import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WasteClassification from "./pages/WasteClassification";
import ComplaintPage from "./pages/ComplaintPage";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";

function App() {
  console.log("App component: Rendering");
  
  useEffect(() => {
    console.log("App component: Mounted");
    return () => {
      console.log("App component: Unmounted");
    };
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/waste-classification" element={<WasteClassification />} />
        <Route path="/complaint" element={<ComplaintPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
