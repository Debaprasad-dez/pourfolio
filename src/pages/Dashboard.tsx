
import { AppLayout } from "@/components/layout/AppLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Drink } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wine, Bookmark, CalendarClock, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [drinks] = useLocalStorage<Drink[]>("pourfolio", []);
  const navigate = useNavigate();

  // Get some basic stats
  const totalDrinks = drinks.length;
  const avgRating = totalDrinks > 0 
    ? drinks.reduce((sum, drink) => sum + drink.rating, 0) / totalDrinks 
    : 0;
  const topTypes = getTopItems(drinks.map(drink => drink.type));
  const topTags = getTopItems(drinks.flatMap(drink => drink.tags));

  function getTopItems(items: string[]): { name: string, count: number }[] {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  return (
    <AppLayout activeTab="dashboard">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold animate-fade-in">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-elevate">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Wine className="mr-2 text-primary" />
                <p className="text-2xl font-bold">{totalDrinks}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-elevate">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                <div className="ml-2 text-accent">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(avgRating) ? "text-accent" : "text-muted"}>★</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-elevate">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                {topTypes.length > 0 ? (
                  topTypes.slice(0, 3).map((type, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{type.name}</span>
                      <span className="text-muted-foreground">{type.count}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">No data yet</li>
                )}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover-elevate">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                {topTags.length > 0 ? (
                  topTags.slice(0, 3).map((tag, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{tag.name}</span>
                      <span className="text-muted-foreground">{tag.count}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">No data yet</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover-elevate animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark size={18} /> Wishlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Track drinks you want to try in the future</p>
              <Button onClick={() => navigate('/wishlist')} variant="outline" className="w-full">Go to Wishlist</Button>
            </CardContent>
          </Card>
          
          <Card className="hover-elevate animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock size={18} /> Party Planner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Plan your next tasting party or event</p>
              <Button onClick={() => navigate('/planner')} variant="outline" className="w-full">Go to Planner</Button>
            </CardContent>
          </Card>
          
          <Card className="hover-elevate animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare size={18} /> Tasting Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Log and track your tasting events</p>
              <Button onClick={() => navigate('/events')} variant="outline" className="w-full">View Events</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
