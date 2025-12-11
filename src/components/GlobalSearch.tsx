import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Tv, MapPin, X, Command } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: number;
  name: string;
  type: "character" | "episode" | "location";
  image?: string;
  subtitle?: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search function
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const [charactersRes, episodesRes, locationsRes] = await Promise.all([
        fetch(`https://thesimpsonsapi.com/api/characters?page=1`),
        fetch(`https://thesimpsonsapi.com/api/episodes?page=1`),
        fetch(`https://thesimpsonsapi.com/api/locations?page=1`),
      ]);

      const [characters, episodes, locations] = await Promise.all([
        charactersRes.json(),
        episodesRes.json(),
        locationsRes.json(),
      ]);

      const searchLower = searchQuery.toLowerCase();
      const combined: SearchResult[] = [];

      // Filter characters
      (characters.results || [])
        .filter((c: any) => c.name.toLowerCase().includes(searchLower))
        .slice(0, 5)
        .forEach((c: any) => {
          combined.push({
            id: c.id,
            name: c.name,
            type: "character",
            image: `https://cdn.thesimpsonsapi.com/500${c.portrait_path}`,
            subtitle: c.occupation || "Character",
          });
        });

      // Filter episodes
      (episodes.results || [])
        .filter((e: any) => e.name.toLowerCase().includes(searchLower))
        .slice(0, 5)
        .forEach((e: any) => {
          combined.push({
            id: e.id,
            name: e.name,
            type: "episode",
            image: e.image_path ? `https://cdn.thesimpsonsapi.com/500${e.image_path}` : undefined,
            subtitle: `Season ${e.season}, Episode ${e.episode}`,
          });
        });

      // Filter locations
      (locations.results || [])
        .filter((l: any) => l.name.toLowerCase().includes(searchLower))
        .slice(0, 5)
        .forEach((l: any) => {
          combined.push({
            id: l.id,
            name: l.name,
            type: "location",
            image: l.image_path ? `https://cdn.thesimpsonsapi.com/500${l.image_path}` : undefined,
            subtitle: l.town || "Location",
          });
        });

      setResults(combined);
      setSelectedIndex(0);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate(`/${result.type}s`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "character":
        return <Users className="w-4 h-4" />;
      case "episode":
        return <Tv className="w-4 h-4" />;
      case "location":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "character":
        return "bg-primary/20 text-primary";
      case "episode":
        return "bg-secondary/20 text-secondary";
      case "location":
        return "bg-accent/20 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-primary-foreground/20 hover:bg-primary-foreground/30",
          "border border-primary-foreground/30",
          "text-primary-foreground text-sm font-body",
          "transition-all duration-200"
        )}
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary-foreground/20 text-xs">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      {/* Mobile search button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "md:hidden p-2 rounded-full",
          "bg-primary-foreground/20 hover:bg-primary-foreground/30",
          "text-primary-foreground",
          "transition-all duration-200"
        )}
      >
        <Search className="w-5 h-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 bg-card border-2 border-border rounded-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search characters, episodes, locations..."
              className="flex-1 h-14 border-0 bg-transparent text-lg font-body focus-visible:ring-0 placeholder:text-muted-foreground/60"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground font-body">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                      index === selectedIndex
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    )}
                  >
                    {/* Image */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      {result.image ? (
                        <img
                          src={result.image}
                          alt={result.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getIcon(result.type)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-heading font-bold text-foreground truncate">
                        {result.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                    </div>

                    {/* Type badge */}
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-heading capitalize shrink-0",
                      getTypeColor(result.type)
                    )}>
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="p-8 text-center">
                <span className="text-4xl mb-3 block">🔍</span>
                <p className="text-muted-foreground font-body">
                  No results found for "{query}"
                </p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <span className="text-4xl mb-3 block">🍩</span>
                <p className="text-muted-foreground font-body">
                  Start typing to search...
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">Characters</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-secondary/20 text-secondary">Episodes</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-accent/20 text-accent">Locations</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

