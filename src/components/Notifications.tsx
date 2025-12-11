import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { 
  Bell,
  X,
  Trophy,
  Flame,
  Star,
  Gift,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "achievement" | "streak" | "challenge" | "reward" | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("simpsonspedia-notifications");
    return saved ? JSON.parse(saved).map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp)
    })) : [];
  });

  useEffect(() => {
    localStorage.setItem("simpsonspedia-notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}

// Notification Bell Component
export function NotificationBell({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "achievement": return <Trophy className="w-4 h-4 text-primary" />;
      case "streak": return <Flame className="w-4 h-4 text-simpsons-orange" />;
      case "challenge": return <Star className="w-4 h-4 text-secondary" />;
      case "reward": return <Gift className="w-4 h-4 text-accent" />;
      case "reminder": return <Calendar className="w-4 h-4 text-simpsons-blue" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors relative"
      >
        <Bell className="w-5 h-5 text-primary-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-2xl border-2 border-border shadow-xl z-50 animate-bounce-in">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-heading font-bold text-foreground">Notifications</h3>
              {notifications.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline font-heading"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:underline font-heading"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-body">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "w-full text-left p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-heading text-sm",
                          notification.read ? "text-foreground" : "text-foreground font-bold"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-body line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

