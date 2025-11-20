import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Writing from "./pages/Writing";
import Transcription from "./pages/Transcription";
import Goals from "./pages/Goals";
import Diary from "./pages/Diary";
import Support from "./pages/Support";
import Awards from "./pages/Awards";
import Profile from "./pages/Profile";
import Export from "./pages/Export";
import Pricing from "./pages/Pricing";
import AdminMessage from "./pages/AdminMessage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/writing" element={<Layout><Writing /></Layout>} />
          <Route path="/transcription" element={<Layout><Transcription /></Layout>} />
          <Route path="/goals" element={<Layout><Goals /></Layout>} />
          <Route path="/diary" element={<Layout><Diary /></Layout>} />
          <Route path="/support" element={<Layout><Support /></Layout>} />
          <Route path="/awards" element={<Layout><Awards /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/export" element={<Layout><Export /></Layout>} />
          <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
          <Route path="/admin-message" element={<Layout><AdminMessage /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
