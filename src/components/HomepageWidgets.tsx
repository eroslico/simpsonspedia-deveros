import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Tv, 
  Shuffle,
  Clock,
  Star,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Character {
  id: number;
  name: string;
  portrait_path: string;
  occupation?: string;
}

interface Episode {
  id: number;
  name: string;
  season: number;
  episode: number;
  image_path?: string;
}

// Character of the Day - changes daily based on date
export function CharacterOfTheDay() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        // Use date to determine which character to show (deterministic)
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
        );
        
        const res = await fetch(`https://thesimpsonsapi.com/api/characters?page=1`);
        const data = await res.json();
        const characters = data.results || [];
        
        if (characters.length > 0) {
          const index = dayOfYear % characters.length;
          setCharacter(characters[index]);
        }
      } catch (error) {
        console.error("Error fetching character:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-4 border border-primary/30 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <User className="w-5 h-5 text-primary" />
          <div className="h-5 w-32 bg-muted rounded" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted" />
          <div className="flex-1">
            <div className="h-5 w-24 bg-muted rounded mb-2" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!character) return null;

  return (
    <Link
      to="/characters"
      className="block bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-4 border border-primary/30 hover:border-primary transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold text-foreground">Character of the Day</h3>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-lg">
          <img
            src={`https://cdn.thesimpsonsapi.com/500${character.portrait_path}`}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-heading font-bold text-foreground">{character.name}</p>
          {character.occupation && (
            <p className="text-sm text-muted-foreground font-body">{character.occupation}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Random Episode Widget
export function RandomEpisodeWidget() {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomEpisode = async () => {
    setLoading(true);
    try {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${randomPage}`);
      const data = await res.json();
      const episodes = data.results || [];
      
      if (episodes.length > 0) {
        const randomIndex = Math.floor(Math.random() * episodes.length);
        setEpisode(episodes[randomIndex]);
      }
    } catch (error) {
      console.error("Error fetching episode:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomEpisode();
  }, []);

  return (
    <div className="bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl p-4 border border-secondary/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-secondary" />
          <h3 className="font-heading font-bold text-foreground">Random Episode</h3>
        </div>
        <button
          onClick={fetchRandomEpisode}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label="Get new random episode"
        >
          <Shuffle className={cn("w-4 h-4 text-muted-foreground", loading && "animate-spin")} />
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-5 w-3/4 bg-muted rounded mb-2" />
          <div className="h-4 w-1/2 bg-muted rounded" />
        </div>
      ) : episode ? (
        <Link to="/episodes" className="block group">
          <div className="flex items-center gap-3">
            {episode.image_path && (
              <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                <img
                  src={`https://cdn.thesimpsonsapi.com/500${episode.image_path}`}
                  alt={episode.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-heading font-bold text-foreground truncate group-hover:text-secondary transition-colors">
                {episode.name}
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Season {episode.season}, Episode {episode.episode}
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <p className="text-sm text-muted-foreground">No episode found</p>
      )}
    </div>
  );
}

// Quick Stats Widget
export function QuickStatsWidget() {
  const [stats, setStats] = useState({
    favorites: 0,
    watched: 0,
    triviaScore: 0,
  });

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("simpsonspedia-favorites") || "[]");
    const watched = JSON.parse(localStorage.getItem("simpsonspedia-watched") || "[]");
    const triviaScore = parseInt(localStorage.getItem("simpsonspedia-trivia-highscore") || "0");

    setStats({
      favorites: favorites.length,
      watched: watched.length,
      triviaScore,
    });
  }, []);

  if (stats.favorites === 0 && stats.watched === 0 && stats.triviaScore === 0) {
    return null;
  }

  return (
    <div
      className="block bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-4 border border-accent/30 transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          <h3 className="font-heading font-bold text-foreground">Your Progress</h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-primary">{stats.favorites}</p>
          <p className="text-xs text-muted-foreground font-body">Favorites</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-secondary">{stats.watched}</p>
          <p className="text-xs text-muted-foreground font-body">Watched</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-accent">{stats.triviaScore}</p>
          <p className="text-xs text-muted-foreground font-body">Trivia</p>
        </div>
      </div>
    </div>
  );
}

