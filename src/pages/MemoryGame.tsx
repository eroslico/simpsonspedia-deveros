import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  Trophy,
  Clock,
  Zap,
  Play,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Card {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CHARACTERS = [
  { emoji: "👨", name: "Homer" },
  { emoji: "👩", name: "Marge" },
  { emoji: "👦", name: "Bart" },
  { emoji: "👧", name: "Lisa" },
  { emoji: "👶", name: "Maggie" },
  { emoji: "👴", name: "Grandpa" },
  { emoji: "🤡", name: "Krusty" },
  { emoji: "😈", name: "Mr. Burns" },
];

const DIFFICULTY = {
  easy: { pairs: 4, name: "Easy", time: 60 },
  medium: { pairs: 6, name: "Medium", time: 90 },
  hard: { pairs: 8, name: "Hard", time: 120 },
};

type Difficulty = keyof typeof DIFFICULTY;

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameState, setGameState] = useState<"menu" | "playing" | "won">("menu");
  const [timeLeft, setTimeLeft] = useState(0);
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>(() => {
    const saved = localStorage.getItem("simpsonspedia-memory-scores");
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });

  const initializeGame = useCallback(() => {
    const numPairs = DIFFICULTY[difficulty].pairs;
    const selectedChars = CHARACTERS.slice(0, numPairs);
    
    const cardPairs = selectedChars.flatMap((char, index) => [
      { id: index * 2, ...char, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, ...char, isFlipped: false, isMatched: false },
    ]);

    // Shuffle cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimeLeft(DIFFICULTY[difficulty].time);
    setGameState("playing");
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("menu");
          toast.error("Time's up! Try again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Check for win
  useEffect(() => {
    if (gameState === "playing" && matches === DIFFICULTY[difficulty].pairs) {
      setGameState("won");
      
      // Calculate score (lower moves = higher score)
      const score = Math.max(1000 - moves * 10 + timeLeft * 5, 100);
      
      if (score > bestScores[difficulty]) {
        const newScores = { ...bestScores, [difficulty]: score };
        setBestScores(newScores);
        localStorage.setItem("simpsonspedia-memory-scores", JSON.stringify(newScores));
        toast.success("🎉 New high score!");
      }
    }
  }, [matches, difficulty, gameState, moves, timeLeft, bestScores]);

  const handleCardClick = (cardId: number) => {
    if (gameState !== "playing") return;
    if (flippedCards.length >= 2) return;
    
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      
      const [first, second] = newFlipped;
      const firstCard = newCards.find((c) => c.id === first);
      const secondCard = newCards.find((c) => c.id === second);

      if (firstCard?.name === secondCard?.name) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatches((m) => m + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Memory Game"
            subtitle="Match the Simpsons characters!"
            icon="🧠"
          />

          {gameState === "menu" && (
            <div className="max-w-md mx-auto">
              <div className="bg-card rounded-3xl p-8 border-4 border-primary shadow-xl text-center">
                <span className="text-7xl mb-6 block animate-bounce">🎴</span>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Select Difficulty
                </h2>

                <div className="space-y-3 mb-8">
                  {(Object.keys(DIFFICULTY) as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 transition-all font-heading",
                        difficulty === diff
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span>{DIFFICULTY[diff].name}</span>
                        <span className="text-sm text-muted-foreground">
                          {DIFFICULTY[diff].pairs} pairs • {DIFFICULTY[diff].time}s
                        </span>
                      </div>
                      {bestScores[diff] > 0 && (
                        <div className="text-xs text-primary mt-1 flex items-center justify-center gap-1">
                          <Trophy className="w-3 h-3" />
                          Best: {bestScores[diff]} pts
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={initializeGame}
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full h-14"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
              </div>
            </div>
          )}

          {gameState === "playing" && (
            <div className="max-w-2xl mx-auto">
              {/* Stats Bar */}
              <div className="flex items-center justify-between mb-6 bg-card rounded-xl p-4 border-2 border-border">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="font-heading">Moves: {moves}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-secondary" />
                  <span className="font-heading">Matches: {matches}/{DIFFICULTY[difficulty].pairs}</span>
                </div>
                <div className={cn(
                  "flex items-center gap-2",
                  timeLeft <= 10 && "text-destructive animate-pulse"
                )}>
                  <Clock className="w-5 h-5" />
                  <span className="font-heading">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Game Board */}
              <div className={cn(
                "grid gap-3",
                difficulty === "easy" && "grid-cols-4",
                difficulty === "medium" && "grid-cols-4",
                difficulty === "hard" && "grid-cols-4"
              )}>
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isFlipped || card.isMatched}
                    className={cn(
                      "aspect-square rounded-2xl border-4 transition-all duration-300 transform",
                      "flex items-center justify-center text-4xl md:text-5xl",
                      card.isMatched && "bg-simpsons-green/20 border-simpsons-green scale-95",
                      card.isFlipped && !card.isMatched && "bg-primary/20 border-primary",
                      !card.isFlipped && !card.isMatched && "bg-card border-border hover:border-primary hover:scale-105 cursor-pointer"
                    )}
                    style={{
                      transform: card.isFlipped || card.isMatched ? "rotateY(180deg)" : "rotateY(0)",
                    }}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <span className="animate-bounce-in">{card.emoji}</span>
                    ) : (
                      <span className="text-3xl">🍩</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Quit Button */}
              <div className="text-center mt-6">
                <Button
                  onClick={() => setGameState("menu")}
                  variant="outline"
                  className="font-heading rounded-full"
                >
                  Quit Game
                </Button>
              </div>
            </div>
          )}

          {gameState === "won" && (
            <div className="max-w-md mx-auto">
              <div className="bg-card rounded-3xl p-8 border-4 border-primary shadow-xl text-center animate-bounce-in">
                <span className="text-7xl mb-4 block">🎉</span>
                <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                  You Won!
                </h2>
                <p className="text-muted-foreground font-body mb-6">
                  Excellent memory, just like an elephant!
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-muted rounded-xl p-3">
                    <p className="text-2xl font-heading font-bold text-primary">{moves}</p>
                    <p className="text-xs text-muted-foreground">Moves</p>
                  </div>
                  <div className="bg-muted rounded-xl p-3">
                    <p className="text-2xl font-heading font-bold text-secondary">{formatTime(timeLeft)}</p>
                    <p className="text-xs text-muted-foreground">Time Left</p>
                  </div>
                  <div className="bg-muted rounded-xl p-3">
                    <p className="text-2xl font-heading font-bold text-accent">
                      {Math.max(1000 - moves * 10 + timeLeft * 5, 100)}
                    </p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={initializeGame}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setGameState("menu")}
                    variant="outline"
                    className="font-heading rounded-full"
                  >
                    Change Difficulty
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

