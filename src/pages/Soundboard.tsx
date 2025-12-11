import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { 
  Volume2, 
  VolumeX,
  Play,
  Heart,
  Search,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Sound {
  id: string;
  name: string;
  phrase: string;
  character: string;
  emoji: string;
  category: string;
  // Using text-to-speech as fallback since we don't have actual audio files
  audioUrl?: string;
}

const sounds: Sound[] = [
  // Homer
  { id: "doh", name: "D'oh!", phrase: "D'oh!", character: "Homer Simpson", emoji: "😫", category: "Homer" },
  { id: "woohoo", name: "Woohoo!", phrase: "Woohoo!", character: "Homer Simpson", emoji: "🎉", category: "Homer" },
  { id: "mmm-donuts", name: "Mmm... Donuts", phrase: "Mmm... donuts", character: "Homer Simpson", emoji: "🍩", category: "Homer" },
  { id: "mmm-beer", name: "Mmm... Beer", phrase: "Mmm... beer", character: "Homer Simpson", emoji: "🍺", category: "Homer" },
  { id: "why-you-little", name: "Why you little...!", phrase: "Why you little!", character: "Homer Simpson", emoji: "😤", category: "Homer" },
  { id: "stupid-flanders", name: "Stupid Flanders", phrase: "Stupid Flanders", character: "Homer Simpson", emoji: "😒", category: "Homer" },
  
  // Bart
  { id: "ay-caramba", name: "¡Ay, caramba!", phrase: "Ay caramba!", character: "Bart Simpson", emoji: "😱", category: "Bart" },
  { id: "eat-my-shorts", name: "Eat my shorts!", phrase: "Eat my shorts!", character: "Bart Simpson", emoji: "🩳", category: "Bart" },
  { id: "dont-have-cow", name: "Don't have a cow, man!", phrase: "Don't have a cow, man!", character: "Bart Simpson", emoji: "🐄", category: "Bart" },
  { id: "i-didnt-do-it", name: "I didn't do it!", phrase: "I didn't do it!", character: "Bart Simpson", emoji: "🙅", category: "Bart" },
  { id: "cowabunga", name: "Cowabunga!", phrase: "Cowabunga!", character: "Bart Simpson", emoji: "🛹", category: "Bart" },
  
  // Mr. Burns
  { id: "excellent", name: "Excellent...", phrase: "Excellent", character: "Mr. Burns", emoji: "😈", category: "Mr. Burns" },
  { id: "release-hounds", name: "Release the hounds!", phrase: "Release the hounds!", character: "Mr. Burns", emoji: "🐕", category: "Mr. Burns" },
  { id: "smithers", name: "Smithers!", phrase: "Smithers!", character: "Mr. Burns", emoji: "👔", category: "Mr. Burns" },
  
  // Nelson
  { id: "ha-ha", name: "Ha ha!", phrase: "Ha ha!", character: "Nelson Muntz", emoji: "👆", category: "Others" },
  
  // Ned Flanders
  { id: "hidilly-ho", name: "Hi-diddly-ho!", phrase: "Hi-diddly-ho, neighborino!", character: "Ned Flanders", emoji: "👋", category: "Others" },
  { id: "okily-dokily", name: "Okily-dokily!", phrase: "Okily-dokily!", character: "Ned Flanders", emoji: "👍", category: "Others" },
  
  // Apu
  { id: "thank-you-come-again", name: "Thank you, come again!", phrase: "Thank you, come again!", character: "Apu", emoji: "🏪", category: "Others" },
  
  // Comic Book Guy
  { id: "worst-ever", name: "Worst. Episode. Ever.", phrase: "Worst. Episode. Ever.", character: "Comic Book Guy", emoji: "🤓", category: "Others" },
  
  // Krusty
  { id: "hey-hey", name: "Hey hey!", phrase: "Hey hey, kids!", character: "Krusty the Clown", emoji: "🤡", category: "Others" },
  
  // Ralph
  { id: "me-fail-english", name: "Me fail English?", phrase: "Me fail English? That's unpossible!", character: "Ralph Wiggum", emoji: "📚", category: "Others" },
  
  // Chief Wiggum
  { id: "bake-em-away", name: "Bake 'em away, toys!", phrase: "Bake 'em away, toys!", character: "Chief Wiggum", emoji: "👮", category: "Others" },
];

const categories = ["All", "Homer", "Bart", "Mr. Burns", "Others"];

export default function Soundboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("simpsonspedia-sound-favorites");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const filteredSounds = sounds.filter((sound) => {
    const matchesCategory = selectedCategory === "All" || sound.category === selectedCategory;
    const matchesSearch = 
      sound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sound.character.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sound.phrase.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const playSound = (sound: Sound) => {
    if (isMuted) {
      toast.error("Sound is muted!");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    setPlayingId(sound.id);

    // Use Web Speech API as fallback
    const utterance = new SpeechSynthesisUtterance(sound.phrase);
    utterance.rate = 0.9;
    utterance.pitch = sound.character === "Mr. Burns" ? 0.7 : 
                      sound.character === "Bart Simpson" ? 1.3 :
                      sound.character === "Homer Simpson" ? 0.8 : 1;
    
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    toast.success(`🔊 ${sound.character}: "${sound.phrase}"`);
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem("simpsonspedia-sound-favorites", JSON.stringify([...newFavorites]));
  };

  const favoriteSounds = sounds.filter((s) => favorites.has(s.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Soundboard"
            subtitle="Play your favorite Simpsons quotes and catchphrases"
            icon="🔊"
          />

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sounds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-card border-2 border-border rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Mute button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                "p-3 rounded-xl border-2 transition-colors",
                isMuted
                  ? "bg-destructive/10 border-destructive text-destructive"
                  : "bg-card border-border hover:border-primary"
              )}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full font-heading text-sm transition-all whitespace-nowrap",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border-2 border-border hover:border-primary"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Favorites Section */}
          {favoriteSounds.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent fill-accent" />
                Favorites
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {favoriteSounds.map((sound) => (
                  <SoundButton
                    key={sound.id}
                    sound={sound}
                    isPlaying={playingId === sound.id}
                    isFavorite={true}
                    onPlay={() => playSound(sound)}
                    onToggleFavorite={() => toggleFavorite(sound.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Sounds */}
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-4">
              {selectedCategory === "All" ? "All Sounds" : selectedCategory}
              <span className="text-muted-foreground font-normal ml-2">
                ({filteredSounds.length})
              </span>
            </h2>
            
            {filteredSounds.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🔇</span>
                <p className="text-muted-foreground font-body">No sounds found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredSounds.map((sound) => (
                  <SoundButton
                    key={sound.id}
                    sound={sound}
                    isPlaying={playingId === sound.id}
                    isFavorite={favorites.has(sound.id)}
                    onPlay={() => playSound(sound)}
                    onToggleFavorite={() => toggleFavorite(sound.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-12 bg-muted/50 rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground font-body">
              🎤 Sounds are generated using text-to-speech. 
              Click any button to hear the famous catchphrase!
            </p>
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

function SoundButton({
  sound,
  isPlaying,
  isFavorite,
  onPlay,
  onToggleFavorite,
}: {
  sound: Sound;
  isPlaying: boolean;
  isFavorite: boolean;
  onPlay: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="relative group">
      <button
        onClick={onPlay}
        className={cn(
          "w-full aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 p-3 transition-all",
          isPlaying
            ? "bg-primary border-primary text-primary-foreground scale-95"
            : "bg-card border-border hover:border-primary hover:shadow-lg hover:-translate-y-1"
        )}
      >
        <span className={cn(
          "text-4xl transition-transform",
          isPlaying && "animate-bounce"
        )}>
          {sound.emoji}
        </span>
        <span className="text-xs font-heading text-center leading-tight">
          {sound.name}
        </span>
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-2xl">
            <Play className="w-8 h-8 text-primary fill-primary animate-pulse" />
          </div>
        )}
      </button>
      
      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={cn(
          "absolute top-1 right-1 p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100",
          isFavorite
            ? "bg-accent text-accent-foreground opacity-100"
            : "bg-card/80 hover:bg-card"
        )}
      >
        <Heart className={cn("w-3 h-3", isFavorite && "fill-current")} />
      </button>
      
      {/* Character label */}
      <p className="text-[10px] text-muted-foreground text-center mt-1 truncate">
        {sound.character}
      </p>
    </div>
  );
}

