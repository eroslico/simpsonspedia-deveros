import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LocationCard } from "@/components/LocationCard";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useFavorites } from "@/hooks/useFavorites";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Location {
  id: number;
  name: string;
  image_path?: string;
  town?: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: Location[];
}

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchLocations = useCallback(async (pageNum: number, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(`https://thesimpsonsapi.com/api/locations?page=${pageNum}`);
      if (!res.ok) throw new Error("Failed to fetch locations");
      const data: ApiResponse = await res.json();

      if (isInitial) {
        setLocations(data.results || []);
        setTotalCount(data.count);
      } else {
        setLocations((prev) => [...prev, ...(data.results || [])]);
      }
      setHasMore(data.next !== null);
    } catch {
      setError("Failed to load locations.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations(1, true);
  }, [fetchLocations]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLocations(nextPage);
    }
  }, [page, loadingMore, hasMore, fetchLocations]);

  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loadingMore);

  const filteredLocations = search
    ? locations.filter((loc) =>
        loc.name.toLowerCase().includes(search.toLowerCase())
      )
    : locations;

  const handleFavoriteClick = (e: React.MouseEvent, location: Location) => {
    e.stopPropagation();
    toggleFavorite({
      id: location.id,
      type: "location",
      name: location.name,
      image: location.image_path
        ? `https://cdn.thesimpsonsapi.com/500${location.image_path}`
        : undefined,
    });
  };

  const handleRetry = () => {
    setPage(1);
    fetchLocations(1, true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Sticky filter bar */}
        <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-md -mx-4 px-4 py-4 border-b border-border mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {search
                  ? `${filteredLocations.length} results`
                  : `${locations.length} of ${totalCount}`}
              </p>
              <h1 className="text-xl font-heading text-foreground">Locations</h1>
            </div>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-8 w-40 md:w-56 text-sm border-border"
            />
          </div>
        </div>

        {error && !loading ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : loading ? (
          <SkeletonGrid count={12} type="location" />
        ) : filteredLocations.length === 0 ? (
          <EmptyState title="No locations found" message="Try a different search." />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map((location, index) => (
                <div key={`${location.id}-${index}`} className="relative group">
                  <LocationCard
                    location={{
                      ...location,
                      image: location.image_path
                        ? `https://cdn.thesimpsonsapi.com/500${location.image_path}`
                        : undefined,
                    }}
                  />
                  <FavoriteButton
                    isFavorite={isFavorite(location.id, "location")}
                    onClick={(e) => handleFavoriteClick(e, location)}
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-md"
                  />
                </div>
              ))}
            </div>

            {!search && hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {loadingMore && (
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                )}
              </div>
            )}

            {!hasMore && !search && locations.length > 0 && (
              <p className="text-center text-xs text-muted-foreground py-8">
                All {totalCount} locations loaded.
              </p>
            )}
          </>
        )}
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
