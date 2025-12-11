import { useState, useEffect } from "react";
import { Calendar, Tv, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Episode {
  id: number;
  name: string;
  season: number;
  episode: number;
  airDate?: string;
  image_path?: string;
}

export function OnThisDay() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const today = new Date();
  const monthDay = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        // Fetch multiple pages to find episodes that aired today
        const allEpisodes: Episode[] = [];
        
        for (let page = 1; page <= 10; page++) {
          const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${page}`);
          const data = await res.json();
          allEpisodes.push(...(data.results || []));
          if (!data.next) break;
        }

        // Filter episodes that aired on this day (month-day match)
        const todayEpisodes = allEpisodes.filter((ep) => {
          if (!ep.airDate) return false;
          // airDate format varies, try to parse it
          const date = new Date(ep.airDate);
          if (isNaN(date.getTime())) return false;
          const epMonthDay = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          return epMonthDay === monthDay;
        });

        setEpisodes(todayEpisodes);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [monthDay]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl p-4 border border-secondary/30 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-secondary" />
          <div className="h-5 w-32 bg-muted rounded" />
        </div>
        <div className="h-4 w-48 bg-muted rounded" />
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl p-4 border border-secondary/30">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-secondary" />
          <h3 className="font-heading font-bold text-foreground">On This Day</h3>
        </div>
        <p className="text-sm text-muted-foreground font-body">
          No episodes premiered on {today.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl p-4 border border-secondary/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-secondary" />
          <h3 className="font-heading font-bold text-foreground">On This Day</h3>
          <span className="px-2 py-0.5 bg-secondary/30 rounded-full text-xs font-heading text-secondary">
            {episodes.length}
          </span>
        </div>
        {episodes.length > 1 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-secondary hover:underline font-heading"
          >
            {isExpanded ? "Show less" : "Show all"}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground font-body mb-3">
        {today.toLocaleDateString("en-US", { month: "long", day: "numeric" })} in Simpsons history
      </p>

      <div className={cn(
        "space-y-2 overflow-hidden transition-all duration-300",
        !isExpanded && episodes.length > 1 && "max-h-20"
      )}>
        {episodes.map((ep) => (
          <div
            key={ep.id}
            className="flex items-center gap-3 p-2 bg-card/80 rounded-lg hover:bg-card transition-colors"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
              {ep.image_path ? (
                <img
                  src={`https://cdn.thesimpsonsapi.com/500${ep.image_path}`}
                  alt={ep.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tv className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-medium text-sm text-foreground truncate">
                {ep.name}
              </p>
              <p className="text-xs text-muted-foreground">
                S{ep.season} E{ep.episode} • {ep.airDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

