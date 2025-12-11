import { useState, useEffect } from "react";
import { 
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  isCurrentUser?: boolean;
}

// Simulated leaderboard data (in a real app, this would come from a backend)
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "HomerFan2024", score: 15420, avatar: "👨" },
  { rank: 2, name: "BartMaster", score: 12850, avatar: "👦" },
  { rank: 3, name: "LisaSaxQueen", score: 11200, avatar: "👧" },
  { rank: 4, name: "DonutLover", score: 9800, avatar: "🍩" },
  { rank: 5, name: "MoesTavern", score: 8500, avatar: "🍺" },
  { rank: 6, name: "KrustyFan", score: 7200, avatar: "🤡" },
  { rank: 7, name: "SpringfieldNative", score: 6800, avatar: "🏠" },
  { rank: 8, name: "DuffMan", score: 5500, avatar: "💪" },
  { rank: 9, name: "MrBurnsExcellent", score: 4200, avatar: "👴" },
  { rank: 10, name: "NedFlanders", score: 3800, avatar: "😇" },
];

interface LeaderboardProps {
  className?: string;
  currentUserScore?: number;
  currentUserName?: string;
}

export function Leaderboard({ className, currentUserScore = 0, currentUserName = "You" }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Insert current user into leaderboard
    const allEntries = [...MOCK_LEADERBOARD];
    
    if (currentUserScore > 0) {
      const userEntry: LeaderboardEntry = {
        rank: 0,
        name: currentUserName,
        score: currentUserScore,
        avatar: "⭐",
        isCurrentUser: true
      };
      
      allEntries.push(userEntry);
      allEntries.sort((a, b) => b.score - a.score);
      allEntries.forEach((entry, i) => entry.rank = i + 1);
    }
    
    setEntries(allEntries.slice(0, 10));
  }, [currentUserScore, currentUserName]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  return (
    <div className={cn("bg-card rounded-2xl p-6 border-2 border-border", className)}>
      <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        Leaderboard
      </h3>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all",
              entry.isCurrentUser 
                ? "bg-primary/20 border-2 border-primary" 
                : "bg-muted/50 hover:bg-muted"
            )}
          >
            <div className="w-8 flex justify-center">
              {getRankIcon(entry.rank)}
            </div>
            
            <span className="text-2xl">{entry.avatar}</span>
            
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-heading font-bold truncate",
                entry.isCurrentUser ? "text-primary" : "text-foreground"
              )}>
                {entry.name}
                {entry.isCurrentUser && " (You)"}
              </p>
            </div>
            
            <div className="text-right">
              <p className="font-heading font-bold text-foreground">
                {entry.score.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        ))}
      </div>

      {currentUserScore > 0 && !entries.find(e => e.isCurrentUser) && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center font-body">
            Your score: <span className="font-heading text-foreground">{currentUserScore.toLocaleString()}</span>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Keep playing to reach the top 10!
          </p>
        </div>
      )}
    </div>
  );
}

// Mini leaderboard for sidebar/widget
export function MiniLeaderboard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-xl p-4 border-2 border-border", className)}>
      <h4 className="text-sm font-heading font-bold text-foreground mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        Top Players
      </h4>
      
      <div className="space-y-2">
        {MOCK_LEADERBOARD.slice(0, 3).map((entry) => (
          <div key={entry.rank} className="flex items-center gap-2">
            <span className="text-lg">{entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}</span>
            <span className="text-sm font-heading text-foreground truncate flex-1">
              {entry.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {(entry.score / 1000).toFixed(1)}k
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

