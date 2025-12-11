import { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { CharacterCard } from "@/components/CharacterCard";
import { SearchBar } from "@/components/SearchBar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PageHeader } from "@/components/PageHeader";
import { CharacterModal } from "@/components/CharacterModal";
import { PageTransition } from "@/components/PageTransition";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useFavorites } from "@/hooks/useFavorites";
import { Loader2, Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Character {
  id: number;
  name: string;
  portrait_path: string;
  gender?: string;
  occupation?: string;
  status?: string;
  age?: number;
  birthdate?: string;
  phrases?: string[];
}

interface ApiResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: Character[];
}

type GenderFilter = "all" | "Male" | "Female";
type StatusFilter = "all" | "Alive" | "Dead";

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  
  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchCharacters = useCallback(async (pageNum: number, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(`https://thesimpsonsapi.com/api/characters?page=${pageNum}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch characters");
      }
      
      const data: ApiResponse = await res.json();

      if (isInitial) {
        setCharacters(data.results || []);
        setTotalCount(data.count);
      } else {
        setCharacters(prev => [...prev, ...(data.results || [])]);
      }

      setHasMore(data.next !== null);
    } catch (err) {
      console.error("Error fetching characters:", err);
      setError("Failed to load characters. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchCharacters(1, true);
  }, [fetchCharacters]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCharacters(nextPage);
    }
  }, [page, loadingMore, hasMore, fetchCharacters]);

  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loadingMore);

  // Apply filters
  const filteredCharacters = useMemo(() => {
    let filtered = characters;
    
    if (search) {
      filtered = filtered.filter((char) =>
        char.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (genderFilter !== "all") {
      filtered = filtered.filter((char) => char.gender === genderFilter);
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((char) => 
        char.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    return filtered;
  }, [characters, search, genderFilter, statusFilter]);

  const activeFiltersCount = [
    genderFilter !== "all",
    statusFilter !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setGenderFilter("all");
    setStatusFilter("all");
    setSearch("");
  };

  const handleFavoriteClick = (e: React.MouseEvent, character: Character) => {
    e.stopPropagation();
    toggleFavorite({
      id: character.id,
      type: "character",
      name: character.name,
      image: `https://cdn.thesimpsonsapi.com/500${character.portrait_path}`,
    });
  };

  const handleRetry = () => {
    setPage(1);
    fetchCharacters(1, true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Characters"
            subtitle="Discover all the characters from The Simpsons universe"
            icon="👥"
          />

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search character..."
            />
            
            <div className="flex gap-2">
              {/* Gender Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-12 px-4 rounded-full border-2 border-border bg-card hover:bg-muted font-heading gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Gender
                    {genderFilter !== "all" && (
                      <Badge className="bg-primary text-primary-foreground ml-1">1</Badge>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-2 border-border shadow-xl">
                  <DropdownMenuItem 
                    onClick={() => setGenderFilter("all")}
                    className="font-heading cursor-pointer"
                  >
                    All Genders
                    {genderFilter === "all" && <Badge className="ml-auto bg-primary">✓</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setGenderFilter("Male")}
                    className="font-heading cursor-pointer"
                  >
                    👨 Male
                    {genderFilter === "Male" && <Badge className="ml-auto bg-primary">✓</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setGenderFilter("Female")}
                    className="font-heading cursor-pointer"
                  >
                    👩 Female
                    {genderFilter === "Female" && <Badge className="ml-auto bg-primary">✓</Badge>}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-12 px-4 rounded-full border-2 border-border bg-card hover:bg-muted font-heading gap-2"
                  >
                    Status
                    {statusFilter !== "all" && (
                      <Badge className="bg-primary text-primary-foreground ml-1">1</Badge>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-2 border-border shadow-xl">
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("all")}
                    className="font-heading cursor-pointer"
                  >
                    All Status
                    {statusFilter === "all" && <Badge className="ml-auto bg-primary">✓</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("Alive")}
                    className="font-heading cursor-pointer"
                  >
                    ✨ Alive
                    {statusFilter === "Alive" && <Badge className="ml-auto bg-primary">✓</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("Dead")}
                    className="font-heading cursor-pointer"
                  >
                    💀 Deceased
                    {statusFilter === "Dead" && <Badge className="ml-auto bg-primary">✓</Badge>}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters */}
              {(activeFiltersCount > 0 || search) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-12 px-4 rounded-full font-heading text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(activeFiltersCount > 0 || search) && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {search && (
                <Badge variant="secondary" className="px-3 py-1 font-body">
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="ml-2 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {genderFilter !== "all" && (
                <Badge variant="secondary" className="px-3 py-1 font-body">
                  Gender: {genderFilter}
                  <button onClick={() => setGenderFilter("all")} className="ml-2 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="px-3 py-1 font-body">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter("all")} className="ml-2 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Error State */}
          {error && !loading ? (
            <ErrorState
              title="Failed to load characters"
              message={error}
              onRetry={handleRetry}
            />
          ) : loading ? (
            <SkeletonGrid count={18} type="character" />
          ) : (
            <>
              <p className="text-center text-muted-foreground mb-6 font-body">
                {search || activeFiltersCount > 0
                  ? `Showing ${filteredCharacters.length} results`
                  : `Showing ${characters.length} of ${totalCount} characters`
                }
              </p>

              {filteredCharacters.length === 0 ? (
                <EmptyState
                  title="No characters found"
                  message="Try adjusting your search or filters"
                  icon="🔍"
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredCharacters.map((character, index) => (
                    <div
                      key={`${character.id}-${index}`}
                      className="relative animate-bounce-in"
                      style={{ animationDelay: `${(index % 20) * 30}ms` }}
                    >
                      <CharacterCard
                        character={{
                          ...character,
                          image: `https://cdn.thesimpsonsapi.com/500${character.portrait_path}`
                        }}
                        onClick={() => setSelectedCharacter(character)}
                      />
                      <FavoriteButton
                        isFavorite={isFavorite(character.id, "character")}
                        onClick={(e) => handleFavoriteClick(e, character)}
                        size="sm"
                        className="absolute top-2 right-2 z-10"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Infinite scroll trigger */}
              {!search && !activeFiltersCount && hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  {loadingMore && (
                    <div className="flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      <span className="font-heading text-foreground">Loading more characters...</span>
                    </div>
                  )}
                </div>
              )}

              {!hasMore && !search && !activeFiltersCount && characters.length > 0 && (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">🎉</span>
                  <p className="text-muted-foreground font-body">
                    You've seen all {totalCount} characters!
                  </p>
                </div>
              )}
            </>
          )}

          <CharacterModal 
            character={selectedCharacter} 
            onClose={() => setSelectedCharacter(null)} 
          />
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}
