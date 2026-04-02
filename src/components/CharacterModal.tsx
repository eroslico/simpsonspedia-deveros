import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Character {
  id: number;
  name: string;
  portrait_path: string;
  gender?: string;
  occupation?: string;
  status?: string;
  age?: number;
  birthdate?: string;
  phrases?: string[];
}

interface CharacterModalProps {
  character: Character | null;
  onClose: () => void;
}

export function CharacterModal({ character, onClose }: CharacterModalProps) {
  if (!character) return null;

  const imageUrl = `https://cdn.thesimpsonsapi.com/500${character.portrait_path}`;

  const details = [
    { label: "Occupation", value: character.occupation },
    { label: "Gender", value: character.gender },
    { label: "Status", value: character.status },
    { label: "Age", value: character.age ? `${character.age}` : null },
    { label: "Birthdate", value: character.birthdate },
  ].filter((d) => d.value);

  return (
    <Sheet open={!!character} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <div className="w-6 h-0.5 bg-primary rounded-full mb-3" />
              <SheetTitle className="text-3xl font-heading text-left leading-tight">
                {character.name}
              </SheetTitle>
              {character.occupation && (
                <p className="text-sm text-muted-foreground mt-1">
                  {character.occupation}
                </p>
              )}
            </SheetHeader>

            <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted mb-6">
              <img
                src={imageUrl}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>

            {details.length > 0 && (
              <dl className="space-y-3 mb-6 border-t border-border pt-4">
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

            {character.phrases && character.phrases.length > 0 && (
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
                  Quotes
                </h3>
                <div className="space-y-3">
                  {character.phrases.slice(0, 6).map((phrase, index) => (
                    <p
                      key={index}
                      className="text-sm text-foreground/80 leading-relaxed border-l-2 border-primary pl-3 italic font-heading"
                    >
                      "{phrase}"
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
