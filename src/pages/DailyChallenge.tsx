import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Trophy,
  Flame,
  CheckCircle,
  Lock,
  Gift,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "trivia" | "memory" | "guess" | "quote" | "explore";
  target: number;
  reward: number;
  link: string;
}

const DAILY_CHALLENGES: Challenge[] = [
  {
    id: "trivia-3",
    title: "Trivia Master",
    description: "Get 3 correct answers in Trivia",
    type: "trivia",
    target: 3,
    reward: 50,
    link: "/trivia"
  },
  {
    id: "memory-win",
    title: "Memory Champion",
    description: "Win a game of Memory",
    type: "memory",
    target: 1,
    reward: 75,
    link: "/memory"
  },
  {
    id: "guess-2",
    title: "Episode Expert",
    description: "Guess 2 episodes correctly",
    type: "guess",
    target: 2,
    reward: 100,
    link: "/guess"
  },
  {
    id: "quote-5",
    title: "Quote Collector",
    description: "Save 5 favorite quotes",
    type: "quote",
    target: 5,
    reward: 30,
    link: "/quotes"
  },
  {
    id: "explore-chars",
    title: "Character Explorer",
    description: "View 10 character profiles",
    type: "explore",
    target: 10,
    reward: 40,
    link: "/characters"
  }
];

function getDailyChallenge(): Challenge {
  const today = new Date().toDateString();
  const seed = today.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return DAILY_CHALLENGES[seed % DAILY_CHALLENGES.length];
}

function getWeeklyChallenges(): Challenge[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const challenges: Challenge[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOfWeek + i);
    const seed = date.toDateString().split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    challenges.push(DAILY_CHALLENGES[seed % DAILY_CHALLENGES.length]);
  }
  
  return challenges;
}

export default function DailyChallenge() {
  const [dailyChallenge] = useState<Challenge>(getDailyChallenge);
  const [weeklyChallenges] = useState<Challenge[]>(getWeeklyChallenges);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem("simpsonspedia-completed-challenges");
    return saved ? JSON.parse(saved) : [];
  });
  const [totalPoints, setTotalPoints] = useState(() => {
    return parseInt(localStorage.getItem("simpsonspedia-challenge-points") || "0");
  });
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem("simpsonspedia-challenge-streak") || "0");
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const todayKey = `${dailyChallenge.id}-${today.toDateString()}`;
  const isCompleted = completedChallenges.includes(todayKey);

  const completeChallenge = () => {
    if (isCompleted) return;
    
    const newCompleted = [...completedChallenges, todayKey];
    setCompletedChallenges(newCompleted);
    localStorage.setItem("simpsonspedia-completed-challenges", JSON.stringify(newCompleted));
    
    const newPoints = totalPoints + dailyChallenge.reward;
    setTotalPoints(newPoints);
    localStorage.setItem("simpsonspedia-challenge-points", newPoints.toString());
    
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("simpsonspedia-challenge-streak", newStreak.toString());
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    toast.success(`+${dailyChallenge.reward} points! Streak: ${newStreak} days 🔥`);
  };

  // Calculate level
  const level = Math.floor(totalPoints / 500) + 1;
  const pointsToNextLevel = 500 - (totalPoints % 500);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Confetti isActive={showConfetti} />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Daily Challenge"
            subtitle="Complete challenges to earn points and rewards!"
            icon="🎯"
          />

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center bg-card rounded-2xl p-4 border-2 border-border">
              <Star className="w-8 h-8 text-primary mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold text-foreground">{totalPoints}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="text-center bg-card rounded-2xl p-4 border-2 border-border">
              <Flame className={cn(
                "w-8 h-8 mx-auto mb-1",
                streak > 0 ? "text-simpsons-orange" : "text-muted-foreground"
              )} />
              <p className="text-2xl font-heading font-bold text-foreground">{streak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center bg-card rounded-2xl p-4 border-2 border-border">
              <Trophy className="w-8 h-8 text-secondary mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold text-foreground">Lvl {level}</p>
              <p className="text-sm text-muted-foreground">{pointsToNextLevel} to next</p>
            </div>
          </div>

          {/* Today's Challenge */}
          <div className="max-w-xl mx-auto mb-12">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Challenge
            </h2>
            
            <div className={cn(
              "bg-card rounded-3xl p-6 border-4 shadow-xl transition-all",
              isCompleted ? "border-simpsons-green" : "border-primary"
            )}>
              {isCompleted ? (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-simpsons-green mx-auto mb-4" />
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Challenge Completed! 🎉
                  </h3>
                  <p className="text-muted-foreground font-body mb-4">
                    Come back tomorrow for a new challenge!
                  </p>
                  <p className="text-simpsons-green font-heading">
                    +{dailyChallenge.reward} points earned
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-3xl mb-2 block">
                        {dailyChallenge.type === "trivia" ? "🧠" :
                         dailyChallenge.type === "memory" ? "🎴" :
                         dailyChallenge.type === "guess" ? "🎬" :
                         dailyChallenge.type === "quote" ? "💬" : "🔍"}
                      </span>
                      <h3 className="text-xl font-heading font-bold text-foreground">
                        {dailyChallenge.title}
                      </h3>
                    </div>
                    <div className="bg-primary/20 px-3 py-1 rounded-full">
                      <span className="font-heading text-primary">+{dailyChallenge.reward} pts</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground font-body mb-6">
                    {dailyChallenge.description}
                  </p>
                  
                  <div className="flex gap-3">
                    <Button
                      asChild
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
                    >
                      <Link to={dailyChallenge.link}>
                        Start Challenge
                      </Link>
                    </Button>
                    <Button
                      onClick={completeChallenge}
                      variant="outline"
                      className="font-heading rounded-full"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Done
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4">
              This Week
            </h2>
            
            <div className="grid grid-cols-7 gap-2">
              {weeklyChallenges.map((challenge, index) => {
                const date = new Date(today);
                date.setDate(today.getDate() - dayOfWeek + index);
                const key = `${challenge.id}-${date.toDateString()}`;
                const completed = completedChallenges.includes(key);
                const isToday = index === dayOfWeek;
                const isPast = index < dayOfWeek;
                const isFuture = index > dayOfWeek;
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "text-center p-3 rounded-xl border-2 transition-all",
                      isToday && "border-primary bg-primary/10",
                      completed && "border-simpsons-green bg-simpsons-green/10",
                      isPast && !completed && "border-destructive/50 bg-destructive/5",
                      isFuture && "border-border bg-muted/50"
                    )}
                  >
                    <p className="text-xs font-heading text-muted-foreground mb-1">
                      {dayNames[index]}
                    </p>
                    <div className="text-xl mb-1">
                      {completed ? "✅" :
                       isFuture ? <Lock className="w-5 h-5 mx-auto text-muted-foreground" /> :
                       isPast ? "❌" :
                       challenge.type === "trivia" ? "🧠" :
                       challenge.type === "memory" ? "🎴" :
                       challenge.type === "guess" ? "🎬" :
                       challenge.type === "quote" ? "💬" : "🔍"}
                    </div>
                    <p className="text-xs font-heading text-foreground">
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rewards */}
          <div className="max-w-xl mx-auto mt-12">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-accent" />
              Rewards
            </h2>
            
            <div className="space-y-3">
              {[
                { level: 5, reward: "🥉 Bronze Fan Badge", points: 2500 },
                { level: 10, reward: "🥈 Silver Fan Badge", points: 5000 },
                { level: 20, reward: "🥇 Gold Fan Badge", points: 10000 },
                { level: 50, reward: "💎 Diamond Fan Badge", points: 25000 },
              ].map((tier) => (
                <div
                  key={tier.level}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2",
                    level >= tier.level
                      ? "border-simpsons-green bg-simpsons-green/10"
                      : "border-border bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tier.reward.split(" ")[0]}</span>
                    <div>
                      <p className="font-heading font-bold text-foreground">
                        {tier.reward.split(" ").slice(1).join(" ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Level {tier.level} • {tier.points.toLocaleString()} points
                      </p>
                    </div>
                  </div>
                  {level >= tier.level && (
                    <CheckCircle className="w-6 h-6 text-simpsons-green" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

