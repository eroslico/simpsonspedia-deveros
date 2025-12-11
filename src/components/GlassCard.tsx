import { ReactNode, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  tiltEnabled?: boolean;
  hoverScale?: boolean;
}

export function GlassCard({
  children,
  className,
  glowColor = "primary",
  tiltEnabled = true,
  hoverScale = true,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !tiltEnabled) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    setGlowPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTransform("");
    setGlowPosition({ x: 50, y: 50 });
  };

  const glowColors: Record<string, string> = {
    primary: "rgba(255, 217, 61, 0.3)",
    secondary: "rgba(100, 181, 246, 0.3)",
    accent: "rgba(236, 72, 153, 0.3)",
    orange: "rgba(255, 152, 0, 0.3)",
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-card/80 backdrop-blur-xl",
        "border border-border/50",
        "transition-all duration-300 ease-out",
        hoverScale && "hover:scale-[1.02]",
        className
      )}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColors[glowColor] || glowColors.primary}, transparent 50%)`,
        }}
      />
      
      {/* Shine effect */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, transparent 50%)`,
          transform: `translateX(${(glowPosition.x - 50) * 2}%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Border gradient */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none">
        <div
          className="absolute inset-0 rounded-2xl opacity-50"
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary) / 0.2), transparent, hsl(var(--secondary) / 0.2))`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />
      </div>
    </div>
  );
}

// Animated gradient border card
interface AnimatedBorderCardProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedBorderCard({ children, className }: AnimatedBorderCardProps) {
  return (
    <div className={cn("relative group", className)}>
      {/* Animated border */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)), hsl(var(--primary)))",
          backgroundSize: "300% 100%",
          animation: "gradient-shift 3s linear infinite",
        }}
      />
      
      {/* Card content */}
      <div className="relative bg-card rounded-2xl p-6">
        {children}
      </div>
    </div>
  );
}

// Floating card with shadow
interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  depth?: number;
}

export function FloatingCard({ children, className, depth = 20 }: FloatingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl bg-card",
        "transition-all duration-300",
        "hover:-translate-y-2",
        className
      )}
      style={{
        boxShadow: `
          0 ${depth / 4}px ${depth / 2}px rgba(0,0,0,0.05),
          0 ${depth / 2}px ${depth}px rgba(0,0,0,0.08),
          0 ${depth}px ${depth * 2}px rgba(0,0,0,0.1)
        `,
      }}
    >
      {children}
    </div>
  );
}

// Neumorphic card
interface NeumorphicCardProps {
  children: ReactNode;
  className?: string;
  pressed?: boolean;
}

export function NeumorphicCard({ children, className, pressed = false }: NeumorphicCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-200",
        pressed
          ? "shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
          : "shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.5)]",
        "bg-background",
        className
      )}
    >
      {children}
    </div>
  );
}

