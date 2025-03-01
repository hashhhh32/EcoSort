import React, { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Image as ImageIcon, Upload, CheckCircle2, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ComplaintPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageCapturing, setImageCapturing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setImageCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive",
      });
      setImageCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        // Draw video frame on canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Get image data as base64 string
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setImagePreview(imageData);
        
        // Stop camera
        stopCamera();
        setImageCapturing(false);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setImageCapturing(false);
  };

  const uploadComplaint = async () => {
    if (!imagePreview) {
      toast({
        title: "Image required",
        description: "Please take a photo of the waste dump",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide details about the waste dump",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Convert base64 to blob
      const dataURLtoBlob = (dataUrl: string) => {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      };

      // Upload image to Supabase storage
      const blob = dataURLtoBlob(imagePreview);
      const file = new File([blob], `complaint_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      setImageUploading(true);
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('complaint_images')
        .upload(`${user?.id}/${Date.now()}.jpg`, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('complaint_images')
        .getPublicUrl(fileData.path);

      // Save complaint to database
      const { error: insertError } = await supabase
        .from('complaints')
        .insert({
          user_id: user?.id,
          image_url: publicUrlData.publicUrl,
          description: description,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast({
        title: "Complaint submitted",
        description: "Thank you for reporting this issue. We'll look into it.",
        variant: "default",
      });

      // Navigate back to home
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setImageUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b p-4 bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
        <div className="container mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="mr-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Report Waste Dump</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        <Card className="mb-6 border-2 hover:border-primary/30 transition-all duration-300 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5 text-primary" />
              Upload Evidence
            </CardTitle>
            <CardDescription>
              Take a photo of the illegal waste dump
            </CardDescription>
          </CardHeader>
          <CardContent>
            {imageCapturing ? (
              <div className="relative">
                <video 
                  ref={videoRef} 
                  className="w-full h-64 object-cover rounded-md border border-border"
                  autoPlay
                  playsInline
                ></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button 
                    onClick={captureImage}
                    className="rounded-full w-14 h-14 p-0"
                  >
                    <Camera className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            ) : imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Captured" 
                  className="w-full h-64 object-contain rounded-md border border-border"
                />
                <div className="absolute bottom-2 right-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setImagePreview(null);
                      startCamera();
                    }}
                    className="bg-white/80 backdrop-blur-sm"
                  >
                    <Camera className="mr-2 h-4 w-4" /> Retake
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                className="w-full h-64 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={startCamera}
              >
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  Tap to take a photo <br />
                  <span className="text-sm">Use camera to capture evidence of illegal dumping</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 border-2 hover:border-primary/30 transition-all duration-300 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5 text-primary" />
              Complaint Details
            </CardTitle>
            <CardDescription>
              Provide information about the waste dump
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Describe the location and details of the illegal waste dump. Include information about the type of waste, approximate size, and any other relevant details."
              className="min-h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={uploadComplaint} 
              disabled={!imagePreview || !description.trim() || submitting || imageUploading}
              className="w-full"
            >
              {submitting || imageUploading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {imageUploading ? "Uploading image..." : "Submitting..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Complaint
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-2 hover:border-primary/30 transition-all duration-300 shadow-md">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
              <li>Your complaint will be reviewed by our team</li>
              <li>Local authorities will be notified if necessary</li>
              <li>Clean-up teams may be dispatched to the location</li>
              <li>You'll receive updates on the status of your complaint</li>
            </ol>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ComplaintPage;
