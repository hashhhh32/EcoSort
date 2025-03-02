import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Mail, Bell, Shield, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [adminEmail, setAdminEmail] = useState("admin@ecotrack.com");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Settings saved",
      description: "Your admin settings have been updated successfully.",
    });
    
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Admin Settings
          </CardTitle>
          <CardDescription>
            Configure your admin dashboard preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for new complaints
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="system-alerts">System Alerts</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive system alerts for important events
                </p>
              </div>
              <Switch
                id="system-alerts"
                checked={systemAlerts}
                onCheckedChange={setSystemAlerts}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Admin Access</h3>
            <Separator />
            
            <div className="grid gap-2">
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                <Label htmlFor="admin-email">Admin Email</Label>
              </div>
              <Input
                id="admin-email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
              <p className="text-sm text-muted-foreground">
                This email will have admin privileges in the system
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveSettings} 
            disabled={saving}
            className="ml-auto"
          >
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription>
            Actions that can have significant consequences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Reset Database</h4>
              <p className="text-sm text-muted-foreground">
                This will delete all complaints and reset the database
              </p>
            </div>
            <Button variant="destructive">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings; 