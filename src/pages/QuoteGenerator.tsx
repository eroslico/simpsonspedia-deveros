import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Download,
  Share2,
  Heart,
  Copy,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Quote {
  text: string;
  character: string;
  episode?: string;
}

const QUOTES: Quote[] = [
  { text: "D'oh!", character: "Homer Simpson" },
  { text: "Eat my shorts!", character: "Bart Simpson" },
  { text: "Don't have a cow, man!", character: "Bart Simpson" },
  { text: "¡Ay, caramba!", character: "Bart Simpson" },
  { text: "I'm Bart Simpson, who the hell are you?", character: "Bart Simpson" },
  { text: "Why you little...!", character: "Homer Simpson" },
  { text: "Mmm... donuts.", character: "Homer Simpson" },
  { text: "To alcohol! The cause of, and solution to, all of life's problems.", character: "Homer Simpson" },
  { text: "I am so smart! S-M-R-T!", character: "Homer Simpson" },
  { text: "Kids, you tried your best and you failed miserably. The lesson is, never try.", character: "Homer Simpson" },
  { text: "Ha-ha!", character: "Nelson Muntz" },
  { text: "Excellent.", character: "Mr. Burns" },
  { text: "Hi-diddly-ho, neighborino!", character: "Ned Flanders" },
  { text: "Okily dokily!", character: "Ned Flanders" },
  { text: "Stupid sexy Flanders!", character: "Homer Simpson" },
  { text: "I didn't do it!", character: "Bart Simpson" },
  { text: "The truth? You can't handle the truth! No truth-handler, you!", character: "Homer Simpson" },
  { text: "I'm not a nerd. Nerds are smart.", character: "Milhouse Van Houten" },
  { text: "Everything's coming up Milhouse!", character: "Milhouse Van Houten" },
  { text: "Release the hounds.", character: "Mr. Burns" },
  { text: "Me fail English? That's unpossible!", character: "Ralph Wiggum" },
  { text: "I bent my wookie.", character: "Ralph Wiggum" },
  { text: "My cat's breath smells like cat food.", character: "Ralph Wiggum" },
  { text: "I'm learnding!", character: "Ralph Wiggum" },
  { text: "Worst. Episode. Ever.", character: "Comic Book Guy" },
  { text: "Thank you, come again!", character: "Apu Nahasapeemapetilon" },
  { text: "Bake him away, toys.", character: "Chief Wiggum" },
  { text: "I've said it before and I'll say it again: democracy simply doesn't work.", character: "Kent Brockman" },
  { text: "You don't win friends with salad.", character: "Homer Simpson" },
  { text: "Just because I don't care doesn't mean I don't understand.", character: "Homer Simpson" },
];

const BACKGROUNDS = [
  { name: "Simpsons Yellow", gradient: "linear-gradient(135deg, #FFD93D 0%, #FF9500 100%)" },
  { name: "Springfield Sky", gradient: "linear-gradient(135deg, #5BC0EB 0%, #9BC53D 100%)" },
  { name: "Donut Pink", gradient: "linear-gradient(135deg, #FF85A2 0%, #FFD93D 100%)" },
  { name: "Moe's Purple", gradient: "linear-gradient(135deg, #7B68EE 0%, #E040FB 100%)" },
  { name: "Duff Red", gradient: "linear-gradient(135deg, #E63946 0%, #FF6B6B 100%)" },
  { name: "Nuclear Green", gradient: "linear-gradient(135deg, #52B788 0%, #95D5B2 100%)" },
  { name: "Night Mode", gradient: "linear-gradient(135deg, #1a1625 0%, #2d2640 100%)" },
  { name: "Sunset", gradient: "linear-gradient(135deg, #F77F00 0%, #D62828 100%)" },
];

export default function QuoteGenerator() {
  const [quote, setQuote] = useState<Quote>(QUOTES[0]);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const [favorites, setFavorites] = useState<Quote[]>(() => {
    const saved = localStorage.getItem("simpsonspedia-favorite-quotes");
    return saved ? JSON.parse(saved) : [];
  });
  const [showPalette, setShowPalette] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getRandomQuote = () => {
    let newQuote = quote;
    while (newQuote === quote && QUOTES.length > 1) {
      newQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }
    setQuote(newQuote);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  const isFavorite = favorites.some(f => f.text === quote.text);

  const toggleFavorite = () => {
    let newFavorites: Quote[];
    if (isFavorite) {
      newFavorites = favorites.filter(f => f.text !== quote.text);
    } else {
      newFavorites = [...favorites, quote];
    }
    setFavorites(newFavorites);
    localStorage.setItem("simpsonspedia-favorite-quotes", JSON.stringify(newFavorites));
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites!");
  };

  const copyQuote = async () => {
    await navigator.clipboard.writeText(`"${quote.text}" - ${quote.character}`);
    toast.success("Quote copied!");
  };

  const downloadQuote = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    const colors = background.gradient.match(/#[a-fA-F0-9]{6}/g) || ["#FFD93D", "#FF9500"];
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Quote text
    ctx.fillStyle = background.name === "Night Mode" ? "#FFFFFF" : "#000000";
    ctx.font = "bold 48px Georgia, serif";
    ctx.textAlign = "center";
    
    // Word wrap
    const maxWidth = 1000;
    const words = quote.text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== "") {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());

    const lineHeight = 60;
    const startY = 315 - (lines.length * lineHeight) / 2;

    lines.forEach((line, i) => {
      ctx.fillText(`"${line}"`, 600, startY + i * lineHeight);
    });

    // Character name
    ctx.font = "italic 32px Georgia, serif";
    ctx.fillStyle = background.name === "Night Mode" ? "#CCCCCC" : "#333333";
    ctx.fillText(`- ${quote.character}`, 600, startY + lines.length * lineHeight + 50);

    // Branding
    ctx.font = "bold 24px Arial";
    ctx.fillText("🍩 Simpsonspedia", 600, 580);

    const link = document.createElement("a");
    link.download = `simpsons-quote-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    
    toast.success("Quote image downloaded!");
  };

  const shareQuote = async () => {
    const text = `"${quote.text}" - ${quote.character}\n\n🍩 From Simpsonspedia`;
    
    if (navigator.share) {
      await navigator.share({ title: "Simpsons Quote", text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Quote copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Quote Generator"
            subtitle="Discover and share iconic Simpsons quotes"
            icon="💬"
          />

          {/* Quote Card */}
          <div className="max-w-2xl mx-auto mb-8">
            <div
              className="rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-500"
              style={{ background: background.gradient }}
            >
              <div className={cn(
                "text-center",
                background.name === "Night Mode" ? "text-white" : "text-black"
              )}>
                <p className="text-2xl md:text-4xl font-heading font-bold mb-6 leading-relaxed">
                  "{quote.text}"
                </p>
                <p className={cn(
                  "text-lg md:text-xl font-body italic",
                  background.name === "Night Mode" ? "text-gray-300" : "text-gray-700"
                )}>
                  — {quote.character}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              onClick={getRandomQuote}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Quote
            </Button>
            <Button
              onClick={toggleFavorite}
              variant="outline"
              className={cn(
                "font-heading rounded-full",
                isFavorite && "bg-accent/20 border-accent"
              )}
            >
              <Heart className={cn("w-4 h-4 mr-2", isFavorite && "fill-accent text-accent")} />
              {isFavorite ? "Favorited" : "Favorite"}
            </Button>
            <Button
              onClick={copyQuote}
              variant="outline"
              className="font-heading rounded-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              onClick={() => setShowPalette(!showPalette)}
              variant="outline"
              className="font-heading rounded-full"
            >
              <Palette className="w-4 h-4 mr-2" />
              Style
            </Button>
            <Button
              onClick={downloadQuote}
              variant="outline"
              className="font-heading rounded-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={shareQuote}
              variant="outline"
              className="font-heading rounded-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Color Palette */}
          {showPalette && (
            <div className="max-w-md mx-auto mb-8 animate-bounce-in">
              <div className="bg-card rounded-2xl p-4 border-2 border-border">
                <p className="text-sm font-heading text-muted-foreground mb-3 text-center">
                  Choose Background
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => setBackground(bg)}
                      className={cn(
                        "aspect-square rounded-xl transition-all hover:scale-105",
                        background.name === bg.name && "ring-2 ring-foreground ring-offset-2"
                      )}
                      style={{ background: bg.gradient }}
                      title={bg.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent" />
                Your Favorite Quotes ({favorites.length})
              </h3>
              <div className="space-y-3">
                {favorites.slice(0, 5).map((fav, i) => (
                  <button
                    key={i}
                    onClick={() => setQuote(fav)}
                    className="w-full text-left bg-card rounded-xl p-4 border-2 border-border hover:border-primary transition-all"
                  >
                    <p className="font-heading text-foreground">"{fav.text}"</p>
                    <p className="text-sm text-muted-foreground font-body">— {fav.character}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </PageTransition>
      <ScrollToTop />
      
      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

