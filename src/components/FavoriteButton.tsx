import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export function FavoriteButton({ isFavorite, onClick, className }: FavoriteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-md transition-colors",
        isFavorite
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("w-4 h-4", isFavorite && "fill-primary")} />
    </button>
  );
}
