import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { OnThisDay } from "@/components/OnThisDay";
import { SkipLink } from "@/components/SkipLink";
import { CharacterOfTheDay, RandomEpisodeWidget, QuickStatsWidget } from "@/components/HomepageWidgets";
import { UltraHero } from "@/components/UltraHero";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { TestimonialSection } from "@/components/TestimonialSection";
import { InteractiveFooter } from "@/components/InteractiveFooter";
import { ScrollReveal, ScrollCounter } from "@/components/ScrollAnimations";
import { GlassCard } from "@/components/GlassCard";
import { UltraLoadingScreen } from "@/components/UltraLoadingScreen";
import { ArrowRight, Heart, Sparkles, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

const features = [
  { name: "Characters", emoji: "👨‍👩‍👧‍👦", path: "/characters", color: "from-yellow-400 to-orange-500" },
  { name: "Episodes", emoji: "📺", path: "/episodes", color: "from-blue-400 to-cyan-500" },
  { name: "Locations", emoji: "🗺️", path: "/locations", color: "from-purple-400 to-pink-500" },
  { name: "Compare", emoji: "⚖️", path: "/compare", color: "from-green-400 to-emerald-500" },
  { name: "Stats", emoji: "📊", path: "/stats", color: "from-red-400 to-rose-500" },
  { name: "Predictions", emoji: "🔮", path: "/predictions", color: "from-indigo-400 to-violet-500" },
];

export default function Index() {
  const { totalFavorites } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if loading was already shown this session
    const loadingShown = sessionStorage.getItem("loading-shown");
    if (loadingShown) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      {/* Ultra Loading Screen */}
      {isLoading && <UltraLoadingScreen onComplete={handleLoadingComplete} />}

      <div className={cn(
        "min-h-screen bg-background transition-opacity duration-500",
        showContent ? "opacity-100" : "opacity-0"
      )}>
        <SkipLink />
        <Navbar />
        
        <PageTransition>
          {/* Ultra Hero Section */}
          <UltraHero />

          {/* Feature Showcase */}
          <FeatureShowcase />

          {/* Daily Challenge Banner */}
          <section className="py-12 px-4">
            <ScrollReveal direction="scale">
              <Link to="/daily" className="block max-w-4xl mx-auto group">
                <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary animate-gradient opacity-90" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 5}s`,
                          animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                      <Zap className="w-4 h-4 text-white animate-pulse" />
                      <span className="text-sm font-heading text-white">New challenge available!</span>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 group-hover:scale-105 transition-transform">
                      🎯 Daily Challenge
                    </h3>
                    <p className="text-white/80 font-body text-lg mb-4">
                      Complete today's challenge and earn exclusive rewards!
                    </p>
                    
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-foreground font-heading font-bold group-hover:scale-105 transition-transform">
                      Start Challenge
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </section>

          {/* Features Grid */}
          <section className="py-16 px-4 bg-gradient-to-b from-transparent via-muted/30 to-transparent">
            <div className="container mx-auto max-w-6xl">
              <ScrollReveal direction="up" className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-heading mb-4">
                  <Sparkles className="w-4 h-4" />
                  Explore Springfield
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold">
                  Discover <span className="text-primary">Everything</span>
                </h2>
              </ScrollReveal>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {features.map((feature, index) => (
                  <ScrollReveal
                    key={feature.path}
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 50}
                  >
                    <Link to={feature.path} className="block group">
                      <GlassCard className="p-6 text-center h-full" hoverScale>
                        <div className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl",
                          `bg-gradient-to-br ${feature.color}`
                        )} />
                        <span className="text-4xl md:text-5xl block mb-3 group-hover:scale-125 transition-transform duration-300">
                          {feature.emoji}
                        </span>
                        <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                          {feature.name}
                        </h3>
                      </GlassCard>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Widgets Section */}
          <section className="py-16 px-4" id="main-content">
            <div className="container mx-auto max-w-6xl">
              <ScrollReveal direction="up" className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold">
                  Today in <span className="text-secondary">Springfield</span>
                </h2>
              </ScrollReveal>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <ScrollReveal direction="left" delay={0}>
                  <CharacterOfTheDay />
                </ScrollReveal>
                <ScrollReveal direction="up" delay={100}>
                  <RandomEpisodeWidget />
                </ScrollReveal>
                <ScrollReveal direction="right" delay={200}>
                  <QuickStatsWidget />
                </ScrollReveal>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ScrollReveal direction="left" delay={300}>
                  <OnThisDay />
                </ScrollReveal>
                
                {/* Quick Stats Card */}
                <ScrollReveal direction="right" delay={400}>
                  <GlassCard className="p-6 h-full">
                    <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      Your Progress
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-xl bg-primary/10">
                        <div className="text-3xl font-heading font-bold text-primary">
                          <ScrollCounter end={totalFavorites} />
                        </div>
                        <div className="text-sm text-muted-foreground">Favorites</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-secondary/10">
                        <div className="text-3xl font-heading font-bold text-secondary">
                          <ScrollCounter end={35} suffix="+" />
                        </div>
                        <div className="text-sm text-muted-foreground">Seasons</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-accent/10">
                        <div className="text-3xl font-heading font-bold text-accent">
                          <ScrollCounter end={750} suffix="+" />
                        </div>
                        <div className="text-sm text-muted-foreground">Episodes</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-muted">
                        <div className="text-3xl font-heading font-bold">
                          <ScrollCounter end={100} suffix="+" />
                        </div>
                        <div className="text-sm text-muted-foreground">Characters</div>
                      </div>
                    </div>
                  </GlassCard>
                </ScrollReveal>
              </div>
            </div>
          </section>


          {/* Testimonials */}
          <TestimonialSection />

          {/* Favorites CTA */}
          {totalFavorites > 0 && (
            <section className="py-12 px-4">
              <ScrollReveal direction="scale">
                <div className="container mx-auto max-w-2xl">
                  <GlassCard className="p-8 text-center" glowColor="accent">
                    <Heart className="w-16 h-16 text-accent mx-auto mb-4 animate-pulse" />
                    <h2 className="text-3xl font-heading font-bold mb-2">
                      You have <span className="text-accent">{totalFavorites}</span> favorite{totalFavorites > 1 ? "s" : ""}!
                    </h2>
                    <p className="text-muted-foreground font-body mb-6">
                      Check out your saved characters, episodes, and locations
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading rounded-full px-8"
                    >
                      <Link to="/favorites">
                        View Favorites
                        <Heart className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </GlassCard>
                </div>
              </ScrollReveal>
            </section>
          )}

          {/* Interactive Footer */}
          <InteractiveFooter />
        </PageTransition>
        
        <ScrollToTop />
      </div>
    </>
  );
}
