import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Library from "./pages/Library";
import Auth from "./pages/Auth";
import BookDetail from "./pages/BookDetail";
import ThreadDetail from "./pages/ThreadDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Library />} />

            {/* Auth page with Spline background */}
            <Route path="/auth" element={<Auth />} />

            {/* Book + Thread pages */}
            <Route path="/book/:bookId" element={<BookDetail />} />
            <Route path="/thread/:threadId" element={<ThreadDetail />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
