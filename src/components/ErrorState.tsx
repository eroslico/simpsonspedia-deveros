import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Oops! Something went wrong",
  message = "We couldn't load the data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
          <AlertTriangle className="w-12 h-12 text-destructive" />
        </div>
        <span className="absolute -top-2 -right-2 text-4xl animate-bounce">😱</span>
      </div>
      
      <h2 className="text-2xl font-heading font-bold text-foreground mb-2 text-center">
        {title}
      </h2>
      <p className="text-muted-foreground font-body text-center max-w-md mb-6">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full px-6"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
      
      <p className="text-sm text-muted-foreground mt-8 font-body italic">
        "D'oh!" - Homer Simpson
      </p>
    </div>
  );
}

