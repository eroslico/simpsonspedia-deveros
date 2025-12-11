import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  variant?: "fade" | "slide" | "scale" | "donut";
}

export function PageTransition({ children, className, variant = "slide" }: PageTransitionProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const variants = {
    fade: "animate-in fade-in duration-500",
    slide: "animate-in fade-in slide-in-from-bottom-4 duration-500",
    scale: "animate-in fade-in zoom-in-95 duration-500",
    donut: "animate-in fade-in spin-in-12 duration-700",
  };

  return (
    <div
      className={cn(
        "transition-all",
        isVisible ? variants[variant] : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

// Stagger animation wrapper for lists
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 50 }: StaggerContainerProps) {
  return (
    <div className={cn("stagger-container", className)} style={{ "--stagger-delay": `${staggerDelay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function StaggerItem({ children, index, className }: StaggerItemProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2",
        className
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "backwards",
      }}
    >
      {children}
    </div>
  );
}

