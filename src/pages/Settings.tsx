
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Trash2, Download, Upload, AlertTriangle } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    document.documentElement.classList.contains("dark")
  );
  
  const handleExportData = () => {
    try {
      const allData = {
        drinks: JSON.parse(localStorage.getItem("pourfolio") || "[]"),
        wishlist: JSON.parse(localStorage.getItem("pourfolio-wishlist") || "[]"),
        events: JSON.parse(localStorage.getItem("pourfolio-events") || "[]"),
        tastingEvents: JSON.parse(localStorage.getItem("pourfolio-tasting-events") || "[]"),
      };
      
      const dataStr = JSON.stringify(allData, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileName = `pourfolio-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileName);
      linkElement.click();
      
      toast({
        title: "Data exported successfully",
        description: `Your data has been exported to ${exportFileName}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data",
        variant: "destructive",
      });
    }
  };
  
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate import data format
        if (!data.drinks || !Array.isArray(data.drinks)) {
          throw new Error("Invalid data format");
        }
        
        // Import data
        localStorage.setItem("pourfolio", JSON.stringify(data.drinks || []));
        localStorage.setItem("pourfolio-wishlist", JSON.stringify(data.wishlist || []));
        localStorage.setItem("pourfolio-events", JSON.stringify(data.events || []));
        localStorage.setItem("pourfolio-tasting-events", JSON.stringify(data.tastingEvents || []));
        
        toast({
          title: "Data imported successfully",
          description: "Your data has been restored from backup",
        });
        
        // Refresh page to reflect changes
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The selected file contains invalid data",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };
  
  const handleClearAllData = () => {
    // Clear all app data
    localStorage.removeItem("pourfolio");
    localStorage.removeItem("pourfolio-wishlist");
    localStorage.removeItem("pourfolio-events");
    localStorage.removeItem("pourfolio-tasting-events");
    
    setIsConfirmingClear(false);
    
    toast({
      title: "All data cleared",
      description: "Your app data has been completely reset",
    });
    
    // Refresh the page
    setTimeout(() => window.location.reload(), 1500);
  };
  
  const toggleDarkMode = () => {
    const root = window.document.documentElement;
    root.classList.toggle("dark");
    localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
    setDarkModeEnabled(!darkModeEnabled);
    
    toast({
      title: `${root.classList.contains("dark") ? "Dark" : "Light"} mode enabled`,
      description: `App theme has been updated`,
    });
  };

  return (
    <AppLayout activeTab="settings">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 animate-fade-in">
          <SettingsIcon className="h-7 w-7" /> Settings
        </h1>
        
        <div className="grid gap-6">
          <Card className="hover-elevate animate-slide-in">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how Pourfolio looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                    <span>Dark Mode</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </span>
                  </Label>
                  <Switch 
                    id="dark-mode" 
                    checked={darkModeEnabled}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-elevate animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export, import, or clear your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Backup & Restore</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  Export your data for backup or import from a previous backup
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleExportData} className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Export Data
                  </Button>
                  
                  <div className="relative">
                    <input
                      type="file"
                      id="import-file"
                      accept=".json"
                      onChange={handleImportData}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Upload className="h-4 w-4" /> Import Data
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Reset Application</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  Clear all your data and start fresh. This cannot be undone.
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsConfirmingClear(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-elevate animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>About Pourfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pourfolio is your personal tasting journal and party planning companion.
                Track your favorite drinks, plan tasting events, and discover your taste preferences.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Version 1.0.0 • Offline-first design • All data stored locally in your browser
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={isConfirmingClear} onOpenChange={setIsConfirmingClear}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Clear All Data
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all your drinks, wishlist items, events, and preferences.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-destructive/10 p-3 rounded-md text-sm border border-destructive/20 text-destructive">
            Make sure you have exported a backup if you want to keep your data.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingClear(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAllData}>
              Yes, Delete Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Settings;
