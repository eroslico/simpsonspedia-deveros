import { useStreak } from "@/hooks/useStreak";
import { Flame, Trophy, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCalendarProps {
  className?: string;
}

export function StreakCalendar({ className }: StreakCalendarProps) {
  const { 
    currentStreak, 
    longestStreak, 
    getCalendarData,
    getWeeklyVisits,
    getMonthlyVisits,
    totalVisits 
  } = useStreak();

  const calendarData = getCalendarData(35); // 5 weeks
  const weeklyVisits = getWeeklyVisits();
  const monthlyVisits = getMonthlyVisits();

  // Group by weeks
  const weeks: typeof calendarData[] = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  return (
    <div className={cn("bg-card rounded-2xl p-6 border-2 border-border", className)}>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className={cn(
              "w-5 h-5",
              currentStreak > 0 ? "text-simpsons-orange" : "text-muted-foreground"
            )} />
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">{currentStreak}</p>
          <p className="text-xs text-muted-foreground font-body">Current</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">{longestStreak}</p>
          <p className="text-xs text-muted-foreground font-body">Best</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">{monthlyVisits}</p>
          <p className="text-xs text-muted-foreground font-body">This Month</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">{totalVisits}</p>
          <p className="text-xs text-muted-foreground font-body">Total</p>
        </div>
      </div>

      {/* Streak message */}
      {currentStreak > 0 && (
        <div className={cn(
          "text-center py-2 px-4 rounded-xl mb-4",
          currentStreak >= 7 ? "bg-simpsons-orange/20 text-simpsons-orange" :
          currentStreak >= 3 ? "bg-primary/20 text-primary" :
          "bg-muted text-muted-foreground"
        )}>
          <p className="font-heading text-sm">
            {currentStreak >= 30 ? "🏆 Legendary! 30+ day streak!" :
             currentStreak >= 14 ? "🔥 On fire! 2 week streak!" :
             currentStreak >= 7 ? "⭐ Amazing! 1 week streak!" :
             currentStreak >= 3 ? "💪 Nice! Keep it going!" :
             "🌟 Great start!"}
          </p>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="space-y-1">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground font-heading">
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              const date = new Date(day.date);
              const isToday = day.date === new Date().toISOString().split("T")[0];
              
              return (
                <div
                  key={dayIndex}
                  className={cn(
                    "aspect-square rounded-md flex items-center justify-center text-xs transition-all",
                    day.visited 
                      ? "bg-simpsons-green text-white" 
                      : "bg-muted/50",
                    isToday && "ring-2 ring-primary ring-offset-1"
                  )}
                  title={`${date.toLocaleDateString()} - ${day.visited ? "Visited" : "Not visited"}`}
                >
                  {day.visited && "✓"}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-muted/50" />
          <span>Not visited</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-simpsons-green" />
          <span>Visited</span>
        </div>
      </div>
    </div>
  );
}

