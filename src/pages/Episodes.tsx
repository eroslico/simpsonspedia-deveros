import { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { EpisodeCard } from "@/components/EpisodeCard";
import { SearchBar } from "@/components/SearchBar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PageHeader } from "@/components/PageHeader";
import { EpisodeModal } from "@/components/EpisodeModal";
import { PageTransition } from "@/components/PageTransition";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useFavorites } from "@/hooks/useFavorites";
import { Loader2, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Episode {
  id: number;
  name: string;
  season: number;
  episode: number;
  airDate?: string;
  synopsis?: string;
  image_path?: string;
  directed_by?: string;
  written_by?: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: Episode[];
}

export default function Episodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchEpisodes = useCallback(async (pageNum: number, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${pageNum}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch episodes");
      }
      
      const data: ApiResponse = await res.json();

      if (isInitial) {
        setEpisodes(data.results || []);
        setTotalCount(data.count);
      } else {
        setEpisodes(prev => [...prev, ...(data.results || [])]);
      }

      setHasMore(data.next !== null);
    } catch (err) {
      console.error("Error fetching episodes:", err);
      setError("Failed to load episodes. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchEpisodes(1, true);
  }, [fetchEpisodes]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEpisodes(nextPage);
    }
  }, [page, loadingMore, hasMore, fetchEpisodes]);

  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loadingMore);

  // All available seasons (The Simpsons has 36 seasons)
  const allSeasons = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => i + 1);
  }, []);

  // Filter episodes by search and season
  const filteredEpisodes = useMemo(() => {
    let filtered = episodes;
    
    if (selectedSeason !== null) {
      filtered = filtered.filter(ep => ep.season === selectedSeason);
    }
    
    if (search) {
      filtered = filtered.filter(ep =>
        ep.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  }, [episodes, selectedSeason, search]);

  // Group episodes by season
  const episodesBySeason = useMemo(() => {
    const grouped: Record<number, Episode[]> = {};
    filteredEpisodes.forEach(ep => {
      if (!grouped[ep.season]) {
        grouped[ep.season] = [];
      }
      grouped[ep.season].push(ep);
    });
    return grouped;
  }, [filteredEpisodes]);

  const sortedSeasons = Object.keys(episodesBySeason)
    .map(Number)
    .sort((a, b) => a - b);

  const handleFavoriteClick = (e: React.MouseEvent, episode: Episode) => {
    e.stopPropagation();
    toggleFavorite({
      id: episode.id,
      type: "episode",
      name: episode.name,
      image: episode.image_path 
        ? `https://cdn.thesimpsonsapi.com/500${episode.image_path}`
        : undefined,
    });
  };

  const handleRetry = () => {
    setPage(1);
    fetchEpisodes(1, true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Episodes"
            subtitle="Explore all episodes of the longest-running TV series"
            icon="📺"
          />

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search episode..."
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-12 px-4 rounded-full border-2 border-border bg-card hover:bg-muted font-heading gap-2 min-w-[180px]"
                >
                  <Filter className="w-4 h-4" />
                  {selectedSeason !== null ? `Season ${selectedSeason}` : "All seasons"}
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-card border-2 border-border shadow-xl z-50"
                align="center"
              >
                <ScrollArea className="h-72">
                  <DropdownMenuItem 
                    onClick={() => setSelectedSeason(null)}
                    className="font-heading cursor-pointer hover:bg-muted focus:bg-muted"
                  >
                    <span className="flex-1">All seasons</span>
                    {selectedSeason === null && (
                      <Badge className="bg-primary text-primary-foreground">✓</Badge>
                    )}
                  </DropdownMenuItem>
                  {allSeasons.map(season => (
                    <DropdownMenuItem 
                      key={season}
                      onClick={() => setSelectedSeason(season)}
                      className="font-heading cursor-pointer hover:bg-muted focus:bg-muted"
                    >
                      <span className="flex-1">Season {season}</span>
                      {selectedSeason === season && (
                        <Badge className="bg-primary text-primary-foreground">✓</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Error State */}
          {error && !loading ? (
            <ErrorState
              title="Failed to load episodes"
              message={error}
              onRetry={handleRetry}
            />
          ) : loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <p className="text-center text-muted-foreground mb-6 font-body">
                {search || selectedSeason !== null
                  ? `Showing ${filteredEpisodes.length} episodes`
                  : `Showing ${episodes.length} of ${totalCount} episodes`
                }
              </p>

              {filteredEpisodes.length === 0 ? (
                <EmptyState
                  title="No episodes found"
                  message="Try another search or season"
                  icon="🔍"
                />
              ) : (
                /* Episodes grouped by season */
                <div className="space-y-12">
                  {sortedSeasons.map(season => (
                    <section key={season} className="animate-bounce-in">
                      {/* Season header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <span className="text-xl font-heading font-bold text-primary-foreground">
                              {season}
                            </span>
                          </div>
                          <div>
                            <h2 className="text-2xl font-heading font-bold text-foreground">
                              Season {season}
                            </h2>
                            <p className="text-sm text-muted-foreground font-body">
                              {episodesBySeason[season].length} episodes
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 h-1 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
                      </div>

                      {/* Episodes grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {episodesBySeason[season]
                          .sort((a, b) => a.episode - b.episode)
                          .map((episode, index) => (
                            <div
                              key={`${episode.id}-${index}`}
                              className="relative animate-bounce-in"
                              style={{ animationDelay: `${(index % 8) * 50}ms` }}
                            >
                              <EpisodeCard 
                                episode={{
                                  ...episode,
                                  image: episode.image_path 
                                    ? `https://cdn.thesimpsonsapi.com/500${episode.image_path}`
                                    : undefined
                                }} 
                                onClick={() => setSelectedEpisode(episode)}
                              />
                              <FavoriteButton
                                isFavorite={isFavorite(episode.id, "episode")}
                                onClick={(e) => handleFavoriteClick(e, episode)}
                                size="sm"
                                className="absolute top-2 right-2 z-10"
                              />
                            </div>
                          ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {/* Infinite scroll trigger */}
              {!search && selectedSeason === null && hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  {loadingMore && (
                    <div className="flex items-center gap-3 bg-secondary/10 rounded-full px-6 py-3">
                      <Loader2 className="w-5 h-5 text-secondary animate-spin" />
                      <span className="font-heading text-foreground">Loading more episodes...</span>
                    </div>
                  )}
                </div>
              )}

              {!hasMore && !search && selectedSeason === null && episodes.length > 0 && (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">🎬</span>
                  <p className="text-muted-foreground font-body">
                    You've seen all {totalCount} available episodes!
                  </p>
                </div>
              )}
            </>
          )}

          <EpisodeModal 
            episode={selectedEpisode} 
            onClose={() => setSelectedEpisode(null)} 
          />
        </main>
      </PageTransition>
    </div>
  );
}
