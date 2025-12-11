import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const HOMER_RESPONSES: Record<string, string[]> = {
  greeting: [
    "D'oh! Oh, hi there! 🍩",
    "Mmm... visitors... *drools*",
    "Woohoo! Someone to talk to!",
  ],
  donut: [
    "Mmm... donuts... 🍩 Did you bring any?",
    "Donuts. Is there anything they can't do?",
    "I would kill everyone in this room for a donut.",
  ],
  beer: [
    "To alcohol! The cause of, and solution to, all of life's problems. 🍺",
    "Mmm... beer...",
    "Here's to alcohol, the rose-colored glasses of life.",
  ],
  bart: [
    "Why you little...! *strangling sounds*",
    "That boy ain't right...",
    "Bart! Stop pestering Satan!",
  ],
  lisa: [
    "Lisa, vampires are make-believe, just like elves, gremlins, and Eskimos.",
    "Just because I don't care doesn't mean I don't understand.",
    "Lisa, if you don't like your job you don't strike. You just go in every day and do it really half-assed.",
  ],
  marge: [
    "Marge, it takes two to lie. One to lie and one to listen.",
    "Marge, I'm going to miss you so much. And it's not just the sex. It's also the food preparation.",
    "Oh, Marge, you're the best wife I ever had!",
  ],
  work: [
    "If something's hard to do, then it's not worth doing.",
    "Operator! Give me the number for 911!",
    "I'm not normally a praying man, but if you're up there, please save me, Superman!",
  ],
  food: [
    "You don't win friends with salad!",
    "Mmm... forbidden donut...",
    "I'm a white male, age 18 to 49. Everyone listens to me, no matter how dumb my suggestions are.",
  ],
  default: [
    "D'oh!",
    "Mmm... that's interesting...",
    "Why do things that happen to stupid people keep happening to me?",
    "I am so smart! S-M-R-T!",
    "Trying is the first step towards failure.",
    "Kids, you tried your best and you failed miserably. The lesson is, never try.",
    "Facts are meaningless. You could use facts to prove anything that's even remotely true!",
  ],
};

function getHomerResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
    return HOMER_RESPONSES.greeting[Math.floor(Math.random() * HOMER_RESPONSES.greeting.length)];
  }
  if (lowerInput.includes("donut") || lowerInput.includes("doughnut")) {
    return HOMER_RESPONSES.donut[Math.floor(Math.random() * HOMER_RESPONSES.donut.length)];
  }
  if (lowerInput.includes("beer") || lowerInput.includes("duff") || lowerInput.includes("drink")) {
    return HOMER_RESPONSES.beer[Math.floor(Math.random() * HOMER_RESPONSES.beer.length)];
  }
  if (lowerInput.includes("bart")) {
    return HOMER_RESPONSES.bart[Math.floor(Math.random() * HOMER_RESPONSES.bart.length)];
  }
  if (lowerInput.includes("lisa")) {
    return HOMER_RESPONSES.lisa[Math.floor(Math.random() * HOMER_RESPONSES.lisa.length)];
  }
  if (lowerInput.includes("marge")) {
    return HOMER_RESPONSES.marge[Math.floor(Math.random() * HOMER_RESPONSES.marge.length)];
  }
  if (lowerInput.includes("work") || lowerInput.includes("job") || lowerInput.includes("nuclear")) {
    return HOMER_RESPONSES.work[Math.floor(Math.random() * HOMER_RESPONSES.work.length)];
  }
  if (lowerInput.includes("food") || lowerInput.includes("eat") || lowerInput.includes("hungry")) {
    return HOMER_RESPONSES.food[Math.floor(Math.random() * HOMER_RESPONSES.food.length)];
  }
  
  return HOMER_RESPONSES.default[Math.floor(Math.random() * HOMER_RESPONSES.default.length)];
}

export function HomerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "D'oh! Oh, hi there! I'm Homer Simpson. What do you want to talk about? 🍩",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate Homer thinking
    setTimeout(() => {
      const response = getHomerResponse(input);
      const homerMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, homerMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-primary shadow-lg",
          "flex items-center justify-center text-2xl",
          "hover:scale-110 transition-transform animate-bounce-in",
          "border-4 border-primary-foreground/20",
          isOpen && "hidden"
        )}
        aria-label="Chat with Homer"
      >
        👨
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 md:w-96 animate-bounce-in">
          <div className="bg-card rounded-2xl border-4 border-primary shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👨</span>
                <div>
                  <h3 className="font-heading font-bold text-primary-foreground">
                    Homer Simpson
                  </h3>
                  <p className="text-xs text-primary-foreground/70 flex items-center gap-1">
                    <span className="w-2 h-2 bg-simpsons-green rounded-full animate-pulse" />
                    Online (probably eating)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-primary-foreground/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-muted/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      msg.isUser
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border-2 border-border rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm font-body">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border-2 border-border rounded-2xl rounded-bl-sm px-4 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask Homer anything..."
                  className="flex-1 px-4 py-2 rounded-full border-2 border-border bg-background font-body text-sm focus:border-primary focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                <Sparkles className="w-3 h-3 inline mr-1" />
                AI-powered Homer responses
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

