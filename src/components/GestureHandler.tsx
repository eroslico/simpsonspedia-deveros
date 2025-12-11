import { useEffect, useRef, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SwipeHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export function SwipeHandler({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: SwipeHandlerProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontal) {
      if (distanceX > threshold) {
        onSwipeLeft?.();
      } else if (distanceX < -threshold) {
        onSwipeRight?.();
      }
    } else {
      if (distanceY > threshold) {
        onSwipeUp?.();
      } else if (distanceY < -threshold) {
        onSwipeDown?.();
      }
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

// Global navigation gestures
export function NavigationGestures() {
  const navigate = useNavigate();
  const [showIndicator, setShowIndicator] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = touchX - touchStartX;
      const diffY = touchY - touchStartY;

      // Only trigger if horizontal swipe from edge
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
        if (touchStartX < 30 && diffX > 0) {
          setShowIndicator("right");
        } else if (touchStartX > window.innerWidth - 30 && diffX < 0) {
          setShowIndicator("left");
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;

      // Edge swipe to go back
      if (touchStartX < 30 && diffX > 100) {
        window.history.back();
        toast.info("← Going back");
      }

      setShowIndicator(null);
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate]);

  return (
    <>
      {/* Back indicator */}
      {showIndicator === "right" && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] pointer-events-none">
          <div className="w-12 h-24 bg-primary/30 rounded-r-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">←</span>
          </div>
        </div>
      )}
    </>
  );
}

// Pull to refresh
interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, (currentY - startY.current) * 0.5);
    setPullDistance(Math.min(distance, threshold * 1.5));
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !refreshing) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    setPulling(false);
    setPullDistance(0);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-50 transition-all"
        style={{
          top: pullDistance - 40,
          opacity: pullDistance / threshold,
        }}
      >
        <div className={`
          w-10 h-10 rounded-full bg-primary flex items-center justify-center
          ${refreshing ? "animate-spin" : ""}
        `}>
          <span className="text-lg">
            {refreshing ? "🔄" : pullDistance >= threshold ? "↓" : "↑"}
          </span>
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pulling ? "none" : "transform 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Double tap to like
interface DoubleTapProps {
  children: ReactNode;
  onDoubleTap: () => void;
}

export function DoubleTap({ children, onDoubleTap }: DoubleTapProps) {
  const lastTap = useRef(0);
  const [showHeart, setShowHeart] = useState(false);
  const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });

  const handleTap = (e: React.TouchEvent | React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0]?.clientX || 0 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY || 0 : e.clientY;
      
      setHeartPosition({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setShowHeart(true);
      onDoubleTap();

      setTimeout(() => setShowHeart(false), 1000);
    }

    lastTap.current = now;
  };

  return (
    <div
      className="relative"
      onTouchEnd={handleTap}
      onClick={handleTap}
    >
      {children}
      
      {showHeart && (
        <div
          className="absolute pointer-events-none z-50 animate-ping"
          style={{
            left: heartPosition.x - 25,
            top: heartPosition.y - 25,
          }}
        >
          <span className="text-5xl">❤️</span>
        </div>
      )}
    </div>
  );
}

