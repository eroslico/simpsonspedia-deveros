import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const COUCH_GAGS = [
  {
    id: 1,
    quote: "D'oh!",
    character: "Homer Simpson",
    emoji: "🍩",
    animation: "animate-bounce",
  },
  {
    id: 2,
    quote: "Eat my shorts!",
    character: "Bart Simpson",
    emoji: "🛹",
    animation: "animate-wiggle",
  },
  {
    id: 3,
    quote: "If anyone wants me, I'll be in my room.",
    character: "Lisa Simpson",
    emoji: "🎷",
    animation: "animate-float",
  },
  {
    id: 4,
    quote: "Mmm... donuts...",
    character: "Homer Simpson",
    emoji: "🍩",
    animation: "animate-pulse",
  },
  {
    id: 5,
    quote: "¡Ay, caramba!",
    character: "Bart Simpson",
    emoji: "😱",
    animation: "animate-bounce",
  },
  {
    id: 6,
    quote: "Excellent...",
    character: "Mr. Burns",
    emoji: "😈",
    animation: "animate-pulse",
  },
  {
    id: 7,
    quote: "Hi-diddly-ho, neighborino!",
    character: "Ned Flanders",
    emoji: "👋",
    animation: "animate-wiggle",
  },
  {
    id: 8,
    quote: "Ha ha!",
    character: "Nelson Muntz",
    emoji: "👆",
    animation: "animate-bounce",
  },
  {
    id: 9,
    quote: "Don't have a cow, man!",
    character: "Bart Simpson",
    emoji: "🐄",
    animation: "animate-float",
  },
  {
    id: 10,
    quote: "I'm Bart Simpson, who the hell are you?",
    character: "Bart Simpson",
    emoji: "😎",
    animation: "animate-bounce",
  },
  {
    id: 11,
    quote: "Why you little...!",
    character: "Homer Simpson",
    emoji: "😤",
    animation: "animate-wiggle",
  },
  {
    id: 12,
    quote: "Thank you, come again!",
    character: "Apu",
    emoji: "🏪",
    animation: "animate-pulse",
  },
  {
    id: 13,
    quote: "Worst. Episode. Ever.",
    character: "Comic Book Guy",
    emoji: "🤓",
    animation: "animate-bounce",
  },
  {
    id: 14,
    quote: "Release the hounds!",
    character: "Mr. Burns",
    emoji: "🐕",
    animation: "animate-wiggle",
  },
  {
    id: 15,
    quote: "I didn't do it!",
    character: "Bart Simpson",
    emoji: "🙅",
    animation: "animate-bounce",
  },
];

interface CouchGagProps {
  className?: string;
  showOnMount?: boolean;
}

export function CouchGag({ className, showOnMount = true }: CouchGagProps) {
  const [gag, setGag] = useState<typeof COUCH_GAGS[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showOnMount) {
      // Check if we should show the gag (once per session)
      const lastShown = sessionStorage.getItem("simpsonspedia-couch-gag-shown");
      if (!lastShown) {
        const randomGag = COUCH_GAGS[Math.floor(Math.random() * COUCH_GAGS.length)];
        setGag(randomGag);
        setIsVisible(true);
        sessionStorage.setItem("simpsonspedia-couch-gag-shown", "true");

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [showOnMount]);

  const dismiss = () => {
    setIsVisible(false);
  };

  if (!gag || !isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm animate-bounce-in cursor-pointer",
        className
      )}
      onClick={dismiss}
    >
      <div className="bg-card rounded-2xl p-4 border-4 border-primary shadow-2xl">
        <div className="flex items-start gap-3">
          <span className={cn("text-4xl", gag.animation)}>{gag.emoji}</span>
          <div className="flex-1">
            <p className="font-heading font-bold text-foreground text-lg italic">
              "{gag.quote}"
            </p>
            <p className="text-sm text-primary font-body mt-1">
              — {gag.character}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Click to dismiss
        </p>
      </div>
    </div>
  );
}

// Hook to get a random quote
export function useRandomQuote() {
  const [quote, setQuote] = useState<typeof COUCH_GAGS[0] | null>(null);

  const getNewQuote = () => {
    const randomGag = COUCH_GAGS[Math.floor(Math.random() * COUCH_GAGS.length)];
    setQuote(randomGag);
  };

  useEffect(() => {
    getNewQuote();
  }, []);

  return { quote, getNewQuote };
}

export { COUCH_GAGS };

