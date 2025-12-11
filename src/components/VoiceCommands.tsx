import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoiceCommand {
  phrases: string[];
  action: () => void;
  feedback: string;
}

export function VoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();

  const commands: VoiceCommand[] = [
    {
      phrases: ["go home", "home page", "go to home"],
      action: () => navigate("/"),
      feedback: "Going to home page",
    },
    {
      phrases: ["show characters", "go to characters", "characters"],
      action: () => navigate("/characters"),
      feedback: "Opening characters",
    },
    {
      phrases: ["show episodes", "go to episodes", "episodes"],
      action: () => navigate("/episodes"),
      feedback: "Opening episodes",
    },
    {
      phrases: ["play trivia", "start trivia", "trivia game"],
      action: () => navigate("/trivia"),
      feedback: "Starting trivia game",
    },
    {
      phrases: ["play wordle", "start wordle", "wordle"],
      action: () => navigate("/wordle"),
      feedback: "Starting Wordle",
    },
    {
      phrases: ["dark mode", "toggle dark", "night mode"],
      action: () => {
        document.documentElement.classList.toggle("dark");
      },
      feedback: "Toggling dark mode",
    },
    {
      phrases: ["show favorites", "my favorites", "favorites"],
      action: () => navigate("/favorites"),
      feedback: "Opening favorites",
    },
    {
      phrases: ["daily challenge", "today's challenge"],
      action: () => navigate("/daily"),
      feedback: "Opening daily challenge",
    },
  ];

  useEffect(() => {
    setIsSupported("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  }, []);

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    for (const command of commands) {
      for (const phrase of command.phrases) {
        if (lowerText.includes(phrase)) {
          toast.success(command.feedback);
          command.action();
          return true;
        }
      }
    }
    
    toast.error("Command not recognized. Try again!");
    return false;
  }, [commands]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast.error("Voice commands not supported in this browser");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      
      setTranscript(text);
      
      if (result.isFinal) {
        processCommand(text);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      toast.error("Voice recognition error. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [isSupported, processCommand]);

  if (!isSupported) return null;

  return (
    <>
      {/* Voice button */}
      <button
        onClick={startListening}
        disabled={isListening}
        className={cn(
          "fixed bottom-20 left-4 z-50 w-12 h-12 rounded-full shadow-lg",
          "flex items-center justify-center transition-all",
          isListening
            ? "bg-destructive animate-pulse"
            : "bg-secondary hover:bg-secondary/90"
        )}
        aria-label="Voice commands"
      >
        {isListening ? (
          <MicOff className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-secondary-foreground" />
        )}
      </button>

      {/* Listening overlay */}
      {isListening && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
          <div className="bg-card rounded-3xl p-8 border-4 border-primary shadow-2xl text-center max-w-md mx-4 animate-bounce-in">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                <Mic className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-primary/50 mx-auto animate-ping" />
            </div>
            
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
              Listening...
            </h3>
            
            {transcript && (
              <p className="text-lg text-primary font-body mb-4">
                "{transcript}"
              </p>
            )}
            
            <p className="text-sm text-muted-foreground font-body">
              Try saying: "Go to characters" or "Play trivia"
            </p>

            <div className="flex justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${20 + Math.random() * 20}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Voice command help tooltip
export function VoiceCommandsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const commands = [
    { phrase: "Go home", description: "Navigate to homepage" },
    { phrase: "Show characters", description: "Open characters page" },
    { phrase: "Play trivia", description: "Start trivia game" },
    { phrase: "Play wordle", description: "Start Wordle game" },
    { phrase: "Dark mode", description: "Toggle dark theme" },
    { phrase: "Show favorites", description: "Open favorites" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-36 left-4 z-40 w-8 h-8 rounded-full bg-muted shadow-md flex items-center justify-center hover:bg-muted/80 transition-colors"
        aria-label="Voice commands help"
      >
        <Volume2 className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-card rounded-2xl p-6 border-2 border-border shadow-xl max-w-sm w-full animate-bounce-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              Voice Commands
            </h3>
            
            <div className="space-y-2">
              {commands.map((cmd) => (
                <div key={cmd.phrase} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="font-heading text-primary">"{cmd.phrase}"</span>
                  <span className="text-sm text-muted-foreground">{cmd.description}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 py-2 bg-primary text-primary-foreground rounded-full font-heading hover:bg-primary/90 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

