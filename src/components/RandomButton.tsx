import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shuffle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface RandomButtonProps {
  className?: string;
}

export function RandomButton({ className }: RandomButtonProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getRandomItem = async (type: "characters" | "episodes" | "locations") => {
    setLoading(true);
    try {
      // First, get the total count
      const res = await fetch(`https://thesimpsonsapi.com/api/${type}?page=1`);
      const data = await res.json();
      const totalPages = data.pages || 1;
      
      // Get a random page
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const randomRes = await fetch(`https://thesimpsonsapi.com/api/${type}?page=${randomPage}`);
      const randomData = await randomRes.json();
      
      // Get a random item from that page
      const results = randomData.results || [];
      if (results.length > 0) {
        const randomIndex = Math.floor(Math.random() * results.length);
        const randomItem = results[randomIndex];
        
        // Navigate and store the random item for highlighting
        sessionStorage.setItem("randomItem", JSON.stringify({
          id: randomItem.id,
          type: type.slice(0, -1), // Remove 's' from end
        }));
        
        navigate(`/${type}`);
      }
    } catch (error) {
      console.error("Error getting random item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "bg-gradient-to-r from-accent to-secondary text-white",
            "hover:from-accent/90 hover:to-secondary/90",
            "font-heading rounded-full shadow-lg hover:shadow-xl",
            "transition-all duration-300 hover:scale-105",
            "border-2 border-white/20",
            className
          )}
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Sparkles className="w-5 h-5 mr-2" />
          )}
          Surprise Me!
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-card border-2 border-border shadow-xl rounded-xl"
        align="end"
      >
        <DropdownMenuItem
          onClick={() => getRandomItem("characters")}
          className="font-heading cursor-pointer gap-2 py-3"
        >
          <span className="text-xl">👥</span>
          Random Character
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => getRandomItem("episodes")}
          className="font-heading cursor-pointer gap-2 py-3"
        >
          <span className="text-xl">📺</span>
          Random Episode
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => getRandomItem("locations")}
          className="font-heading cursor-pointer gap-2 py-3"
        >
          <span className="text-xl">🗺️</span>
          Random Location
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

