
import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon, Wine } from "lucide-react";
import { DrinkCard } from "@/components/journal/DrinkCard";
import { DrinkForm } from "@/components/journal/DrinkForm";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drink } from "@/types/models";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlavorProfile from "./FlavorProfile";
import { toast } from "@/components/ui/use-toast";

interface IndexProps {
  activeTab?: string;
}

const Index = ({ activeTab = "journal" }: IndexProps) => {
  const [drinks, setDrinks] = useLocalStorage<Drink[]>("pourfolio", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingDrink, setIsAddingDrink] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
  const [currentTab, setCurrentTab] = useState(activeTab === "profile" ? "profile" : "journal");

  useEffect(() => {
    // Make sure currentTab stays in sync with the route's activeTab prop
    setCurrentTab(activeTab === "profile" ? "profile" : "journal");
  }, [activeTab]);

  const handleAddDrink = (newDrink: Omit<Drink, "id">) => {
    const drink = {
      ...newDrink,
      id: `drink-${Date.now()}`,
    };
    setDrinks([drink, ...drinks]);
    setIsAddingDrink(false);
    toast({
      title: "Drink added",
      description: `${drink.name} has been added to your journal.`,
    });
  };

  const handleUpdateDrink = (updatedDrink: Omit<Drink, "id">) => {
    if (!editingDrink) return;
    
    const updatedDrinks = drinks.map(drink => 
      drink.id === editingDrink.id ? { ...updatedDrink, id: editingDrink.id } : drink
    );
    
    setDrinks(updatedDrinks);
    setEditingDrink(null);
    toast({
      title: "Drink updated",
      description: `${updatedDrink.name} has been updated.`,
    });
  };

  const filteredDrinks = drinks.filter(drink => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      drink.name.toLowerCase().includes(query) ||
      drink.brand.toLowerCase().includes(query) ||
      drink.tags.some(tag => tag.toLowerCase().includes(query)) ||
      drink.type.toLowerCase().includes(query) ||
      drink.origin.toLowerCase().includes(query)
    );
  });

  return (
    <AppLayout activeTab={activeTab === "profile" ? "profile" : "journal"}>
      <Tabs defaultValue={currentTab} value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex ">
          <TabsTrigger value="journal" className="transition-all duration-300">Tasting Journal</TabsTrigger>
          <TabsTrigger value="profile" className="transition-all duration-300">Flavor Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="journal" className="animate-fade-in min-h-[400px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
            <div className="relative w-full md:w-80">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search drinks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsAddingDrink(true)} className="hover-scale">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Drink
            </Button>
          </div>

          {filteredDrinks.length === 0 ? (
            <div className="text-center py-12 animate-fade-in border rounded-lg p-8 bg-background">
              <Wine className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No drinks found</h3>
              <p className="text-muted-foreground mb-6">
                {drinks.length === 0
                  ? "Start building your collection by adding your first drink"
                  : "Try adjusting your search or filters"}
              </p>
              <Button onClick={() => setIsAddingDrink(true)} className="hover-scale">
                Add Your First Drink
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrinks.map((drink, index) => (
                <div 
                  key={drink.id} 
                  className="animate-slide-in" 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <DrinkCard
                    drink={drink}
                    onClick={() => setEditingDrink(drink)}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="profile" className="animate-fade-in min-h-[400px]">
          <FlavorProfile drinks={drinks} />
        </TabsContent>
      </Tabs>

      <Dialog open={isAddingDrink} onOpenChange={setIsAddingDrink}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Add New Drink</DialogTitle>
          <DrinkForm
            onSubmit={handleAddDrink}
            onCancel={() => setIsAddingDrink(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingDrink} onOpenChange={(open) => !open && setEditingDrink(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Edit Drink</DialogTitle>
          {editingDrink && (
            <DrinkForm
              initialDrink={editingDrink}
              onSubmit={handleUpdateDrink}
              onCancel={() => setEditingDrink(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Index;
