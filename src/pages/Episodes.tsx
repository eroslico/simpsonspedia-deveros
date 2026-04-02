import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EpisodeCard } from "@/components/EpisodeCard";
import { EpisodeModal } from "@/components/EpisodeModal";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useFavorites } from "@/hooks/useFavorites";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";

interface Episode {
  id: number;
  name: string;
  season: number;
  episode_number: number;
  airdate?: string;
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
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const loadingAllRef = useRef(false);

  const fetchEpisodes = useCallback(async (pageNum: number, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${pageNum}`);
      if (!res.ok) throw new Error("Failed to fetch episodes");
      const data: ApiResponse = await res.json();

      if (isInitial) {
        setEpisodes(data.results || []);
        setTotalCount(data.count);
        setTotalPages(data.pages);
      } else {
        setEpisodes((prev) => [...prev, ...(data.results || [])]);
      }
      setHasMore(data.next !== null);
    } catch {
      setError("Failed to load episodes.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const fetchAllEpisodes = useCallback(async () => {
    if (loadingAllRef.current || allLoaded) return;
    loadingAllRef.current = true;
    setLoadingAll(true);

    try {
      const currentPage = page;
      const remaining = Array.from(
        { length: totalPages - currentPage },
        (_, i) => currentPage + 1 + i
      );

      for (let i = 0; i < remaining.length; i += 5) {
        const batch = remaining.slice(i, i + 5);
        const responses = await Promise.all(
          batch.map((p) =>
            fetch(`https://thesimpsonsapi.com/api/episodes?page=${p}`).then((r) => r.json())
          )
        );
        const newEps = responses.flatMap((d: ApiResponse) => d.results || []);
        setEpisodes((prev) => [...prev, ...newEps]);
      }

      setAllLoaded(true);
      setHasMore(false);
    } catch {
      // partial data still usable
    } finally {
      setLoadingAll(false);
      loadingAllRef.current = false;
    }
  }, [page, totalPages, allLoaded]);

  useEffect(() => {
    fetchEpisodes(1, true);
  }, [fetchEpisodes]);

  // When a season filter is activated, load all episodes
  useEffect(() => {
    if (selectedSeason !== null && !allLoaded && totalPages > 0) {
      fetchAllEpisodes();
    }
  }, [selectedSeason, allLoaded, totalPages, fetchAllEpisodes]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loadingAll) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEpisodes(nextPage);
    }
  }, [page, loadingMore, hasMore, loadingAll, fetchEpisodes]);

  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore, loadingMore);

  const availableSeasons = useMemo(() => {
    const seasons = new Set(episodes.map((ep) => ep.season));
    return Array.from(seasons).sort((a, b) => a - b);
  }, [episodes]);

  const filteredEpisodes = useMemo(() => {
    let filtered = episodes;
    if (selectedSeason !== null) {
      filtered = filtered.filter((ep) => ep.season === selectedSeason);
    }
    if (search) {
      filtered = filtered.filter((ep) =>
        ep.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  }, [episodes, selectedSeason, search]);

  const episodesBySeason = useMemo(() => {
    const grouped: Record<number, Episode[]> = {};
    filteredEpisodes.forEach((ep) => {
      if (!grouped[ep.season]) grouped[ep.season] = [];
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
    setAllLoaded(false);
    fetchEpisodes(1, true);
  };

  const isFiltering = search || selectedSeason !== null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-md -mx-4 px-4 py-4 border-b border-border mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {isFiltering
                  ? `${filteredEpisodes.length} results`
                  : `${episodes.length} of ${totalCount}`}
                {loadingAll && " · loading all..."}
              </p>
              <h1 className="text-xl font-heading text-foreground">Episodes</h1>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-8 w-40 md:w-56 text-sm border-border"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                    {selectedSeason !== null ? `Season ${selectedSeason}` : "All seasons"}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <ScrollArea className="h-64">
                    <DropdownMenuItem onClick={() => setSelectedSeason(null)}>
                      All seasons
                    </DropdownMenuItem>
                    {Array.from({ length: 36 }, (_, i) => i + 1).map((season) => (
                      <DropdownMenuItem
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                      >
                        Season {season}
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {error && !loading ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : loading ? (
          <SkeletonGrid count={12} type="episode" />
        ) : filteredEpisodes.length === 0 && !loadingAll ? (
          <EmptyState title="No episodes found" message="Try another search or season." />
        ) : (
          <>
            <div className="space-y-10">
              {sortedSeasons.map((season) => (
                <section key={season}>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="w-1 h-5 bg-primary rounded-full shrink-0" />
                    <h2 className="text-xl font-heading text-foreground">
                      Season {season}
                    </h2>
                    <span className="text-xs font-mono text-muted-foreground">
                      {episodesBySeason[season].length} ep.
                    </span>
                  </div>

                  <div className="space-y-0">
                    {episodesBySeason[season]
                      .sort((a, b) => a.episode_number - b.episode_number)
                      .map((episode, index) => (
                        <div
                          key={`${episode.id}-${index}`}
                          className="relative group flex items-center hover:bg-muted/50 rounded-sm transition-colors"
                        >
                          <div className="flex-1">
                            <EpisodeCard
                              episode={{
                                id: episode.id,
                                name: episode.name,
                                season: episode.season,
                                episode: episode.episode_number,
                                airDate: episode.airdate || undefined,
                                image: episode.image_path
                                  ? `https://cdn.thesimpsonsapi.com/500${episode.image_path}`
                                  : undefined,
                              }}
                              onClick={() => setSelectedEpisode(episode)}
                            />
                          </div>
                          <FavoriteButton
                            isFavorite={isFavorite(episode.id, "episode")}
                            onClick={(e) => handleFavoriteClick(e, episode)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          />
                        </div>
                      ))}
                  </div>
                </section>
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
                <span className="text-xs text-muted-foreground">Loading all episodes...</span>
              </div>
            )}

            {!hasMore && !isFiltering && allLoaded && (
              <p className="text-center text-xs text-muted-foreground py-8">
                All {totalCount} episodes loaded.
              </p>
            )}
          </>
        )}

        <EpisodeModal
          episode={selectedEpisode}
          onClose={() => setSelectedEpisode(null)}
        />
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
