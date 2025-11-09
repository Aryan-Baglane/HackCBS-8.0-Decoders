import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Querypage from "./pages/Querypage";
import { withAuthenticationRequired } from "@auth0/auth0-react";

const queryClient = new QueryClient();

// ✅ Protect Querypage correctly
const ProtectedQuerypage = withAuthenticationRequired(Querypage, {
  returnTo: "/Querypage",
  onRedirecting: () => <div>Loading...</div>,   // optional
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* ✅ Public landing */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ✅ Protected route */}
          <Route path="/Querypage" element={<Querypage />} />

          {/* ✅ Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
