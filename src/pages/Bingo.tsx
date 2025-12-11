import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  Trophy,
  Share2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BINGO_ITEMS = [
  "Homer says D'oh!",
  "Bart's prank call",
  "Lisa plays sax",
  "Maggie falls",
  "Marge groans",
  "Mr. Burns says 'Excellent'",
  "Nelson says 'Ha-ha!'",
  "Krusty laughs",
  "Itchy & Scratchy",
  "Couch gag",
  "Chalkboard gag",
  "Flanders says 'Okily dokily'",
  "Moe's Tavern scene",
  "Springfield Elementary",
  "Nuclear plant shown",
  "Apu at Kwik-E-Mart",
  "Chief Wiggum eating",
  "Comic Book Guy insult",
  "Grandpa's story",
  "Patty & Selma smoking",
  "Sideshow Bob appears",
  "Milhouse gets hurt",
  "Ralph says something weird",
  "Smithers helps Burns",
  "Kent Brockman reports",
  "Dr. Hibbert laughs",
  "Lenny & Carl together",
  "Barney burps",
  "Otto drives bus",
  "Skinner & Chalmers",
];

interface BingoCell {
  text: string;
  marked: boolean;
}

function generateBingoCard(): BingoCell[][] {
  const shuffled = [...BINGO_ITEMS].sort(() => Math.random() - 0.5);
  const card: BingoCell[][] = [];
  
  for (let i = 0; i < 5; i++) {
    const row: BingoCell[] = [];
    for (let j = 0; j < 5; j++) {
      if (i === 2 && j === 2) {
        row.push({ text: "FREE 🍩", marked: true });
      } else {
        const index = i * 5 + j - (i > 2 || (i === 2 && j > 2) ? 1 : 0);
        row.push({ text: shuffled[index], marked: false });
      }
    }
    card.push(row);
  }
  
  return card;
}

function checkBingo(card: BingoCell[][]): { hasBingo: boolean; winningCells: [number, number][] } {
  const winningCells: [number, number][] = [];
  
  // Check rows
  for (let i = 0; i < 5; i++) {
    if (card[i].every(cell => cell.marked)) {
      card[i].forEach((_, j) => winningCells.push([i, j]));
    }
  }
  
  // Check columns
  for (let j = 0; j < 5; j++) {
    if (card.every(row => row[j].marked)) {
      card.forEach((_, i) => winningCells.push([i, j]));
    }
  }
  
  // Check diagonals
  if (card.every((row, i) => row[i].marked)) {
    for (let i = 0; i < 5; i++) winningCells.push([i, i]);
  }
  if (card.every((row, i) => row[4 - i].marked)) {
    for (let i = 0; i < 5; i++) winningCells.push([i, 4 - i]);
  }
  
  return { hasBingo: winningCells.length > 0, winningCells };
}

export default function Bingo() {
  const [card, setCard] = useState<BingoCell[][]>(generateBingoCard);
  const [hasBingo, setHasBingo] = useState(false);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gamesWon, setGamesWon] = useState(() => {
    return parseInt(localStorage.getItem("simpsonspedia-bingo-wins") || "0");
  });

  const toggleCell = useCallback((row: number, col: number) => {
    if (hasBingo) return;
    if (row === 2 && col === 2) return; // Can't unmark free space
    
    setCard(prev => {
      const newCard = prev.map((r, i) =>
        r.map((cell, j) =>
          i === row && j === col
            ? { ...cell, marked: !cell.marked }
            : cell
        )
      );
      return newCard;
    });
  }, [hasBingo]);

  useEffect(() => {
    const result = checkBingo(card);
    if (result.hasBingo && !hasBingo) {
      setHasBingo(true);
      setWinningCells(result.winningCells);
      setShowConfetti(true);
      const newWins = gamesWon + 1;
      setGamesWon(newWins);
      localStorage.setItem("simpsonspedia-bingo-wins", newWins.toString());
      toast.success("🎉 BINGO! You won!");
      
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [card, hasBingo, gamesWon]);

  const resetGame = () => {
    setCard(generateBingoCard());
    setHasBingo(false);
    setWinningCells([]);
  };

  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  const shareCard = async () => {
    const text = `🎯 I'm playing Simpsons Bingo on Simpsonspedia!\n\n${hasBingo ? "🏆 I got BINGO!" : "Playing..."}\n\nTotal wins: ${gamesWon}`;
    
    if (navigator.share) {
      await navigator.share({ title: "Simpsons Bingo", text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Confetti isActive={showConfetti} />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Simpsons Bingo"
            subtitle="Watch an episode and mark what you see!"
            icon="🎯"
          />

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-primary mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold text-foreground">{gamesWon}</p>
              <p className="text-sm text-muted-foreground">Games Won</p>
            </div>
          </div>

          {/* Bingo Card */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="bg-card rounded-3xl p-4 border-4 border-primary shadow-xl">
              {/* BINGO Header */}
              <div className="grid grid-cols-5 gap-1 mb-2">
                {["B", "I", "N", "G", "O"].map((letter, i) => (
                  <div
                    key={letter}
                    className="text-center text-2xl font-heading font-bold text-primary py-2"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {letter}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-5 gap-1">
                {card.map((row, i) =>
                  row.map((cell, j) => (
                    <button
                      key={`${i}-${j}`}
                      onClick={() => toggleCell(i, j)}
                      disabled={hasBingo || (i === 2 && j === 2)}
                      className={cn(
                        "aspect-square p-1 rounded-lg border-2 transition-all text-xs font-heading",
                        "flex items-center justify-center text-center leading-tight",
                        cell.marked
                          ? isWinningCell(i, j)
                            ? "bg-simpsons-green border-simpsons-green text-white animate-pulse"
                            : "bg-primary/30 border-primary text-foreground"
                          : "bg-background border-border hover:border-primary hover:bg-primary/10",
                        i === 2 && j === 2 && "bg-primary/50 border-primary"
                      )}
                    >
                      <span className="line-clamp-3">{cell.text}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Win Message */}
          {hasBingo && (
            <div className="text-center mb-8 animate-bounce-in">
              <div className="inline-block bg-gradient-to-r from-primary to-simpsons-orange rounded-2xl px-8 py-4">
                <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-white">
                  🎉 BINGO! 🎉
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={resetGame}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Card
            </Button>
            <Button
              onClick={shareCard}
              variant="outline"
              className="font-heading rounded-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Instructions */}
          <div className="max-w-md mx-auto mt-12 text-center">
            <h3 className="font-heading font-bold text-foreground mb-2">How to Play</h3>
            <p className="text-sm text-muted-foreground font-body">
              Watch any Simpsons episode and click on the squares when you see or hear 
              the event described. Get 5 in a row (horizontal, vertical, or diagonal) to win!
            </p>
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

