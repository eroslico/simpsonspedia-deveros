import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw,
  Trophy,
  HelpCircle,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const WORDS = [
  "HOMER", "MARGE", "BARTS", "LISAS", "BURNS",
  "FLANDERS", "KRUSTY", "CHIEF", "RALPH",
  "APLUS", "DONUT", "DUFFS", "COUCH", "CHOKE",
  "PRANK", "SKATE", "PLANT", "MAYOR", "NUKE"
];

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
];

type LetterStatus = "correct" | "present" | "absent" | "empty";

interface GuessLetter {
  letter: string;
  status: LetterStatus;
}

function getDailyWord(): string {
  const today = new Date();
  const start = new Date(2024, 0, 1);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return WORDS[diff % WORDS.length];
}

export default function Wordle() {
  const [targetWord] = useState(getDailyWord);
  const [guesses, setGuesses] = useState<GuessLetter[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [showConfetti, setShowConfetti] = useState(false);
  const [usedLetters, setUsedLetters] = useState<Record<string, LetterStatus>>({});
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("simpsonspedia-wordle-stats");
    return saved ? JSON.parse(saved) : { played: 0, won: 0, streak: 0, maxStreak: 0 };
  });

  const maxGuesses = 6;
  const wordLength = 5;

  const checkGuess = useCallback((guess: string): GuessLetter[] => {
    const result: GuessLetter[] = [];
    const targetLetters = targetWord.split("");
    const guessLetters = guess.split("");
    const usedIndices: number[] = [];

    // First pass: find correct letters
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        result[i] = { letter, status: "correct" };
        usedIndices.push(i);
      }
    });

    // Second pass: find present letters
    guessLetters.forEach((letter, i) => {
      if (result[i]) return;
      
      const targetIndex = targetLetters.findIndex((t, j) => 
        t === letter && !usedIndices.includes(j)
      );
      
      if (targetIndex !== -1) {
        result[i] = { letter, status: "present" };
        usedIndices.push(targetIndex);
      } else {
        result[i] = { letter, status: "absent" };
      }
    });

    return result;
  }, [targetWord]);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== wordLength) {
      toast.error("Word must be 5 letters!");
      return;
    }

    const result = checkGuess(currentGuess);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);

    // Update used letters
    const newUsedLetters = { ...usedLetters };
    result.forEach(({ letter, status }) => {
      if (!newUsedLetters[letter] || status === "correct") {
        newUsedLetters[letter] = status;
      } else if (status === "present" && newUsedLetters[letter] !== "correct") {
        newUsedLetters[letter] = status;
      }
    });
    setUsedLetters(newUsedLetters);

    // Check win/lose
    if (currentGuess === targetWord) {
      setGameState("won");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      const newStats = {
        ...stats,
        played: stats.played + 1,
        won: stats.won + 1,
        streak: stats.streak + 1,
        maxStreak: Math.max(stats.maxStreak, stats.streak + 1)
      };
      setStats(newStats);
      localStorage.setItem("simpsonspedia-wordle-stats", JSON.stringify(newStats));
      toast.success("🎉 Excellent!");
    } else if (newGuesses.length >= maxGuesses) {
      setGameState("lost");
      
      const newStats = {
        ...stats,
        played: stats.played + 1,
        streak: 0
      };
      setStats(newStats);
      localStorage.setItem("simpsonspedia-wordle-stats", JSON.stringify(newStats));
      toast.error(`The word was: ${targetWord}`);
    }

    setCurrentGuess("");
  }, [currentGuess, guesses, targetWord, checkGuess, usedLetters, stats]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== "playing") return;

    if (key === "ENTER") {
      submitGuess();
    } else if (key === "⌫" || key === "BACKSPACE") {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key.length === 1 && /[A-Z]/.test(key) && currentGuess.length < wordLength) {
      setCurrentGuess(prev => prev + key);
    }
  }, [gameState, currentGuess, submitGuess]);

  // Keyboard listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      handleKeyPress(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKeyPress]);

  const shareResult = async () => {
    const emojiGrid = guesses.map(guess =>
      guess.map(({ status }) =>
        status === "correct" ? "🟩" :
        status === "present" ? "🟨" : "⬛"
      ).join("")
    ).join("\n");

    const text = `Simpsonspedia Wordle\n${guesses.length}/${maxGuesses}\n\n${emojiGrid}`;
    
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess("");
    setGameState("playing");
    setUsedLetters({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Confetti isActive={showConfetti} />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Simpsons Wordle"
            subtitle="Guess the Simpsons-related word in 6 tries!"
            icon="📝"
          />

          {/* Stats */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="text-center">
              <p className="text-xl font-heading font-bold text-foreground">{stats.played}</p>
              <p className="text-xs text-muted-foreground">Played</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-heading font-bold text-foreground">
                {stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Win %</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-heading font-bold text-foreground">{stats.streak}</p>
              <p className="text-xs text-muted-foreground">Streak</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-heading font-bold text-foreground">{stats.maxStreak}</p>
              <p className="text-xs text-muted-foreground">Max</p>
            </div>
          </div>

          {/* Game Board */}
          <div className="max-w-sm mx-auto mb-6">
            <div className="grid gap-1">
              {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
                const guess = guesses[rowIndex];
                const isCurrentRow = rowIndex === guesses.length && gameState === "playing";
                
                return (
                  <div key={rowIndex} className="grid grid-cols-5 gap-1">
                    {Array.from({ length: wordLength }).map((_, colIndex) => {
                      const letter = guess?.[colIndex] || 
                        (isCurrentRow ? { letter: currentGuess[colIndex] || "", status: "empty" as LetterStatus } : { letter: "", status: "empty" as LetterStatus });
                      
                      return (
                        <div
                          key={colIndex}
                          className={cn(
                            "aspect-square flex items-center justify-center text-2xl font-heading font-bold rounded-lg border-2 transition-all",
                            letter.status === "correct" && "bg-simpsons-green border-simpsons-green text-white",
                            letter.status === "present" && "bg-primary border-primary text-primary-foreground",
                            letter.status === "absent" && "bg-muted border-muted text-muted-foreground",
                            letter.status === "empty" && letter.letter && "border-foreground bg-background",
                            letter.status === "empty" && !letter.letter && "border-border bg-background",
                            isCurrentRow && colIndex === currentGuess.length && "border-primary"
                          )}
                        >
                          {letter.letter}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keyboard */}
          <div className="max-w-lg mx-auto">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1 mb-1">
                {row.map((key) => {
                  const status = usedLetters[key];
                  const isWide = key === "ENTER" || key === "⌫";
                  
                  return (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      disabled={gameState !== "playing"}
                      className={cn(
                        "h-12 rounded-lg font-heading font-bold transition-all",
                        isWide ? "px-3 text-xs" : "w-8 md:w-10 text-sm",
                        status === "correct" && "bg-simpsons-green text-white",
                        status === "present" && "bg-primary text-primary-foreground",
                        status === "absent" && "bg-muted text-muted-foreground",
                        !status && "bg-card border-2 border-border hover:border-primary"
                      )}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Game Over */}
          {gameState !== "playing" && (
            <div className="max-w-sm mx-auto mt-8 text-center animate-bounce-in">
              <div className="bg-card rounded-2xl p-6 border-2 border-border">
                <p className="text-4xl mb-2">
                  {gameState === "won" ? "🎉" : "😢"}
                </p>
                <p className="font-heading font-bold text-foreground mb-4">
                  {gameState === "won" 
                    ? `You got it in ${guesses.length}!` 
                    : `The word was: ${targetWord}`}
                </p>
                
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={shareResult}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    className="font-heading rounded-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Practice
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Help */}
          <div className="max-w-sm mx-auto mt-8">
            <div className="bg-muted/50 rounded-xl p-4 text-sm">
              <p className="font-heading font-bold text-foreground mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                How to Play
              </p>
              <ul className="space-y-1 text-muted-foreground font-body">
                <li>• Guess the Simpsons-related word in 6 tries</li>
                <li>• <span className="text-simpsons-green">Green</span> = correct position</li>
                <li>• <span className="text-primary">Yellow</span> = wrong position</li>
                <li>• <span className="text-muted-foreground">Gray</span> = not in word</li>
              </ul>
            </div>
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

