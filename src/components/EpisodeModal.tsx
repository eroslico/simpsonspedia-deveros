import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface EpisodeModalProps {
  episode: Episode | null;
  onClose: () => void;
}

export function EpisodeModal({ episode, onClose }: EpisodeModalProps) {
  if (!episode) return null;

  const imageUrl = episode.image_path
    ? `https://cdn.thesimpsonsapi.com/500${episode.image_path}`
    : null;

  const details = [
    {
      label: "Episode",
      value: `S${String(episode.season).padStart(2, "0")}E${String(episode.episode_number).padStart(2, "0")}`,
    },
    { label: "Air date", value: episode.airdate || undefined },
    { label: "Directed by", value: episode.directed_by },
    { label: "Written by", value: episode.written_by },
  ].filter((d) => d.value);

  return (
    <Sheet open={!!episode} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-heading text-left">
                {episode.name}
              </SheetTitle>
            </SheetHeader>

            {imageUrl && (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted mb-6">
                <img
                  src={imageUrl}
                  alt={episode.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {details.length > 0 && (
              <dl className="space-y-3 mb-6">
                {details.map((d) => (
                  <div key={d.label} className="flex justify-between items-baseline">
                    <dt className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      {d.label}
                    </dt>
                    <dd className="text-sm text-foreground">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {episode.synopsis && (
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Synopsis
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {episode.synopsis}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
