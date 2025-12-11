import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  RotateCcw, 
  Share2,
  ChevronRight,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: { text: string; scores: Record<string, number> }[];
}

interface Character {
  id: string;
  name: string;
  emoji: string;
  description: string;
  traits: string[];
  quote: string;
  color: string;
}

const characters: Character[] = [
  {
    id: "homer",
    name: "Homer Simpson",
    emoji: "🍩",
    description: "You're laid-back, love food, and enjoy the simple pleasures in life. You might not be the sharpest tool in the shed, but your heart is in the right place!",
    traits: ["Lazy", "Lovable", "Food lover", "Family man"],
    quote: "D'oh!",
    color: "bg-primary",
  },
  {
    id: "lisa",
    name: "Lisa Simpson",
    emoji: "🎷",
    description: "You're intelligent, passionate about causes, and always striving for excellence. You see the world's problems and want to fix them!",
    traits: ["Intelligent", "Passionate", "Artistic", "Idealistic"],
    quote: "If anyone wants me, I'll be in my room.",
    color: "bg-secondary",
  },
  {
    id: "bart",
    name: "Bart Simpson",
    emoji: "🛹",
    description: "You're a rebel at heart! You love pranks, adventure, and pushing boundaries. Rules are meant to be broken, right?",
    traits: ["Rebellious", "Creative", "Adventurous", "Troublemaker"],
    quote: "Eat my shorts!",
    color: "bg-simpsons-orange",
  },
  {
    id: "marge",
    name: "Marge Simpson",
    emoji: "💙",
    description: "You're the glue that holds everything together. Patient, caring, and always putting others first. The world needs more people like you!",
    traits: ["Caring", "Patient", "Organized", "Supportive"],
    quote: "Hmmmm...",
    color: "bg-simpsons-blue",
  },
  {
    id: "burns",
    name: "Mr. Burns",
    emoji: "💰",
    description: "You're ambitious and know what you want. Some might call you ruthless, but you prefer 'determined'. Success is your middle name!",
    traits: ["Ambitious", "Strategic", "Wealthy", "Powerful"],
    quote: "Excellent...",
    color: "bg-simpsons-green",
  },
  {
    id: "flanders",
    name: "Ned Flanders",
    emoji: "✝️",
    description: "You're the nicest person anyone could meet! Always positive, helpful, and ready with a neighborly smile. You see the good in everyone!",
    traits: ["Kind", "Religious", "Optimistic", "Helpful"],
    quote: "Hi-diddly-ho!",
    color: "bg-accent",
  },
];

const questions: Question[] = [
  {
    id: 1,
    question: "It's Saturday morning. What are you doing?",
    options: [
      { text: "Sleeping in and watching TV", scores: { homer: 3, bart: 1 } },
      { text: "Reading a book or practicing an instrument", scores: { lisa: 3 } },
      { text: "Helping around the house", scores: { marge: 3, flanders: 2 } },
      { text: "Planning world domination... I mean, my schedule", scores: { burns: 3 } },
      { text: "Going to church then helping neighbors", scores: { flanders: 3 } },
      { text: "Skateboarding or causing mischief", scores: { bart: 3 } },
    ],
  },
  {
    id: 2,
    question: "Your favorite food is...",
    options: [
      { text: "Donuts and beer", scores: { homer: 3 } },
      { text: "Something healthy and ethical", scores: { lisa: 3 } },
      { text: "Whatever I can grab quickly", scores: { bart: 2, homer: 1 } },
      { text: "A home-cooked meal", scores: { marge: 3, flanders: 1 } },
      { text: "The finest cuisine money can buy", scores: { burns: 3 } },
      { text: "Hot cocoa and apple pie", scores: { flanders: 3 } },
    ],
  },
  {
    id: 3,
    question: "How do you handle problems?",
    options: [
      { text: "Ignore them until they go away", scores: { homer: 3 } },
      { text: "Research and find the best solution", scores: { lisa: 3 } },
      { text: "Blame someone else", scores: { bart: 3 } },
      { text: "Take care of it myself, as always", scores: { marge: 3 } },
      { text: "Pay someone to handle it", scores: { burns: 3 } },
      { text: "Pray about it and stay positive", scores: { flanders: 3 } },
    ],
  },
  {
    id: 4,
    question: "What's your biggest strength?",
    options: [
      { text: "My ability to relax", scores: { homer: 3 } },
      { text: "My intelligence", scores: { lisa: 3, burns: 1 } },
      { text: "My creativity", scores: { bart: 3, lisa: 1 } },
      { text: "My patience", scores: { marge: 3, flanders: 1 } },
      { text: "My ambition", scores: { burns: 3 } },
      { text: "My kindness", scores: { flanders: 3, marge: 1 } },
    ],
  },
  {
    id: 5,
    question: "How do you feel about rules?",
    options: [
      { text: "What rules?", scores: { homer: 2, bart: 2 } },
      { text: "They exist for good reasons", scores: { lisa: 2, marge: 2 } },
      { text: "Made to be broken!", scores: { bart: 3 } },
      { text: "I follow them... mostly", scores: { marge: 3 } },
      { text: "I make the rules", scores: { burns: 3 } },
      { text: "Rules are important for society", scores: { flanders: 3, lisa: 1 } },
    ],
  },
  {
    id: 6,
    question: "Your dream vacation would be...",
    options: [
      { text: "A couch and unlimited TV", scores: { homer: 3 } },
      { text: "A cultural trip to museums and historical sites", scores: { lisa: 3 } },
      { text: "An adventure park with extreme sports", scores: { bart: 3 } },
      { text: "A relaxing family trip", scores: { marge: 3, flanders: 1 } },
      { text: "A private island with servants", scores: { burns: 3 } },
      { text: "A mission trip helping others", scores: { flanders: 3 } },
    ],
  },
  {
    id: 7,
    question: "What do you value most?",
    options: [
      { text: "Comfort and happiness", scores: { homer: 3 } },
      { text: "Knowledge and justice", scores: { lisa: 3 } },
      { text: "Freedom and fun", scores: { bart: 3 } },
      { text: "Family and stability", scores: { marge: 3 } },
      { text: "Power and success", scores: { burns: 3 } },
      { text: "Faith and community", scores: { flanders: 3 } },
    ],
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Character | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    const option = questions[currentQuestion].options[optionIndex];
    const newScores = { ...scores };
    
    Object.entries(option.scores).forEach(([char, score]) => {
      newScores[char] = (newScores[char] || 0) + score;
    });
    
    setScores(newScores);

    // Delay before moving to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Calculate result
        const maxScore = Math.max(...Object.values(newScores));
        const winnerId = Object.entries(newScores).find(([_, s]) => s === maxScore)?.[0];
        const winner = characters.find((c) => c.id === winnerId) || characters[0];
        setResult(winner);
      }
    }, 500);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setScores({});
    setResult(null);
    setSelectedOption(null);
  };

  const shareResult = async () => {
    if (!result) return;
    
    const text = `I'm ${result.name} from The Simpsons! "${result.quote}" 🍩 Take the quiz at Simpsonspedia!`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text, url: window.location.href });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Which Simpson Are You?"
            subtitle="Take this personality quiz to find out!"
            icon="🪞"
          />

          <div className="max-w-2xl mx-auto">
            {!result ? (
              <>
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm font-heading text-muted-foreground mb-2">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="bg-card rounded-3xl p-6 md:p-8 border-4 border-border shadow-xl">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6 text-center">
                    {questions[currentQuestion].question}
                  </h2>

                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedOption !== null}
                        className={cn(
                          "w-full p-4 rounded-xl text-left font-body transition-all duration-300",
                          "border-2 hover:scale-[1.02]",
                          selectedOption === index
                            ? "bg-primary/20 border-primary"
                            : "bg-muted hover:bg-muted/80 border-border hover:border-primary"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.text}</span>
                          <ChevronRight className={cn(
                            "w-5 h-5 transition-transform",
                            selectedOption === index && "translate-x-1"
                          )} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Result */
              <div className="bg-card rounded-3xl p-6 md:p-8 border-4 border-primary shadow-xl animate-bounce-in text-center">
                <div className={cn(
                  "w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-7xl",
                  result.color
                )}>
                  {result.emoji}
                </div>

                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  You are {result.name}!
                </h2>
                
                <p className="text-primary font-heading text-lg mb-4 italic">
                  "{result.quote}"
                </p>

                <p className="text-muted-foreground font-body mb-6 max-w-md mx-auto">
                  {result.description}
                </p>

                {/* Traits */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {result.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-3 py-1 bg-muted rounded-full text-sm font-heading"
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={shareResult}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Result
                  </Button>
                  <Button
                    onClick={restart}
                    variant="outline"
                    className="font-heading rounded-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Take Again
                  </Button>
                </div>

                {/* All characters preview */}
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground font-body mb-4">
                    Other possible results:
                  </p>
                  <div className="flex justify-center gap-4">
                    {characters.filter((c) => c.id !== result.id).map((char) => (
                      <div
                        key={char.id}
                        className="text-center opacity-50 hover:opacity-100 transition-opacity"
                      >
                        <span className="text-2xl">{char.emoji}</span>
                        <p className="text-xs text-muted-foreground">{char.name.split(" ")[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

