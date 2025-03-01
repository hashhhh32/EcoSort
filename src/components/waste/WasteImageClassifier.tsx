
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Image, Upload, AlertTriangle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import * as tf from "@tensorflow/tfjs";
import { IMAGENET_CLASSES } from "@/lib/imageNetClasses";

// Map ImageNet classes to waste categories
const wasteCategories = {
  biodegradable: [
    "banana", "apple", "orange", "pear", "broccoli", "carrot", "cucumber", "lettuce", 
    "cabbage", "mushroom", "corn", "eggplant", "bell pepper", "potato", "pineapple",
    "strawberry", "tomato", "watermelon", "paper bag", "cardboard", "wood", "leaf"
  ],
  recyclable: [
    "water bottle", "plastic bag", "plastic bottle", "pop bottle", "soda bottle", "beer bottle", 
    "wine bottle", "glass", "beer glass", "can", "tin can", "aluminum can", "metal", 
    "iron", "steel", "copper", "brass", "silver", "gold", "cardboard", "paper", "newspaper",
    "magazine", "book", "carton", "packet", "container", "plastic container"
  ],
  hazardous: [
    "battery", "cell phone", "mobile phone", "computer", "laptop", "monitor", "television",
    "TV", "electronic device", "light bulb", "fluorescent", "medicine", "pill", "drug",
    "paint", "oil", "gasoline", "pesticide", "insecticide", "herbicide", "chemical"
  ],
  nonbiodegradable: [
    "plastic", "synthetic", "polymer", "nylon", "polyester", "acrylic", "rubber", "foam",
    "styrofoam", "polystyrene", "ceramic", "pottery", "porcelain", "glass", "mirror"
  ]
};

// Function to map ImageNet class to waste category
const mapToWasteCategory = (className: string): string => {
  const lowerClassName = className.toLowerCase();
  
  for (const [category, keywords] of Object.entries(wasteCategories)) {
    for (const keyword of keywords) {
      if (lowerClassName.includes(keyword)) {
        return category;
      }
    }
  }
  
  return "unknown";
};

export function WasteImageClassifier() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [classification, setClassification] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [savedToDb, setSavedToDb] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setClassification(null);
      setConfidence(null);
      setError(null);
      setSavedToDb(false);
    }
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const classifyImage = async () => {
    if (!image || !imageUrl) {
      setError("Please upload an image first");
      return;
    }
    
    try {
      setClassifying(true);
      setError(null);
      
      // Load the MobileNet model
      const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
      
      // Prepare the image
      const img = new Image();
      img.src = imageUrl;
      await new Promise(resolve => { img.onload = resolve; });
      
      // Convert the image to a tensor
      const tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();
      
      // Normalize the image
      const normalized = tensor.div(tf.scalar(127.5)).sub(tf.scalar(1));
      
      // Get predictions
      const predictions = await model.predict(normalized) as tf.Tensor;
      const data = await predictions.data();
      
      // Get the top prediction
      const maxIndex = data.indexOf(Math.max(...Array.from(data)));
      const predictedClass = IMAGENET_CLASSES[maxIndex];
      const predictedConfidence = data[maxIndex] * 100;
      
      // Map to waste category
      const wasteCategory = mapToWasteCategory(predictedClass);
      
      setClassification(wasteCategory);
      setConfidence(predictedConfidence);
      
      // Clean up tensors
      tensor.dispose();
      normalized.dispose();
      predictions.dispose();
      
      toast({
        title: "Classification Complete",
        description: `The waste is classified as ${wasteCategory}`,
      });
    } catch (err) {
      console.error("Error classifying image:", err);
      setError("Error classifying image. Please try again.");
    } finally {
      setClassifying(false);
    }
  };
  
  const saveClassification = async () => {
    if (!user || !image || !classification) {
      setError("Missing required information");
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload image to Supabase Storage
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('waste_images')
        .upload(filePath, image);
        
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Get public URL for the uploaded image
      const { data: urlData } = await supabase.storage
        .from('waste_images')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      
      // Save classification data to the database
      const { error: insertError } = await supabase
        .from('waste_classifications')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          classification,
          confidence: confidence || 0,
          notes
        });
        
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      setSavedToDb(true);
      toast({
        title: "Success",
        description: "Classification saved successfully",
      });
    } catch (err) {
      console.error("Error saving classification:", err);
      setError("Error saving classification. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  
  const getWasteCategoryColor = (category: string | null) => {
    switch(category) {
      case 'biodegradable': return 'bg-green-100 text-green-800';
      case 'recyclable': return 'bg-blue-100 text-blue-800';
      case 'hazardous': return 'bg-red-100 text-red-800';
      case 'nonbiodegradable': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Waste Classification</h1>
        <p className="text-muted-foreground">
          Upload an image of waste to classify it and get proper disposal recommendations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div 
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={handleUploadClick}
            >
              {imageUrl ? (
                <div className="relative">
                  <img 
                    src={imageUrl} 
                    alt="Waste" 
                    className="mx-auto max-h-[300px] rounded-md object-contain"
                  />
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadClick();
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="py-12">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">Click to upload waste image</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG or JPEG</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            
            <div className="mt-4 space-y-2">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1" 
                  onClick={classifyImage}
                  disabled={!imageUrl || classifying}
                >
                  {classifying && <Spinner className="mr-2" />}
                  Classify Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            {classification ? (
              <div className="space-y-4">
                <div>
                  <span className="block text-sm font-medium mb-1">Classification Result:</span>
                  <div className={`px-3 py-1 rounded-full inline-flex items-center ${getWasteCategoryColor(classification)}`}>
                    <span className="capitalize font-medium">{classification}</span>
                  </div>
                </div>
                
                {confidence !== null && (
                  <div>
                    <span className="block text-sm font-medium mb-1">Confidence:</span>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${Math.min(confidence, 100)}%` }} 
                      />
                    </div>
                    <span className="text-xs text-right block mt-1">{confidence.toFixed(2)}%</span>
                  </div>
                )}
                
                <div>
                  <span className="block text-sm font-medium mb-1">Disposal Instructions:</span>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {classification === 'biodegradable' && (
                      <p>This waste is biodegradable. It can be composted or disposed of in organic waste bins.</p>
                    )}
                    {classification === 'recyclable' && (
                      <p>This waste is recyclable. Please clean it and place in the recycling bin.</p>
                    )}
                    {classification === 'hazardous' && (
                      <p>This waste is hazardous. Do not dispose with regular trash. Take to a designated hazardous waste collection center.</p>
                    )}
                    {classification === 'nonbiodegradable' && (
                      <p>This waste is non-biodegradable. Check if it can be recycled, otherwise dispose in general waste.</p>
                    )}
                    {classification === 'unknown' && (
                      <p>We couldn't determine the waste category. Consider consulting local waste disposal guidelines.</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Notes (optional):</label>
                  <textarea 
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Add any notes about this waste item..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={savedToDb}
                  />
                </div>
                
                <Button 
                  onClick={saveClassification} 
                  disabled={uploading || savedToDb || !user}
                  className="w-full"
                >
                  {uploading && <Spinner className="mr-2" />}
                  {savedToDb ? (
                    <span className="flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      Saved
                    </span>
                  ) : (
                    "Save Classification"
                  )}
                </Button>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Upload and classify an image to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
