
export interface Drink {
  id: string;
  name: string;
  type: DrinkType;
  brand: string;
  abv: number;
  price: number;
  origin: string;
  tags: string[];
  rating: number;
  notes: string;
  date: string;
  location: string;
  image?: string;
  eventId?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  guestCount: number;
  category: DrinkType;
  notes: string;
  checklistItems: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface WishlistItem {
  id: string;
  name: string;
  type: DrinkType;
  brand: string;
  priority: "low" | "medium" | "high";
  notes: string;
}

export type DrinkType = 
  | "Wine" 
  | "Whiskey" 
  | "Bourbon" 
  | "Gin" 
  | "Vodka" 
  | "Rum" 
  | "Tequila" 
  | "Beer" 
  | "Cider" 
  | "Other";
