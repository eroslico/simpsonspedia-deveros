import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UltraHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeDonut, setActiveDonut] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setActiveDonut(prev => (prev + 1) % 5);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingElements = [
    { emoji: "🍩", size: "text-6xl md:text-8xl", x: 15, y: 20, delay: 0 },
    { emoji: "🍺", size: "text-4xl md:text-6xl", x: 80, y: 15, delay: 0.5 },
    { emoji: "📺", size: "text-5xl md:text-7xl", x: 10, y: 70, delay: 1 },
    { emoji: "🎸", size: "text-4xl md:text-5xl", x: 85, y: 65, delay: 1.5 },
    { emoji: "☢️", size: "text-5xl md:text-6xl", x: 75, y: 80, delay: 2 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-gradient" />
      
      {/* Animated mesh gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, hsl(var(--primary)) 0%, transparent 50%),
            radial-gradient(at ${80 - mousePosition.x * 10}% ${20 - mousePosition.y * 10}%, hsl(var(--secondary)) 0%, transparent 40%),
            radial-gradient(at ${20 + mousePosition.x * 15}% ${80 + mousePosition.y * 15}%, hsl(var(--accent)) 0%, transparent 40%)
          `,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating 3D elements with parallax */}
      {floatingElements.map((el, i) => (
        <div
          key={i}
          className={cn(
            "absolute transition-all duration-700 ease-out",
            el.size,
            isLoaded ? "opacity-60" : "opacity-0 scale-0"
          )}
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            transform: `
              translate(${mousePosition.x * (30 + i * 10)}px, ${mousePosition.y * (30 + i * 10)}px)
              rotate(${mousePosition.x * 10}deg)
              scale(${activeDonut === i ? 1.2 : 1})
            `,
            transitionDelay: `${el.delay}s`,
            filter: activeDonut === i ? "drop-shadow(0 0 20px hsl(var(--primary)))" : "none",
          }}
        >
          {el.emoji}
        </div>
      ))}

      {/* Animated circles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-primary/20 animate-ping"
            style={{
              width: `${300 + i * 200}px`,
              height: `${300 + i * 200}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animationDuration: `${3 + i}s`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Animated badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-primary/10 border border-primary/30 backdrop-blur-sm",
            "mb-8 transition-all duration-1000",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          )}
        >
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-heading text-primary">
            The Ultimate Simpsons Experience
          </span>
        </div>

        {/* Main title with animated letters */}
        <h1 className="mb-6">
          <span className="sr-only">Simpsonspedia</span>
          <span className="block text-6xl md:text-8xl lg:text-9xl font-heading font-bold">
            {"Simpsonspedia".split("").map((letter, i) => (
              <span
                key={i}
                className={cn(
                  "inline-block transition-all duration-500",
                  "hover:text-primary hover:scale-110 hover:-translate-y-2",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                style={{
                  transitionDelay: `${i * 50}ms`,
                  textShadow: "0 4px 30px rgba(0,0,0,0.1)",
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        </h1>

        {/* Animated subtitle */}
        <p
          className={cn(
            "text-xl md:text-2xl lg:text-3xl text-muted-foreground font-body mb-12",
            "max-w-2xl mx-auto transition-all duration-1000 delay-500",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          Explore <span className="text-primary font-heading">100+ characters</span>,{" "}
          <span className="text-secondary font-heading">750+ episodes</span>, and{" "}
          <span className="text-accent font-heading">endless fun</span> from Springfield
        </p>

        {/* CTA Buttons with glow effect */}
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center items-center",
            "transition-all duration-1000 delay-700",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <Button
            asChild
            size="lg"
            className={cn(
              "group relative overflow-hidden",
              "bg-primary text-primary-foreground",
              "font-heading text-lg h-16 px-10 rounded-full",
              "shadow-[0_0_30px_rgba(255,217,61,0.3)]",
              "hover:shadow-[0_0_50px_rgba(255,217,61,0.5)]",
              "transition-all duration-300"
            )}
          >
            <Link to="/characters">
              <span className="relative z-10 flex items-center gap-2">
                Start Exploring
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-simpsons-orange to-primary bg-[length:200%_100%] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className={cn(
              "group relative overflow-hidden",
              "font-heading text-lg h-16 px-10 rounded-full",
              "border-2 border-foreground/20 backdrop-blur-sm",
              "hover:border-primary hover:bg-primary/10",
              "transition-all duration-300"
            )}
          >
            <Link to="/daily">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Daily Challenge
            </Link>
          </Button>
        </div>

        {/* Stats row */}
        <div
          className={cn(
            "grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto",
            "transition-all duration-1000 delay-1000",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {[
            { value: "100+", label: "Characters", emoji: "👥" },
            { value: "750+", label: "Episodes", emoji: "📺" },
            { value: "10+", label: "Games", emoji: "🎮" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center group cursor-default"
            >
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">
                {stat.emoji}
              </div>
              <div className="text-3xl md:text-4xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2",
          "transition-all duration-1000 delay-1500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm text-muted-foreground font-body">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

