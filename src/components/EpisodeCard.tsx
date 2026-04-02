import { Tv } from "lucide-react";

interface Episode {
  id: number;
  name: string;
  season: number;
  episode: number;
  airDate?: string;
  image?: string;
}

interface EpisodeCardProps {
  episode: Episode;
  onClick?: () => void;
}

export function EpisodeCard({ episode, onClick }: EpisodeCardProps) {
  const code = `S${String(episode.season).padStart(2, "0")}E${String(episode.episode).padStart(2, "0")}`;

  return (
    <div
      onClick={onClick}
      className="group/card flex gap-4 py-3 cursor-pointer border-b border-border last:border-0 -mx-2 px-2 rounded-sm transition-colors"
    >
      <div className="w-24 h-16 rounded overflow-hidden bg-muted shrink-0">
        {episode.image ? (
          <img
            src={episode.image}
            alt={episode.name}
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tv className="w-5 h-5 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-sm font-medium text-foreground truncate group-hover/card:text-primary transition-colors">
          {episode.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-mono tracking-wider text-primary/70">
            {code}
          </span>
          {episode.airDate && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-xs text-muted-foreground">{episode.airDate}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
