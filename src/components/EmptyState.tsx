interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No results found",
  message = "Try adjusting your search or filters",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <h3 className="text-sm font-medium text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
