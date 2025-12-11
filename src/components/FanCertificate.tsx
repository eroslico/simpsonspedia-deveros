import { useRef, useState } from "react";
import { Download, Share2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useStreak } from "@/hooks/useStreak";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FanCertificateProps {
  username: string;
}

export function FanCertificate({ username }: FanCertificateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { totalFavorites } = useFavorites();
  const { currentStreak, longestStreak, totalVisits } = useStreak();

  const triviaHighScore = parseInt(localStorage.getItem("simpsonspedia-trivia-highscore") || "0");
  const watchedCount = JSON.parse(localStorage.getItem("simpsonspedia-watched") || "[]").length;

  // Calculate fan level
  const calculateLevel = () => {
    const points = totalFavorites * 10 + watchedCount * 5 + triviaHighScore + longestStreak * 20;
    if (points >= 1000) return { level: "Ultimate Fan", emoji: "👑", color: "#FFD700" };
    if (points >= 500) return { level: "Super Fan", emoji: "⭐", color: "#FF6B6B" };
    if (points >= 200) return { level: "Dedicated Fan", emoji: "🔥", color: "#4ECDC4" };
    if (points >= 50) return { level: "Rising Fan", emoji: "🌟", color: "#95E1D3" };
    return { level: "New Fan", emoji: "🍩", color: "#FFD93D" };
  };

  const fanLevel = calculateLevel();

  const generateCertificate = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, "#FFD93D");
    gradient.addColorStop(1, "#FF9500");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Inner white area
    ctx.fillStyle = "#FFFFFF";
    ctx.roundRect(30, 30, 740, 540, 20);
    ctx.fill();

    // Border
    ctx.strokeStyle = "#FFD93D";
    ctx.lineWidth = 8;
    ctx.roundRect(30, 30, 740, 540, 20);
    ctx.stroke();

    // Decorative corners
    ctx.fillStyle = "#FFD93D";
    ctx.font = "40px Arial";
    ctx.fillText("🍩", 50, 80);
    ctx.fillText("🍩", 720, 80);
    ctx.fillText("🍩", 50, 550);
    ctx.fillText("🍩", 720, 550);

    // Title
    ctx.fillStyle = "#333333";
    ctx.font = "bold 36px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("CERTIFICATE OF ACHIEVEMENT", 400, 100);

    // Subtitle
    ctx.font = "italic 20px Georgia, serif";
    ctx.fillStyle = "#666666";
    ctx.fillText("This certifies that", 400, 150);

    // Username
    ctx.font = "bold 48px Georgia, serif";
    ctx.fillStyle = "#FF6B00";
    ctx.fillText(username, 400, 210);

    // Fan Level
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = fanLevel.color;
    ctx.fillText(`${fanLevel.emoji} ${fanLevel.level} ${fanLevel.emoji}`, 400, 270);

    // Description
    ctx.font = "18px Georgia, serif";
    ctx.fillStyle = "#333333";
    ctx.fillText("has demonstrated exceptional knowledge and dedication", 400, 320);
    ctx.fillText("to The Simpsons universe", 400, 345);

    // Stats
    ctx.font = "16px Arial";
    ctx.fillStyle = "#666666";
    const stats = [
      `📺 ${watchedCount} Episodes Watched`,
      `❤️ ${totalFavorites} Favorites`,
      `🧠 ${triviaHighScore} Trivia Score`,
      `🔥 ${longestStreak} Day Best Streak`,
    ];
    
    const startY = 400;
    stats.forEach((stat, i) => {
      const x = i < 2 ? 250 : 550;
      const y = startY + (i % 2) * 30;
      ctx.fillText(stat, x, y);
    });

    // Date
    ctx.font = "italic 14px Georgia, serif";
    ctx.fillStyle = "#999999";
    ctx.fillText(`Issued on ${new Date().toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })}`, 400, 500);

    // Simpsonspedia branding
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#FFD93D";
    ctx.fillText("🍩 SIMPSONSPEDIA 🍩", 400, 540);

    setIsGenerating(false);
  };

  const downloadCertificate = async () => {
    await generateCertificate();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `simpsonspedia-certificate-${username.replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    
    toast.success("Certificate downloaded! 🎉");
  };

  const shareCertificate = async () => {
    await generateCertificate();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share) {
          const file = new File([blob], "simpsonspedia-certificate.png", { type: "image/png" });
          await navigator.share({
            title: "My Simpsonspedia Fan Certificate",
            text: `I'm a ${fanLevel.level} on Simpsonspedia! 🍩`,
            files: [file],
          });
        } else {
          // Fallback: copy to clipboard info
          await navigator.clipboard.writeText(
            `I'm a ${fanLevel.level} on Simpsonspedia! 🍩 Check it out!`
          );
          toast.success("Certificate info copied to clipboard!");
        }
      });
    } catch (error) {
      toast.error("Sharing failed");
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 border-2 border-border">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-heading font-bold text-foreground">Fan Certificate</h3>
      </div>

      <p className="text-sm text-muted-foreground font-body mb-4">
        Generate a personalized certificate showcasing your Simpsons fan achievements!
      </p>

      {/* Preview */}
      <div className="bg-gradient-to-br from-primary/20 to-simpsons-orange/20 rounded-xl p-4 mb-4 text-center">
        <span className="text-4xl mb-2 block">{fanLevel.emoji}</span>
        <p className="font-heading font-bold text-foreground">{username}</p>
        <p className="text-sm font-heading" style={{ color: fanLevel.color }}>
          {fanLevel.level}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={downloadCertificate}
          disabled={isGenerating}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={shareCertificate}
          disabled={isGenerating}
          variant="outline"
          className="font-heading rounded-full"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

