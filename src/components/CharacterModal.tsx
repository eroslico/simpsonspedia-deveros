import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, User, Heart, Calendar, MessageCircle, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const isAlive = character.status?.toLowerCase() === "alive";

  const infoItems = [
    { icon: Briefcase, label: "Occupation", value: character.occupation, color: "text-primary" },
    { 
      icon: User, 
      label: "Gender", 
      value: character.gender,
      color: "text-secondary" 
    },
    { icon: Heart, label: "Age", value: character.age ? `${character.age} years old` : null, color: "text-accent" },
    { icon: Calendar, label: "Birthdate", value: character.birthdate, color: "text-simpsons-orange" },
  ].filter(item => item.value);

  return (
    <Dialog open={!!character} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-card border-4 border-primary rounded-3xl shadow-2xl">
        {/* Animated header */}
        <div className="relative bg-sky-gradient pt-6 pb-24 overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-card/90 hover:bg-card shadow-lg transition-all duration-300 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Animated decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-2 left-4 text-5xl opacity-40 animate-float">☁️</div>
            <div className="absolute top-6 right-12 text-3xl opacity-30 animate-float" style={{ animationDelay: "0.5s" }}>☁️</div>
            <div className="absolute top-12 left-1/3 text-2xl opacity-20 animate-float" style={{ animationDelay: "1s" }}>☁️</div>
            <Sparkles className="absolute bottom-4 right-6 w-6 h-6 text-primary/40 animate-pulse" />
          </div>

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
        </div>

        {/* Character image */}
        <div className="relative -mt-20 flex justify-center z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl scale-90 group-hover:scale-100 transition-transform duration-500" />
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-primary shadow-2xl bg-card transition-transform duration-300 hover:scale-105">
              <img
                src={imageUrl}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
            <Badge 
              className={cn(
                "absolute -bottom-2 left-1/2 -translate-x-1/2 font-heading text-xs px-3 py-1 shadow-lg transition-all duration-300 hover:scale-110",
                isAlive 
                  ? "bg-simpsons-green hover:bg-simpsons-green text-white" 
                  : "bg-destructive hover:bg-destructive text-destructive-foreground"
              )}
            >
              {isAlive ? "✨ Alive" : "💀 Deceased"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-foreground mb-6 animate-bounce-in">
            {character.name}
          </h2>

          {/* Info cards */}
          {infoItems.length > 0 && (
            <div className={cn(
              "grid gap-3 mb-6",
              infoItems.length === 1 ? "grid-cols-1" : 
              infoItems.length === 2 ? "grid-cols-2" :
              infoItems.length === 3 ? "grid-cols-3" : "grid-cols-2"
            )}>
              {infoItems.map((item, index) => (
                <div 
                  key={item.label}
                  className="bg-muted/80 backdrop-blur rounded-xl p-3 flex items-start gap-2 transition-all duration-300 hover:bg-muted hover:shadow-md hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <item.icon className={cn("w-5 h-5 mt-0.5 shrink-0", item.color)} />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-body">{item.label}</p>
                    <p className="text-sm font-heading font-medium text-foreground truncate">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Phrases section */}
          {character.phrases && character.phrases.length > 0 ? (
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">Famous Quotes</h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {character.phrases.length}
                </Badge>
              </div>
              <ScrollArea className="h-36">
                <div className="space-y-2 pr-4">
                  {character.phrases.slice(0, 6).map((phrase, index) => (
                    <div 
                      key={index}
                      className="bg-card/80 backdrop-blur rounded-lg p-3 border-l-4 border-primary shadow-sm transition-all duration-300 hover:shadow-md hover:bg-card"
                    >
                      <p className="text-sm font-body italic text-foreground leading-relaxed">
                        &ldquo;{phrase}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-2xl p-6 text-center border border-border/50">
              <span className="text-4xl mb-3 block animate-bounce-in">🤫</span>
              <p className="text-sm text-muted-foreground font-body">
                This character prefers silence...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
