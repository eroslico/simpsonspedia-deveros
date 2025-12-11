import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { 
  Play,
  SkipForward,
  Trophy,
  Lightbulb,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Episode {
  title: string;
  hints: string[];
  season: number;
  episode: number;
}

const EPISODES: Episode[] = [
  {
    title: "Simpsons Roasting on an Open Fire",
    hints: [
      "This is the very first episode",
      "Homer gets a job as a mall Santa",
      "The family adopts a dog named Santa's Little Helper",
      "It's a Christmas special"
    ],
    season: 1,
    episode: 1
  },
  {
    title: "Bart the Genius",
    hints: [
      "Bart cheats on an intelligence test",
      "He gets sent to a school for gifted children",
      "Martin Prince appears for the first time",
      "Bart realizes he doesn't belong with the smart kids"
    ],
    season: 1,
    episode: 2
  },
  {
    title: "Cape Feare",
    hints: [
      "Sideshow Bob is released from prison",
      "The Simpsons enter witness protection",
      "They move to Terror Lake",
      "Famous scene with rakes"
    ],
    season: 5,
    episode: 2
  },
  {
    title: "Marge vs. the Monorail",
    hints: [
      "A con man comes to Springfield",
      "The town builds a monorail",
      "Leonard Nimoy guest stars",
      "Written by Conan O'Brien"
    ],
    season: 4,
    episode: 12
  },
  {
    title: "Homer's Enemy",
    hints: [
      "Frank Grimes is introduced",
      "He can't believe Homer's success",
      "Bart buys an abandoned factory",
      "One of the darkest episodes"
    ],
    season: 8,
    episode: 23
  },
  {
    title: "22 Short Films About Springfield",
    hints: [
      "Multiple short stories about different characters",
      "Steamed Hams segment",
      "Milhouse's parents argue",
      "Pulp Fiction parody with Wiggum"
    ],
    season: 7,
    episode: 21
  },
  {
    title: "Last Exit to Springfield",
    hints: [
      "Lisa needs braces",
      "Homer becomes union leader",
      "Mr. Burns tries to negotiate",
      "Dental plan! Lisa needs braces!"
    ],
    season: 4,
    episode: 17
  },
  {
    title: "Treehouse of Horror V",
    hints: [
      "The Shining parody",
      "Time travel with a toaster",
      "Groundskeeper Willie gets axed three times",
      "No TV and no beer make Homer something something"
    ],
    season: 6,
    episode: 6
  },
  {
    title: "Who Shot Mr. Burns?",
    hints: [
      "Two-part episode",
      "Mr. Burns blocks out the sun",
      "Everyone has a motive",
      "It was Maggie!"
    ],
    season: 6,
    episode: 25
  },
  {
    title: "Homer at the Bat",
    hints: [
      "The nuclear plant enters a softball league",
      "Mr. Burns hires professional baseball players",
      "Each ringer has a mishap",
      "Homer wins the game with his head"
    ],
    season: 3,
    episode: 17
  }
];

export default function GuessEpisode() {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [guess, setGuess] = useState("");
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("simpsonspedia-guess-highscore") || "0");
  });

  const startNewRound = useCallback(() => {
    const randomEpisode = EPISODES[Math.floor(Math.random() * EPISODES.length)];
    setCurrentEpisode(randomEpisode);
    setHintsRevealed(1);
    setGuess("");
    setGameState("playing");
    setShowAnswer(false);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const revealHint = () => {
    if (hintsRevealed < 4) {
      setHintsRevealed(prev => prev + 1);
    }
  };

  const calculatePoints = () => {
    // More points for fewer hints used
    const basePoints = (5 - hintsRevealed) * 100;
    const streakBonus = streak * 50;
    return basePoints + streakBonus;
  };

  const checkGuess = () => {
    if (!currentEpisode) return;
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedAnswer = currentEpisode.title.toLowerCase();
    
    // Check for partial match (at least 60% of words match)
    const guessWords = normalizedGuess.split(/\s+/);
    const answerWords = normalizedAnswer.split(/\s+/);
    const matchingWords = guessWords.filter(word => 
      answerWords.some(answerWord => answerWord.includes(word) || word.includes(answerWord))
    );
    
    const isCorrect = normalizedGuess === normalizedAnswer || 
                      matchingWords.length >= Math.ceil(answerWords.length * 0.6);

    if (isCorrect) {
      const points = calculatePoints();
      const newScore = score + points;
      const newStreak = streak + 1;
      
      setScore(newScore);
      setStreak(newStreak);
      setGameState("won");
      setShowConfetti(true);
      
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("simpsonspedia-guess-highscore", newScore.toString());
        toast.success("🏆 New high score!");
      }
      
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      toast.error("Not quite right! Try again or reveal another hint.");
    }
  };

  const giveUp = () => {
    setGameState("lost");
    setStreak(0);
    setShowAnswer(true);
  };

  if (!currentEpisode) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Confetti isActive={showConfetti} />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Guess the Episode"
            subtitle="Can you name the episode from the hints?"
            icon="🎬"
          />

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-heading font-bold text-primary">{score}</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-heading font-bold text-secondary">{streak}</p>
              <p className="text-sm text-muted-foreground">Streak</p>
            </div>
            <div className="text-center">
              <Trophy className="w-6 h-6 text-primary mx-auto" />
              <p className="text-lg font-heading font-bold text-foreground">{highScore}</p>
              <p className="text-sm text-muted-foreground">Best</p>
            </div>
          </div>

          {/* Game Card */}
          <div className="max-w-xl mx-auto">
            <div className="bg-card rounded-3xl p-6 md:p-8 border-4 border-primary shadow-xl">
              {/* Hints */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Hints ({hintsRevealed}/4)
                  </h3>
                  {hintsRevealed < 4 && gameState === "playing" && (
                    <Button
                      onClick={revealHint}
                      variant="outline"
                      size="sm"
                      className="font-heading rounded-full"
                    >
                      Reveal Hint (-100 pts)
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {currentEpisode.hints.slice(0, hintsRevealed).map((hint, i) => (
                    <div
                      key={i}
                      className="bg-muted rounded-xl p-3 animate-bounce-in"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <p className="font-body text-foreground">
                        <span className="font-heading text-primary mr-2">{i + 1}.</span>
                        {hint}
                      </p>
                    </div>
                  ))}
                  
                  {Array.from({ length: 4 - hintsRevealed }).map((_, i) => (
                    <div
                      key={`hidden-${i}`}
                      className="bg-muted/50 rounded-xl p-3 border-2 border-dashed border-border"
                    >
                      <p className="font-body text-muted-foreground flex items-center gap-2">
                        <EyeOff className="w-4 h-4" />
                        Hidden hint...
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Answer Input */}
              {gameState === "playing" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && checkGuess()}
                    placeholder="Type the episode name..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={checkGuess}
                      disabled={!guess.trim()}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Check Answer
                    </Button>
                    <Button
                      onClick={giveUp}
                      variant="outline"
                      className="font-heading rounded-full"
                    >
                      Give Up
                    </Button>
                  </div>
                </div>
              )}

              {/* Result */}
              {gameState !== "playing" && (
                <div className={cn(
                  "text-center py-6 rounded-xl",
                  gameState === "won" ? "bg-simpsons-green/20" : "bg-destructive/20"
                )}>
                  <p className="text-4xl mb-2">
                    {gameState === "won" ? "🎉" : "😢"}
                  </p>
                  <p className="text-xl font-heading font-bold text-foreground mb-2">
                    {gameState === "won" ? "Correct!" : "Better luck next time!"}
                  </p>
                  <p className="font-body text-foreground mb-1">
                    The answer was:
                  </p>
                  <p className="font-heading font-bold text-primary text-lg">
                    "{currentEpisode.title}"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Season {currentEpisode.season}, Episode {currentEpisode.episode}
                  </p>
                  
                  {gameState === "won" && (
                    <p className="mt-4 text-lg font-heading text-simpsons-green">
                      +{calculatePoints()} points!
                    </p>
                  )}
                  
                  <Button
                    onClick={startNewRound}
                    className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Next Episode
                  </Button>
                </div>
              )}
            </div>

            {/* Potential Points */}
            {gameState === "playing" && (
              <p className="text-center text-sm text-muted-foreground mt-4 font-body">
                Potential points: <span className="font-heading text-primary">{calculatePoints()}</span>
              </p>
            )}
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

