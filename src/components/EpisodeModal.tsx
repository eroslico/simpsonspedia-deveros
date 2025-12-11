import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Tv, Hash, FileText, X, Star, Play } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface EpisodeModalProps {
  episode: Episode | null;
  onClose: () => void;
}

export function EpisodeModal({ episode, onClose }: EpisodeModalProps) {
  if (!episode) return null;

  const imageUrl = episode.image_path 
    ? `https://cdn.thesimpsonsapi.com/500${episode.image_path}`
    : null;

  return (
    <Dialog open={!!episode} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-4 border-secondary rounded-3xl shadow-2xl">
        {/* Header with episode image or gradient */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={episode.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-sunset-gradient flex items-center justify-center">
              <Tv className="w-20 h-20 text-foreground/20" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-card/90 hover:bg-card shadow-lg transition-all duration-300 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Season/Episode badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground font-heading text-sm px-3 py-1 shadow-lg">
              <Tv className="w-4 h-4 mr-1" />
              Season {episode.season}
            </Badge>
            <Badge className="bg-secondary text-secondary-foreground font-heading text-sm px-3 py-1 shadow-lg">
              <Hash className="w-4 h-4 mr-1" />
              Episode {episode.episode}
            </Badge>
          </div>

          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-xl">
              <Play className="w-8 h-8 text-primary-foreground ml-1" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-2">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4 leading-tight">
            {episode.name}
          </h2>

          {/* Info row */}
          <div className="flex flex-wrap gap-3 mb-6">
            {episode.airDate && (
              <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
                <Calendar className="w-4 h-4 text-simpsons-orange" />
                <span className="text-sm font-body text-foreground">{episode.airDate}</span>
              </div>
            )}
            {episode.directed_by && (
              <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-body text-foreground">Dir: {episode.directed_by}</span>
              </div>
            )}
            {episode.written_by && (
              <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
                <FileText className="w-4 h-4 text-secondary" />
                <span className="text-sm font-body text-foreground">Written by: {episode.written_by}</span>
              </div>
            )}
          </div>

          {/* Synopsis */}
          {episode.synopsis ? (
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-5 border border-secondary/20">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-secondary" />
                <h3 className="font-heading font-bold text-foreground">Synopsis</h3>
              </div>
              <ScrollArea className="max-h-40">
                <p className="text-sm font-body text-foreground/90 leading-relaxed pr-4">
                  {episode.synopsis}
                </p>
              </ScrollArea>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-2xl p-6 text-center border border-border/50">
              <span className="text-4xl mb-3 block">📺</span>
              <p className="text-sm text-muted-foreground font-body">
                No synopsis available for this episode.
              </p>
            </div>
          )}

          {/* Episode number display */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-4 bg-muted/50 rounded-full px-6 py-3">
              <div className="text-center">
                <p className="text-2xl font-heading font-bold text-primary">{episode.season}</p>
                <p className="text-xs text-muted-foreground">Season</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-heading font-bold text-secondary">{episode.episode}</p>
                <p className="text-xs text-muted-foreground">Episode</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
