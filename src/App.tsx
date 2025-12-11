import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EasterEgg } from "@/components/EasterEgg";
import { CouchGag } from "@/components/CouchGag";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { KeyboardShortcuts, ShortcutHint } from "@/components/KeyboardShortcuts";
import { NotificationProvider } from "@/components/Notifications";
import { HomerChat } from "@/components/HomerChat";
import { VoiceCommands, VoiceCommandsHelp } from "@/components/VoiceCommands";
import { NavigationGestures } from "@/components/GestureHandler";
import { SoundProvider, SoundToggle } from "@/components/SoundSystem";
import Index from "./pages/Index";
import Characters from "./pages/Characters";
import Episodes from "./pages/Episodes";
import Locations from "./pages/Locations";
import Favorites from "./pages/Favorites";
import Stats from "./pages/Stats";
import Trivia from "./pages/Trivia";
import Compare from "./pages/Compare";
import MemeGenerator from "./pages/MemeGenerator";
import Timeline from "./pages/Timeline";
import Profile from "./pages/Profile";
import Predictions from "./pages/Predictions";
import FamilyTree from "./pages/FamilyTree";
import Soundboard from "./pages/Soundboard";
import Quiz from "./pages/Quiz";
import MemoryGame from "./pages/MemoryGame";
import Bingo from "./pages/Bingo";
import QuoteGenerator from "./pages/QuoteGenerator";
import GuessEpisode from "./pages/GuessEpisode";
import SpringfieldMap from "./pages/SpringfieldMap";
import CouchGags from "./pages/CouchGags";
import WhoSaidIt from "./pages/WhoSaidIt";
import DailyChallenge from "./pages/DailyChallenge";
import Wordle from "./pages/Wordle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SoundProvider>
          <NotificationProvider>
            <EasterEgg>
              <Toaster />
              <Sonner />
            <BrowserRouter>
              <KeyboardShortcuts />
              <ShortcutHint />
              <NavigationGestures />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/characters" element={<Characters />} />
                <Route path="/episodes" element={<Episodes />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/trivia" element={<Trivia />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/memes" element={<MemeGenerator />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/predictions" element={<Predictions />} />
                <Route path="/family-tree" element={<FamilyTree />} />
                <Route path="/soundboard" element={<Soundboard />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/memory" element={<MemoryGame />} />
                <Route path="/bingo" element={<Bingo />} />
                <Route path="/quotes" element={<QuoteGenerator />} />
                <Route path="/guess" element={<GuessEpisode />} />
                <Route path="/map" element={<SpringfieldMap />} />
                <Route path="/couch-gags" element={<CouchGags />} />
                <Route path="/who-said-it" element={<WhoSaidIt />} />
                <Route path="/daily" element={<DailyChallenge />} />
                <Route path="/wordle" element={<Wordle />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <HomerChat />
              <VoiceCommands />
              <VoiceCommandsHelp />
            </BrowserRouter>
              <CouchGag />
              <OfflineIndicator />
              {/* Sound toggle button */}
              <div className="fixed bottom-4 left-4 z-50">
                <SoundToggle />
              </div>
            </EasterEgg>
          </NotificationProvider>
        </SoundProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
