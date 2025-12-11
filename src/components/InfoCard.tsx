import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  emoji?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "primary" | "secondary" | "accent";
}

export function InfoCard({
  title,
  value,
  subtitle,
  icon: Icon,
  emoji,
  trend,
  className,
  variant = "default",
}: InfoCardProps) {
  const variants = {
    default: "bg-card border-border",
    primary: "bg-primary/10 border-primary/30",
    secondary: "bg-secondary/10 border-secondary/30",
    accent: "bg-accent/10 border-accent/30",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-4 transition-all hover:scale-105 hover:shadow-lg",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-heading text-muted-foreground">
          {title}
        </span>
        {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
        {emoji && <span className="text-xl">{emoji}</span>}
      </div>
      
      <div className="flex items-end gap-2">
        <span className="text-3xl font-heading font-bold text-foreground">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-sm font-heading mb-1",
              trend.isPositive ? "text-simpsons-green" : "text-destructive"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1 font-body">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Grid of info cards
interface InfoGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function InfoGrid({ children, columns = 4, className }: InfoGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

// Feature card with icon
interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  onClick?: () => void;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  className,
  onClick,
}: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left w-full p-6 rounded-2xl border-2 border-border bg-card",
        "transition-all hover:border-primary hover:shadow-lg hover:scale-[1.02]",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-heading font-bold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground font-body">
        {description}
      </p>
    </button>
  );
}

// Badge component
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "accent" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary/20 text-secondary-foreground",
    accent: "bg-accent/20 text-accent-foreground",
    success: "bg-simpsons-green/20 text-simpsons-green",
    warning: "bg-simpsons-orange/20 text-simpsons-orange",
    error: "bg-destructive/20 text-destructive",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-heading font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

