import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { LocationCard } from "@/components/LocationCard";
import { SearchBar } from "@/components/SearchBar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useFavorites } from "@/hooks/useFavorites";
import { Loader2 } from "lucide-react";

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
      
      if (!res.ok) {
        throw new Error("Failed to fetch locations");
      }
      
      const data: ApiResponse = await res.json();

      if (isInitial) {
        setLocations(data.results || []);
        setTotalCount(data.count);
      } else {
        setLocations(prev => [...prev, ...(data.results || [])]);
      }

      setHasMore(data.next !== null);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Failed to load locations. Please try again.");
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
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Locations"
            subtitle="Visit the most iconic places in Springfield"
            icon="🗺️"
          />

          <div className="flex justify-center mb-8">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search location..."
            />
          </div>

          {/* Error State */}
          {error && !loading ? (
            <ErrorState
              title="Failed to load locations"
              message={error}
              onRetry={handleRetry}
            />
          ) : loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <p className="text-center text-muted-foreground mb-6 font-body">
                {search 
                  ? `Showing ${filteredLocations.length} results`
                  : `Showing ${locations.length} of ${totalCount} locations`
                }
              </p>

              {filteredLocations.length === 0 ? (
                <EmptyState
                  title="No locations found"
                  message="Try adjusting your search"
                  icon="🔍"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredLocations.map((location, index) => (
                    <div
                      key={`${location.id}-${index}`}
                      className="relative animate-bounce-in"
                      style={{ animationDelay: `${(index % 12) * 50}ms` }}
                    >
                      <LocationCard 
                        location={{
                          ...location,
                          image: location.image_path 
                            ? `https://cdn.thesimpsonsapi.com/500${location.image_path}`
                            : undefined
                        }} 
                      />
                      <FavoriteButton
                        isFavorite={isFavorite(location.id, "location")}
                        onClick={(e) => handleFavoriteClick(e, location)}
                        size="sm"
                        className="absolute top-2 right-2 z-10"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Infinite scroll trigger */}
              {!search && hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  {loadingMore && (
                    <div className="flex items-center gap-3 bg-accent/10 rounded-full px-6 py-3">
                      <Loader2 className="w-5 h-5 text-accent animate-spin" />
                      <span className="font-heading text-foreground">Loading more locations...</span>
                    </div>
                  )}
                </div>
              )}

              {!hasMore && !search && locations.length > 0 && (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">🏠</span>
                  <p className="text-muted-foreground font-body">
                    You've explored all {totalCount} Springfield locations!
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </PageTransition>
    </div>
  );
}
