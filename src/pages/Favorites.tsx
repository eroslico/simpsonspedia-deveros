import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { EmptyState } from "@/components/EmptyState";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart, Trash2, Users, Tv, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Favorites() {
  const { favorites, removeFavorite, getFavoritesByType } = useFavorites();

  const characterFavorites = getFavoritesByType("character");
  const episodeFavorites = getFavoritesByType("episode");
  const locationFavorites = getFavoritesByType("location");

  const sections = [
    { 
      type: "character" as const, 
      title: "Characters", 
      icon: Users, 
      items: characterFavorites,
      emoji: "👥",
      color: "bg-primary"
    },
    { 
      type: "episode" as const, 
      title: "Episodes", 
      icon: Tv, 
      items: episodeFavorites,
      emoji: "📺",
      color: "bg-secondary"
    },
    { 
      type: "location" as const, 
      title: "Locations", 
      icon: MapPin, 
      items: locationFavorites,
      emoji: "🗺️",
      color: "bg-accent"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="My Favorites"
            subtitle="Your saved characters, episodes, and locations"
            icon="❤️"
          />

          {favorites.length === 0 ? (
            <EmptyState
              title="No favorites yet"
              message="Start exploring and save your favorite characters, episodes, and locations!"
              icon="💔"
            />
          ) : (
            <div className="space-y-12">
              {sections.map((section) => (
                section.items.length > 0 && (
                  <section key={section.type} className="animate-bounce-in">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
                        section.color
                      )}>
                        <section.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <h2 className="text-2xl font-heading font-bold text-foreground">
                        {section.title}
                      </h2>
                      <span className="text-muted-foreground font-body">
                        ({section.items.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {section.items.map((item, index) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          className="group relative bg-card rounded-2xl overflow-hidden border-4 border-border shadow-lg hover:shadow-xl hover:border-accent transition-all duration-300 animate-bounce-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="aspect-square overflow-hidden bg-muted">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-4xl">{section.emoji}</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-heading font-bold text-sm text-foreground truncate">
                              {item.name}
                            </h3>
                          </div>
                          
                          {/* Remove button */}
                          <button
                            onClick={() => removeFavorite(item.id, item.type)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                            aria-label="Remove from favorites"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              ))}
            </div>
          )}
        </main>
      </PageTransition>
    </div>
  );
}

