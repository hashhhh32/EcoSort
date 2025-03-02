import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideLeaf, Recycle, MapPin, Trophy, AlertTriangle, UserCircle, LogIn, Image, Trash, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginScreen from "@/components/auth/LoginScreen";
import { useNavigate } from "react-router-dom";

const Index = () => {
  console.log("Index component: Rendering started");
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const {
    user,
    loading,
    signOut,
    isAdmin
  } = useAuth();
  console.log("Index component: Auth state", { user: user ? "exists" : "null", loading });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index component: useEffect triggered", { loading });
    if (!loading) {
      setIsLocalLoading(false);
    }
  }, [loading]);

  const handleLogin = () => {
    console.log("Index component: handleLogin called");
    // This function is now just a pass-through for the UI state
    // The actual login is handled by the AuthContext
  };

  const handleLogout = async () => {
    console.log("Index component: handleLogout called");
    await signOut();
  };

  if (isLocalLoading) {
    console.log("Index component: Showing loading spinner");
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>;
  }

  if (!user) {
    console.log("Index component: Showing login screen");
    return <LoginScreen onLogin={handleLogin} />;
  }

  console.log("Index component: Rendering main content");
  return <div className="min-h-screen bg-background flex flex-col">
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 z-0"></div>
        <div className="relative z-10 p-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                <LucideLeaf className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">EcoTrack</h1>
                <p className="text-xs text-white/80">Sustainable waste management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/admin')}
                  className="mr-2"
                >
                  Admin Dashboard
                </Button>
              )}
              <span className="text-sm text-white/90 mr-2">
                {user.email?.split('@')[0] || 'User'}
              </span>
              <Button variant="outline" size="icon" className="rounded-full border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30" onClick={handleLogout}>
                <LogOut className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
        <div className="h-8 bg-gradient-to-b from-primary/10 to-transparent"></div>
      </header>

      <main className="flex-1 container mx-auto p-4 bg-emerald-50/50 rounded-lg mb-20 shadow-sm">
        <section className="mb-8 animate-enter">
          <div className="glass dark:glass-dark p-6 rounded-lg bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center hover:shadow-lg transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-2 text-primary">Welcome to EcoTrack</h2>
              <p className="text-muted-foreground">Your partner in sustainable waste management</p>
            </div>
          </div>
        </section>

        <section className="mb-8 animate-enter delay-100">
          <h2 className="text-xl font-bold mb-4 text-primary flex items-center">
            <Recycle className="mr-2 h-5 w-5" />
            Sustainable Waste Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
              <div className="relative h-48 bg-eco-backdrop">
                <img 
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Waste Segregation" 
                  className="w-full h-full object-cover brightness-90 hover:brightness-100 transition-all duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-lg font-medium text-white">Waste Segregation</h3>
                  <p className="text-sm text-white/80">Learn proper segregation techniques</p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm">
                  Proper waste segregation is crucial for effective recycling. Learn how to separate waste into 
                  recyclables, organic waste, and other categories to minimize environmental impact.
                </p>
                <Button variant="outline" className="mt-4 w-full group" onClick={() => navigate("/waste-classification")}>
                  <Recycle className="mr-2 h-4 w-4 text-eco-leaf group-hover:text-primary transition-colors" /> 
                  Waste Classification
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
              <div className="relative h-48 bg-eco-backdrop">
                <img 
                  src="https://images.unsplash.com/photo-1528323273322-d81458248d40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Waste Collection" 
                  className="w-full h-full object-cover brightness-90 hover:brightness-100 transition-all duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-lg font-medium text-white">Waste Collection</h3>
                  <p className="text-sm text-white/80">Schedule and track waste pickup</p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm">
                  Our scheduled waste collection ensures timely pickup of segregated waste from your location.
                  Track the collection vehicle in real-time and get notifications before arrival.
                </p>
                <Button variant="outline" className="mt-4 w-full group">
                  <MapPin className="mr-2 h-4 w-4 text-eco-plastic group-hover:text-primary transition-colors" /> 
                  View Collection Schedule
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-8 animate-enter delay-200">
          <Tabs defaultValue="segregation" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="segregation">Waste Guide</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="segregation">
              <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle>Waste Segregation Guide</CardTitle>
                  <CardDescription>Learn how to properly sort your waste</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <WasteTypeCard type="Plastic" color="bg-eco-plastic" />
                    <WasteTypeCard type="Paper" color="bg-eco-paper" />
                    <WasteTypeCard type="Glass" color="bg-eco-glass" />
                    <WasteTypeCard type="Metal" color="bg-eco-metal" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="collection">
              <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle>Waste Collection Schedule</CardTitle>
                  <CardDescription>Upcoming collection in your area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <CollectionItem day="Monday" type="Recyclables" time="8:00 AM - 12:00 PM" />
                    <CollectionItem day="Wednesday" type="Organic Waste" time="8:00 AM - 12:00 PM" />
                    <CollectionItem day="Friday" type="General Waste" time="1:00 PM - 5:00 PM" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports">
              <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle>Report Waste Dump</CardTitle>
                  <CardDescription>Help us keep our environment clean</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full mb-4 bg-destructive hover:bg-destructive/90"
                    onClick={() => navigate("/complaint")}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" /> Report Illegal Dumping
                  </Button>
                  <div className="text-muted-foreground text-sm">
                    <p>Take a photo and report illegal waste dumps in your area. Your report will be sent to the authorities for action.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="animate-enter delay-300">
          <Card className="border-2 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle>Your Eco Impact</CardTitle>
              <CardDescription>Track your contribution to a cleaner environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary">127 kg</div>
                  <div className="text-sm text-muted-foreground">Waste Recycled</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-3xl font-bold text-secondary">350</div>
                  <div className="text-sm text-muted-foreground">Eco Points</div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-muted text-center">
                <p className="text-sm text-muted-foreground">You've helped save approximately</p>
                <h4 className="text-lg font-semibold mb-1">23 kg of CO2 emissions</h4>
                <p className="text-xs text-muted-foreground">equivalent to planting 2 trees</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Fixed nav bar with proper z-index */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 z-50 shadow-lg">
        <div className="container mx-auto">
          <ul className="flex justify-around">
            <NavItem icon={<LucideLeaf />} label="Home" isActive />
            <NavItem icon={<Recycle />} label="Segregate" onClick={() => navigate("/waste-classification")} />
            <NavItem icon={<Trash />} label="Complaint" onClick={() => navigate("/complaint")} />
            <NavItem icon={<Trophy />} label="Rewards" />
            <NavItem icon={<UserCircle />} label="Profile" onClick={() => navigate("/profile")} />
          </ul>
        </div>
      </nav>
    </div>;
};

const WasteTypeCard = ({
  type,
  color
}: {
  type: string;
  color: string;
}) => {
  return <div className="flex items-center p-3 rounded-md bg-card border border-border hover:shadow-md transition-all duration-300">
      <div className={`w-4 h-4 rounded-full ${color} mr-3`}></div>
      <span>{type}</span>
    </div>;
};

const CollectionItem = ({
  day,
  type,
  time
}: {
  day: string;
  type: string;
  time: string;
}) => {
  return <div className="flex justify-between items-center p-3 border border-border rounded-md hover:shadow-sm transition-all duration-300 hover:bg-muted/30">
      <div>
        <div className="font-medium">{day}</div>
        <div className="text-sm text-muted-foreground">{type}</div>
      </div>
      <div className="text-sm">{time}</div>
    </div>;
};

const NavItem = ({
  icon,
  label,
  isActive = false,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return <li>
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 w-16 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs">{label}</span>
    </button>
  </li>;
};

// Define ArrowRight component as a fallback
const ArrowRight = ({ className = "h-4 w-4" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

export default Index;
