import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Animated Donut SVG
export function AnimatedDonut({ className, size = 100 }: { className?: string; size?: number }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("drop-shadow-lg", className)}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Donut base */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="#D4A574"
        stroke="#8B6914"
        strokeWidth="2"
      />
      {/* Donut hole */}
      <circle cx="50" cy="50" r="15" fill="hsl(var(--background))" />
      {/* Pink frosting */}
      <path
        d="M 50 10 
           Q 80 15, 85 40 
           Q 90 65, 70 80 
           Q 50 95, 30 80 
           Q 10 65, 15 40 
           Q 20 15, 50 10"
        fill="#FF69B4"
        opacity="0.9"
      />
      {/* Frosting hole */}
      <circle cx="50" cy="50" r="18" fill="hsl(var(--background))" />
      {/* Sprinkles */}
      {[
        { x: 35, y: 25, color: "#FF0000", angle: 45 },
        { x: 60, y: 22, color: "#00FF00", angle: -30 },
        { x: 75, y: 45, color: "#0000FF", angle: 60 },
        { x: 70, y: 70, color: "#FFFF00", angle: -45 },
        { x: 45, y: 75, color: "#FF00FF", angle: 30 },
        { x: 25, y: 60, color: "#00FFFF", angle: -60 },
        { x: 28, y: 35, color: "#FFA500", angle: 15 },
        { x: 55, y: 30, color: "#800080", angle: -15 },
      ].map((sprinkle, i) => (
        <rect
          key={i}
          x={sprinkle.x - 4}
          y={sprinkle.y - 1.5}
          width="8"
          height="3"
          rx="1.5"
          fill={sprinkle.color}
          transform={`rotate(${sprinkle.angle} ${sprinkle.x} ${sprinkle.y})`}
        />
      ))}
    </svg>
  );
}

// Animated TV SVG
export function AnimatedTV({ className, size = 100 }: { className?: string; size?: number }) {
  const [screenColor, setScreenColor] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScreenColor(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("drop-shadow-lg", className)}
    >
      {/* TV body */}
      <rect
        x="10"
        y="20"
        width="80"
        height="60"
        rx="5"
        fill="#4A4A4A"
        stroke="#2A2A2A"
        strokeWidth="3"
      />
      {/* Screen */}
      <rect
        x="18"
        y="28"
        width="50"
        height="40"
        rx="2"
        fill={`hsl(${screenColor}, 70%, 50%)`}
      >
        <animate
          attributeName="fill"
          values="hsl(0, 70%, 50%);hsl(120, 70%, 50%);hsl(240, 70%, 50%);hsl(0, 70%, 50%)"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      {/* Screen glare */}
      <rect
        x="20"
        y="30"
        width="20"
        height="10"
        rx="1"
        fill="white"
        opacity="0.2"
      />
      {/* Buttons */}
      <circle cx="78" cy="40" r="4" fill="#FFD700" />
      <circle cx="78" cy="52" r="4" fill="#FF4444" />
      <circle cx="78" cy="64" r="4" fill="#44FF44" />
      {/* Antenna */}
      <line x1="35" y1="20" x2="25" y2="5" stroke="#2A2A2A" strokeWidth="3" strokeLinecap="round" />
      <line x1="65" y1="20" x2="75" y2="5" stroke="#2A2A2A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="25" cy="5" r="3" fill="#FFD700" />
      <circle cx="75" cy="5" r="3" fill="#FFD700" />
      {/* Legs */}
      <rect x="25" y="80" width="10" height="12" rx="2" fill="#2A2A2A" />
      <rect x="65" y="80" width="10" height="12" rx="2" fill="#2A2A2A" />
    </svg>
  );
}

// Animated Nuclear Symbol
export function AnimatedNuclear({ className, size = 100 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("drop-shadow-lg", className)}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Background circle */}
      <circle cx="50" cy="50" r="45" fill="#FFD700" filter="url(#glow)">
        <animate
          attributeName="r"
          values="43;47;43"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Nuclear symbol */}
      <g fill="#000" transform="translate(50, 50)">
        {/* Center circle */}
        <circle r="8" />
        
        {/* Blades */}
        {[0, 120, 240].map((angle, i) => (
          <path
            key={i}
            d="M 0 -12 Q 15 -25, 0 -40 Q -15 -25, 0 -12"
            transform={`rotate(${angle})`}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`${angle} 0 0`}
              to={`${angle + 360} 0 0`}
              dur="10s"
              repeatCount="indefinite"
            />
          </path>
        ))}
      </g>
    </svg>
  );
}

// Animated Beer SVG
export function AnimatedBeer({ className, size = 100 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("drop-shadow-lg", className)}
    >
      {/* Mug */}
      <path
        d="M 20 25 L 20 85 Q 20 95, 35 95 L 65 95 Q 80 95, 80 85 L 80 25 Z"
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="2"
      />
      
      {/* Beer liquid */}
      <rect x="25" y="35" width="50" height="55" rx="3" fill="#F4A460" />
      
      {/* Foam */}
      <ellipse cx="50" cy="35" rx="27" ry="12" fill="#FFFACD" />
      <ellipse cx="35" cy="30" rx="8" ry="6" fill="#FFFACD" />
      <ellipse cx="50" cy="28" rx="10" ry="7" fill="#FFFACD" />
      <ellipse cx="65" cy="30" rx="8" ry="6" fill="#FFFACD" />
      
      {/* Bubbles */}
      {[
        { cx: 35, delay: 0 },
        { cx: 50, delay: 0.5 },
        { cx: 65, delay: 1 },
        { cx: 42, delay: 1.5 },
        { cx: 58, delay: 2 },
      ].map((bubble, i) => (
        <circle key={i} cx={bubble.cx} r="3" fill="rgba(255,255,255,0.5)">
          <animate
            attributeName="cy"
            values="80;40"
            dur="2s"
            begin={`${bubble.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0"
            dur="2s"
            begin={`${bubble.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      
      {/* Handle */}
      <path
        d="M 80 35 Q 100 35, 100 55 Q 100 75, 80 75"
        fill="none"
        stroke="#DAA520"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Animated Springfield Cloud
export function AnimatedCloud({ className, size = 150 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 150 90"
      className={className}
    >
      <defs>
        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
      </defs>
      
      <g fill="url(#cloudGradient)">
        <ellipse cx="50" cy="60" rx="40" ry="25">
          <animate
            attributeName="rx"
            values="40;42;40"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="85" cy="55" rx="35" ry="30">
          <animate
            attributeName="ry"
            values="30;32;30"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="115" cy="60" rx="30" ry="22">
          <animate
            attributeName="rx"
            values="30;32;30"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="70" cy="40" rx="30" ry="22">
          <animate
            attributeName="cy"
            values="40;38;40"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="100" cy="35" rx="25" ry="20">
          <animate
            attributeName="cy"
            values="35;33;35"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>
    </svg>
  );
}

