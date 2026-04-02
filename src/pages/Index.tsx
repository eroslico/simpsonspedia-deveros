import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const sections = [
  { name: "Characters", path: "/characters", description: "The residents of Springfield" },
  { name: "Episodes", path: "/episodes", description: "35 seasons and counting" },
  { name: "Locations", path: "/locations", description: "From Moe's to the Power Plant" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center container mx-auto px-4 py-16 md:py-24">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-6">
          127 characters · 750+ episodes · 50+ locations
        </p>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading text-foreground max-w-3xl leading-[1.1]">
          Every character.{" "}
          <br className="hidden md:block" />
          Every episode.{" "}
          <br className="hidden md:block" />
          Every corner of{" "}
          <span className="highlight italic">Springfield.</span>
        </h1>

        <p className="mt-6 text-base text-muted-foreground max-w-md leading-relaxed">
          A catalog of The Simpsons — no trivia games, no memes,
          just the show.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mt-12 max-w-2xl">
          {sections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className="group border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <span className="text-lg font-heading text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                {section.name}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </span>
              <span className="text-xs text-muted-foreground mt-1 block">
                {section.description}
              </span>
            </Link>
          ))}
        </div>

        <div className="w-12 h-0.5 bg-primary rounded-full mt-12" />
      </main>

      <Footer />
    </div>
  );
}
