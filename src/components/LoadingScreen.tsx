import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

const LOADING_MESSAGES = [
  "Loading Springfield...",
  "Eating donuts...",
  "Avoiding work at the plant...",
  "Practicing saxophone...",
  "Writing on the chalkboard...",
  "Watching Itchy & Scratchy...",
  "Ordering a Duff...",
  "Consulting with Mr. Burns...",
];

export function LoadingScreen({ message, className }: LoadingScreenProps) {
  const randomMessage = message || LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background",
      className
    )}>
      {/* Animated Donut */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-simpsons-pink to-pink-400 animate-spin-slow shadow-xl">
          <div className="absolute inset-4 rounded-full bg-background" />
        </div>
        
        {/* Sprinkles */}
        <div className="absolute top-2 left-1/2 w-2 h-4 bg-primary rounded-full -rotate-12 animate-pulse" />
        <div className="absolute top-4 right-4 w-2 h-4 bg-simpsons-green rounded-full rotate-45 animate-pulse" style={{ animationDelay: "0.1s" }} />
        <div className="absolute bottom-4 right-8 w-2 h-4 bg-simpsons-blue rounded-full -rotate-30 animate-pulse" style={{ animationDelay: "0.2s" }} />
        <div className="absolute bottom-8 left-4 w-2 h-4 bg-simpsons-orange rounded-full rotate-12 animate-pulse" style={{ animationDelay: "0.3s" }} />
        <div className="absolute top-8 left-2 w-2 h-4 bg-accent rounded-full rotate-60 animate-pulse" style={{ animationDelay: "0.4s" }} />
      </div>

      {/* Loading Text */}
      <p className="text-xl font-heading font-bold text-foreground animate-pulse">
        {randomMessage}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// Mini loading spinner for inline use
export function MiniLoader({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

