import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { EmptyState } from "@/components/EmptyState";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart, Trash2, Users, Tv, MapPin, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
      color: "bg-primary",
      href: "/characters"
    },
    { 
      type: "episode" as const, 
      title: "Episodes", 
      icon: Tv, 
      items: episodeFavorites,
      emoji: "📺",
      color: "bg-secondary",
      href: "/episodes"
    },
    { 
      type: "location" as const, 
      title: "Locations", 
      icon: MapPin, 
      items: locationFavorites,
      emoji: "🗺️",
      color: "bg-accent",
      href: "/locations"
    },
  ];

  // Calculate stats
  const totalFavorites = favorites.length;
  const mostRecentFavorite = favorites.length > 0 
    ? favorites.reduce((a, b) => a.addedAt > b.addedAt ? a : b)
    : null;

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
            <>
              {/* Statistics Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-md text-center">
                  <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-3xl font-heading font-bold text-foreground">{totalFavorites}</p>
                  <p className="text-sm text-muted-foreground font-body">Total Favorites</p>
                </div>
                <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-md text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-heading font-bold text-foreground">{characterFavorites.length}</p>
                  <p className="text-sm text-muted-foreground font-body">Characters</p>
                </div>
                <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-md text-center">
                  <Tv className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="text-3xl font-heading font-bold text-foreground">{episodeFavorites.length}</p>
                  <p className="text-sm text-muted-foreground font-body">Episodes</p>
                </div>
                <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-md text-center">
                  <MapPin className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-3xl font-heading font-bold text-foreground">{locationFavorites.length}</p>
                  <p className="text-sm text-muted-foreground font-body">Locations</p>
                </div>
              </div>

              {/* Most Recent */}
              {mostRecentFavorite && (
                <div className="mb-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-bold text-foreground">Most Recently Added</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                      {mostRecentFavorite.image ? (
                        <img
                          src={mostRecentFavorite.image}
                          alt={mostRecentFavorite.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {mostRecentFavorite.type === "character" ? "👥" : 
                           mostRecentFavorite.type === "episode" ? "📺" : "🗺️"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-lg text-foreground">{mostRecentFavorite.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{mostRecentFavorite.type}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Favorites by Category */}
              <div className="space-y-12">
                {sections.map((section) => (
                  section.items.length > 0 && (
                    <section key={section.type} className="animate-bounce-in">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
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
                        <Link 
                          to={section.href}
                          className="text-sm font-heading text-primary hover:underline"
                        >
                          View all →
                        </Link>
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
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
            </>
          )}
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}
