import { useState } from "react";
import { 
  Download, 
  Upload, 
  FileJson, 
  FileSpreadsheet,
  Check,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ExportData {
  version: string;
  exportedAt: string;
  favorites: any[];
  reviews: any[];
  watched: number[];
  triviaHighScore: number;
  soundFavorites: string[];
  username: string;
  visits: number;
}

export function DataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const collectData = (): ExportData => {
    return {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      favorites: JSON.parse(localStorage.getItem("simpsonspedia-favorites") || "[]"),
      reviews: JSON.parse(localStorage.getItem("simpsonspedia-reviews") || "[]"),
      watched: JSON.parse(localStorage.getItem("simpsonspedia-watched") || "[]"),
      triviaHighScore: parseInt(localStorage.getItem("simpsonspedia-trivia-highscore") || "0"),
      soundFavorites: JSON.parse(localStorage.getItem("simpsonspedia-sound-favorites") || "[]"),
      username: localStorage.getItem("simpsonspedia-username") || "Springfield Resident",
      visits: parseInt(localStorage.getItem("simpsonspedia-visits") || "0"),
    };
  };

  const exportAsJSON = () => {
    setIsExporting(true);
    try {
      const data = collectData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `simpsonspedia-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsCSV = () => {
    setIsExporting(true);
    try {
      const data = collectData();
      
      // Create CSV for favorites
      let csv = "Type,ID,Name,Image,Added At\n";
      data.favorites.forEach((fav: any) => {
        csv += `${fav.type},${fav.id},"${fav.name}","${fav.image || ''}","${fav.addedAt}"\n`;
      });
      
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `simpsonspedia-favorites-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Favorites exported as CSV!");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: ExportData = JSON.parse(content);

        // Validate data structure
        if (!data.version || !data.exportedAt) {
          throw new Error("Invalid backup file");
        }

        // Import data
        if (data.favorites) {
          localStorage.setItem("simpsonspedia-favorites", JSON.stringify(data.favorites));
        }
        if (data.reviews) {
          localStorage.setItem("simpsonspedia-reviews", JSON.stringify(data.reviews));
        }
        if (data.watched) {
          localStorage.setItem("simpsonspedia-watched", JSON.stringify(data.watched));
        }
        if (data.triviaHighScore) {
          localStorage.setItem("simpsonspedia-trivia-highscore", data.triviaHighScore.toString());
        }
        if (data.soundFavorites) {
          localStorage.setItem("simpsonspedia-sound-favorites", JSON.stringify(data.soundFavorites));
        }
        if (data.username) {
          localStorage.setItem("simpsonspedia-username", data.username);
        }

        toast.success("Data imported successfully! Refresh to see changes.");
      } catch (error) {
        toast.error("Failed to import data. Invalid file format.");
      } finally {
        setIsImporting(false);
        // Reset input
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone!")) {
      const keys = [
        "simpsonspedia-favorites",
        "simpsonspedia-reviews",
        "simpsonspedia-watched",
        "simpsonspedia-trivia-highscore",
        "simpsonspedia-sound-favorites",
        "simpsonspedia-username",
        "simpsonspedia-visits",
        "simpsonspedia-first-visit",
      ];
      keys.forEach((key) => localStorage.removeItem(key));
      toast.success("All data cleared. Refresh to see changes.");
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 border-2 border-border">
      <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
        <FileJson className="w-5 h-5 text-primary" />
        Data Management
      </h3>

      <div className="space-y-4">
        {/* Export Section */}
        <div>
          <p className="text-sm text-muted-foreground font-body mb-3">
            Export your data to keep a backup or transfer to another device.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={exportAsJSON}
              disabled={isExporting}
              variant="outline"
              className="font-heading"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              onClick={exportAsCSV}
              disabled={isExporting}
              variant="outline"
              className="font-heading"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Import Section */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground font-body mb-3">
            Import data from a previous backup.
          </p>
          <label className="inline-flex">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              disabled={isImporting}
              className="hidden"
            />
            <Button
              asChild
              disabled={isImporting}
              variant="outline"
              className="font-heading cursor-pointer"
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {isImporting ? "Importing..." : "Import Backup"}
              </span>
            </Button>
          </label>
        </div>

        {/* Clear Data */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground font-body mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            Danger zone: This will delete all your data permanently.
          </p>
          <Button
            onClick={clearAllData}
            variant="destructive"
            className="font-heading"
          >
            Clear All Data
          </Button>
        </div>
      </div>
    </div>
  );
}

