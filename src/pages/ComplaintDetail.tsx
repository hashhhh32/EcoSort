import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, ArrowLeft, User, AlertTriangle, Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Complaint = {
  id: string;
  description: string;
  image_url: string | null;
  user_id: string;
  location: { latitude: number; longitude: number } | null;
  user_email?: string;
  timestamp?: string;
  latitude?: number;
  longitude?: number;
};

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate("/");
      return;
    }

    const fetchComplaintDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError("Complaint ID is missing");
          return;
        }

        // Fetch complaint details
        const { data, error } = await supabase
          .from("complaints")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching complaint:", error);
          setError(`Error: ${error.message}`);
          return;
        }

        if (!data) {
          setError("Complaint not found");
          return;
        }

        // Fetch user email if user_id exists
        let userEmail = "Unknown";
        if (data.user_id) {
          try {
            const { data: userData } = await supabase
              .from("users")
              .select("email")
              .eq("id", data.user_id)
              .single();

            if (userData && userData.email) {
              userEmail = userData.email;
            }
          } catch (userError) {
            console.error("Error fetching user data:", userError);
          }
        }

        // Process complaint data
        const processedComplaint = {
          ...data,
          user_email: userEmail,
          // Ensure location data is properly structured
          location: data.location || 
            (data.latitude && data.longitude 
              ? { latitude: data.latitude, longitude: data.longitude } 
              : null)
        };

        setComplaint(processedComplaint);
      } catch (error: any) {
        console.error("Unexpected error:", error);
        setError(`Unexpected error: ${error.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id, isAdmin, navigate]);

  const deleteComplaint = async () => {
    try {
      if (!complaint) return;

      const { error } = await supabase
        .from("complaints")
        .delete()
        .eq("id", complaint.id);

      if (error) throw error;

      toast({
        title: "Complaint deleted",
        description: "The complaint has been permanently removed",
      });

      // Navigate back to admin dashboard after successful deletion
      navigate("/admin");
    } catch (error: any) {
      console.error("Error deleting complaint:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete complaint",
        variant: "destructive"
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar title="Complaint Details" />

      <main className="container mx-auto px-4 py-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/admin")}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : complaint ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Complaint #{complaint.id.substring(0, 8)}</CardTitle>
                </div>
                <CardDescription>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {complaint.timestamp 
                        ? formatTimestamp(complaint.timestamp) 
                        : "No timestamp available"}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <User className="h-4 w-4 mr-1" />
                    <span>Submitted by: {complaint.user_email}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm mb-4 p-3 bg-muted rounded-md">{complaint.description}</p>
                
                {complaint.location && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Location</h3>
                    <div className="flex items-center p-3 bg-muted rounded-md">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {complaint.location.latitude.toFixed(6)},{" "}
                        {complaint.location.longitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <a 
                        href={`https://www.google.com/maps?q=${complaint.location.latitude},${complaint.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete Complaint
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will permanently delete this complaint from the database.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={deleteComplaint}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>

            {complaint.image_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Complaint Image</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="overflow-hidden rounded-md w-full max-h-[500px]">
                    <img
                      src={complaint.image_url}
                      alt="Complaint"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <a 
                    href={complaint.image_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Full Image
                  </a>
                </CardFooter>
              </Card>
            )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Complaint not found
          </p>
        )}
      </main>
    </div>
  );
};

export default ComplaintDetail; 