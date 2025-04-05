
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, CalendarClock, Trash2, Check, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { format } from "date-fns";

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

interface PartyEvent {
  id: string;
  name: string;
  date: string;
  guestCount: number;
  category: string;
  description?: string;
  tasks: TaskItem[];
  createdAt: number;
}

// Default task templates based on event category
const taskTemplates: Record<string, string[]> = {
  'Wine': [
    'Wine glasses (1 per guest + extras)', 
    'Wine opener', 
    'Decanter', 
    'Ice bucket', 
    'Water for palate cleansing',
    'Cheese and crackers',
    'Tasting cards'
  ],
  'Beer': [
    'Beer glasses', 
    'Bottle opener', 
    'Ice for cooling', 
    'Water for palate cleansing',
    'Pretzels or snacks',
    'Tasting cards'
  ],
  'Whiskey': [
    'Whiskey glasses (1 per guest)', 
    'Water for dilution', 
    'Ice if desired', 
    'Pipettes for adding water',
    'Palate cleansing snacks',
    'Tasting cards'
  ],
  'Cocktail': [
    'Cocktail glasses', 
    'Cocktail shaker', 
    'Jigger/measuring tool', 
    'Ice', 
    'Garnishes',
    'Mixers',
    'Strainers',
    'Bar spoons',
    'Snacks'
  ],
  'Mixed': [
    'Various glassware', 
    'Openers (wine/beer)', 
    'Ice bucket', 
    'Water',
    'Assorted snacks',
    'Tasting cards'
  ],
};

const PartyPlanner = () => {
  const [events, setEvents] = useLocalStorage<PartyEvent[]>("pourfolio-events", []);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newEvent, setNewEvent] = useState<Omit<PartyEvent, 'id' | 'createdAt' | 'tasks'>>({
    name: '',
    date: '',
    guestCount: 4,
    category: 'Wine',
    description: ''
  });

  const handleAddEvent = () => {
    // Create default tasks based on the category
    const defaultTasks = (taskTemplates[newEvent.category] || []).map(text => ({
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text,
      completed: false
    }));
    
    const event: PartyEvent = {
      ...newEvent,
      id: `event-${Date.now()}`,
      createdAt: Date.now(),
      tasks: defaultTasks
    };
    
    setEvents([...events, event]);
    setIsAddingEvent(false);
    setNewEvent({
      name: '',
      date: '',
      guestCount: 4,
      category: 'Wine',
      description: ''
    });
  };
  
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };
  
  const toggleTask = (eventId: string, taskId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          tasks: event.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return event;
    }));
  };
  
  // Filter events
  const filteredEvents = events.filter(event => {
    return searchQuery.trim() === '' || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort events by date (closest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  return (
    <AppLayout activeTab="planner">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold animate-fade-in">Party Planner</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60"
            />
            
            <Button onClick={() => setIsAddingEvent(true)} className="w-full sm:w-auto hover-scale">
              <PlusIcon className="h-4 w-4 mr-2" />
              Plan New Event
            </Button>
          </div>
        </div>
        
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events planned</h3>
            <p className="text-muted-foreground mb-6">
              Plan your first tasting event
            </p>
            <Button onClick={() => setIsAddingEvent(true)} className="hover-scale">
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedEvents.map((event, index) => {
              const completedTasks = event.tasks.filter(t => t.completed).length;
              const progress = event.tasks.length > 0 
                ? Math.floor((completedTasks / event.tasks.length) * 100) 
                : 0;
              
              const eventDate = new Date(event.date);
              const isPastEvent = eventDate < new Date();
              
              return (
                <Card 
                  key={event.id} 
                  className={`hover-elevate animate-slide-in ${isPastEvent ? 'opacity-70' : ''}`} 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {format(new Date(event.date), 'MMMM d, yyyy')}
                          {isPastEvent && ' (Past)'}
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
                        <span className="text-muted-foreground">Category:</span>
                        <p>{event.category}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Guests:</span>
                        <p>{event.guestCount}</p>
                      </div>
                    </div>
                    
                    {event.description && (
                      <div>
                        <span className="text-sm text-muted-foreground">Notes:</span>
                        <p className="text-sm mt-1">{event.description}</p>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Checklist</h4>
                        <span className="text-xs text-muted-foreground">
                          {completedTasks}/{event.tasks.length} completed
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      
                      <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
                        {event.tasks.map(task => (
                          <div key={task.id} className="flex items-start gap-2">
                            <Checkbox 
                              id={task.id} 
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(event.id, task.id)}
                              className="mt-0.5"
                            />
                            <label 
                              htmlFor={task.id} 
                              className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.text}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {progress === 100 ? (
                      <div className="w-full flex items-center justify-center text-sm text-primary font-medium">
                        <Check className="mr-1 h-4 w-4" /> Ready for your event!
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center text-sm text-muted-foreground">
                        {isPastEvent ? (
                          <span><X className="inline-block mr-1 h-4 w-4" /> Event has passed</span>
                        ) : (
                          <span>{100 - progress}% tasks remaining</span>
                        )}
                      </div>
                    )}
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
            <DialogTitle>Plan a New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input 
                id="name" 
                value={newEvent.name} 
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                placeholder="e.g. Wine Tasting Night"
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
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newEvent.category} 
                onValueChange={(value) => setNewEvent({...newEvent, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wine">Wine</SelectItem>
                  <SelectItem value="Beer">Beer</SelectItem>
                  <SelectItem value="Whiskey">Whiskey</SelectItem>
                  <SelectItem value="Cocktail">Cocktail</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestCount">Number of Guests</Label>
              <Input 
                id="guestCount" 
                type="number"
                min={1}
                value={newEvent.guestCount.toString()} 
                onChange={(e) => setNewEvent({...newEvent, guestCount: parseInt(e.target.value) || 1})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Notes (optional)</Label>
              <Textarea 
                id="description" 
                value={newEvent.description} 
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Additional details about your event"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingEvent(false)}>Cancel</Button>
            <Button 
              onClick={handleAddEvent}
              disabled={!newEvent.name || !newEvent.date}
            >
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default PartyPlanner;
