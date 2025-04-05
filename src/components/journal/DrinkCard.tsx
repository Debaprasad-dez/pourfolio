
import { Drink } from "@/types/models";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface DrinkCardProps {
  drink: Drink;
  onClick?: () => void;
}

export function DrinkCard({ drink, onClick }: DrinkCardProps) {
  const formattedDate = formatDistanceToNow(new Date(drink.date), { addSuffix: true });

  return (
    <div 
      onClick={onClick}
      className="premium-card hover:cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-40 mb-3 overflow-hidden rounded-md">
        {drink.image ? (
          <img 
            src={drink.image} 
            alt={drink.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold">
          {drink.type}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-1">{drink.name}</h3>
      
      <div className="text-sm text-muted-foreground mb-2">
        <span>{drink.brand}</span>
        {drink.origin && <span> • {drink.origin}</span>}
      </div>
      
      <div className="flex items-center mb-2">
        <RatingStars rating={drink.rating} />
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {drink.tags.slice(0, 3).map((tag) => (
          <span 
            key={tag} 
            className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground"
          >
            {tag}
          </span>
        ))}
        {drink.tags.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            +{drink.tags.length - 3}
          </span>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground mt-auto">
        Added {formattedDate}
      </div>
    </div>
  );
}

interface RatingStarsProps {
  rating: number;
  max?: number;
  onChange?: (rating: number) => void;
}

export function RatingStars({ rating, max = 5, onChange }: RatingStarsProps) {
  return (
    <div className="flex">
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={cn(
            "transition-colors",
            i < rating ? "fill-gold text-gold" : "text-muted",
            onChange && "cursor-pointer hover:text-gold"
          )}
          onClick={() => onChange?.(i + 1)}
        />
      ))}
    </div>
  );
}
