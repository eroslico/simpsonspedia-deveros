import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  RefreshCw, 
  Type,
  Image as ImageIcon,
  Palette,
  Search,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Character {
  id: number;
  name: string;
  portrait_path: string;
}

const MEME_TEMPLATES = [
  { id: "top-bottom", name: "Top & Bottom Text", icon: "📝" },
  { id: "top-only", name: "Top Text Only", icon: "⬆️" },
  { id: "bottom-only", name: "Bottom Text Only", icon: "⬇️" },
  { id: "caption", name: "Caption Below", icon: "💬" },
];

const TEXT_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Yellow", value: "#FFD700" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0066FF" },
];

export default function MemeGenerator() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [template, setTemplate] = useState("top-bottom");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const allCharacters: Character[] = [];
        for (let page = 1; page <= 5; page++) {
          const res = await fetch(`https://thesimpsonsapi.com/api/characters?page=${page}`);
          const data = await res.json();
          allCharacters.push(...(data.results || []));
          if (!data.next) break;
        }
        setCharacters(allCharacters);
        if (allCharacters.length > 0) {
          setSelectedCharacter(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const randomCharacter = () => {
    if (characters.length > 0) {
      const random = characters[Math.floor(Math.random() * characters.length)];
      setSelectedCharacter(random);
    }
  };

  const downloadMeme = async () => {
    if (!selectedCharacter || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `https://cdn.thesimpsonsapi.com/500${selectedCharacter.portrait_path}`;

    img.onload = () => {
      // Set canvas size
      const size = 500;
      canvas.width = size;
      canvas.height = template === "caption" ? size + 80 : size;

      // Draw background for caption template
      if (template === "caption") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw image
      ctx.drawImage(img, 0, 0, size, size);

      // Text settings
      ctx.textAlign = "center";
      ctx.lineWidth = 4;
      ctx.strokeStyle = textColor === "#FFFFFF" ? "#000000" : "#FFFFFF";
      ctx.fillStyle = textColor;

      const drawText = (text: string, y: number, fontSize: number) => {
        ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
        const words = text.split(" ");
        let line = "";
        const lines: string[] = [];
        const maxWidth = size - 40;

        words.forEach((word) => {
          const testLine = line + word + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && line !== "") {
            lines.push(line.trim());
            line = word + " ";
          } else {
            line = testLine;
          }
        });
        lines.push(line.trim());

        lines.forEach((l, i) => {
          const lineY = y + i * (fontSize + 5);
          ctx.strokeText(l.toUpperCase(), size / 2, lineY);
          ctx.fillText(l.toUpperCase(), size / 2, lineY);
        });
      };

      // Draw text based on template
      if (template === "top-bottom" || template === "top-only") {
        if (topText) drawText(topText, 50, 40);
      }
      if (template === "top-bottom" || template === "bottom-only") {
        if (bottomText) drawText(bottomText, size - 30, 40);
      }
      if (template === "caption") {
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 0;
        if (topText || bottomText) {
          ctx.font = "bold 24px Arial, sans-serif";
          ctx.fillText((topText || bottomText).toUpperCase(), size / 2, size + 50);
        }
      }

      // Download
      const link = document.createElement("a");
      link.download = `simpsons-meme-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Meme downloaded! 🎉");
    };

    img.onerror = () => {
      toast.error("Failed to load image");
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Meme Generator"
            subtitle="Create hilarious Simpsons memes in seconds"
            icon="🎨"
          />

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Preview */}
            <div className="order-2 lg:order-1">
              <div className="bg-card rounded-3xl p-6 border-4 border-border shadow-xl sticky top-24">
                <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Preview
                </h2>

                <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden mb-4">
                  {selectedCharacter ? (
                    <>
                      <img
                        src={`https://cdn.thesimpsonsapi.com/500${selectedCharacter.portrait_path}`}
                        alt={selectedCharacter.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Text Overlays */}
                      {(template === "top-bottom" || template === "top-only") && topText && (
                        <div 
                          className="absolute top-4 left-0 right-0 text-center px-4"
                          style={{ 
                            color: textColor,
                            textShadow: textColor === "#FFFFFF" 
                              ? "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000"
                              : "2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF"
                          }}
                        >
                          <p className="text-2xl md:text-3xl font-bold uppercase break-words" style={{ fontFamily: "Impact, Arial Black, sans-serif" }}>
                            {topText}
                          </p>
                        </div>
                      )}
                      
                      {(template === "top-bottom" || template === "bottom-only") && bottomText && (
                        <div 
                          className="absolute bottom-4 left-0 right-0 text-center px-4"
                          style={{ 
                            color: textColor,
                            textShadow: textColor === "#FFFFFF" 
                              ? "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000"
                              : "2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF"
                          }}
                        >
                          <p className="text-2xl md:text-3xl font-bold uppercase break-words" style={{ fontFamily: "Impact, Arial Black, sans-serif" }}>
                            {bottomText}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Select a character</p>
                    </div>
                  )}
                </div>

                {/* Caption template */}
                {template === "caption" && (topText || bottomText) && (
                  <div className="bg-white text-black text-center py-3 -mt-4 rounded-b-2xl">
                    <p className="font-bold uppercase text-lg">{topText || bottomText}</p>
                  </div>
                )}

                <p className="text-center text-sm text-muted-foreground mb-4">
                  {selectedCharacter?.name || "No character selected"}
                </p>

                <Button
                  onClick={downloadMeme}
                  disabled={!selectedCharacter}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full h-12"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Meme
                </Button>

                {/* Hidden canvas for download */}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>

            {/* Controls */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Character Selection */}
              <div className="bg-card rounded-3xl p-6 border-4 border-border shadow-xl">
                <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-secondary" />
                  Select Character
                </h2>

                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => setShowSearch(!showSearch)}
                    variant="outline"
                    className="flex-1 font-heading rounded-full"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    onClick={randomCharacter}
                    variant="outline"
                    className="font-heading rounded-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Random
                  </Button>
                </div>

                {showSearch && (
                  <div className="mb-4 animate-bounce-in">
                    <div className="relative mb-3">
                      <input
                        type="text"
                        placeholder="Search characters..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-muted rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                      {filteredCharacters.slice(0, 20).map((char) => (
                        <button
                          key={char.id}
                          onClick={() => {
                            setSelectedCharacter(char);
                            setShowSearch(false);
                            setSearchQuery("");
                          }}
                          className={cn(
                            "p-1 rounded-lg transition-all hover:scale-105",
                            selectedCharacter?.id === char.id && "ring-2 ring-primary"
                          )}
                        >
                          <img
                            src={`https://cdn.thesimpsonsapi.com/500${char.portrait_path}`}
                            alt={char.name}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Template Selection */}
              <div className="bg-card rounded-3xl p-6 border-4 border-border shadow-xl">
                <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <Type className="w-5 h-5 text-accent" />
                  Template
                </h2>

                <div className="grid grid-cols-2 gap-2">
                  {MEME_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all font-heading text-sm",
                        template === t.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="text-xl block mb-1">{t.icon}</span>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="bg-card rounded-3xl p-6 border-4 border-border shadow-xl">
                <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <Type className="w-5 h-5 text-primary" />
                  Text
                </h2>

                {(template === "top-bottom" || template === "top-only" || template === "caption") && (
                  <div className="mb-4">
                    <label className="text-sm font-heading text-muted-foreground mb-2 block">
                      {template === "caption" ? "Caption" : "Top Text"}
                    </label>
                    <input
                      type="text"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                      placeholder="Enter text..."
                      className="w-full px-4 py-3 bg-muted rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={100}
                    />
                  </div>
                )}

                {(template === "top-bottom" || template === "bottom-only") && (
                  <div>
                    <label className="text-sm font-heading text-muted-foreground mb-2 block">
                      Bottom Text
                    </label>
                    <input
                      type="text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                      placeholder="Enter text..."
                      className="w-full px-4 py-3 bg-muted rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={100}
                    />
                  </div>
                )}
              </div>

              {/* Color Selection */}
              {template !== "caption" && (
                <div className="bg-card rounded-3xl p-6 border-4 border-border shadow-xl">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-secondary" />
                    Text Color
                  </h2>

                  <div className="flex gap-2">
                    {TEXT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setTextColor(color.value)}
                        className={cn(
                          "w-10 h-10 rounded-full border-4 transition-transform hover:scale-110",
                          textColor === color.value ? "border-primary scale-110" : "border-border"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

