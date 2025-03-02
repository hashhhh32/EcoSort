import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WasteClassification from "./pages/WasteClassification";
import ComplaintPage from "./pages/ComplaintPage";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import ComplaintDetail from "@/pages/ComplaintDetail";

// Admin route guard component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

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
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="/admin/complaint/:id" element={
          <AdminRoute>
            <ComplaintDetail />
          </AdminRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
