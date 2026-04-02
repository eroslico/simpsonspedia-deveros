import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CharacterCard } from "@/components/CharacterCard";
import { CharacterModal } from "@/components/CharacterModal";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useFavorites } from "@/hooks/useFavorites";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");

  const { isFavorite, toggleFavorite } = useFavorites();
  const loadingAllRef = useRef(false);

  const fetchCharacters = useCallback(async (pageNum: number, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(`https://thesimpsonsapi.com/api/characters?page=${pageNum}`);
      if (!res.ok) throw new Error("Failed to fetch characters");
      const data: ApiResponse = await res.json();

      if (isInitial) {
        setCharacters(data.results || []);
        setTotalCount(data.count);
        setTotalPages(data.pages);
      } else {
        setCharacters((prev) => [...prev, ...(data.results || [])]);
      }
      setHasMore(data.next !== null);
    } catch {
      setError("Failed to load characters.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Load all remaining pages (for filtering)
  const fetchAllCharacters = useCallback(async () => {
    if (loadingAllRef.current || allLoaded) return;
    loadingAllRef.current = true;
    setLoadingAll(true);

    try {
      // Fetch all remaining pages in parallel batches of 5
      const currentPage = page;
      const remaining = Array.from(
        { length: totalPages - currentPage },
        (_, i) => currentPage + 1 + i
      );

      for (let i = 0; i < remaining.length; i += 5) {
        const batch = remaining.slice(i, i + 5);
        const responses = await Promise.all(
          batch.map((p) =>
            fetch(`https://thesimpsonsapi.com/api/characters?page=${p}`).then((r) =>
              r.json()
            )
          )
        );
        const newChars = responses.flatMap((d: ApiResponse) => d.results || []);
        setCharacters((prev) => [...prev, ...newChars]);
      }

      setAllLoaded(true);
      setHasMore(false);
    } catch {
      // Silently fail — partial data is still usable
    } finally {
      setLoadingAll(false);
      loadingAllRef.current = false;
    }
  }, [page, totalPages, allLoaded]);

  useEffect(() => {
    fetchCharacters(1, true);
  }, [fetchCharacters]);

  // When a filter is activated, load all characters
  useEffect(() => {
    if (genderFilter !== "all" && !allLoaded && totalPages > 0) {
      fetchAllCharacters();
    }
  }, [genderFilter, allLoaded, totalPages, fetchAllCharacters]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loadingAll) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCharacters(nextPage);
    }
  }, [page, loadingMore, hasMore, loadingAll, fetchCharacters]);

  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loadingMore);

  const filteredCharacters = useMemo(() => {
    let filtered = characters;
    if (search) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (genderFilter !== "all") {
      filtered = filtered.filter((c) => c.gender === genderFilter);
    }
    return filtered;
  }, [characters, search, genderFilter]);

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
    setAllLoaded(false);
    fetchCharacters(1, true);
  };

  const isFiltering = search || genderFilter !== "all";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Sticky filter bar */}
        <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-md -mx-4 px-4 py-4 border-b border-border mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {isFiltering
                  ? `${filteredCharacters.length} results`
                  : `${characters.length} of ${totalCount}`}
                {loadingAll && " · loading all..."}
              </p>
              <h1 className="text-xl font-heading text-foreground">Characters</h1>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-8 w-40 md:w-56 text-sm border-border"
              />
              <div className="hidden sm:flex items-center gap-1 text-xs">
                {(["all", "Male", "Female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-colors",
                      genderFilter === g
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {g === "all" ? "All" : g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && !loading ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : loading ? (
          <SkeletonGrid count={18} type="character" />
        ) : filteredCharacters.length === 0 ? (
          <EmptyState title="No characters found" message="Try a different search." />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredCharacters.map((character, index) => (
                <div key={`${character.id}-${index}`} className="relative group">
                  <CharacterCard
                    character={{
                      ...character,
                      image: `https://cdn.thesimpsonsapi.com/500${character.portrait_path}`,
                    }}
                    onClick={() => setSelectedCharacter(character)}
                  />
                  <FavoriteButton
                    isFavorite={isFavorite(character.id, "character")}
                    onClick={(e) => handleFavoriteClick(e, character)}
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-md"
                  />
                </div>
              ))}
            </div>

            {!isFiltering && hasMore && !loadingAll && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {loadingMore && (
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                )}
              </div>
            )}

            {loadingAll && (
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                <span className="text-xs text-muted-foreground">Loading all characters for filtering...</span>
              </div>
            )}

            {!hasMore && !isFiltering && allLoaded && (
              <p className="text-center text-xs text-muted-foreground py-8">
                All {totalCount} characters loaded.
              </p>
            )}
          </>
        )}

        <CharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
