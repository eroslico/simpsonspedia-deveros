import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { DataExport } from "@/components/DataExport";
import { StreakCalendar } from "@/components/StreakCalendar";
import { FanCertificate } from "@/components/FanCertificate";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { Button } from "@/components/ui/button";
import { 
  User,
  Trophy,
  Star,
  Heart,
  Eye,
  Brain,
  Clock,
  Calendar,
  Award,
  Zap,
  Target,
  Flame,
  Medal,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: "explorer" | "collector" | "trivia" | "dedication";
}

export default function Profile() {
  const { favorites, getFavoritesByType } = useFavorites();
  const [username, setUsername] = useState(() => 
    localStorage.getItem("simpsonspedia-username") || "Springfield Resident"
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [triviaHighScore, setTriviaHighScore] = useState(() => {
    const saved = localStorage.getItem("simpsonspedia-trivia-highscore");
    return saved ? parseInt(saved) : 0;
  });
  const [watchedCount, setWatchedCount] = useState(() => {
    const saved = localStorage.getItem("simpsonspedia-watched");
    return saved ? JSON.parse(saved).length : 0;
  });
  const [visitCount, setVisitCount] = useState(() => {
    const count = parseInt(localStorage.getItem("simpsonspedia-visits") || "0") + 1;
    localStorage.setItem("simpsonspedia-visits", count.toString());
    return count;
  });
  const [firstVisit] = useState(() => {
    const saved = localStorage.getItem("simpsonspedia-first-visit");
    if (!saved) {
      const now = new Date().toISOString();
      localStorage.setItem("simpsonspedia-first-visit", now);
      return now;
    }
    return saved;
  });

  const characterFavs = getFavoritesByType("character").length;
  const episodeFavs = getFavoritesByType("episode").length;
  const locationFavs = getFavoritesByType("location").length;

  const achievements: Achievement[] = [
    // Explorer achievements
    {
      id: "first-visit",
      name: "Welcome to Springfield",
      description: "Visit Simpsonspedia for the first time",
      icon: "🏠",
      unlocked: true,
      category: "explorer",
    },
    {
      id: "frequent-visitor",
      name: "Regular Customer",
      description: "Visit Simpsonspedia 10 times",
      icon: "🔄",
      unlocked: visitCount >= 10,
      progress: Math.min(visitCount, 10),
      maxProgress: 10,
      category: "explorer",
    },
    {
      id: "dedicated-fan",
      name: "Dedicated Fan",
      description: "Visit Simpsonspedia 50 times",
      icon: "💫",
      unlocked: visitCount >= 50,
      progress: Math.min(visitCount, 50),
      maxProgress: 50,
      category: "explorer",
    },
    // Collector achievements
    {
      id: "first-favorite",
      name: "First Love",
      description: "Add your first favorite",
      icon: "💝",
      unlocked: favorites.length >= 1,
      category: "collector",
    },
    {
      id: "collector",
      name: "Collector",
      description: "Add 10 favorites",
      icon: "📦",
      unlocked: favorites.length >= 10,
      progress: Math.min(favorites.length, 10),
      maxProgress: 10,
      category: "collector",
    },
    {
      id: "super-collector",
      name: "Super Collector",
      description: "Add 25 favorites",
      icon: "🏆",
      unlocked: favorites.length >= 25,
      progress: Math.min(favorites.length, 25),
      maxProgress: 25,
      category: "collector",
    },
    {
      id: "character-lover",
      name: "Character Lover",
      description: "Favorite 5 characters",
      icon: "👥",
      unlocked: characterFavs >= 5,
      progress: Math.min(characterFavs, 5),
      maxProgress: 5,
      category: "collector",
    },
    {
      id: "episode-enthusiast",
      name: "Episode Enthusiast",
      description: "Favorite 5 episodes",
      icon: "📺",
      unlocked: episodeFavs >= 5,
      progress: Math.min(episodeFavs, 5),
      maxProgress: 5,
      category: "collector",
    },
    {
      id: "location-scout",
      name: "Location Scout",
      description: "Favorite 5 locations",
      icon: "🗺️",
      unlocked: locationFavs >= 5,
      progress: Math.min(locationFavs, 5),
      maxProgress: 5,
      category: "collector",
    },
    // Trivia achievements
    {
      id: "trivia-beginner",
      name: "Trivia Beginner",
      description: "Score 50+ points in trivia",
      icon: "🎯",
      unlocked: triviaHighScore >= 50,
      category: "trivia",
    },
    {
      id: "trivia-master",
      name: "Trivia Master",
      description: "Score 100+ points in trivia",
      icon: "🧠",
      unlocked: triviaHighScore >= 100,
      category: "trivia",
    },
    {
      id: "trivia-legend",
      name: "Trivia Legend",
      description: "Score 150+ points in trivia",
      icon: "👑",
      unlocked: triviaHighScore >= 150,
      category: "trivia",
    },
    // Dedication achievements
    {
      id: "binge-watcher",
      name: "Binge Watcher",
      description: "Mark 10 episodes as watched",
      icon: "👀",
      unlocked: watchedCount >= 10,
      progress: Math.min(watchedCount, 10),
      maxProgress: 10,
      category: "dedication",
    },
    {
      id: "marathon-runner",
      name: "Marathon Runner",
      description: "Mark 50 episodes as watched",
      icon: "🏃",
      unlocked: watchedCount >= 50,
      progress: Math.min(watchedCount, 50),
      maxProgress: 50,
      category: "dedication",
    },
    {
      id: "completionist",
      name: "Completionist",
      description: "Mark 100 episodes as watched",
      icon: "✅",
      unlocked: watchedCount >= 100,
      progress: Math.min(watchedCount, 100),
      maxProgress: 100,
      category: "dedication",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalAchievements = achievements.length;
  const achievementPercent = (unlockedCount / totalAchievements) * 100;

  const saveName = () => {
    localStorage.setItem("simpsonspedia-username", username);
    setIsEditingName(false);
  };

  const categoryIcons = {
    explorer: <Target className="w-4 h-4" />,
    collector: <Heart className="w-4 h-4" />,
    trivia: <Brain className="w-4 h-4" />,
    dedication: <Flame className="w-4 h-4" />,
  };

  const categoryColors = {
    explorer: "text-secondary",
    collector: "text-accent",
    trivia: "text-primary",
    dedication: "text-simpsons-orange",
  };

  const daysSinceFirstVisit = Math.floor(
    (new Date().getTime() - new Date(firstVisit).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Your Profile"
            subtitle="Track your progress and unlock achievements"
            icon="👤"
          />

          {/* Profile Card */}
          <div className="bg-card rounded-3xl p-6 md:p-8 border-4 border-primary shadow-xl mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-6xl shadow-xl">
                  🍩
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-heading shadow-lg">
                  Lvl {Math.floor(unlockedCount / 3) + 1}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditingName ? (
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="text-2xl font-heading font-bold bg-muted px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={20}
                      autoFocus
                    />
                    <Button onClick={saveName} size="sm" className="font-heading">
                      Save
                    </Button>
                  </div>
                ) : (
                  <h2 
                    onClick={() => setIsEditingName(true)}
                    className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2 cursor-pointer hover:text-primary transition-colors"
                  >
                    {username} ✏️
                  </h2>
                )}
                <p className="text-muted-foreground font-body mb-4">
                  Member for {daysSinceFirstVisit} day{daysSinceFirstVisit !== 1 ? "s" : ""}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                    <Heart className="w-4 h-4 text-accent" />
                    <span className="font-heading text-sm">{favorites.length} Favorites</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                    <Eye className="w-4 h-4 text-secondary" />
                    <span className="font-heading text-sm">{watchedCount} Watched</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="font-heading text-sm">{triviaHighScore} High Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-lg mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading text-foreground flex items-center gap-2">
                <Medal className="w-5 h-5 text-primary" />
                Achievement Progress
              </span>
              <span className="font-heading text-primary">
                {unlockedCount} / {totalAchievements} ({achievementPercent.toFixed(0)}%)
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
                style={{ width: `${achievementPercent}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Clock, label: "Total Visits", value: visitCount, color: "text-secondary" },
              { icon: Heart, label: "Favorites", value: favorites.length, color: "text-accent" },
              { icon: Eye, label: "Episodes Watched", value: watchedCount, color: "text-simpsons-green" },
              { icon: Trophy, label: "Trivia High Score", value: triviaHighScore, color: "text-primary" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="bg-card rounded-2xl p-4 border-2 border-border shadow-md text-center"
              >
                <stat.icon className={cn("w-8 h-8 mx-auto mb-2", stat.color)} />
                <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-body">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="bg-card rounded-3xl p-6 border-4 border-border shadow-xl">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              Achievements
            </h2>

            {/* Category Tabs */}
            {(["explorer", "collector", "trivia", "dedication"] as const).map((category) => {
              const categoryAchievements = achievements.filter((a) => a.category === category);
              const categoryUnlocked = categoryAchievements.filter((a) => a.unlocked).length;
              
              return (
                <div key={category} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={categoryColors[category]}>{categoryIcons[category]}</span>
                    <h3 className="font-heading font-bold text-foreground capitalize">{category}</h3>
                    <span className="text-sm text-muted-foreground">
                      ({categoryUnlocked}/{categoryAchievements.length})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all",
                          achievement.unlocked
                            ? "bg-primary/10 border-primary"
                            : "bg-muted/50 border-border opacity-60"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span className={cn(
                            "text-3xl",
                            !achievement.unlocked && "grayscale"
                          )}>
                            {achievement.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-bold text-foreground text-sm">
                              {achievement.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-body">
                              {achievement.description}
                            </p>
                            
                            {/* Progress bar for incomplete achievements */}
                            {!achievement.unlocked && achievement.progress !== undefined && (
                              <div className="mt-2">
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all"
                                    style={{
                                      width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%`,
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {achievement.progress} / {achievement.maxProgress}
                                </p>
                              </div>
                            )}
                            
                            {achievement.unlocked && (
                              <p className="text-xs text-primary font-heading mt-1 flex items-center gap-1">
                                <Star className="w-3 h-3" /> Unlocked!
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Streak Calendar */}
          <div className="mt-8">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-simpsons-orange" />
              Visit Streak
            </h2>
            <StreakCalendar />
          </div>

          {/* Fan Certificate & Customization */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <FanCertificate username={username} />
            <ThemeCustomizer />
          </div>

          {/* Data Export Section */}
          <div className="mt-8">
            <DataExport />
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

