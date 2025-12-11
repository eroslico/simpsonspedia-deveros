import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

const COLORS = [
  "#FFD93D", // Yellow
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#95E1D3", // Mint
  "#FF85A2", // Pink
  "#5BC0EB", // Blue
  "#F77F00", // Orange
];

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  pieces?: number;
}

export function Confetti({ isActive, duration = 3000, pieces = 50 }: ConfettiProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newConfetti: ConfettiPiece[] = [];
      for (let i = 0; i < pieces; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
          size: 8 + Math.random() * 8,
        });
      }
      setConfetti(newConfetti);

      const timer = setTimeout(() => {
        setConfetti([]);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setConfetti([]);
    }
  }, [isActive, duration, pieces]);

  if (confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// Emoji burst for specific celebrations
interface EmojiBurstProps {
  emoji: string;
  isActive: boolean;
  count?: number;
}

export function EmojiBurst({ emoji, isActive, count = 20 }: EmojiBurstProps) {
  const [emojis, setEmojis] = useState<{ id: number; x: number; delay: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const newEmojis = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.3,
      }));
      setEmojis(newEmojis);

      const timer = setTimeout(() => {
        setEmojis([]);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setEmojis([]);
    }
  }, [isActive, count]);

  if (emojis.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {emojis.map((item) => (
        <div
          key={item.id}
          className="absolute top-0 text-3xl animate-confetti"
          style={{
            left: `${item.x}%`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}

