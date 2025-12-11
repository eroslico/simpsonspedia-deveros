import { useState, useEffect, useCallback } from "react";
import { translations, Language, TranslationKeys } from "@/i18n/translations";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("simpsonspedia-language");
      if (saved === "en" || saved === "es") return saved;
      
      // Detect browser language
      const browserLang = navigator.language.split("-")[0];
      return browserLang === "es" ? "es" : "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("simpsonspedia-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split(".");
      let value: any = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          // Fallback to English
          value = translations.en;
          for (const fallbackKey of keys) {
            if (value && typeof value === "object" && fallbackKey in value) {
              value = value[fallbackKey];
            } else {
              return key; // Return key if not found
            }
          }
          break;
        }
      }

      if (typeof value !== "string") return key;

      // Replace params
      if (params) {
        return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
          return String(params[paramKey] ?? `{${paramKey}}`);
        });
      }

      return value;
    },
    [language]
  );

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isEnglish: language === "en",
    isSpanish: language === "es",
  };
}

