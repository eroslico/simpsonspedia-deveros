import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Plus, 
  X, 
  ArrowLeftRight,
  Briefcase,
  User,
  MessageCircle,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CharacterTags } from "@/components/CharacterTags";

interface Character {
  id: number;
  name: string;
  portrait_path: string;
  gender?: string;
  occupation?: string;
  status?: string;
  age?: number;
  phrases?: string[];
}

export default function Compare() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<(Character | null)[]>([null, null]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const allCharacters: Character[] = [];
        for (let page = 1; page <= 5; page++) {
          const res = await fetch(`https://thesimpsonsapi.com/api/characters?page=${page}`);
          const data = await res.json();
          allCharacters.push(...(data.results || []));
          if (!data.next) break;
        }
        setCharacters(allCharacters);
      } catch (error) {
        console.error("Error fetching characters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectCharacter = (character: Character, slot: number) => {
    const newSelected = [...selectedCharacters];
    newSelected[slot] = character;
    setSelectedCharacters(newSelected);
    setShowSearch(null);
    setSearchQuery("");
  };

  const removeCharacter = (slot: number) => {
    const newSelected = [...selectedCharacters];
    newSelected[slot] = null;
    setSelectedCharacters(newSelected);
  };

  const swapCharacters = () => {
    setSelectedCharacters([selectedCharacters[1], selectedCharacters[0]]);
  };

  const ComparisonRow = ({ label, values, icon: Icon }: { label: string; values: (string | undefined)[]; icon: any }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground font-body">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      {values.map((value, i) => (
        <div key={i} className="text-center font-heading text-foreground">
          {value || "-"}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Character Comparator"
            subtitle="Compare your favorite Springfield residents side by side"
            icon="⚖️"
          />

          {/* Character Selection */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 relative">
            {/* Swap Button */}
            {selectedCharacters[0] && selectedCharacters[1] && (
              <button
                onClick={swapCharacters}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-primary rounded-full shadow-lg hover:scale-110 transition-transform hidden md:flex"
                aria-label="Swap characters"
              >
                <ArrowLeftRight className="w-5 h-5 text-primary-foreground" />
              </button>
            )}

            {[0, 1].map((slot) => (
              <div key={slot} className="relative">
                {selectedCharacters[slot] ? (
                  <div className="bg-card rounded-3xl p-6 border-4 border-primary shadow-xl animate-bounce-in">
                    <button
                      onClick={() => removeCharacter(slot)}
                      className="absolute top-4 right-4 p-2 bg-destructive/10 hover:bg-destructive/20 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg mb-4">
                        <img
                          src={`https://cdn.thesimpsonsapi.com/500${selectedCharacters[slot]!.portrait_path}`}
                          alt={selectedCharacters[slot]!.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                        {selectedCharacters[slot]!.name}
                      </h3>
                      <CharacterTags characterName={selectedCharacters[slot]!.name} />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setShowSearch(slot)}
                    className="bg-card rounded-3xl p-6 border-4 border-dashed border-border hover:border-primary cursor-pointer transition-colors min-h-[280px] flex flex-col items-center justify-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-heading">
                      Select Character {slot + 1}
                    </p>
                  </div>
                )}

                {/* Search Dropdown */}
                {showSearch === slot && (
                  <div className="absolute top-0 left-0 right-0 z-20 bg-card rounded-3xl border-4 border-primary shadow-2xl p-4 animate-bounce-in">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search characters..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          setShowSearch(null);
                          setSearchQuery("");
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {loading ? (
                        <p className="text-center text-muted-foreground py-4">Loading...</p>
                      ) : filteredCharacters.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No characters found</p>
                      ) : (
                        filteredCharacters.slice(0, 20).map((char) => (
                          <button
                            key={char.id}
                            onClick={() => selectCharacter(char, slot)}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
                          >
                            <img
                              src={`https://cdn.thesimpsonsapi.com/500${char.portrait_path}`}
                              alt={char.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="font-heading text-foreground">{char.name}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {selectedCharacters[0] && selectedCharacters[1] && (
            <div className="bg-card rounded-3xl p-6 border-4 border-border shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
                📊 Comparison
              </h2>
              
              <div className="overflow-x-auto">
                <div className="min-w-[400px]">
                  {/* Header */}
                  <div className="grid grid-cols-3 gap-4 pb-4 border-b-2 border-primary mb-4">
                    <div className="font-heading font-bold text-muted-foreground">Attribute</div>
                    <div className="text-center font-heading font-bold text-primary">
                      {selectedCharacters[0]?.name}
                    </div>
                    <div className="text-center font-heading font-bold text-secondary">
                      {selectedCharacters[1]?.name}
                    </div>
                  </div>

                  <ComparisonRow
                    label="Gender"
                    values={[selectedCharacters[0]?.gender, selectedCharacters[1]?.gender]}
                    icon={User}
                  />
                  <ComparisonRow
                    label="Occupation"
                    values={[selectedCharacters[0]?.occupation, selectedCharacters[1]?.occupation]}
                    icon={Briefcase}
                  />
                  <ComparisonRow
                    label="Status"
                    values={[selectedCharacters[0]?.status, selectedCharacters[1]?.status]}
                    icon={Users}
                  />
                  <ComparisonRow
                    label="Age"
                    values={[
                      selectedCharacters[0]?.age ? `${selectedCharacters[0].age} years` : undefined,
                      selectedCharacters[1]?.age ? `${selectedCharacters[1].age} years` : undefined
                    ]}
                    icon={User}
                  />
                  <ComparisonRow
                    label="Famous Quotes"
                    values={[
                      selectedCharacters[0]?.phrases ? `${selectedCharacters[0].phrases.length}` : "0",
                      selectedCharacters[1]?.phrases ? `${selectedCharacters[1].phrases.length}` : "0"
                    ]}
                    icon={MessageCircle}
                  />
                </div>
              </div>

              {/* Quotes Comparison */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {[0, 1].map((slot) => (
                  <div key={slot} className="bg-muted/50 rounded-2xl p-4">
                    <h3 className={cn(
                      "font-heading font-bold mb-3",
                      slot === 0 ? "text-primary" : "text-secondary"
                    )}>
                      {selectedCharacters[slot]?.name}'s Quotes
                    </h3>
                    {selectedCharacters[slot]?.phrases && selectedCharacters[slot]!.phrases!.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedCharacters[slot]!.phrases!.slice(0, 5).map((phrase, i) => (
                          <p key={i} className="text-sm font-body italic text-foreground bg-card p-2 rounded-lg">
                            "{phrase}"
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No quotes available</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedCharacters[0] && !selectedCharacters[1] && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">👆</span>
              <p className="text-muted-foreground font-body">
                Select two characters above to compare them
              </p>
            </div>
          )}
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

