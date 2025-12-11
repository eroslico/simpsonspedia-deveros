import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Timer,
  Zap,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

const triviaQuestions: Question[] = [
  {
    id: 1,
    question: "What is Homer Simpson's middle name?",
    options: ["James", "Jay", "John", "Jeffrey"],
    correctAnswer: 1,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 2,
    question: "What is the name of the bar where Homer drinks?",
    options: ["Joe's Tavern", "Moe's Tavern", "The Drunken Clam", "Paddy's Pub"],
    correctAnswer: 1,
    category: "Locations",
    difficulty: "easy",
  },
  {
    id: 3,
    question: "What instrument does Lisa Simpson play?",
    options: ["Trumpet", "Violin", "Saxophone", "Piano"],
    correctAnswer: 2,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 4,
    question: "What is Bart Simpson's catchphrase?",
    options: ["D'oh!", "Ay caramba!", "Excellent!", "Ha ha!"],
    correctAnswer: 1,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 5,
    question: "What is the name of the Simpsons' neighbor?",
    options: ["Ned Flanders", "Apu Nahasapeemapetilon", "Moe Szyslak", "Chief Wiggum"],
    correctAnswer: 0,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 6,
    question: "Where does Homer work?",
    options: ["Kwik-E-Mart", "Springfield Elementary", "Springfield Nuclear Power Plant", "Krusty Burger"],
    correctAnswer: 2,
    category: "Locations",
    difficulty: "easy",
  },
  {
    id: 7,
    question: "What is the name of the clown on TV?",
    options: ["Sideshow Bob", "Krusty the Clown", "Sideshow Mel", "Mr. Teeny"],
    correctAnswer: 1,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 8,
    question: "What year did The Simpsons first air as a series?",
    options: ["1987", "1988", "1989", "1990"],
    correctAnswer: 2,
    category: "Show Facts",
    difficulty: "medium",
  },
  {
    id: 9,
    question: "What is Marge Simpson's maiden name?",
    options: ["Bouvier", "Van Houten", "Carlson", "Muntz"],
    correctAnswer: 0,
    category: "Characters",
    difficulty: "medium",
  },
  {
    id: 10,
    question: "What is the name of the Simpsons' dog?",
    options: ["Snowball", "Santa's Little Helper", "Laddie", "Rex"],
    correctAnswer: 1,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 11,
    question: "Who is the owner of the Springfield Nuclear Power Plant?",
    options: ["Homer Simpson", "Mr. Burns", "Waylon Smithers", "Lenny Leonard"],
    correctAnswer: 1,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 12,
    question: "What is the name of Bart's best friend?",
    options: ["Nelson Muntz", "Ralph Wiggum", "Milhouse Van Houten", "Martin Prince"],
    correctAnswer: 2,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 13,
    question: "What color is Marge's hair?",
    options: ["Yellow", "Blue", "Purple", "Green"],
    correctAnswer: 1,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 14,
    question: "What is Apu's last name?",
    options: ["Nahasapeemapetilon", "Szyslak", "Wiggum", "Lovejoy"],
    correctAnswer: 0,
    category: "Characters",
    difficulty: "medium",
  },
  {
    id: 15,
    question: "How many seasons does The Simpsons have (as of 2024)?",
    options: ["25+", "30+", "35+", "40+"],
    correctAnswer: 2,
    category: "Show Facts",
    difficulty: "medium",
  },
  {
    id: 16,
    question: "What is the name of the Simpsons' cat?",
    options: ["Snowball", "Whiskers", "Mittens", "Fluffy"],
    correctAnswer: 0,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 17,
    question: "What is Homer's favorite beer brand?",
    options: ["Budweiser", "Duff", "Fudd", "Springfield Lager"],
    correctAnswer: 1,
    category: "Show Facts",
    difficulty: "easy",
  },
  {
    id: 18,
    question: "Who shot Mr. Burns?",
    options: ["Homer Simpson", "Waylon Smithers", "Maggie Simpson", "Bart Simpson"],
    correctAnswer: 2,
    category: "Episodes",
    difficulty: "medium",
  },
  {
    id: 19,
    question: "What is the name of Bart's teacher?",
    options: ["Mrs. Krabappel", "Mrs. Hoover", "Miss Springfield", "Mrs. Skinner"],
    correctAnswer: 0,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 20,
    question: "What state is Springfield located in?",
    options: ["Oregon", "Ohio", "Illinois", "Never revealed"],
    correctAnswer: 3,
    category: "Show Facts",
    difficulty: "hard",
  },
  {
    id: 21,
    question: "What is Groundskeeper Willie's nationality?",
    options: ["Irish", "Scottish", "Welsh", "English"],
    correctAnswer: 1,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 22,
    question: "What is the name of the convenience store owner?",
    options: ["Apu", "Manjula", "Sanjay", "Raj"],
    correctAnswer: 0,
    category: "Characters",
    difficulty: "easy",
  },
  {
    id: 23,
    question: "How many children does Apu have?",
    options: ["4", "6", "8", "10"],
    correctAnswer: 2,
    category: "Characters",
    difficulty: "hard",
  },
  {
    id: 24,
    question: "What is Mr. Burns' first name?",
    options: ["Montgomery", "Charles", "Monty", "All of the above"],
    correctAnswer: 3,
    category: "Characters",
    difficulty: "hard",
  },
  {
    id: 25,
    question: "What is the name of the school bus driver?",
    options: ["Otto Mann", "Otto Van", "Otto Bus", "Otto Driver"],
    correctAnswer: 0,
    category: "Characters",
    difficulty: "medium",
  },
];

export default function Trivia() {
  const [gameState, setGameState] = useState<"start" | "playing" | "finished">("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("simpsonspedia-trivia-highscore");
    return saved ? parseInt(saved) : 0;
  });

  // Shuffle and select questions
  const startGame = useCallback(() => {
    const shuffled = [...triviaQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(15);
    setGameState("playing");
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== "playing" || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1); // Time's up
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, showResult, currentQuestionIndex]);

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      const points = currentQuestion.difficulty === "easy" ? 10 : 
                     currentQuestion.difficulty === "medium" ? 20 : 30;
      const bonusPoints = Math.floor(timeLeft / 3) * 5; // Time bonus
      const streakBonus = streak >= 3 ? 10 : 0; // Streak bonus
      
      setScore((prev) => prev + points + bonusPoints + streakBonus);
      setStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
      
      if (streak >= 2) {
        toast.success(`🔥 ${streak + 1} in a row!`);
      }
    } else {
      setStreak(0);
      if (answerIndex === -1) {
        toast.error("⏰ Time's up!");
      }
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(15);
      } else {
        // Game finished
        setGameState("finished");
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("simpsonspedia-trivia-highscore", score.toString());
          toast.success("🎉 New High Score!");
        }
      }
    }, 1500);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Simpsons Trivia"
            subtitle="Test your knowledge of The Simpsons universe!"
            icon="🧠"
          />

          {gameState === "start" && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-card rounded-3xl p-8 md:p-12 border-4 border-primary shadow-xl">
                <span className="text-8xl mb-6 block animate-bounce-in">🍩</span>
                <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                  Ready to Play?
                </h2>
                <p className="text-muted-foreground font-body mb-8">
                  Answer 10 questions about The Simpsons. <br />
                  Be quick - you only have 15 seconds per question!
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-muted rounded-xl p-4">
                    <Timer className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-heading text-foreground">15 sec/question</p>
                  </div>
                  <div className="bg-muted rounded-xl p-4">
                    <Zap className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <p className="text-sm font-heading text-foreground">Streak bonuses</p>
                  </div>
                  <div className="bg-muted rounded-xl p-4">
                    <Award className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm font-heading text-foreground">High score: {highScore}</p>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-xl h-16 px-12 rounded-full shadow-lg"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Game
                </Button>
              </div>
            </div>
          )}

          {gameState === "playing" && currentQuestion && (
            <div className="max-w-3xl mx-auto">
              {/* Progress and Score */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-heading text-muted-foreground">
                    Question {currentQuestionIndex + 1}/{questions.length}
                  </span>
                  {streak >= 3 && (
                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-heading animate-pulse">
                      🔥 {streak} streak!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-heading text-foreground">
                    Score: <span className="text-primary font-bold">{score}</span>
                  </span>
                </div>
              </div>

              {/* Timer Bar */}
              <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-1000 rounded-full",
                    timeLeft > 10 ? "bg-simpsons-green" :
                    timeLeft > 5 ? "bg-primary" : "bg-destructive"
                  )}
                  style={{ width: `${(timeLeft / 15) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="bg-card rounded-3xl p-6 md:p-8 border-4 border-border shadow-xl mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-heading",
                    currentQuestion.difficulty === "easy" ? "bg-simpsons-green/20 text-simpsons-green" :
                    currentQuestion.difficulty === "medium" ? "bg-primary/20 text-primary" :
                    "bg-destructive/20 text-destructive"
                  )}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-heading bg-muted text-muted-foreground">
                    {currentQuestion.category}
                  </span>
                  <span className={cn(
                    "ml-auto text-2xl font-heading font-bold",
                    timeLeft > 10 ? "text-simpsons-green" :
                    timeLeft > 5 ? "text-primary" : "text-destructive animate-pulse"
                  )}>
                    {timeLeft}s
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
                  {currentQuestion.question}
                </h2>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const showCorrect = showResult && isCorrect;
                    const showWrong = showResult && isSelected && !isCorrect;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showResult}
                        className={cn(
                          "w-full p-4 rounded-xl text-left font-body transition-all duration-300",
                          "border-2 hover:scale-[1.02]",
                          showCorrect && "bg-simpsons-green/20 border-simpsons-green text-simpsons-green",
                          showWrong && "bg-destructive/20 border-destructive text-destructive",
                          !showResult && "bg-muted hover:bg-muted/80 border-border hover:border-primary",
                          !showResult && isSelected && "border-primary bg-primary/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading shrink-0",
                            showCorrect && "bg-simpsons-green text-white",
                            showWrong && "bg-destructive text-white",
                            !showResult && "bg-background"
                          )}>
                            {showCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                             showWrong ? <XCircle className="w-5 h-5" /> :
                             String.fromCharCode(65 + index)}
                          </span>
                          <span className={cn(
                            "text-foreground",
                            (showCorrect || showWrong) && "font-medium"
                          )}>
                            {option}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {gameState === "finished" && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-card rounded-3xl p-8 md:p-12 border-4 border-primary shadow-xl">
                <span className="text-8xl mb-6 block animate-bounce-in">
                  {score >= 150 ? "🏆" : score >= 100 ? "🎉" : score >= 50 ? "👍" : "😅"}
                </span>
                <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                  {score >= 150 ? "Excellent!" : score >= 100 ? "Great Job!" : score >= 50 ? "Not Bad!" : "Keep Trying!"}
                </h2>
                <p className="text-muted-foreground font-body mb-6">
                  {score >= 150 ? "You're a true Simpsons expert!" : 
                   score >= 100 ? "You know your Simpsons!" :
                   score >= 50 ? "You're getting there!" :
                   "Watch more episodes and try again!"}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-4xl font-heading font-bold text-primary">{score}</p>
                    <p className="text-sm text-muted-foreground font-body">Final Score</p>
                  </div>
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-4xl font-heading font-bold text-secondary">{bestStreak}</p>
                    <p className="text-sm text-muted-foreground font-body">Best Streak</p>
                  </div>
                </div>

                {score > highScore && (
                  <div className="bg-primary/20 rounded-xl p-4 mb-6">
                    <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-heading font-bold text-primary">New High Score!</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setGameState("start")}
                    variant="outline"
                    size="lg"
                    className="font-heading rounded-full"
                  >
                    Back to Menu
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

