import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useFavorites } from "@/hooks/useFavorites";
import { 
  BarChart3, 
  Users, 
  Tv, 
  MapPin, 
  TrendingUp, 
  Calendar,
  Award,
  Clock,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsData {
  totalCharacters: number;
  totalEpisodes: number;
  totalLocations: number;
  totalSeasons: number;
  episodesPerSeason: { season: number; count: number }[];
  loading: boolean;
}

export default function Stats() {
  const [stats, setStats] = useState<StatsData>({
    totalCharacters: 0,
    totalEpisodes: 0,
    totalLocations: 0,
    totalSeasons: 36,
    episodesPerSeason: [],
    loading: true,
  });

  const { favorites, getFavoritesByType } = useFavorites();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [charactersRes, episodesRes, locationsRes] = await Promise.all([
          fetch("https://thesimpsonsapi.com/api/characters?page=1"),
          fetch("https://thesimpsonsapi.com/api/episodes?page=1"),
          fetch("https://thesimpsonsapi.com/api/locations?page=1"),
        ]);

        const [characters, episodes, locations] = await Promise.all([
          charactersRes.json(),
          episodesRes.json(),
          locationsRes.json(),
        ]);

        // Fetch more episodes to calculate per season
        const allEpisodes: any[] = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore && page <= 5) {
          const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${page}`);
          const data = await res.json();
          allEpisodes.push(...(data.results || []));
          hasMore = data.next !== null;
          page++;
        }

        // Calculate episodes per season
        const seasonCounts: Record<number, number> = {};
        allEpisodes.forEach((ep) => {
          seasonCounts[ep.season] = (seasonCounts[ep.season] || 0) + 1;
        });

        const episodesPerSeason = Object.entries(seasonCounts)
          .map(([season, count]) => ({ season: Number(season), count }))
          .sort((a, b) => a.season - b.season);

        setStats({
          totalCharacters: characters.count || 0,
          totalEpisodes: episodes.count || 0,
          totalLocations: locations.count || 0,
          totalSeasons: 36,
          episodesPerSeason,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Characters",
      value: stats.totalCharacters,
      icon: Users,
      color: "bg-primary",
      description: "Unique characters in database",
    },
    {
      title: "Episodes",
      value: stats.totalEpisodes,
      icon: Tv,
      color: "bg-secondary",
      description: "Episodes catalogued",
    },
    {
      title: "Locations",
      value: stats.totalLocations,
      icon: MapPin,
      color: "bg-accent",
      description: "Springfield locations",
    },
    {
      title: "Seasons",
      value: stats.totalSeasons,
      icon: Award,
      color: "bg-simpsons-orange",
      description: "And counting!",
    },
  ];

  const funFacts = [
    { icon: "🎬", title: "First Episode", value: "December 17, 1989", description: "Simpsons Roasting on an Open Fire" },
    { icon: "⏱️", title: "Runtime", value: "22 minutes", description: "Average episode length" },
    { icon: "🏆", title: "Emmy Awards", value: "35+", description: "Awards won" },
    { icon: "🌍", title: "Countries", value: "100+", description: "Broadcast worldwide" },
    { icon: "📺", title: "Network", value: "FOX", description: "Original broadcaster" },
    { icon: "🎤", title: "Voice Actors", value: "6 main", description: "Core cast members" },
  ];

  const maxEpisodes = Math.max(...stats.episodesPerSeason.map(s => s.count), 1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Statistics"
            subtitle="Explore fascinating data about The Simpsons universe"
            icon="📊"
          />

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {statCards.map((stat, index) => (
              <div
                key={stat.title}
                className="bg-card rounded-2xl p-6 border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-bounce-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                  stat.color
                )}>
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-1">
                  {stats.loading ? (
                    <span className="inline-block w-16 h-8 bg-muted rounded animate-pulse" />
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </p>
                <p className="font-heading font-medium text-foreground">{stat.title}</p>
                <p className="text-sm text-muted-foreground font-body">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Episodes per Season Chart */}
          <div className="bg-card rounded-3xl p-6 md:p-8 border-2 border-border shadow-lg mb-12">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-heading font-bold text-foreground">Episodes per Season</h2>
            </div>
            
            {stats.loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex items-end gap-2 min-w-[800px] h-64 pt-8">
                  {stats.episodesPerSeason.map((season, index) => (
                    <div
                      key={season.season}
                      className="flex-1 flex flex-col items-center gap-2 group"
                    >
                      <span className="text-xs font-heading text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {season.count}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-300 hover:from-primary/80 hover:to-secondary/80 cursor-pointer"
                        style={{
                          height: `${(season.count / maxEpisodes) * 180}px`,
                          animationDelay: `${index * 50}ms`,
                        }}
                        title={`Season ${season.season}: ${season.count} episodes`}
                      />
                      <span className="text-xs font-heading text-muted-foreground">
                        S{season.season}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Your Stats */}
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl p-6 md:p-8 border-2 border-accent/30 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-heading font-bold text-foreground">Your Activity</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card/80 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-heading font-bold text-accent">{favorites.length}</p>
                <p className="text-sm text-muted-foreground font-body">Total Favorites</p>
              </div>
              <div className="bg-card/80 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-heading font-bold text-primary">{getFavoritesByType("character").length}</p>
                <p className="text-sm text-muted-foreground font-body">Fav Characters</p>
              </div>
              <div className="bg-card/80 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-heading font-bold text-secondary">{getFavoritesByType("episode").length}</p>
                <p className="text-sm text-muted-foreground font-body">Fav Episodes</p>
              </div>
              <div className="bg-card/80 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-heading font-bold text-simpsons-orange">{getFavoritesByType("location").length}</p>
                <p className="text-sm text-muted-foreground font-body">Fav Locations</p>
              </div>
            </div>
          </div>

          {/* Fun Facts Grid */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading font-bold text-foreground">Fun Facts</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {funFacts.map((fact, index) => (
                <div
                  key={fact.title}
                  className="bg-card rounded-2xl p-5 border-2 border-border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-bounce-in"
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                >
                  <span className="text-3xl mb-3 block">{fact.icon}</span>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">{fact.title}</p>
                  <p className="text-xl font-heading font-bold text-foreground">{fact.value}</p>
                  <p className="text-sm text-muted-foreground font-body">{fact.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-3xl p-6 md:p-8 border-2 border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-simpsons-orange" />
              <h2 className="text-2xl font-heading font-bold text-foreground">Simpsons Timeline</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { year: "1987", event: "First appearance on The Tracey Ullman Show", emoji: "🎬" },
                { year: "1989", event: "The Simpsons premieres as a series", emoji: "📺" },
                { year: "1990", event: "Bart Simpson becomes a cultural phenomenon", emoji: "🛹" },
                { year: "1997", event: "Surpasses The Flintstones as longest-running animated series", emoji: "🏆" },
                { year: "2007", event: "The Simpsons Movie released", emoji: "🎥" },
                { year: "2019", event: "Disney acquires The Simpsons", emoji: "🏰" },
                { year: "2024", event: "Still going strong after 35+ seasons!", emoji: "💪" },
              ].map((item, index) => (
                <div
                  key={item.year}
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-primary">{item.year}</p>
                    <p className="text-foreground font-body">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

