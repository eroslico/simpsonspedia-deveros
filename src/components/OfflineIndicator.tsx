import { useServiceWorker } from "@/hooks/useServiceWorker";
import { WifiOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfflineIndicator() {
  const { isOnline, isUpdateAvailable, updateApp } = useServiceWorker();

  if (isOnline && !isUpdateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-bounce-in">
      {!isOnline && (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-heading text-sm">
          <WifiOff className="w-4 h-4" />
          You're offline
        </div>
      )}
      
      {isUpdateAvailable && (
        <button
          onClick={updateApp}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-heading text-sm hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Update available - Click to refresh
        </button>
      )}
    </div>
  );
}

