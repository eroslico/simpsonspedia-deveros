import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CursorEffectsProps {
  enabled?: boolean;
}

export function CursorEffects({ enabled = true }: CursorEffectsProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    // Create trail elements
    const trailContainer = document.createElement("div");
    trailContainer.className = "fixed inset-0 pointer-events-none z-[9998]";
    document.body.appendChild(trailContainer);

    const trails: HTMLDivElement[] = [];
    for (let i = 0; i < 8; i++) {
      const trail = document.createElement("div");
      trail.className = cn(
        "fixed w-2 h-2 rounded-full pointer-events-none",
        "bg-primary/40 transition-transform duration-75"
      );
      trail.style.transform = "translate(-50%, -50%) scale(0)";
      trailContainer.appendChild(trail);
      trails.push(trail);
    }
    trailsRef.current = trails;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.dataset.cursor;

      setIsHovering(!!isInteractive);
      setCursorText(target.dataset.cursorText || "");
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Smooth cursor animation
    let animationFrame: number;
    const animate = () => {
      // Smooth follow
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorPos.current.x}px`;
        cursorRef.current.style.top = `${cursorPos.current.y}px`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${mousePos.current.x}px`;
        cursorDotRef.current.style.top = `${mousePos.current.y}px`;
      }

      // Animate trails
      trails.forEach((trail, i) => {
        const delay = (i + 1) * 2;
        const trailX = cursorPos.current.x + (mousePos.current.x - cursorPos.current.x) * (1 - i / trails.length);
        const trailY = cursorPos.current.y + (mousePos.current.y - cursorPos.current.y) * (1 - i / trails.length);
        
        setTimeout(() => {
          trail.style.left = `${trailX}px`;
          trail.style.top = `${trailY}px`;
          trail.style.transform = `translate(-50%, -50%) scale(${1 - i * 0.1})`;
          trail.style.opacity = `${0.5 - i * 0.05}`;
        }, delay);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      trailContainer.remove();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={cn(
          "fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2",
          "w-10 h-10 rounded-full border-2 border-primary",
          "transition-all duration-200 ease-out",
          "hidden md:flex items-center justify-center",
          isHovering && "w-16 h-16 bg-primary/10 border-primary",
          isClicking && "scale-75"
        )}
        style={{ mixBlendMode: "difference" }}
      >
        {cursorText && (
          <span className="text-xs font-heading text-primary whitespace-nowrap">
            {cursorText}
          </span>
        )}
      </div>

      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className={cn(
          "fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2",
          "w-1.5 h-1.5 rounded-full bg-primary",
          "transition-transform duration-100",
          "hidden md:block",
          isClicking && "scale-150"
        )}
      />

      {/* Hide default cursor */}
      <style>{`
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}

// Click ripple effect
export function ClickRipple() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      };
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9997]">
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          <div
            className="absolute inset-0 rounded-full border-2 border-primary"
            style={{
              animation: "ripple-expand 0.6s ease-out forwards",
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes ripple-expand {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(20);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

