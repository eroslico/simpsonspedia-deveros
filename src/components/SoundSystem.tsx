import { createContext, useContext, useCallback, useRef, useState, ReactNode, useEffect } from "react";

interface SoundContextType {
  playSound: (sound: SoundType) => void;
  toggleMute: () => void;
  isMuted: boolean;
  setVolume: (volume: number) => void;
  volume: number;
}

type SoundType = 
  | "click" 
  | "hover" 
  | "success" 
  | "error" 
  | "woohoo" 
  | "doh" 
  | "pop" 
  | "whoosh"
  | "ding"
  | "levelUp";

const SoundContext = createContext<SoundContextType | null>(null);

// Sound frequencies and patterns for Web Audio API
const soundConfigs: Record<SoundType, { frequencies: number[]; durations: number[]; type: OscillatorType }> = {
  click: { frequencies: [800, 600], durations: [0.05, 0.05], type: "square" },
  hover: { frequencies: [400], durations: [0.03], type: "sine" },
  success: { frequencies: [523, 659, 784], durations: [0.1, 0.1, 0.2], type: "sine" },
  error: { frequencies: [200, 150], durations: [0.1, 0.2], type: "sawtooth" },
  woohoo: { frequencies: [300, 400, 500, 600, 700], durations: [0.08, 0.08, 0.08, 0.08, 0.15], type: "sine" },
  doh: { frequencies: [400, 300, 200], durations: [0.15, 0.15, 0.3], type: "triangle" },
  pop: { frequencies: [600, 900], durations: [0.02, 0.05], type: "sine" },
  whoosh: { frequencies: [200, 800, 200], durations: [0.05, 0.1, 0.05], type: "sine" },
  ding: { frequencies: [880, 1100], durations: [0.1, 0.3], type: "sine" },
  levelUp: { frequencies: [523, 659, 784, 1047], durations: [0.1, 0.1, 0.1, 0.3], type: "sine" },
};

export function SoundProvider({ children }: { children: ReactNode }) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("simpsonspedia-muted") === "true";
    }
    return false;
  });
  const [volume, setVolumeState] = useState(() => {
    if (typeof window !== "undefined") {
      return parseFloat(localStorage.getItem("simpsonspedia-volume") || "0.3");
    }
    return 0.3;
  });

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((sound: SoundType) => {
    if (isMuted) return;

    try {
      const ctx = getAudioContext();
      const config = soundConfigs[sound];
      
      let startTime = ctx.currentTime;
      
      config.frequencies.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(freq, startTime);
        
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + config.durations[i]);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + config.durations[i]);
        
        startTime += config.durations[i] * 0.8;
      });
    } catch (e) {
      console.warn("Sound playback failed:", e);
    }
  }, [isMuted, volume, getAudioContext]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem("simpsonspedia-muted", String(newValue));
      return newValue;
    });
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem("simpsonspedia-volume", String(newVolume));
  }, []);

  return (
    <SoundContext.Provider value={{ playSound, toggleMute, isMuted, setVolume, volume }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}

// Sound toggle button component
export function SoundToggle() {
  const { isMuted, toggleMute, volume, setVolume, playSound } = useSound();
  const [showVolume, setShowVolume] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          toggleMute();
          if (isMuted) playSound("pop");
        }}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
        className="p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
        title={isMuted ? "Unmute sounds" : "Mute sounds"}
      >
        {isMuted ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Volume slider */}
      {showVolume && !isMuted && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-card rounded-lg shadow-lg border border-border">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-2 accent-primary"
          />
        </div>
      )}
    </div>
  );
}

// Hook for adding sound to buttons
export function useSoundButton() {
  const { playSound } = useSound();

  return {
    onClick: () => playSound("click"),
    onMouseEnter: () => playSound("hover"),
  };
}

// Hook for adding sound to cards
export function useSoundCard() {
  const { playSound } = useSound();
  const timeoutRef = useRef<NodeJS.Timeout>();

  return {
    onMouseEnter: () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => playSound("pop"), 50);
    },
    onMouseLeave: () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
  };
}

