import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Clock, 
  Trophy, 
  Zap, 
  Target,
  Calendar,
  Gamepad2,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter, CircularProgress } from "./AnimatedCounter";

interface UserStats {
  totalPlayTime: number;
  gamesPlayed: number;
  triviaCorrect: number;
  triviaTotal: number;
  favoritesCount: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  currentStreak: number;
  longestStreak: number;
  lastActive: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

function calculateUserStats(): UserStats {
  // Gather stats from localStorage
  const triviaHighScore = parseInt(localStorage.getItem("simpsonspedia-trivia-highscore") || "0");
  const wordleStats = JSON.parse(localStorage.getItem("simpsonspedia-wordle-stats") || '{"played":0,"won":0}');
  const memoryScores = JSON.parse(localStorage.getItem("simpsonspedia-memory-scores") || '{"easy":0,"medium":0,"hard":0}');
  const favorites = JSON.parse(localStorage.getItem("simpsonspedia-favorites") || '{"characters":[],"episodes":[],"locations":[]}');
  const streak = JSON.parse(localStorage.getItem("simpsonspedia-streak") || '{"currentStreak":0,"longestStreak":0,"totalVisits":0}');
  const challengePoints = parseInt(localStorage.getItem("simpsonspedia-challenge-points") || "0");
  
  const favoritesCount = 
    (favorites.characters?.length || 0) + 
    (favorites.episodes?.length || 0) + 
    (favorites.locations?.length || 0);

  const gamesPlayed = wordleStats.played + (memoryScores.easy > 0 ? 1 : 0) + (memoryScores.medium > 0 ? 1 : 0) + (memoryScores.hard > 0 ? 1 : 0);
  
  const xp = triviaHighScore + challengePoints + (wordleStats.won * 100) + (favoritesCount * 10);
  const level = Math.floor(xp / 500) + 1;
  const xpToNextLevel = 500 - (xp % 500);

  return {
    totalPlayTime: streak.totalVisits * 5, // Estimate 5 mins per visit
    gamesPlayed,
    triviaCorrect: Math.floor(triviaHighScore / 100),
    triviaTotal: Math.floor(triviaHighScore / 50),
    favoritesCount,
    achievementsUnlocked: Math.min(16, Math.floor(xp / 200)),
    totalAchievements: 16,
    currentStreak: streak.currentStreak || 0,
    longestStreak: streak.longestStreak || 0,
    lastActive: new Date().toLocaleDateString(),
    level,
    xp,
    xpToNextLevel,
  };
}

export function AdvancedStats({ className }: { className?: string }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "games" | "progress">("overview");

  useEffect(() => {
    setStats(calculateUserStats());
  }, []);

  if (!stats) return null;

  return (
    <div className={cn("bg-card rounded-3xl border-4 border-border shadow-xl overflow-hidden", className)}>
      {/* Header with level */}
      <div className="bg-gradient-to-r from-primary via-simpsons-orange to-accent p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/70 text-sm font-heading">Your Level</p>
            <p className="text-4xl font-heading font-bold text-primary-foreground">
              Level {stats.level}
            </p>
          </div>
          <CircularProgress
            value={500 - stats.xpToNextLevel}
            max={500}
            size={80}
            strokeWidth={6}
            className="text-primary-foreground"
          >
            <div className="text-center">
              <p className="text-lg font-heading font-bold text-primary-foreground">{stats.xp}</p>
              <p className="text-xs text-primary-foreground/70">XP</p>
            </div>
          </CircularProgress>
        </div>
        
        {/* XP Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-primary-foreground/70 mb-1">
            <span>Progress to Level {stats.level + 1}</span>
            <span>{stats.xpToNextLevel} XP needed</span>
          </div>
          <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-foreground rounded-full transition-all duration-1000"
              style={{ width: `${((500 - stats.xpToNextLevel) / 500) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["overview", "games", "progress"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3 text-sm font-heading transition-colors capitalize",
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={<Zap className="w-5 h-5 text-simpsons-orange" />}
              label="Current Streak"
              value={stats.currentStreak}
              suffix=" days"
            />
            <StatCard
              icon={<Trophy className="w-5 h-5 text-primary" />}
              label="Best Streak"
              value={stats.longestStreak}
              suffix=" days"
            />
            <StatCard
              icon={<Gamepad2 className="w-5 h-5 text-secondary" />}
              label="Games Played"
              value={stats.gamesPlayed}
            />
            <StatCard
              icon={<Target className="w-5 h-5 text-accent" />}
              label="Achievements"
              value={stats.achievementsUnlocked}
              suffix={`/${stats.totalAchievements}`}
            />
          </div>
        )}

        {activeTab === "games" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-heading font-bold text-foreground">Trivia</p>
                  <p className="text-sm text-muted-foreground">Questions answered</p>
                </div>
              </div>
              <p className="text-2xl font-heading font-bold text-primary">
                {stats.triviaCorrect}
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📝</span>
                <div>
                  <p className="font-heading font-bold text-foreground">Wordle</p>
                  <p className="text-sm text-muted-foreground">Games completed</p>
                </div>
              </div>
              <p className="text-2xl font-heading font-bold text-simpsons-green">
                {JSON.parse(localStorage.getItem("simpsonspedia-wordle-stats") || '{"played":0}').played}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎴</span>
                <div>
                  <p className="font-heading font-bold text-foreground">Memory</p>
                  <p className="text-sm text-muted-foreground">Best scores</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  E: {JSON.parse(localStorage.getItem("simpsonspedia-memory-scores") || '{}').easy || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  M: {JSON.parse(localStorage.getItem("simpsonspedia-memory-scores") || '{}').medium || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-heading text-muted-foreground">Achievements</span>
                <span className="text-sm font-heading text-primary">
                  {stats.achievementsUnlocked}/{stats.totalAchievements}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${(stats.achievementsUnlocked / stats.totalAchievements) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-heading text-muted-foreground">Collection</span>
                <span className="text-sm font-heading text-secondary">
                  {stats.favoritesCount} items
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, stats.favoritesCount * 5)}%` }}
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-xl text-center">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Last Active</p>
              <p className="font-heading font-bold text-foreground">{stats.lastActive}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  suffix = "" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  suffix?: string;
}) {
  return (
    <div className="bg-muted/50 rounded-xl p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-2xl font-heading font-bold text-foreground">
        <AnimatedCounter value={value} duration={1500} />
        {suffix}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

