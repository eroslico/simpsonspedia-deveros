import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SwipeableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function SwipeableModal({
  open,
  onOpenChange,
  children,
  title,
  className,
}: SwipeableModalProps) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable swipe when at top of scroll
    if (contentRef.current && contentRef.current.scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    // Only allow dragging down
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      // Close modal if dragged more than 100px
      onOpenChange(false);
    }
    setDragY(0);
    setIsDragging(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl max-h-[90vh] overflow-hidden p-0 gap-0 rounded-t-3xl md:rounded-3xl",
          "fixed bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2",
          "w-full md:w-auto",
          "data-[state=open]:animate-slide-up md:data-[state=open]:animate-in",
          "data-[state=closed]:animate-slide-down md:data-[state=closed]:animate-out",
          className
        )}
        style={{
          transform: isDragging ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? "none" : "transform 0.2s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe indicator (mobile only) */}
        <div className="md:hidden flex justify-center py-3 bg-card">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card sticky top-0 z-10">
          <DialogTitle className="font-heading font-bold text-lg text-foreground">
            {title || "Details"}
          </DialogTitle>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="overflow-y-auto max-h-[calc(90vh-80px)] overscroll-contain"
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

