
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DrinkType, Drink } from "@/types/models";
import { RatingStars } from "./DrinkCard";
import { X, Camera } from "lucide-react";

const drinkTypes: DrinkType[] = [
  "Wine", "Whiskey", "Bourbon", "Gin", "Vodka", 
  "Rum", "Tequila", "Beer", "Cider", "Other"
];

const commonTags = [
  "Sweet", "Dry", "Bitter", "Fruity", "Spicy", "Smoky",
  "Floral", "Herbal", "Rich", "Light", "Crisp", "Smooth",
  "Oaky", "Vanilla", "Caramel", "Chocolate", "Citrus"
];

interface DrinkFormProps {
  onSubmit: (drink: Omit<Drink, "id">) => void;
  onCancel: () => void;
  initialDrink?: Drink;
}

export function DrinkForm({ onSubmit, onCancel, initialDrink }: DrinkFormProps) {
  const [name, setName] = useState(initialDrink?.name || "");
  const [type, setType] = useState<DrinkType>(initialDrink?.type || "Wine");
  const [brand, setBrand] = useState(initialDrink?.brand || "");
  const [abv, setAbv] = useState(initialDrink?.abv?.toString() || "");
  const [price, setPrice] = useState(initialDrink?.price?.toString() || "");
  const [origin, setOrigin] = useState(initialDrink?.origin || "");
  const [tags, setTags] = useState<string[]>(initialDrink?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [rating, setRating] = useState(initialDrink?.rating || 0);
  const [notes, setNotes] = useState(initialDrink?.notes || "");
  const [location, setLocation] = useState(initialDrink?.location || "");
  const [image, setImage] = useState<string | undefined>(initialDrink?.image);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      type,
      brand,
      abv: parseFloat(abv) || 0,
      price: parseFloat(price) || 0,
      origin,
      tags,
      rating,
      notes,
      date: initialDrink?.date || new Date().toISOString(),
      location,
      image,
    });
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="drink-image">Image</Label>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted flex items-center justify-center">
            {image ? (
              <>
                <img src={image} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage(undefined)}
                  className="absolute top-1 right-1 bg-background/70 rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <Camera size={24} className="text-muted-foreground" />
            )}
          </div>
          <Input
            id="drink-image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="drink-name">Name*</Label>
          <Input
            id="drink-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drink-type">Type*</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as DrinkType)}
          >
            <SelectTrigger id="drink-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {drinkTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="drink-brand">Brand</Label>
          <Input
            id="drink-brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drink-origin">Origin</Label>
          <Input
            id="drink-origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Country/Region"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drink-abv">ABV (%)</Label>
          <Input
            id="drink-abv"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={abv}
            onChange={(e) => setAbv(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drink-price">Price</Label>
          <Input
            id="drink-price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drink-location">Location</Label>
          <Input
            id="drink-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where you tasted it"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drink-rating">Rating</Label>
          <div className="pt-2">
            <RatingStars rating={rating} onChange={setRating} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {commonTags.filter(tag => !tags.includes(tag)).slice(0, 8).map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setTags([...tags, tag])}
              className="text-xs px-2 py-1 bg-accent/10 hover:bg-accent/20 rounded-full"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="drink-notes">Notes</Label>
        <Textarea
          id="drink-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Your tasting notes..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name}>
          {initialDrink ? "Update" : "Add"} Drink
        </Button>
      </div>
    </form>
  );
}
