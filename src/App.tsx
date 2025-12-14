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
import { NavigationGestures } from "@/components/GestureHandler";
import { ScrollToTopOnRouteChange } from "@/components/ScrollToTopOnRouteChange";
import Index from "./pages/Index";
import Characters from "./pages/Characters";
import Episodes from "./pages/Episodes";
import Locations from "./pages/Locations";
import Favorites from "./pages/Favorites";
import Stats from "./pages/Stats";
import Compare from "./pages/Compare";
import Predictions from "./pages/Predictions";
import DailyChallenge from "./pages/DailyChallenge";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <EasterEgg>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTopOnRouteChange />
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
                <Route path="/compare" element={<Compare />} />
                <Route path="/predictions" element={<Predictions />} />
                <Route path="/daily" element={<DailyChallenge />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <CouchGag />
            <OfflineIndicator />
          </EasterEgg>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
