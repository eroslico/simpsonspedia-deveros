import { useState, useEffect, useCallback } from "react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string;
  visitDates: string[];
  totalVisits: number;
}

const STORAGE_KEY = "simpsonspedia-streak";

function getDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: "",
      visitDates: [],
      totalVisits: 0,
    };
  });

  // Update streak on mount
  useEffect(() => {
    const today = getDateString();
    const { lastVisit, currentStreak, longestStreak, visitDates, totalVisits } = streakData;

    // If already visited today, do nothing
    if (lastVisit === today) return;

    let newStreak = currentStreak;
    let newLongest = longestStreak;
    let newVisitDates = [...visitDates];

    if (!lastVisit) {
      // First visit ever
      newStreak = 1;
    } else {
      const daysDiff = getDaysDifference(lastVisit, today);
      
      if (daysDiff === 1) {
        // Consecutive day - increase streak
        newStreak = currentStreak + 1;
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1;
      }
    }

    // Update longest streak
    if (newStreak > newLongest) {
      newLongest = newStreak;
    }

    // Add today to visit dates (keep last 365 days)
    if (!newVisitDates.includes(today)) {
      newVisitDates = [today, ...newVisitDates].slice(0, 365);
    }

    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastVisit: today,
      visitDates: newVisitDates,
      totalVisits: totalVisits + 1,
    };

    setStreakData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  // Get calendar data for the last N days
  const getCalendarData = useCallback((days: number = 30) => {
    const calendar: { date: string; visited: boolean }[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = getDateString(date);
      calendar.push({
        date: dateStr,
        visited: streakData.visitDates.includes(dateStr),
      });
    }

    return calendar;
  }, [streakData.visitDates]);

  // Get visits this week
  const getWeeklyVisits = useCallback(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    return streakData.visitDates.filter((date) => {
      const d = new Date(date);
      return d >= weekStart && d <= today;
    }).length;
  }, [streakData.visitDates]);

  // Get visits this month
  const getMonthlyVisits = useCallback(() => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return streakData.visitDates.filter((date) => {
      const d = new Date(date);
      return d >= monthStart && d <= today;
    }).length;
  }, [streakData.visitDates]);

  return {
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    lastVisit: streakData.lastVisit,
    totalVisits: streakData.totalVisits,
    visitDates: streakData.visitDates,
    getCalendarData,
    getWeeklyVisits,
    getMonthlyVisits,
  };
}

