import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Github, Twitter, Mail, ArrowUp } from "lucide-react";
import { ScrollReveal } from "./ScrollAnimations";
import { cn } from "@/lib/utils";

const footerLinks = {
  explore: [
    { name: "Characters", path: "/characters" },
    { name: "Episodes", path: "/episodes" },
    { name: "Locations", path: "/locations" },
    { name: "Timeline", path: "/timeline" },
  ],
  games: [
    { name: "Trivia", path: "/trivia" },
    { name: "Memory", path: "/memory" },
    { name: "Wordle", path: "/wordle" },
    { name: "Quiz", path: "/quiz" },
  ],
  tools: [
    { name: "Meme Generator", path: "/memes" },
    { name: "Quote Generator", path: "/quotes" },
    { name: "Compare", path: "/compare" },
    { name: "Stats", path: "/stats" },
  ],
};

const funFacts = [
  "The Simpsons has predicted over 30 real-world events! 🔮",
  "Homer's email is chunkylover53@aol.com 📧",
  "Bart's prank calls to Moe's are improvised! 📞",
  "The couch gag is different in almost every episode 🛋️",
  "Springfield's state is intentionally never revealed 🗺️",
  "The show has won 34 Emmy Awards 🏆",
  "Matt Groening named characters after his family 👨‍👩‍👧‍👦",
  "The Simpsons yellow skin saves animation time 🎨",
];

export function InteractiveFooter() {
  const [currentFact, setCurrentFact] = useState(0);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % funFacts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      
      {/* Animated clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-10 left-0 w-full h-40 opacity-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute text-8xl"
              style={{
                left: `${i * 25}%`,
                animation: `float ${10 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              ☁️
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Fun fact banner */}
        <ScrollReveal direction="up" className="mb-12">
          <div className="bg-primary/10 rounded-2xl p-6 text-center max-w-2xl mx-auto backdrop-blur-sm border border-primary/20">
            <span className="text-sm text-primary font-heading uppercase tracking-wider">
              Did you know?
            </span>
            <p className="text-lg font-body mt-2 text-foreground min-h-[3rem] flex items-center justify-center">
              {funFacts[currentFact]}
            </p>
            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {funFacts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentFact(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === currentFact
                      ? "bg-primary w-6"
                      : "bg-primary/30 hover:bg-primary/50"
                  )}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <ScrollReveal direction="left" className="lg:col-span-2">
            <Link to="/" className="inline-block group">
              <h3 className="text-3xl font-heading font-bold mb-4 group-hover:text-primary transition-colors">
                🍩 Simpsonspedia
              </h3>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              The ultimate encyclopedia for everything about The Simpsons. 
              Explore characters, episodes, and more from America's favorite animated family.
            </p>
            
            {/* Social links */}
            <div className="flex gap-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Mail, href: "#", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </ScrollReveal>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <ScrollReveal key={category} direction="up" delay={index * 100}>
              <h4 className="font-heading font-bold text-lg mb-4 capitalize">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom bar */}
        <ScrollReveal direction="up" delay={400}>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {year} Simpsonspedia. Made with{" "}
              <Heart className="w-4 h-4 inline text-accent fill-accent animate-pulse" />{" "}
              for Simpsons fans everywhere.
            </p>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Not affiliated with Fox or Disney
              </span>
              
              {/* Back to top button */}
              <button
                onClick={scrollToTop}
                className="p-2 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
                aria-label="Back to top"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* CSS for float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </footer>
  );
}

