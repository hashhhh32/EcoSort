
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WasteImageClassifier } from "@/components/waste/WasteImageClassifier";

const WasteClassification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Waste Classification</h1>
        </div>
      </header>
      
      <main className="flex-1">
        <WasteImageClassifier />
      </main>
    </div>
  );
};

export default WasteClassification;
