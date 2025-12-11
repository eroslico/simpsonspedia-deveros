import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  Eye,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Episode {
  id: number;
  name: string;
  season: number;
  episode: number;
  airDate?: string;
  image_path?: string;
  synopsis?: string;
}

export default function Timeline() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("simpsonspedia-watched");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [hoveredEpisode, setHoveredEpisode] = useState<Episode | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const allEpisodes: Episode[] = [];
        for (let page = 1; page <= 20; page++) {
          const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${page}`);
          const data = await res.json();
          allEpisodes.push(...(data.results || []));
          if (!data.next) break;
        }
        // Sort by season and episode
        allEpisodes.sort((a, b) => {
          if (a.season !== b.season) return a.season - b.season;
          return a.episode - b.episode;
        });
        setEpisodes(allEpisodes);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, []);

  const toggleWatched = (episodeId: number) => {
    const newWatched = new Set(watchedEpisodes);
    if (newWatched.has(episodeId)) {
      newWatched.delete(episodeId);
    } else {
      newWatched.add(episodeId);
    }
    setWatchedEpisodes(newWatched);
    localStorage.setItem("simpsonspedia-watched", JSON.stringify([...newWatched]));
  };

  const seasons = [...new Set(episodes.map((ep) => ep.season))].sort((a, b) => a - b);
  
  const filteredEpisodes = selectedSeason
    ? episodes.filter((ep) => ep.season === selectedSeason)
    : episodes;

  const episodesByYear = filteredEpisodes.reduce((acc, ep) => {
    if (ep.airDate) {
      const year = new Date(ep.airDate).getFullYear();
      if (!isNaN(year)) {
        if (!acc[year]) acc[year] = [];
        acc[year].push(ep);
      }
    }
    return acc;
  }, {} as Record<number, Episode[]>);

  const years = Object.keys(episodesByYear).map(Number).sort((a, b) => a - b);

  const watchedCount = filteredEpisodes.filter((ep) => watchedEpisodes.has(ep.id)).length;
  const totalCount = filteredEpisodes.length;
  const progressPercent = totalCount > 0 ? (watchedCount / totalCount) * 100 : 0;

  const scrollTimeline = (direction: "left" | "right") => {
    if (timelineRef.current) {
      const scrollAmount = 300;
      timelineRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Episode Timeline"
            subtitle="Explore The Simpsons history chronologically"
            icon="📅"
          />

          {/* Progress Bar */}
          <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-lg mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading text-foreground">
                <Eye className="w-4 h-4 inline mr-2" />
                Watched Progress
              </span>
              <span className="font-heading text-primary">
                {watchedCount} / {totalCount} episodes ({progressPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Season Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-heading text-foreground">Filter by Season</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedSeason(null)}
                variant={selectedSeason === null ? "default" : "outline"}
                className="font-heading rounded-full"
                size="sm"
              >
                All Seasons
              </Button>
              {seasons.map((season) => (
                <Button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  variant={selectedSeason === season ? "default" : "outline"}
                  className="font-heading rounded-full"
                  size="sm"
                >
                  S{season}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Timeline Navigation */}
              <div className="relative mb-8">
                <button
                  onClick={() => scrollTimeline("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card border-2 border-border rounded-full shadow-lg hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollTimeline("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card border-2 border-border rounded-full shadow-lg hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Timeline */}
                <div
                  ref={timelineRef}
                  className="overflow-x-auto scrollbar-hide px-12"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div className="flex gap-8 pb-4 min-w-max">
                    {years.map((year) => (
                      <div key={year} className="flex flex-col items-center">
                        {/* Year marker */}
                        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-heading font-bold mb-4 shadow-lg">
                          {year}
                        </div>
                        
                        {/* Episodes for this year */}
                        <div className="flex gap-2">
                          {episodesByYear[year].map((ep) => (
                            <div
                              key={ep.id}
                              className="relative group"
                              onMouseEnter={() => setHoveredEpisode(ep)}
                              onMouseLeave={() => setHoveredEpisode(null)}
                            >
                              <button
                                onClick={() => toggleWatched(ep.id)}
                                className={cn(
                                  "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all hover:scale-110",
                                  watchedEpisodes.has(ep.id)
                                    ? "border-simpsons-green ring-2 ring-simpsons-green/50"
                                    : "border-border hover:border-primary"
                                )}
                              >
                                {ep.image_path ? (
                                  <img
                                    src={`https://cdn.thesimpsonsapi.com/500${ep.image_path}`}
                                    alt={ep.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-heading">
                                    S{ep.season}E{ep.episode}
                                  </div>
                                )}
                                
                                {/* Watched indicator */}
                                {watchedEpisodes.has(ep.id) && (
                                  <div className="absolute inset-0 bg-simpsons-green/30 flex items-center justify-center">
                                    <Check className="w-6 h-6 text-white drop-shadow-lg" />
                                  </div>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Episode Details Popup */}
              {hoveredEpisode && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
                  <div className="bg-card rounded-2xl p-4 border-4 border-primary shadow-2xl flex gap-4 max-w-md">
                    {hoveredEpisode.image_path && (
                      <img
                        src={`https://cdn.thesimpsonsapi.com/500${hoveredEpisode.image_path}`}
                        alt={hoveredEpisode.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-primary font-heading">
                        Season {hoveredEpisode.season}, Episode {hoveredEpisode.episode}
                      </p>
                      <h3 className="font-heading font-bold text-foreground truncate">
                        {hoveredEpisode.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {hoveredEpisode.airDate}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {watchedEpisodes.has(hoveredEpisode.id) ? (
                          <span className="text-xs text-simpsons-green font-heading flex items-center gap-1">
                            <Check className="w-3 h-3" /> Watched
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground font-heading">
                            Not watched
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* List View */}
              <div className="bg-card rounded-3xl p-6 border-4 border-border shadow-xl">
                <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Episode List
                </h2>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredEpisodes.map((ep) => (
                    <div
                      key={ep.id}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-xl transition-colors",
                        watchedEpisodes.has(ep.id) ? "bg-simpsons-green/10" : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <button
                        onClick={() => toggleWatched(ep.id)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                          watchedEpisodes.has(ep.id)
                            ? "bg-simpsons-green border-simpsons-green text-white"
                            : "border-border hover:border-primary"
                        )}
                      >
                        {watchedEpisodes.has(ep.id) && <Check className="w-4 h-4" />}
                      </button>
                      
                      {ep.image_path && (
                        <img
                          src={`https://cdn.thesimpsonsapi.com/500${ep.image_path}`}
                          alt={ep.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-medium text-foreground truncate">
                          {ep.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          S{ep.season} E{ep.episode} • {ep.airDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

