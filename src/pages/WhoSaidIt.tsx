import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle,
  Trophy,
  Zap,
  RotateCcw,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface QuoteQuestion {
  quote: string;
  correctAnswer: string;
  options: string[];
}

const QUOTES: QuoteQuestion[] = [
  {
    quote: "D'oh!",
    correctAnswer: "Homer Simpson",
    options: ["Homer Simpson", "Bart Simpson", "Moe Szyslak", "Barney Gumble"]
  },
  {
    quote: "Eat my shorts!",
    correctAnswer: "Bart Simpson",
    options: ["Homer Simpson", "Bart Simpson", "Nelson Muntz", "Milhouse Van Houten"]
  },
  {
    quote: "Excellent...",
    correctAnswer: "Mr. Burns",
    options: ["Mr. Burns", "Smithers", "Principal Skinner", "Sideshow Bob"]
  },
  {
    quote: "Ha-ha!",
    correctAnswer: "Nelson Muntz",
    options: ["Bart Simpson", "Nelson Muntz", "Jimbo Jones", "Kearney"]
  },
  {
    quote: "Hi-diddly-ho, neighborino!",
    correctAnswer: "Ned Flanders",
    options: ["Homer Simpson", "Ned Flanders", "Reverend Lovejoy", "Lenny Leonard"]
  },
  {
    quote: "Don't have a cow, man!",
    correctAnswer: "Bart Simpson",
    options: ["Homer Simpson", "Bart Simpson", "Lisa Simpson", "Milhouse Van Houten"]
  },
  {
    quote: "Me fail English? That's unpossible!",
    correctAnswer: "Ralph Wiggum",
    options: ["Bart Simpson", "Ralph Wiggum", "Nelson Muntz", "Milhouse Van Houten"]
  },
  {
    quote: "I'm not a nerd. Nerds are smart.",
    correctAnswer: "Milhouse Van Houten",
    options: ["Bart Simpson", "Martin Prince", "Milhouse Van Houten", "Database"]
  },
  {
    quote: "Worst. Episode. Ever.",
    correctAnswer: "Comic Book Guy",
    options: ["Homer Simpson", "Bart Simpson", "Comic Book Guy", "Professor Frink"]
  },
  {
    quote: "Thank you, come again!",
    correctAnswer: "Apu Nahasapeemapetilon",
    options: ["Moe Szyslak", "Apu Nahasapeemapetilon", "Luigi Risotto", "Cletus"]
  },
  {
    quote: "Release the hounds.",
    correctAnswer: "Mr. Burns",
    options: ["Mr. Burns", "Chief Wiggum", "Mayor Quimby", "Fat Tony"]
  },
  {
    quote: "Ay, caramba!",
    correctAnswer: "Bart Simpson",
    options: ["Homer Simpson", "Bart Simpson", "Bumblebee Man", "Dr. Nick"]
  },
  {
    quote: "I bent my wookie.",
    correctAnswer: "Ralph Wiggum",
    options: ["Bart Simpson", "Ralph Wiggum", "Milhouse Van Houten", "Rod Flanders"]
  },
  {
    quote: "Bake him away, toys.",
    correctAnswer: "Chief Wiggum",
    options: ["Chief Wiggum", "Lou", "Eddie", "Snake Jailbird"]
  },
  {
    quote: "Everything's coming up Milhouse!",
    correctAnswer: "Milhouse Van Houten",
    options: ["Bart Simpson", "Milhouse Van Houten", "Kirk Van Houten", "Nelson Muntz"]
  }
];

export default function WhoSaidIt() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questions, setQuestions] = useState<QuoteQuestion[]>([]);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("simpsonspedia-whosaid-highscore") || "0");
  });

  const initGame = useCallback(() => {
    const shuffled = [...QUOTES].sort(() => Math.random() - 0.5).slice(0, 10);
    shuffled.forEach(q => {
      q.options = [...q.options].sort(() => Math.random() - 0.5);
    });
    setQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      const points = 100 + streak * 25;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      toast.success(`+${points} points!`);
    } else {
      setStreak(0);
      toast.error("Wrong answer!");
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= questions.length) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("simpsonspedia-whosaid-highscore", score.toString());
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  if (questions.length === 0) return null;

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Confetti isActive={showConfetti} />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Who Said It?"
            subtitle="Guess which character said the famous quote!"
            icon="🗣️"
          />

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-heading font-bold text-primary">{score}</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div className="text-center">
              <Zap className={cn(
                "w-6 h-6 mx-auto",
                streak > 0 ? "text-simpsons-orange" : "text-muted-foreground"
              )} />
              <p className="text-lg font-heading font-bold text-foreground">{streak}</p>
              <p className="text-sm text-muted-foreground">Streak</p>
            </div>
            <div className="text-center">
              <Trophy className="w-6 h-6 text-primary mx-auto" />
              <p className="text-lg font-heading font-bold text-foreground">{highScore}</p>
              <p className="text-sm text-muted-foreground">Best</p>
            </div>
          </div>

          {!gameOver ? (
            <div className="max-w-xl mx-auto">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-heading text-muted-foreground">
                    Question {currentQuestion + 1}/{questions.length}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Quote Card */}
              <div className="bg-card rounded-3xl p-8 border-4 border-primary shadow-xl mb-6">
                <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                <p className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center">
                  "{question.quote}"
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((option) => {
                  const isCorrect = option === question.correctAnswer;
                  const isSelected = option === selectedAnswer;
                  
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={cn(
                        "p-4 rounded-xl border-2 font-heading text-sm md:text-base transition-all",
                        showResult
                          ? isCorrect
                            ? "bg-simpsons-green/20 border-simpsons-green text-simpsons-green"
                            : isSelected
                              ? "bg-destructive/20 border-destructive text-destructive"
                              : "bg-muted border-border text-muted-foreground"
                          : "bg-card border-border hover:border-primary hover:bg-primary/10"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              {showResult && (
                <div className="text-center mt-6">
                  <Button
                    onClick={nextQuestion}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full px-8"
                  >
                    {currentQuestion + 1 >= questions.length ? "See Results" : "Next Question"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-card rounded-3xl p-8 border-4 border-primary shadow-xl animate-bounce-in">
                <span className="text-6xl mb-4 block">
                  {score >= 800 ? "🏆" : score >= 500 ? "🌟" : score >= 300 ? "👍" : "😅"}
                </span>
                <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Game Over!
                </h2>
                <p className="text-4xl font-heading font-bold text-primary mb-4">
                  {score} points
                </p>
                
                {score > highScore - score && score === highScore && (
                  <p className="text-simpsons-green font-heading mb-4">
                    🎉 New High Score!
                  </p>
                )}

                <p className="text-muted-foreground font-body mb-6">
                  {score >= 800 ? "You're a true Simpsons expert!" :
                   score >= 500 ? "Great job! You know your quotes!" :
                   score >= 300 ? "Not bad! Keep watching!" :
                   "Time to rewatch some episodes!"}
                </p>

                <Button
                  onClick={initGame}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

