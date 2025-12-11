import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedDonut } from "./AnimatedSVG";

interface UltraLoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export function UltraLoadingScreen({ onComplete, minDuration = 2500 }: UltraLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [isComplete, setIsComplete] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  const loadingMessages = [
    "Initializing...",
    "Loading donuts...",
    "Waking up Homer...",
    "Tuning into Channel 6...",
    "Opening Kwik-E-Mart...",
    "Preparing Springfield...",
    "Almost there...",
    "D'oh! Just kidding...",
    "Welcome to Springfield!",
  ];

  useEffect(() => {
    // Check if we've shown the loading screen recently
    const lastShown = sessionStorage.getItem("loading-shown");
    if (lastShown) {
      setShouldShow(false);
      onComplete?.();
      return;
    }

    const startTime = Date.now();
    let frame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      
      setProgress(newProgress);
      
      // Update loading text based on progress
      const messageIndex = Math.min(
        Math.floor((newProgress / 100) * loadingMessages.length),
        loadingMessages.length - 1
      );
      setLoadingText(loadingMessages[messageIndex]);

      if (newProgress < 100) {
        frame = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        sessionStorage.setItem("loading-shown", "true");
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [minDuration, onComplete]);

  if (!shouldShow) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[99999] flex flex-col items-center justify-center",
        "bg-gradient-to-br from-primary via-primary/90 to-simpsons-orange",
        "transition-all duration-500",
        isComplete && "opacity-0 pointer-events-none"
      )}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating donuts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + i * 0.3}s`,
              opacity: 0.3,
            }}
          >
            <span className="text-4xl">🍩</span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Animated donut logo */}
        <div className="mb-8 animate-bounce">
          <AnimatedDonut size={120} />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground mb-4 text-shadow-md">
          Simpsonspedia
        </h1>

        {/* Loading text */}
        <p className="text-lg text-primary-foreground/80 mb-8 font-body h-6">
          {loadingText}
        </p>

        {/* Progress bar container */}
        <div className="w-64 md:w-80 mx-auto">
          {/* Progress bar background */}
          <div className="h-4 bg-primary-foreground/20 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Progress bar fill */}
            <div
              className="h-full bg-gradient-to-r from-accent via-secondary to-accent rounded-full transition-all duration-100 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Progress percentage */}
          <div className="mt-2 text-sm text-primary-foreground/60 font-mono">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Fun facts while loading */}
        <div className="mt-8 max-w-md mx-auto px-4">
          <p className="text-sm text-primary-foreground/60 italic">
            {progress < 30 && "Did you know? The Simpsons is the longest-running American animated series."}
            {progress >= 30 && progress < 60 && "Fun fact: Homer's 'D'oh!' is now in the Oxford English Dictionary."}
            {progress >= 60 && progress < 90 && "Springfield exists in every US state except... Springfield!"}
            {progress >= 90 && "Get ready to explore the world of The Simpsons!"}
          </p>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}

