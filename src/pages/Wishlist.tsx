
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, Bookmark, Trash2, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "@/components/ui/use-toast";

interface WishlistItem {
  id: string;
  name: string;
  type: string;
  brand?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

const Wishlist = () => {
  const [items, setItems] = useLocalStorage<WishlistItem[]>("pourfolio-wishlist", []);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'date'>('date');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newItem, setNewItem] = useState<Omit<WishlistItem, 'id' | 'createdAt'>>({
    name: '',
    type: '',
    brand: '',
    notes: '',
    priority: 'medium'
  });

  const handleAddItem = () => {
    const item: WishlistItem = {
      ...newItem,
      id: `wishlist-${Date.now()}`,
      createdAt: Date.now()
    };
    
    setItems([...items, item]);
    setIsAddingItem(false);
    setNewItem({
      name: '',
      type: '',
      brand: '',
      notes: '',
      priority: 'medium'
    });
    
    toast({
      title: "Item added",
      description: `${item.name} has been added to your wishlist.`,
    });
  };
  
  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    setItems(items.filter(item => item.id !== id));
    
    if (itemToDelete) {
      toast({
        title: "Item removed",
        description: `${itemToDelete.name} has been removed from your wishlist.`,
      });
    }
  };
  
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };
  
  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery.trim() === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    
    return matchesSearch && matchesPriority;
  });
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else {
      return b.createdAt - a.createdAt;
    }
  });

  return (
    <AppLayout activeTab="wishlist">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold animate-fade-in">Wishlist</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60"
            />
            
            <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as any)}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={() => setSortBy(sortBy === 'name' ? 'date' : sortBy === 'date' ? 'priority' : 'name')} variant="outline" className="w-full sm:w-auto">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortBy === 'name' ? 'Name' : sortBy === 'priority' ? 'Priority' : 'Date'}
            </Button>
            
            <Button onClick={() => setIsAddingItem(true)} className="w-full sm:w-auto hover-scale">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Drink
            </Button>
          </div>
        </div>
        
        {sortedItems.length === 0 ? (
          <div className="text-center py-12 animate-fade-in border rounded-lg p-8 bg-background">
            <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add drinks you want to try in the future
            </p>
            <Button onClick={() => setIsAddingItem(true)} className="hover-scale">
              Add Your First Wishlist Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedItems.map((item, index) => (
              <Card key={item.id} className="hover-elevate animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardHeader className="pb-2">
                  <Badge className={`mb-2 ${priorityColors[item.priority]}`}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                  </Badge>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{item.type}</span>
                    </div>
                    {item.brand && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand:</span>
                        <span>{item.brand}</span>
                      </div>
                    )}
                    {item.notes && (
                      <div className="mt-2">
                        <span className="text-muted-foreground">Notes:</span>
                        <p className="mt-1">{item.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteItem(item.id)}
                    className="ml-auto hover-scale"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Wishlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                value={newItem.name} 
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="e.g. Macallan 12 Year"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Input 
                id="type" 
                value={newItem.type} 
                onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                placeholder="e.g. Whiskey, Wine, Beer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand (optional)</Label>
              <Input 
                id="brand" 
                value={newItem.brand} 
                onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
                placeholder="e.g. Macallan, Yellow Tail"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={newItem.priority} 
                onValueChange={(value) => setNewItem({...newItem, priority: value as 'low' | 'medium' | 'high'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea 
                id="notes" 
                value={newItem.notes} 
                onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                placeholder="Why do you want to try this?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingItem(false)}>Cancel</Button>
            <Button 
              onClick={handleAddItem}
              disabled={!newItem.name || !newItem.type}
              className="hover-scale"
            >
              Add to Wishlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Wishlist;
