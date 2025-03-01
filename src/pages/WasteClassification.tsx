
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Camera, Upload, RefreshCw, CheckCircle, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { classifyWaste } from "@/lib/wasteClassifier";
import { Spinner } from "@/components/ui/spinner";

type ClassificationResult = {
  className: string;
  probability: number;
  category: 'biodegradable' | 'non-biodegradable' | 'recyclable';
};

const wasteCategories = {
  'biodegradable': {
    items: ['food waste', 'fruit', 'vegetable', 'leaf', 'paper', 'cardboard'],
    color: 'bg-eco-compost',
    icon: '🍃'
  },
  'recyclable': {
    items: ['plastic bottle', 'can', 'glass bottle', 'newspaper', 'magazine', 'cardboard box'],
    color: 'bg-eco-plastic',
    icon: '♻️'
  },
  'non-biodegradable': {
    items: ['plastic bag', 'styrofoam', 'electronics', 'battery', 'light bulb'],
    color: 'bg-eco-metal',
    icon: '⚠️'
  },
};

// Function to map the model's class prediction to our waste categories
const mapToWasteCategory = (className: string): 'biodegradable' | 'non-biodegradable' | 'recyclable' => {
  const lowerClass = className.toLowerCase();
  
  for (const [category, data] of Object.entries(wasteCategories)) {
    if (data.items.some(item => lowerClass.includes(item))) {
      return category as 'biodegradable' | 'non-biodegradable' | 'recyclable';
    }
  }
  
  // Default to non-biodegradable if we can't determine
  return 'non-biodegradable';
};

const WasteClassification = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is an image
      if (!selectedFile.type.match('image.*')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
        });
        return;
      }

      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB",
        });
        return;
      }

      setImage(selectedFile);
      
      // Create a preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setImagePreview(objectUrl);
      
      // Reset classification when a new image is selected
      setClassificationResult(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleClassifyImage = async () => {
    if (!image || !imagePreview) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to classify",
      });
      return;
    }

    setIsClassifying(true);
    
    try {
      // Use the pre-trained model to classify the waste
      const result = await classifyWaste(imagePreview);
      
      if (result) {
        // Map the class to a waste category
        const category = mapToWasteCategory(result.className);
        
        setClassificationResult({
          className: result.className,
          probability: result.probability,
          category
        });
      } else {
        toast({
          variant: "destructive",
          title: "Classification failed",
          description: "Unable to classify the image. Please try again.",
        });
      }
    } catch (error) {
      console.error("Classification error:", error);
      toast({
        variant: "destructive",
        title: "Classification error",
        description: "An error occurred during classification. Please try again.",
      });
    } finally {
      setIsClassifying(false);
    }
  };

  const saveClassification = async () => {
    if (!user || !image || !classificationResult) return;
    
    setIsSaving(true);
    
    try {
      // 1. Upload image to Supabase Storage
      const fileExt = image.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('waste_images')
        .upload(fileName, image);
        
      if (uploadError) throw uploadError;
      
      // 2. Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('waste_images')
        .getPublicUrl(fileName);
        
      // 3. Save classification details to the database
      const { error: dbError } = await supabase
        .from('waste_classifications')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          classification: classificationResult.category,
          confidence: classificationResult.probability * 100,
          notes: notes
        });
        
      if (dbError) throw dbError;
      
      toast({
        title: "Classification saved",
        description: "Your waste classification has been saved successfully",
      });
      
      // Reset the form
      setImage(null);
      setImagePreview(null);
      setClassificationResult(null);
      setNotes('');
      
    } catch (error) {
      console.error("Error saving classification:", error);
      toast({
        variant: "destructive",
        title: "Save error",
        description: "Failed to save classification. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setImagePreview(null);
    setClassificationResult(null);
    setNotes('');
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-4"
      >
        ← Back to Home
      </Button>
      
      <h1 className="text-2xl font-bold mb-4">Waste Classification</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Waste Image</CardTitle>
          <CardDescription>
            Take or upload a photo of waste to identify its proper classification
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Input (hidden) */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {/* Image Upload UI */}
          <div className="flex justify-center">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Waste Preview" 
                  className="max-h-64 rounded-lg object-contain border border-border"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={resetForm}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={triggerFileInput}>
                <div className="flex flex-col items-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF (max. 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={triggerFileInput}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Image
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleClassifyImage}
              disabled={!image || isClassifying}
            >
              {isClassifying ? (
                <>
                  <Spinner className="mr-2" /> Classifying...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" /> Classify Waste
                </>
              )}
            </Button>
          </div>
          
          {/* Classification Results */}
          {classificationResult && (
            <div className="mt-6 border border-border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${wasteCategories[classificationResult.category].color}`}></span>
                Classification Result
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Category:</p>
                  <p className="font-medium flex items-center">
                    <span className="mr-2">{wasteCategories[classificationResult.category].icon}</span>
                    {classificationResult.category.charAt(0).toUpperCase() + classificationResult.category.slice(1)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Detected Item:</p>
                  <p className="font-medium">{classificationResult.className}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Confidence:</p>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={classificationResult.probability * 100} 
                      className="h-2 flex-1" 
                    />
                    <span className="text-sm font-medium">
                      {Math.round(classificationResult.probability * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Add notes about this waste item..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={saveClassification} 
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Spinner className="mr-2" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Save Classification
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4 text-sm text-muted-foreground">
          <p>
            Upload an image of waste to help improve proper waste management.
          </p>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Waste Segregation Guide</CardTitle>
          <CardDescription>
            Learn how to properly sort different types of waste
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <CategoryInfoCard 
              title="Biodegradable"
              color="bg-eco-compost"
              icon="🍃"
              description="Waste that can decompose naturally"
              examples={["Food waste", "Garden waste", "Paper", "Cardboard"]}
            />
            
            <CategoryInfoCard 
              title="Recyclable"
              color="bg-eco-plastic"
              icon="♻️"
              description="Materials that can be processed and reused"
              examples={["Plastic bottles", "Glass", "Aluminum cans", "Newspapers"]}
            />
            
            <CategoryInfoCard 
              title="Non-biodegradable"
              color="bg-eco-metal"
              icon="⚠️"
              description="Waste that does not break down naturally"
              examples={["Styrofoam", "Some plastics", "Batteries", "Electronics"]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CategoryInfoCard = ({ 
  title, 
  color, 
  icon, 
  description, 
  examples 
}: { 
  title: string;
  color: string;
  icon: string;
  description: string;
  examples: string[];
}) => {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-4 h-4 rounded-full ${color}`}></div>
        <h3 className="font-medium">{title}</h3>
        <span>{icon}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <p className="text-xs font-medium mb-1">Examples:</p>
      <ul className="text-xs text-muted-foreground">
        {examples.map((example, i) => (
          <li key={i} className="list-disc list-inside">{example}</li>
        ))}
      </ul>
    </div>
  );
};

export default WasteClassification;
