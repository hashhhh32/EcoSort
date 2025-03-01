import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideLeaf, Recycle, MapPin, Trophy, AlertTriangle, UserCircle, LogIn, Image, Trash, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginScreen from "@/components/auth/LoginScreen";
const Index = () => {
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const {
    user,
    loading,
    signOut
  } = useAuth();
  useEffect(() => {
    if (!loading) {
      setIsLocalLoading(false);
    }
  }, [loading]);
  const handleLogin = () => {
    // This function is now just a pass-through for the UI state
    // The actual login is handled by the AuthContext
  };
  const handleLogout = async () => {
    await signOut();
  };
  if (isLocalLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>;
  }
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }
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

      <main className="flex-1 container mx-auto p-4 bg-emerald-50 rounded-lg">
        <section className="mb-8 animate-enter">
          <div className="glass dark:glass-dark p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Welcome to EcoTrack</h2>
            <p className="text-muted-foreground">Your partner in sustainable waste management</p>
          </div>
        </section>

        <section className="mb-8 animate-enter delay-100">
          <h2 className="text-xl font-bold mb-4">Sustainable Waste Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="relative h-48 bg-eco-backdrop">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="w-24 h-24 text-eco-leaf opacity-30" />
                </div>
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
                <Button variant="outline" className="mt-4 w-full" onClick={() => window.location.href = "/waste-classification"}>
                  <Recycle className="mr-2 h-4 w-4 text-eco-leaf" /> Waste Classification
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="relative h-48 bg-eco-backdrop">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-24 h-24 text-eco-plastic opacity-30" />
                </div>
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
                <Button variant="outline" className="mt-4 w-full">
                  <MapPin className="mr-2 h-4 w-4 text-eco-plastic" /> View Collection Schedule
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
              <Card>
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
              <Card>
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
              <Card>
                <CardHeader>
                  <CardTitle>Report Waste Dump</CardTitle>
                  <CardDescription>Help us keep our environment clean</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-4 bg-destructive">
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
          <Card>
            <CardHeader>
              <CardTitle>Your Eco Impact</CardTitle>
              <CardDescription>Track your contribution to a cleaner environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">127 kg</div>
                  <div className="text-sm text-muted-foreground">Waste Recycled</div>
                </div>
                <div className="text-center">
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

      <nav className="bg-background border-t border-border py-2">
        <div className="container mx-auto">
          <ul className="flex justify-around">
            <NavItem icon={<LucideLeaf />} label="Home" isActive />
            <NavItem icon={<Recycle />} label="Segregate" onClick={() => window.location.href = "/waste-classification"} />
            <NavItem icon={<Trash />} label="Complaint" />
            <NavItem icon={<Trophy />} label="Rewards" />
            <NavItem icon={<UserCircle />} label="Profile" />
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
  return <div className="flex items-center p-3 rounded-md bg-card border border-border">
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
  return <div className="flex justify-between items-center p-3 border border-border rounded-md">
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
  return <li className="flex flex-col items-center">
      <button className={`p-2 rounded-full flex flex-col items-center ${isActive ? "text-primary" : "text-muted-foreground"}`} onClick={onClick}>
        <div>{icon}</div>
        <span className="text-xs mt-1">{label}</span>
      </button>
    </li>;
};
export default Index;