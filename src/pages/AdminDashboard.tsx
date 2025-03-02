import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trash, AlertTriangle, Settings, BarChart, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminNavbar from "@/components/admin/AdminNavbar";
import UserManagement from "@/components/admin/UserManagement";
import AdminSettings from "@/components/admin/AdminSettings";

type Complaint = {
  id: string;
  created_at: string;
  description: string;
  image_url: string | null;
  status: string;
  user_id: string;
  location: { latitude: number; longitude: number } | null;
  user_email?: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("complaints")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch user emails for each complaint
        const complaintsWithUserInfo = await Promise.all(
          (data || []).map(async (complaint) => {
            const { data: userData } = await supabase
              .from("users")
              .select("email")
              .eq("id", complaint.user_id)
              .single();

            return {
              ...complaint,
              user_email: userData?.email || "Unknown",
            };
          })
        );

        setComplaints(complaintsWithUserInfo);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchComplaints();
    }
  }, [isAdmin]);

  const updateComplaintStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("complaints")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setComplaints(
        complaints.map((complaint) =>
          complaint.id === id ? { ...complaint, status } : complaint
        )
      );
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar title="Admin Dashboard" />

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Complaints
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{complaints.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Complaints
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {complaints.filter(c => c.status === "pending").length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Resolved Complaints
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {complaints.filter(c => c.status === "resolved").length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Rejected Complaints
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {complaints.filter(c => c.status === "rejected").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Overview of recent complaints and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : complaints.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No complaints found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {complaints.slice(0, 5).map((complaint) => (
                      <div
                        key={complaint.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">
                            Complaint #{complaint.id.substring(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(complaint.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              complaint.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : complaint.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {complaint.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Complaints</CardTitle>
                <CardDescription>
                  Manage and respond to user complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : complaints.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No complaints found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <Card key={complaint.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-base">
                              Complaint #{complaint.id.substring(0, 8)}
                            </CardTitle>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                complaint.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : complaint.status === "resolved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {complaint.status}
                            </span>
                          </div>
                          <CardDescription>
                            Submitted by: {complaint.user_email} on{" "}
                            {new Date(complaint.created_at).toLocaleString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm mb-2">{complaint.description}</p>
                          {complaint.image_url && (
                            <div className="mt-2 rounded-md overflow-hidden">
                              <img
                                src={complaint.image_url}
                                alt="Complaint"
                                className="w-full h-48 object-cover"
                              />
                            </div>
                          )}
                          {complaint.location && (
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>
                                {complaint.location.latitude.toFixed(6)},{" "}
                                {complaint.location.longitude.toFixed(6)}
                              </span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 pt-0">
                          {complaint.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateComplaintStatus(complaint.id, "rejected")
                                }
                              >
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateComplaintStatus(complaint.id, "resolved")
                                }
                              >
                                Resolve
                              </Button>
                            </>
                          )}
                          {complaint.status !== "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateComplaintStatus(complaint.id, "pending")
                              }
                            >
                              Reopen
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;