import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface EasterEggProps {
  children: React.ReactNode;
  className?: string;
}

// Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", 
  "ArrowDown", "ArrowDown", 
  "ArrowLeft", "ArrowRight", 
  "ArrowLeft", "ArrowRight", 
  "KeyB", "KeyA"
];

export function EasterEgg({ children, className }: EasterEggProps) {
  const [activated, setActivated] = useState(false);
  const [showDonut, setShowDonut] = useState(false);
  const inputRef = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      inputRef.current = [...inputRef.current, e.code].slice(-10);
      
      if (inputRef.current.join(",") === KONAMI_CODE.join(",")) {
        setActivated(true);
        setShowDonut(true);
        
        // Play sound effect
        try {
          const audio = new Audio("https://www.myinstants.com/media/sounds/woohoo.mp3");
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch {}

        // Hide donut after animation
        setTimeout(() => setShowDonut(false), 3000);
        
        // Reset after some time
        setTimeout(() => {
          setActivated(false);
          inputRef.current = [];
        }, 10000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {children}
      
      {/* Floating donuts animation */}
      {showDonut && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-50px`,
                animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              🍩
            </span>
          ))}
        </div>
      )}

      {/* Rainbow mode when activated */}
      {activated && (
        <style>{`
          @keyframes fall {
            to {
              transform: translateY(110vh) rotate(720deg);
            }
          }
          
          @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
          }
          
          body {
            animation: rainbow 2s linear infinite;
          }
        `}</style>
      )}
    </div>
  );
}

// Click counter easter egg for the donut
export function DonutEasterEgg() {
  const [clicks, setClicks] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks === 10) {
      setShowMessage(true);
      try {
        const audio = new Audio("https://www.myinstants.com/media/sounds/doh.mp3");
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {}
      
      setTimeout(() => {
        setShowMessage(false);
        setClicks(0);
      }, 3000);
    }
  };

  return (
    <div className="relative inline-block">
      <span 
        onClick={handleClick}
        className="cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 inline-block"
        title="Click me!"
      >
        🍩
      </span>
      
      {showMessage && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-primary-foreground px-4 py-2 rounded-full font-heading text-sm shadow-lg animate-bounce-in">
          D'oh! 🍩
        </div>
      )}
    </div>
  );
}

