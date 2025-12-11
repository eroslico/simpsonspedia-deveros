import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { 
  MapPin,
  X,
  ZoomIn,
  ZoomOut,
  Home,
  Building,
  Trees,
  Utensils
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  icon: string;
  category: "home" | "business" | "public" | "food";
  characters?: string[];
}

const LOCATIONS: Location[] = [
  {
    id: "simpsons-house",
    name: "742 Evergreen Terrace",
    description: "The Simpson family home. A two-story house with an attached garage, where Homer, Marge, Bart, Lisa, and Maggie live.",
    x: 25,
    y: 40,
    icon: "🏠",
    category: "home",
    characters: ["Homer", "Marge", "Bart", "Lisa", "Maggie"]
  },
  {
    id: "flanders-house",
    name: "740 Evergreen Terrace",
    description: "Home of the Flanders family. Ned keeps it in perfect condition, much to Homer's annoyance.",
    x: 20,
    y: 40,
    icon: "🏡",
    category: "home",
    characters: ["Ned Flanders", "Rod", "Todd"]
  },
  {
    id: "moes-tavern",
    name: "Moe's Tavern",
    description: "Springfield's local dive bar, owned by Moe Szyslak. Homer's favorite drinking spot.",
    x: 45,
    y: 55,
    icon: "🍺",
    category: "food",
    characters: ["Moe", "Barney", "Lenny", "Carl"]
  },
  {
    id: "kwik-e-mart",
    name: "Kwik-E-Mart",
    description: "Convenience store run by Apu Nahasapeemapetilon. Open 24 hours, 364 days a year.",
    x: 55,
    y: 35,
    icon: "🏪",
    category: "business",
    characters: ["Apu"]
  },
  {
    id: "nuclear-plant",
    name: "Springfield Nuclear Power Plant",
    description: "Owned by Mr. Burns, this is where Homer works as a Safety Inspector in Sector 7G.",
    x: 80,
    y: 25,
    icon: "☢️",
    category: "business",
    characters: ["Mr. Burns", "Smithers", "Homer", "Lenny", "Carl"]
  },
  {
    id: "elementary-school",
    name: "Springfield Elementary",
    description: "The local elementary school where Bart and Lisa attend. Principal Skinner runs the show.",
    x: 35,
    y: 65,
    icon: "🏫",
    category: "public",
    characters: ["Principal Skinner", "Mrs. Krabappel", "Groundskeeper Willie"]
  },
  {
    id: "krusty-burger",
    name: "Krusty Burger",
    description: "Fast food restaurant endorsed by Krusty the Clown. Home of the Krusty Burger and Ribwich.",
    x: 60,
    y: 50,
    icon: "🍔",
    category: "food",
    characters: ["Squeaky-Voiced Teen"]
  },
  {
    id: "church",
    name: "First Church of Springfield",
    description: "The local church where Reverend Lovejoy preaches to the community.",
    x: 40,
    y: 25,
    icon: "⛪",
    category: "public",
    characters: ["Reverend Lovejoy"]
  },
  {
    id: "android-dungeon",
    name: "The Android's Dungeon",
    description: "Comic book store owned by Comic Book Guy. Bart's favorite hangout for collecting comics.",
    x: 50,
    y: 70,
    icon: "🦸",
    category: "business",
    characters: ["Comic Book Guy"]
  },
  {
    id: "police-station",
    name: "Springfield Police Department",
    description: "Where Chief Wiggum and his officers pretend to fight crime.",
    x: 65,
    y: 40,
    icon: "🚔",
    category: "public",
    characters: ["Chief Wiggum", "Lou", "Eddie"]
  },
  {
    id: "hospital",
    name: "Springfield General Hospital",
    description: "The local hospital where Dr. Hibbert and Dr. Nick work.",
    x: 75,
    y: 60,
    icon: "🏥",
    category: "public",
    characters: ["Dr. Hibbert", "Dr. Nick"]
  },
  {
    id: "burns-manor",
    name: "Burns Manor",
    description: "The extravagant mansion of Montgomery Burns, complete with guard dogs and Smithers.",
    x: 85,
    y: 70,
    icon: "🏰",
    category: "home",
    characters: ["Mr. Burns", "Smithers"]
  }
];

const CATEGORIES = [
  { id: "all", name: "All", icon: MapPin },
  { id: "home", name: "Homes", icon: Home },
  { id: "business", name: "Business", icon: Building },
  { id: "public", name: "Public", icon: Trees },
  { id: "food", name: "Food", icon: Utensils },
];

export default function SpringfieldMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [zoom, setZoom] = useState(1);

  const filteredLocations = filter === "all" 
    ? LOCATIONS 
    : LOCATIONS.filter(loc => loc.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Springfield Map"
            subtitle="Explore the iconic locations of Springfield"
            icon="🗺️"
          />

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  variant={filter === cat.id ? "default" : "outline"}
                  className={cn(
                    "font-heading rounded-full",
                    filter === cat.id && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.name}
                </Button>
              );
            })}
          </div>

          {/* Map Container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <Button
                onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
                variant="outline"
                size="icon"
                className="rounded-full bg-card"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
                variant="outline"
                size="icon"
                className="rounded-full bg-card"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Map */}
            <div 
              className="relative bg-gradient-to-b from-simpsons-blue/30 to-simpsons-green/30 rounded-3xl border-4 border-border overflow-hidden"
              style={{ 
                aspectRatio: "16/10",
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                transition: "transform 0.3s ease"
              }}
            >
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Roads */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-400 transform -translate-y-1/2" />
                <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-gray-400" />
                <div className="absolute top-0 bottom-0 right-1/4 w-3 bg-gray-400" />
              </div>

              {/* Location Pins */}
              {filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all",
                    "hover:scale-125 hover:z-10",
                    selectedLocation?.id === location.id && "scale-125 z-10"
                  )}
                  style={{ left: `${location.x}%`, top: `${location.y}%` }}
                >
                  <div className={cn(
                    "text-3xl md:text-4xl drop-shadow-lg",
                    "animate-bounce hover:animate-none"
                  )}>
                    {location.icon}
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <MapPin className="w-4 h-4 text-destructive fill-destructive" />
                  </div>
                </button>
              ))}
            </div>

            {/* Location Info Panel */}
            {selectedLocation && (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card rounded-2xl p-4 border-2 border-border shadow-xl animate-bounce-in z-30">
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{selectedLocation.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-foreground">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body mt-1">
                      {selectedLocation.description}
                    </p>
                    
                    {selectedLocation.characters && (
                      <div className="mt-3">
                        <p className="text-xs font-heading text-muted-foreground mb-1">
                          Notable Characters:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedLocation.characters.map((char) => (
                            <span
                              key={char}
                              className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-heading"
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-card rounded-2xl p-4 border-2 border-border">
              <h3 className="font-heading font-bold text-foreground mb-3">Locations ({filteredLocations.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-xl text-left transition-all",
                      "hover:bg-muted",
                      selectedLocation?.id === loc.id && "bg-primary/20"
                    )}
                  >
                    <span className="text-xl">{loc.icon}</span>
                    <span className="text-sm font-heading text-foreground truncate">
                      {loc.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

