
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist";
import PartyPlanner from "./pages/PartyPlanner";
import TastingEvents from "./pages/TastingEvents";
import AlcoholGuide from "./pages/AlcoholGuide";
import Settings from "./pages/Settings";
import { HashRouter } from 'react-router-dom';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Index activeTab="profile" />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/planner" element={<PartyPlanner />} />
          <Route path="/events" element={<TastingEvents />} />
          <Route path="/guide" element={<AlcoholGuide />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
