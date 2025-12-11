import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { 
  Play,
  Heart,
  Shuffle,
  Clock,
  Star,
  Sofa
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CouchGag {
  id: number;
  title: string;
  description: string;
  season: number;
  episode: number;
  duration: string;
  rating: number;
  isFamous: boolean;
}

const COUCH_GAGS: CouchGag[] = [
  {
    id: 1,
    title: "The Classic",
    description: "The family runs in and sits on the couch normally. The original and simplest couch gag.",
    season: 1,
    episode: 1,
    duration: "5 sec",
    rating: 3,
    isFamous: false
  },
  {
    id: 2,
    title: "Simpsons Babies",
    description: "The family are babies crawling to the couch, then transform into adults when they sit.",
    season: 4,
    episode: 7,
    duration: "8 sec",
    rating: 4,
    isFamous: true
  },
  {
    id: 3,
    title: "Circus Trapeze",
    description: "The family swings in on trapezes and lands perfectly on the couch.",
    season: 5,
    episode: 2,
    duration: "10 sec",
    rating: 4,
    isFamous: false
  },
  {
    id: 4,
    title: "Banksy Opening",
    description: "Street artist Banksy's dark commentary on Simpsons merchandise production. One of the most controversial.",
    season: 22,
    episode: 3,
    duration: "180 sec",
    rating: 5,
    isFamous: true
  },
  {
    id: 5,
    title: "Rick and Morty Crossover",
    description: "Rick and Morty crash through the floor and kill the Simpson family, then Rick fixes it.",
    season: 26,
    episode: 4,
    duration: "120 sec",
    rating: 5,
    isFamous: true
  },
  {
    id: 6,
    title: "Homer Evolution",
    description: "Shows Homer's evolution from a single-cell organism to his current form.",
    season: 17,
    episode: 2,
    duration: "60 sec",
    rating: 5,
    isFamous: true
  },
  {
    id: 7,
    title: "Game of Thrones",
    description: "The family arrives at the couch through a Game of Thrones-style opening map sequence.",
    season: 26,
    episode: 1,
    duration: "90 sec",
    rating: 4,
    isFamous: true
  },
  {
    id: 8,
    title: "Pixel Art",
    description: "The family appears as 8-bit video game characters jumping onto a pixelated couch.",
    season: 17,
    episode: 7,
    duration: "15 sec",
    rating: 4,
    isFamous: false
  },
  {
    id: 9,
    title: "Clones",
    description: "Multiple copies of each family member fight for spots on the couch.",
    season: 6,
    episode: 1,
    duration: "12 sec",
    rating: 4,
    isFamous: false
  },
  {
    id: 10,
    title: "The Longest",
    description: "An extended couch gag that goes through multiple scenarios, lasting over 3 minutes.",
    season: 27,
    episode: 1,
    duration: "200 sec",
    rating: 5,
    isFamous: true
  },
  {
    id: 11,
    title: "Futurama Crossover",
    description: "The Planet Express ship crashes through the living room, mixing both shows.",
    season: 26,
    episode: 6,
    duration: "90 sec",
    rating: 5,
    isFamous: true
  },
  {
    id: 12,
    title: "Couch Morphs",
    description: "The couch transforms into various objects as the family tries to sit.",
    season: 8,
    episode: 14,
    duration: "10 sec",
    rating: 3,
    isFamous: false
  },
  {
    id: 13,
    title: "Simpsons Shuffle",
    description: "The family members' heads are on the wrong bodies.",
    season: 9,
    episode: 4,
    duration: "8 sec",
    rating: 4,
    isFamous: false
  },
  {
    id: 14,
    title: "Adventure Time Style",
    description: "The entire opening is animated in Adventure Time's art style.",
    season: 28,
    episode: 1,
    duration: "120 sec",
    rating: 5,
    isFamous: true
  },
  {
    id: 15,
    title: "Live Action",
    description: "Real actors recreate the couch gag in live action.",
    season: 17,
    episode: 14,
    duration: "30 sec",
    rating: 5,
    isFamous: true
  }
];

export default function CouchGags() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("simpsonspedia-favorite-gags");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState<"all" | "famous" | "favorites">("all");
  const [sortBy, setSortBy] = useState<"rating" | "season" | "duration">("rating");

  const toggleFavorite = (id: number) => {
    let newFavorites: number[];
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(f => f !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    setFavorites(newFavorites);
    localStorage.setItem("simpsonspedia-favorite-gags", JSON.stringify(newFavorites));
  };

  const getRandomGag = () => {
    const gag = COUCH_GAGS[Math.floor(Math.random() * COUCH_GAGS.length)];
    toast.success(`Random pick: "${gag.title}" from S${gag.season}E${gag.episode}!`);
  };

  let filteredGags = [...COUCH_GAGS];
  
  if (filter === "famous") {
    filteredGags = filteredGags.filter(g => g.isFamous);
  } else if (filter === "favorites") {
    filteredGags = filteredGags.filter(g => favorites.includes(g.id));
  }

  if (sortBy === "rating") {
    filteredGags.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "season") {
    filteredGags.sort((a, b) => a.season - b.season);
  } else if (sortBy === "duration") {
    filteredGags.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Couch Gag Collection"
            subtitle="Explore the iconic opening sequences"
            icon="🛋️"
          />

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <Sofa className="w-8 h-8 text-primary mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold text-foreground">{COUCH_GAGS.length}</p>
              <p className="text-sm text-muted-foreground">Total Gags</p>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 text-secondary mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold text-foreground">
                {COUCH_GAGS.filter(g => g.isFamous).length}
              </p>
              <p className="text-sm text-muted-foreground">Famous</p>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 text-accent mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold text-foreground">{favorites.length}</p>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex gap-2">
              {(["all", "famous", "favorites"] as const).map((f) => (
                <Button
                  key={f}
                  onClick={() => setFilter(f)}
                  variant={filter === f ? "default" : "outline"}
                  className={cn(
                    "font-heading rounded-full capitalize",
                    filter === f && "bg-primary text-primary-foreground"
                  )}
                >
                  {f}
                </Button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 rounded-full border-2 border-border bg-background font-heading text-sm"
            >
              <option value="rating">Sort by Rating</option>
              <option value="season">Sort by Season</option>
              <option value="duration">Sort by Duration</option>
            </select>

            <Button
              onClick={getRandomGag}
              variant="outline"
              className="font-heading rounded-full"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Random
            </Button>
          </div>

          {/* Gags Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {filteredGags.map((gag, index) => (
              <div
                key={gag.id}
                className="bg-card rounded-2xl p-5 border-2 border-border shadow-md hover:shadow-lg hover:border-primary transition-all animate-bounce-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛋️</span>
                    {gag.isFamous && (
                      <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-heading">
                        Famous
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(gag.id)}
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5 transition-colors",
                        favorites.includes(gag.id)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                </div>

                <h3 className="font-heading font-bold text-foreground mb-2">
                  {gag.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body mb-3 line-clamp-2">
                  {gag.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-heading">
                    S{gag.season}E{gag.episode}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {gag.duration}
                  </span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3 h-3",
                          i < gag.rating
                            ? "fill-primary text-primary"
                            : "text-muted"
                        )}
                      />
                    ))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredGags.length === 0 && (
            <div className="text-center py-12">
              <Sofa className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-heading text-foreground mb-2">No couch gags found</p>
              <p className="text-muted-foreground font-body">
                {filter === "favorites" ? "Add some favorites first!" : "Try a different filter"}
              </p>
            </div>
          )}
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

