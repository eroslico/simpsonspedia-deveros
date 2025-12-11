import { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT_COLORS = [
  { name: "Simpsons Yellow", value: "51 99% 55%", hex: "#FFD93D" },
  { name: "Donut Pink", value: "330 85% 70%", hex: "#FF85A2" },
  { name: "Duff Red", value: "0 80% 55%", hex: "#E63946" },
  { name: "Springfield Green", value: "120 60% 40%", hex: "#52B788" },
  { name: "Sky Blue", value: "197 90% 65%", hex: "#5BC0EB" },
  { name: "Moe's Purple", value: "260 50% 55%", hex: "#7B68EE" },
  { name: "Krusty Orange", value: "25 95% 55%", hex: "#F77F00" },
  { name: "Maggie Blue", value: "210 80% 60%", hex: "#4A90D9" },
];

const FONT_SIZES = [
  { name: "Small", value: "14px" },
  { name: "Normal", value: "16px" },
  { name: "Large", value: "18px" },
  { name: "Extra Large", value: "20px" },
];

export function ThemeCustomizer() {
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("simpsonspedia-accent") || "51 99% 55%";
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("simpsonspedia-fontsize") || "16px";
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Apply accent color
    document.documentElement.style.setProperty("--primary", accentColor);
    localStorage.setItem("simpsonspedia-accent", accentColor);
  }, [accentColor]);

  useEffect(() => {
    // Apply font size
    document.documentElement.style.fontSize = fontSize;
    localStorage.setItem("simpsonspedia-fontsize", fontSize);
  }, [fontSize]);

  const resetToDefault = () => {
    setAccentColor("51 99% 55%");
    setFontSize("16px");
  };

  return (
    <div className="bg-card rounded-2xl p-6 border-2 border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-heading font-bold text-foreground">Customize Theme</h3>
        </div>
        <span className={cn(
          "text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-6 animate-bounce-in">
          {/* Accent Color */}
          <div>
            <label className="text-sm font-heading text-muted-foreground mb-3 block">
              Accent Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  className={cn(
                    "aspect-square rounded-xl border-2 transition-all hover:scale-105 relative",
                    accentColor === color.value
                      ? "border-foreground scale-105"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {accentColor === color.value && (
                    <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="text-sm font-heading text-muted-foreground mb-3 block">
              Font Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className={cn(
                    "px-3 py-2 rounded-xl border-2 transition-all font-heading text-sm",
                    fontSize === size.value
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetToDefault}
            className="text-sm text-muted-foreground hover:text-foreground font-heading underline"
          >
            Reset to defaults
          </button>
        </div>
      )}
    </div>
  );
}

