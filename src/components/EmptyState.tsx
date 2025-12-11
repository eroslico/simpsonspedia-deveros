import { Search } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

export function EmptyState({
  title = "No results found",
  message = "Try adjusting your search or filters",
  icon = "🔍",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <span className="text-6xl mb-4 animate-bounce-in">{icon}</span>
      <h3 className="text-xl font-heading font-bold text-foreground mb-2 text-center">
        {title}
      </h3>
      <p className="text-muted-foreground font-body text-center max-w-md">
        {message}
      </p>
    </div>
  );
}

