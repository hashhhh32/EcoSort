import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trash, AlertTriangle, Settings, BarChart, MapPin, MessageSquare, Clock, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminNavbar from "@/components/admin/AdminNavbar";
import UserManagement from "@/components/admin/UserManagement";
import AdminSettings from "@/components/admin/AdminSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

type Complaint = {
  id: string;
  created_at: string;
  description: string;
  image_url: string | null;
  status: string;
  user_id: string;
  location: { latitude: number; longitude: number } | null;
  user_email?: string;
  timestamp?: string;
  latitude?: number;
  longitude?: number;
};

// Create a sample complaint for testing if no complaints are found
const createSampleComplaints = (): Complaint[] => {
  return [
    {
      id: "sample-1",
      created_at: new Date().toISOString(),
      description: "Sample complaint: Illegal waste dump near the park",
      image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      status: "pending",
      user_id: "sample-user-1",
      location: { latitude: 40.7128, longitude: -74.0060 },
      user_email: "user@example.com",
      timestamp: new Date().toISOString()
    },
    {
      id: "sample-2",
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      description: "Sample complaint: Plastic waste on the beach",
      image_url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      status: "resolved",
      user_id: "sample-user-2",
      location: { latitude: 34.0522, longitude: -118.2437 },
      user_email: "another@example.com",
      timestamp: new Date(Date.now() - 86400000).toISOString()
    }
  ];
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [messages, setMessages] = useState<Complaint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching complaints from Supabase...");
      
      // Fetch all complaints without relying on created_at
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("timestamp", { ascending: false });

      console.log("Complaints data response:", data ? `Found ${data.length} complaints` : "No data");
      
      if (error) {
        console.error("Error fetching complaints:", error);
        setError(`Fetch error: ${error.message}`);
        setLoading(false);
        return;
      }

      // If no complaints found, show empty state
      if (!data || data.length === 0) {
        console.log("No complaints found");
        setComplaints([]);
        setMessages([]);
        setLoading(false);
        return;
      }

      // Process the complaints data
      const complaintsWithUserInfo = await Promise.all(
        data.map(async (complaint) => {
          let userEmail = "Unknown";
          
          // Try to fetch user email if user_id exists
          if (complaint.user_id) {
            try {
              const { data: userData } = await supabase
                .from("users")
                .select("email")
                .eq("id", complaint.user_id)
                .single();
                
              if (userData && userData.email) {
                userEmail = userData.email;
              }
            } catch (userError) {
              console.error("Error fetching user data:", userError);
            }
          }

          return {
            ...complaint,
            user_email: userEmail,
            // Ensure location data is properly structured
            location: complaint.location || 
              (complaint.latitude && complaint.longitude 
                ? { latitude: complaint.latitude, longitude: complaint.longitude } 
                : null)
          };
        })
      );

      console.log("Processed complaints:", complaintsWithUserInfo.length);
      setComplaints(complaintsWithUserInfo);
      setMessages(complaintsWithUserInfo);
    } catch (error: any) {
      console.error("Unexpected error fetching complaints:", error);
      setError(`Unexpected error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchComplaints();
    }
  }, [isAdmin]);

  const updateComplaintStatus = async (id: string, status: string) => {
    try {
      // Skip update for sample data
      if (id.startsWith("sample-")) {
        // Just update local state for sample data
        setComplaints(
          complaints.map((complaint) =>
            complaint.id === id ? { ...complaint, status } : complaint
          )
        );
        
        setMessages(
          messages.map((message) =>
            message.id === id ? { ...message, status } : message
          )
        );
        
        toast({
          title: "Status updated (demo)",
          description: `Complaint status updated to ${status} (sample data)`,
        });
        
        return;
      }
      
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
      
      // Also update messages
      setMessages(
        messages.map((message) =>
          message.id === id ? { ...message, status } : message
        )
      );
      
      toast({
        title: "Status updated",
        description: `Complaint status updated to ${status}`,
      });
    } catch (error: any) {
      console.error("Error updating complaint status:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update status",
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
      <AdminNavbar title="Admin Dashboard" />

      <main className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
            <p className="font-medium">Error loading complaints</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchComplaints} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
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
                            {new Date(complaint.timestamp).toLocaleDateString()}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            {new Date(complaint.timestamp).toLocaleString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm mb-2">{complaint.description}</p>
                          {complaint.image_url && (
                            <div className="mt-2 rounded-md overflow-hidden w-[100px] h-[100px]">
                              <img
                                src={complaint.image_url}
                                alt="Complaint"
                                className="w-full h-full object-cover aspect-square"
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
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/admin/complaint/${complaint.id}`)}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateComplaintStatus(complaint.id, "rejected")
                                }
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Complaint Messages
                </CardTitle>
                <CardDescription>
                  View all complaints as messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No messages found
                  </p>
                ) : (
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div key={message.id} className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={`https://avatar.vercel.sh/${message.user_id}`} />
                            <AvatarFallback>{message.user_email?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{message.user_email}</div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatTimestamp(message.timestamp || message.created_at)}
                              </div>
                            </div>
                            <div className="rounded-lg bg-muted p-4">
                              <p className="text-sm">{message.description}</p>
                              
                              {message.image_url && (
                                <div className="mt-3 rounded-md overflow-hidden w-[100px] h-[100px]">
                                  <img
                                    src={message.image_url}
                                    alt="Complaint"
                                    className="w-full h-full object-cover rounded-md aspect-square"
                                  />
                                </div>
                              )}
                              
                              {(message.location || message.latitude || message.longitude) && (
                                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                                  <MapPin className="mr-1 h-3 w-3" />
                                  <span>
                                    {message.location 
                                      ? `${message.location.latitude.toFixed(6)}, ${message.location.longitude.toFixed(6)}`
                                      : `${message.latitude?.toFixed(6) || "N/A"}, ${message.longitude?.toFixed(6) || "N/A"}`}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  message.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : message.status === "resolved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {message.status}
                              </span>
                              <div className="flex gap-2">
                                {message.status === "pending" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        updateComplaintStatus(message.id, "rejected")
                                      }
                                    >
                                      Reject
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        updateComplaintStatus(message.id, "resolved")
                                      }
                                    >
                                      Resolve
                                    </Button>
                                  </>
                                )}
                                {message.status !== "pending" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => navigate(`/admin/complaint/${message.id}`)}
                                    >
                                      View Details
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        updateComplaintStatus(message.id, "rejected")
                                      }
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
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