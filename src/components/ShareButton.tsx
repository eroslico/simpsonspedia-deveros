import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ShareButton({ title, text, className, size = "md" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = window.location.href;
  const shareText = text || `Check out ${title} on Simpsonspedia!`;

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error
      }
    }
  };

  // Use native share on mobile if available
  if (navigator.share) {
    return (
      <button
        onClick={nativeShare}
        className={cn(
          "rounded-full flex items-center justify-center",
          "bg-card/90 backdrop-blur-sm border-2 border-border shadow-lg",
          "hover:border-secondary hover:text-secondary",
          "transition-all duration-300 hover:scale-110",
          "text-muted-foreground",
          sizeClasses[size],
          className
        )}
        aria-label="Share"
      >
        <Share2 className={iconSizes[size]} />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "rounded-full flex items-center justify-center",
            "bg-card/90 backdrop-blur-sm border-2 border-border shadow-lg",
            "hover:border-secondary hover:text-secondary",
            "transition-all duration-300 hover:scale-110",
            "text-muted-foreground",
            sizeClasses[size],
            className
          )}
          aria-label="Share"
        >
          <Share2 className={iconSizes[size]} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-card border-2 border-border shadow-xl rounded-xl"
        align="end"
      >
        <DropdownMenuItem
          onClick={copyToClipboard}
          className="font-heading cursor-pointer gap-2 py-3"
        >
          {copied ? (
            <Check className="w-4 h-4 text-simpsons-green" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={shareToTwitter}
          className="font-heading cursor-pointer gap-2 py-3"
        >
          <Twitter className="w-4 h-4" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={shareToFacebook}
          className="font-heading cursor-pointer gap-2 py-3"
        >
          <Facebook className="w-4 h-4" />
          Share on Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

