import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  type?: "character" | "episode" | "location";
  className?: string;
}

export function SkeletonCard({ type = "character", className }: SkeletonCardProps) {
  const isSquare = type === "character";
  
  return (
    <div
      className={cn(
        "bg-card rounded-2xl overflow-hidden border-4 border-border",
        "animate-pulse",
        className
      )}
    >
      {/* Image skeleton */}
      <div className={cn(
        "bg-muted",
        isSquare ? "aspect-square" : "aspect-video"
      )}>
        <div className="w-full h-full bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-shimmer" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {type === "episode" && (
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded-full" />
            <div className="h-6 w-24 bg-muted rounded-full" />
          </div>
        )}
        <div className="h-5 bg-muted rounded-lg w-3/4" />
        {type !== "character" && (
          <div className="h-4 bg-muted rounded-lg w-1/2" />
        )}
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  type?: "character" | "episode" | "location";
}

export function SkeletonGrid({ count = 12, type = "character" }: SkeletonGridProps) {
  const gridClass = type === "character"
    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={cn("grid gap-4 md:gap-6", gridClass)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} type={type} />
      ))}
    </div>
  );
}

