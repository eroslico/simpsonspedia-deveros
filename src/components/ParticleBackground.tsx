import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: "donut" | "star" | "circle";
  rotation: number;
  rotationSpeed: number;
}

const COLORS = ["#FFD93D", "#FF6B6B", "#4ECDC4", "#FF85A2", "#5BC0EB"];
const EMOJIS = ["🍩", "⭐", "✨"];

export function ParticleBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const count = Math.min(50, Math.floor(window.innerWidth / 30));

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 20 + 10,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          type: Math.random() > 0.7 ? "donut" : Math.random() > 0.5 ? "star" : "circle",
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        });
      }

      particlesRef.current = particles;
    };

    const drawParticle = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = 0.6;

      if (p.type === "donut") {
        ctx.font = `${p.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🍩", 0, 0);
      } else if (p.type === "star") {
        ctx.font = `${p.size * 0.8}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✨", 0, 0);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx -= (dx / dist) * force * 0.02;
          p.vy -= (dy / dist) * force * 0.02;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Bounds
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        drawParticle(p);
      });

      // Draw connections
      ctx.strokeStyle = "rgba(255, 217, 61, 0.1)";
      ctx.lineWidth = 1;
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.globalAlpha = (150 - dist) / 150 * 0.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "fixed inset-0 pointer-events-none z-0",
        className
      )}
    />
  );
}

// Floating elements for hero section
export function FloatingElements() {
  const elements = [
    { emoji: "🍩", delay: 0, duration: 6, x: 10, y: 20 },
    { emoji: "🍺", delay: 1, duration: 7, x: 85, y: 15 },
    { emoji: "📺", delay: 2, duration: 5, x: 15, y: 70 },
    { emoji: "🎸", delay: 0.5, duration: 8, x: 80, y: 65 },
    { emoji: "🛹", delay: 1.5, duration: 6, x: 25, y: 40 },
    { emoji: "🎷", delay: 2.5, duration: 7, x: 75, y: 35 },
    { emoji: "☢️", delay: 3, duration: 5, x: 90, y: 80 },
    { emoji: "🏠", delay: 0.8, duration: 6, x: 5, y: 50 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((el, i) => (
        <div
          key={i}
          className="absolute text-4xl md:text-5xl opacity-20 animate-float"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            animationDelay: `${el.delay}s`,
            animationDuration: `${el.duration}s`,
          }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  );
}

