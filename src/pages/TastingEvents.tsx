
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, CheckSquare, Trash2, Wine } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Drink } from "@/types/models";
import { format } from "date-fns";

interface TastingEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  drinkIds: string[];
  notes: string;
  createdAt: number;
}

const TastingEvents = () => {
  const [events, setEvents] = useLocalStorage<TastingEvent[]>("pourfolio-tasting-events", []);
  const [drinks] = useLocalStorage<Drink[]>("pourfolio", []);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isViewingEvent, setIsViewingEvent] = useState<TastingEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newEvent, setNewEvent] = useState<Omit<TastingEvent, 'id' | 'createdAt'>>({
    name: '',
    date: '',
    location: '',
    description: '',
    drinkIds: [],
    notes: ''
  });

  const handleAddEvent = () => {
    const event: TastingEvent = {
      ...newEvent,
      id: `tastingEvent-${Date.now()}`,
      createdAt: Date.now()
    };
    
    setEvents([...events, event]);
    setIsAddingEvent(false);
    setNewEvent({
      name: '',
      date: '',
      location: '',
      description: '',
      drinkIds: [],
      notes: ''
    });
  };
  
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };
  
  const toggleDrinkSelection = (drinkId: string) => {
    setNewEvent(prev => {
      if (prev.drinkIds.includes(drinkId)) {
        return { ...prev, drinkIds: prev.drinkIds.filter(id => id !== drinkId) };
      } else {
        return { ...prev, drinkIds: [...prev.drinkIds, drinkId] };
      }
    });
  };
  
  // Filter events
  const filteredEvents = events.filter(event => {
    return searchQuery.trim() === '' || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort events by date (most recent first)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return (
    <AppLayout activeTab="events">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold animate-fade-in">Tasting Events</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60"
            />
            
            <Button onClick={() => setIsAddingEvent(true)} className="w-full sm:w-auto hover-scale">
              <PlusIcon className="h-4 w-4 mr-2" />
              Log New Event
            </Button>
          </div>
        </div>
        
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tasting events logged</h3>
            <p className="text-muted-foreground mb-6">
              Record your tasting experiences to build your palate history
            </p>
            <Button onClick={() => setIsAddingEvent(true)} className="hover-scale">
              Log Your First Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedEvents.map((event, index) => {
              const eventDrinks = drinks.filter(drink => event.drinkIds.includes(drink.id));
              
              return (
                <Card 
                  key={event.id} 
                  className="hover-elevate animate-slide-in" 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {format(new Date(event.date), 'MMMM d, yyyy')}
                        </p>
                        <CardTitle>{event.name}</CardTitle>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p>{event.location}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Drinks tasted:</span>
                        <p>{eventDrinks.length}</p>
                      </div>
                    </div>
                    
                    {event.description && (
                      <div>
                        <span className="text-sm text-muted-foreground">Description:</span>
                        <p className="text-sm mt-1">{event.description}</p>
                      </div>
                    )}
                    
                    {eventDrinks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Drinks</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {eventDrinks.slice(0, 4).map(drink => (
                            <div key={drink.id} className="text-xs p-2 bg-muted rounded-lg flex items-center gap-2">
                              <Wine className="h-3 w-3 text-primary" />
                              <span className="truncate">{drink.name}</span>
                            </div>
                          ))}
                          {eventDrinks.length > 4 && (
                            <div className="text-xs p-2 bg-muted rounded-lg flex items-center justify-center">
                              +{eventDrinks.length - 4} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setIsViewingEvent(event)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log a Tasting Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input 
                id="name" 
                value={newEvent.name} 
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                placeholder="e.g. Wine Bar Crawl 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Event Date *</Label>
              <Input 
                id="date" 
                type="date"
                value={newEvent.date} 
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input 
                id="location" 
                value={newEvent.location} 
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="e.g. Downtown Wine Bar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newEvent.description} 
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Describe the tasting event"
              />
            </div>
            
            {drinks.length > 0 && (
              <div className="space-y-2">
                <Label>Select Drinks Tasted</Label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                  {drinks.map(drink => (
                    <div key={drink.id} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`drink-${drink.id}`}
                        checked={newEvent.drinkIds.includes(drink.id)}
                        onChange={() => toggleDrinkSelection(drink.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`drink-${drink.id}`} className="text-sm">
                        {drink.name} ({drink.type})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Event Notes</Label>
              <Textarea 
                id="notes" 
                value={newEvent.notes} 
                onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                placeholder="Any additional notes or observations"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingEvent(false)}>Cancel</Button>
            <Button 
              onClick={handleAddEvent}
              disabled={!newEvent.name || !newEvent.date || !newEvent.location}
            >
              Log Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {isViewingEvent && (
        <Dialog open={!!isViewingEvent} onOpenChange={(open) => !open && setIsViewingEvent(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{isViewingEvent.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {format(new Date(isViewingEvent.date), 'MMMM d, yyyy')} at {isViewingEvent.location}
              </p>
            </DialogHeader>
            <div className="space-y-4">
              {isViewingEvent.description && (
                <div>
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="mt-1">{isViewingEvent.description}</p>
                </div>
              )}
              
              {isViewingEvent.notes && (
                <div>
                  <h4 className="text-sm font-medium">Event Notes</h4>
                  <p className="mt-1">{isViewingEvent.notes}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Drinks Tasted</h4>
                {drinks.filter(d => isViewingEvent.drinkIds.includes(d.id)).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {drinks
                      .filter(d => isViewingEvent.drinkIds.includes(d.id))
                      .map(drink => (
                        <div key={drink.id} className="p-3 border rounded-lg text-sm">
                          <div className="font-medium">{drink.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {drink.type} • {drink.brand} • Rating: {drink.rating}/5
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No drinks recorded for this event</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  );
};

export default TastingEvents;
