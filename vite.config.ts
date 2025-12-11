import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunks
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tooltip"],
          "vendor-query": ["@tanstack/react-query"],
          // Feature chunks
          "pages-games": [
            "./src/pages/Trivia.tsx",
            "./src/pages/MemoryGame.tsx",
            "./src/pages/Quiz.tsx",
            "./src/pages/Bingo.tsx",
            "./src/pages/GuessEpisode.tsx",
            "./src/pages/WhoSaidIt.tsx",
            "./src/pages/Wordle.tsx",
          ],
          "pages-tools": [
            "./src/pages/MemeGenerator.tsx",
            "./src/pages/Compare.tsx",
            "./src/pages/Soundboard.tsx",
            "./src/pages/QuoteGenerator.tsx",
            "./src/pages/DailyChallenge.tsx",
          ],
          "pages-data": [
            "./src/pages/Stats.tsx",
            "./src/pages/Timeline.tsx",
            "./src/pages/FamilyTree.tsx",
            "./src/pages/SpringfieldMap.tsx",
            "./src/pages/CouchGags.tsx",
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
  },
}));
