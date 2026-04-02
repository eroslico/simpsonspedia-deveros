import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { useFavorites } from "@/hooks/useFavorites";
import { Trash2 } from "lucide-react";

export default function Favorites() {
  const { favorites, removeFavorite, getFavoritesByType } = useFavorites();

  const characterFavorites = getFavoritesByType("character");
  const episodeFavorites = getFavoritesByType("episode");
  const locationFavorites = getFavoritesByType("location");

  const sections = [
    { type: "character" as const, title: "Characters", items: characterFavorites },
    { type: "episode" as const, title: "Episodes", items: episodeFavorites },
    { type: "location" as const, title: "Locations", items: locationFavorites },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <PageHeader title="Favorites" count={favorites.length} />

        {favorites.length === 0 ? (
          <div className="py-16">
            <p className="text-sm text-muted-foreground">
              Nothing here yet.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Heart something from{" "}
              <a href="/characters" className="text-foreground hover:text-primary underline transition-colors">characters</a>,{" "}
              <a href="/episodes" className="text-foreground hover:text-primary underline transition-colors">episodes</a>, or{" "}
              <a href="/locations" className="text-foreground hover:text-primary underline transition-colors">locations</a> to save it here.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {sections.map(
              (section) =>
                section.items.length > 0 && (
                  <section key={section.type}>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="w-1 h-4 bg-primary rounded-full shrink-0" />
                      <h2 className="text-xl font-heading text-foreground">
                        {section.title}
                      </h2>
                      <span className="text-xs font-mono text-muted-foreground">
                        {section.items.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {section.items.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full" />
                            )}
                          </div>
                          <p className="text-sm font-heading text-foreground mt-2 truncate group-hover:text-primary transition-colors">
                            {item.name}
                          </p>
                          <button
                            onClick={() => removeFavorite(item.id, item.type)}
                            className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove from favorites"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
