
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideLeaf, Recycle, MapPin, Trophy, AlertTriangle, UserCircle, LogIn } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LucideLeaf className="h-6 w-6" />
            <h1 className="text-xl font-bold">EcoTrack</h1>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        <section className="mb-8 animate-enter">
          <div className="glass dark:glass-dark p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Welcome to EcoTrack</h2>
            <p className="text-muted-foreground">Your partner in sustainable waste management</p>
          </div>
        </section>

        <section className="mb-8 animate-enter delay-100">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickActionCard 
              title="Segregate" 
              icon={<Recycle className="h-8 w-8 text-eco-leaf" />} 
              description="Learn how to sort waste"
            />
            <QuickActionCard 
              title="Collect" 
              icon={<Recycle className="h-8 w-8 text-eco-plastic" />} 
              description="Schedule waste pickup"
            />
            <QuickActionCard 
              title="Track" 
              icon={<MapPin className="h-8 w-8 text-eco-metal" />} 
              description="Find collection points"
            />
            <QuickActionCard 
              title="Rewards" 
              icon={<Trophy className="h-8 w-8 text-eco-paper" />} 
              description="View your eco-points"
            />
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
                    <CollectionItem 
                      day="Monday" 
                      type="Recyclables" 
                      time="8:00 AM - 12:00 PM" 
                    />
                    <CollectionItem 
                      day="Wednesday" 
                      type="Organic Waste" 
                      time="8:00 AM - 12:00 PM" 
                    />
                    <CollectionItem 
                      day="Friday" 
                      type="General Waste" 
                      time="1:00 PM - 5:00 PM" 
                    />
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
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-background border-t border-border py-2">
        <div className="container mx-auto">
          <ul className="flex justify-around">
            <NavItem icon={<LucideLeaf />} label="Home" isActive />
            <NavItem icon={<Recycle />} label="Segregate" />
            <NavItem icon={<MapPin />} label="Locate" />
            <NavItem icon={<Trophy />} label="Rewards" />
            <NavItem icon={<UserCircle />} label="Profile" />
          </ul>
        </div>
      </nav>
    </div>
  );
};

// Component for login screen
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary text-primary-foreground p-3 rounded-full inline-flex">
            <LucideLeaf className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Welcome to EcoTrack</CardTitle>
          <CardDescription>Your sustainable waste management companion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border border-input rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full p-2 border border-input rounded-md"
              />
            </div>
            <Button className="w-full" onClick={onLogin}>
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>Don't have an account? <span className="text-primary cursor-pointer">Sign up</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Component for quick action cards
const QuickActionCard = ({ 
  title, 
  icon, 
  description 
}: { 
  title: string;
  icon: React.ReactNode;
  description: string;
}) => {
  return (
    <div className="waste-card p-4 bg-card flex flex-col items-center text-center cursor-pointer">
      <div className="mb-2">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

// Component for waste type cards
const WasteTypeCard = ({ type, color }: { type: string; color: string }) => {
  return (
    <div className="flex items-center p-3 rounded-md bg-card border border-border">
      <div className={`w-4 h-4 rounded-full ${color} mr-3`}></div>
      <span>{type}</span>
    </div>
  );
};

// Component for collection schedule items
const CollectionItem = ({ 
  day, 
  type, 
  time 
}: { 
  day: string;
  type: string;
  time: string;
}) => {
  return (
    <div className="flex justify-between items-center p-3 border border-border rounded-md">
      <div>
        <div className="font-medium">{day}</div>
        <div className="text-sm text-muted-foreground">{type}</div>
      </div>
      <div className="text-sm">{time}</div>
    </div>
  );
};

// Component for navigation items
const NavItem = ({ 
  icon, 
  label, 
  isActive = false 
}: { 
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}) => {
  return (
    <li className="flex flex-col items-center">
      <button 
        className={`p-2 rounded-full flex flex-col items-center ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <div>{icon}</div>
        <span className="text-xs mt-1">{label}</span>
      </button>
    </li>
  );
};

export default Index;
