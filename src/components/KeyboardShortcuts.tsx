import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Command,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Shortcut {
  keys: string[];
  description: string;
  action: () => void;
}

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const shortcuts: Shortcut[] = [
    { keys: ["?"], description: "Show keyboard shortcuts", action: () => setIsOpen(true) },
    { keys: ["g", "h"], description: "Go to Home", action: () => navigate("/") },
    { keys: ["g", "c"], description: "Go to Characters", action: () => navigate("/characters") },
    { keys: ["g", "e"], description: "Go to Episodes", action: () => navigate("/episodes") },
    { keys: ["g", "l"], description: "Go to Locations", action: () => navigate("/locations") },
    { keys: ["g", "f"], description: "Go to Favorites", action: () => navigate("/favorites") },
    { keys: ["g", "t"], description: "Go to Trivia", action: () => navigate("/trivia") },
    { keys: ["/"], description: "Focus search", action: () => {
      const searchBtn = document.querySelector('[aria-label="Search"]') as HTMLButtonElement;
      searchBtn?.click();
    }},
    { keys: ["Esc"], description: "Close modal/menu", action: () => setIsOpen(false) },
  ];

  useEffect(() => {
    let keySequence: string[] = [];
    let sequenceTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key;

      // Handle Escape
      if (key === "Escape") {
        setIsOpen(false);
        return;
      }

      // Handle ? for help
      if (key === "?" || (e.shiftKey && key === "/")) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      // Handle / for search
      if (key === "/" && !e.shiftKey) {
        e.preventDefault();
        const shortcut = shortcuts.find(s => s.keys[0] === "/");
        shortcut?.action();
        return;
      }

      // Build key sequence
      keySequence.push(key.toLowerCase());
      clearTimeout(sequenceTimeout);
      sequenceTimeout = setTimeout(() => {
        keySequence = [];
      }, 1000);

      // Check for matching shortcut
      const matchingShortcut = shortcuts.find(s => 
        s.keys.length === keySequence.length &&
        s.keys.every((k, i) => k.toLowerCase() === keySequence[i])
      );

      if (matchingShortcut) {
        e.preventDefault();
        matchingShortcut.action();
        keySequence = [];
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(sequenceTimeout);
    };
  }, [navigate, shortcuts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card rounded-2xl p-6 border-2 border-border shadow-2xl max-w-md w-full mx-4 animate-bounce-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
            <Command className="w-5 h-5 text-primary" />
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-muted rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((shortcut, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground font-body">
                {shortcut.description}
              </span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, j) => (
                  <span key={j}>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono font-bold text-foreground">
                      {key}
                    </kbd>
                    {j < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground mx-1">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center font-body">
          Press <kbd className="px-1 bg-muted rounded">?</kbd> anytime to toggle this menu
        </p>
      </div>
    </div>
  );
}

// Floating shortcut hint
export function ShortcutHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-bounce-in">
      <div className="bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 border border-border shadow-lg flex items-center gap-2">
        <Command className="w-4 h-4 text-primary" />
        <span className="text-sm font-body text-muted-foreground">
          Press <kbd className="px-1 bg-muted rounded font-mono">?</kbd> for shortcuts
        </span>
        <button
          onClick={() => setVisible(false)}
          className="p-0.5 hover:bg-muted rounded-full"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

