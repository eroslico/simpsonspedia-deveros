import { useState, useEffect } from "react";
import { ScrollReveal } from "./ScrollAnimations";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "D'oh! This website knows more about me than I do!",
    author: "Homer Simpson",
    role: "Nuclear Safety Inspector",
    avatar: "👨‍🦲",
    rating: 5,
  },
  {
    quote: "Eat my shorts! Actually, this site is pretty cool.",
    author: "Bart Simpson",
    role: "Professional Troublemaker",
    avatar: "👦",
    rating: 5,
  },
  {
    quote: "Finally, a website that appreciates the saxophone.",
    author: "Lisa Simpson",
    role: "Future President",
    avatar: "👧",
    rating: 5,
  },
  {
    quote: "This site is almost as good as my blue hair dye.",
    author: "Marge Simpson",
    role: "Homemaker Extraordinaire",
    avatar: "👩",
    rating: 5,
  },
  {
    quote: "Excellent... This pleases me.",
    author: "Mr. Burns",
    role: "Springfield Nuclear Power Plant Owner",
    avatar: "👴",
    rating: 4,
  },
  {
    quote: "Ha-ha! Even I couldn't make fun of this site!",
    author: "Nelson Muntz",
    role: "School Bully",
    avatar: "😈",
    rating: 5,
  },
];

export function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex(prev => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      {/* Decorative quotes */}
      <div className="absolute top-20 left-10 text-primary/10 text-[200px] font-serif leading-none">
        "
      </div>
      <div className="absolute bottom-20 right-10 text-primary/10 text-[200px] font-serif leading-none rotate-180">
        "
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <ScrollReveal direction="up" className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-heading mb-4">
            What Springfield Says
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Fan <span className="text-primary">Reviews</span>
          </h2>
        </ScrollReveal>

        {/* Main testimonial */}
        <div className="relative">
          <ScrollReveal direction="scale">
            <GlassCard className="p-8 md:p-12 text-center">
              {/* Quote icon */}
              <Quote className="w-12 h-12 text-primary/30 mx-auto mb-6" />

              {/* Quote text */}
              <blockquote className="text-2xl md:text-3xl font-heading mb-8 min-h-[4rem]">
                "{testimonials[activeIndex].quote}"
              </blockquote>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "text-2xl transition-all duration-300",
                      i < testimonials[activeIndex].rating
                        ? "text-primary scale-110"
                        : "text-muted opacity-30"
                    )}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <span className="text-5xl">{testimonials[activeIndex].avatar}</span>
                <div className="text-left">
                  <div className="font-heading font-bold text-lg">
                    {testimonials[activeIndex].author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[activeIndex].role}
                  </div>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>

          {/* Navigation buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full bg-card border border-border shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full bg-card border border-border shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(i);
              }}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "bg-primary w-8"
                  : "bg-muted hover:bg-primary/50"
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail preview */}
        <div className="hidden md:flex justify-center gap-4 mt-12">
          {testimonials.map((testimonial, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(i);
              }}
              className={cn(
                "p-4 rounded-xl transition-all duration-300",
                i === activeIndex
                  ? "bg-primary/20 scale-110"
                  : "bg-card hover:bg-muted opacity-60 hover:opacity-100"
              )}
            >
              <span className="text-3xl">{testimonial.avatar}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

