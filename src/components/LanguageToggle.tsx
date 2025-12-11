import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "relative p-2 rounded-full transition-all duration-300",
        "bg-primary-foreground/20 hover:bg-primary-foreground/30",
        "border-2 border-primary-foreground/30 hover:border-primary-foreground/50",
        "font-heading text-sm font-bold text-primary-foreground"
      )}
      aria-label={language === "en" ? "Switch to Spanish" : "Switch to English"}
      title={language === "en" ? "Cambiar a Español" : "Switch to English"}
    >
      {language === "en" ? "🇺🇸" : "🇪🇸"}
    </button>
  );
}

