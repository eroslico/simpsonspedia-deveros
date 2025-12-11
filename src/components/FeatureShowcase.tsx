import { Link } from "react-router-dom";
import { ScrollReveal, ScrollCounter, Magnetic } from "./ScrollAnimations";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Characters",
    description: "Explore 100+ iconic characters from Springfield",
    emoji: "👥",
    path: "/characters",
    color: "from-yellow-400 to-orange-500",
    stats: { value: 100, suffix: "+" },
  },
  {
    title: "Episodes",
    description: "Browse through 750+ episodes across 35 seasons",
    emoji: "📺",
    path: "/episodes",
    color: "from-blue-400 to-cyan-500",
    stats: { value: 750, suffix: "+" },
  },
  {
    title: "Locations",
    description: "Visit famous places in Springfield and beyond",
    emoji: "📍",
    path: "/locations",
    color: "from-green-400 to-emerald-500",
    stats: { value: 50, suffix: "+" },
  },
  {
    title: "Trivia Games",
    description: "Test your knowledge with fun quizzes",
    emoji: "🧠",
    path: "/trivia",
    color: "from-purple-400 to-pink-500",
    stats: { value: 10, suffix: "+" },
  },
  {
    title: "Memory Game",
    description: "Match characters in this classic game",
    emoji: "🎴",
    path: "/memory",
    color: "from-red-400 to-rose-500",
    stats: { value: 3, suffix: " modes" },
  },
  {
    title: "Simpsons Wordle",
    description: "Daily word puzzle with Simpsons theme",
    emoji: "🔤",
    path: "/wordle",
    color: "from-amber-400 to-yellow-500",
    stats: { value: 1, suffix: " daily" },
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section header */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-heading mb-4">
            Explore Everything
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4">
            Your Springfield <span className="text-primary">Adventure</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover everything The Simpsons universe has to offer
          </p>
        </ScrollReveal>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <ScrollReveal
              key={feature.path}
              direction={index % 2 === 0 ? "left" : "right"}
              delay={index * 100}
            >
              <Magnetic strength={0.1}>
                <Link to={feature.path} className="block group">
                  <GlassCard className="p-6 h-full" hoverScale>
                    {/* Gradient background on hover */}
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl",
                        `bg-gradient-to-br ${feature.color}`
                      )}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {feature.emoji}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm mb-4">
                        {feature.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-heading font-bold text-primary">
                          <ScrollCounter
                            end={feature.stats.value}
                            suffix={feature.stats.suffix}
                          />
                        </span>
                        
                        {/* Arrow */}
                        <span className="text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300">
                          →
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </Magnetic>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal direction="up" delay={600} className="text-center mt-12">
          <Link
            to="/stats"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-bold hover:scale-105 transition-transform"
          >
            View All Stats
            <span>📊</span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

