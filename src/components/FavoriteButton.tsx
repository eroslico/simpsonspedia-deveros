import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FavoriteButton({ 
  isFavorite, 
  onClick, 
  size = "md",
  className 
}: FavoriteButtonProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-300",
        "bg-card/90 backdrop-blur-sm border-2 shadow-lg",
        "hover:scale-110 active:scale-95",
        isFavorite 
          ? "border-accent text-accent" 
          : "border-border text-muted-foreground hover:border-accent hover:text-accent",
        sizeClasses[size],
        className
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          "transition-all duration-300",
          isFavorite && "fill-accent scale-110"
        )} 
      />
    </button>
  );
}

