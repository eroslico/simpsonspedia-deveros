import { useCallback, useRef } from "react";

// Sound effects URLs (using free sound effects)
const SOUNDS = {
  doh: "https://www.myinstants.com/media/sounds/doh.mp3",
  woohoo: "https://www.myinstants.com/media/sounds/woohoo.mp3",
  excellent: "https://www.myinstants.com/media/sounds/the-simpsons-excellent.mp3",
  click: "data:audio/wav;base64,UklGRl9vT19teleXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",
} as const;

type SoundName = keyof typeof SOUNDS;

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const enabledRef = useRef<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("simpsonspedia-sounds");
      return saved !== "false";
    }
    return true;
  });

  const playSound = useCallback((sound: SoundName) => {
    if (!enabledRef.current) return;

    try {
      // Create a new audio element each time for overlapping sounds
      const audio = new Audio(SOUNDS[sound]);
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    } catch (error) {
      // Ignore errors
    }
  }, []);

  const toggleSound = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    localStorage.setItem("simpsonspedia-sounds", String(enabledRef.current));
    return enabledRef.current;
  }, []);

  const isSoundEnabled = useCallback(() => {
    return enabledRef.current;
  }, []);

  return {
    playSound,
    toggleSound,
    isSoundEnabled,
  };
}

