import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: number;
  name: string;
  type: "character" | "episode" | "location";
  subtitle?: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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

      (characters.results || [])
        .filter((c: any) => c.name.toLowerCase().includes(searchLower))
        .slice(0, 5)
        .forEach((c: any) => {
          combined.push({
            id: c.id,
            name: c.name,
            type: "character",
            subtitle: c.occupation || undefined,
          });
        });

      (episodes.results || [])
        .filter((e: any) => e.name.toLowerCase().includes(searchLower))
        .slice(0, 5)
        .forEach((e: any) => {
          combined.push({
            id: e.id,
            name: e.name,
            type: "episode",
            subtitle: `S${String(e.season).padStart(2, "0")}E${String(e.episode_number).padStart(2, "0")}`,
          });
        });

      (locations.results || [])
        .filter((l: any) => l.name.toLowerCase().includes(searchLower))
        .slice(0, 5)
        .forEach((l: any) => {
          combined.push({
            id: l.id,
            name: l.name,
            type: "location",
            subtitle: l.town || undefined,
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

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0 gap-0 bg-card border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="flex-1 h-12 border-0 bg-transparent text-sm focus-visible:ring-0"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} className="p-1 rounded-md hover:bg-muted">
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-1">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors",
                      index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{result.name}</p>
                      {result.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                      )}
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground ml-3 shrink-0">
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No results for "{query}"</p>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Start typing to search</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
