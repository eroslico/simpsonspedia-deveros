import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState(0);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeenIntro = sessionStorage.getItem("simpsonspedia-intro-seen");
    if (hasSeenIntro) {
      onComplete();
      return;
    }

    const phases = [
      { duration: 1000 }, // Fade in
      { duration: 2000 }, // Logo animation
      { duration: 1500 }, // Text reveal
      { duration: 1000 }, // Fade out
    ];

    let currentPhase = 0;
    const advancePhase = () => {
      if (skip) return;
      
      currentPhase++;
      setPhase(currentPhase);

      if (currentPhase < phases.length) {
        setTimeout(advancePhase, phases[currentPhase].duration);
      } else {
        sessionStorage.setItem("simpsonspedia-intro-seen", "true");
        onComplete();
      }
    };

    setTimeout(advancePhase, phases[0].duration);
  }, [onComplete, skip]);

  const handleSkip = () => {
    setSkip(true);
    sessionStorage.setItem("simpsonspedia-intro-seen", "true");
    onComplete();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] bg-black flex items-center justify-center transition-opacity duration-1000",
        phase >= 4 && "opacity-0 pointer-events-none"
      )}
    >
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-white/50 hover:text-white text-sm font-heading transition-colors"
      >
        Skip Intro →
      </button>

      {/* TV static effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-noise animate-pulse" />
      </div>

      {/* Main content */}
      <div className="text-center relative">
        {/* Donut logo */}
        <div
          className={cn(
            "text-[120px] md:text-[200px] transition-all duration-1000",
            phase >= 1 ? "scale-100 opacity-100" : "scale-150 opacity-0",
            phase >= 2 && "animate-bounce"
          )}
        >
          🍩
        </div>

        {/* Title */}
        <h1
          className={cn(
            "text-4xl md:text-7xl font-heading font-bold text-primary transition-all duration-700",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          Simpsonspedia
        </h1>

        {/* Subtitle */}
        <p
          className={cn(
            "text-lg md:text-2xl text-white/70 font-body mt-4 transition-all duration-700",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
        >
          The Ultimate Simpsons Encyclopedia
        </p>

        {/* Loading bar */}
        <div
          className={cn(
            "w-64 h-1 bg-white/20 rounded-full mx-auto mt-8 overflow-hidden transition-opacity duration-500",
            phase >= 2 ? "opacity-100" : "opacity-0"
          )}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-2000 ease-out"
            style={{ width: phase >= 3 ? "100%" : "0%" }}
          />
        </div>
      </div>

      {/* Animated clouds/background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute text-6xl transition-all duration-1000",
              phase >= 1 ? "opacity-10" : "opacity-0"
            )}
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            ☁️
          </div>
        ))}
      </div>
    </div>
  );
}

