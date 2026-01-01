import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Landing from "./pages/Landing";
import Library from "./pages/Library";
import Auth from "./pages/Auth";
import BookDetail from "./pages/BookDetail";
import ThreadDetail from "./pages/ThreadDetail";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import UserSearch from "./pages/UserSearch";
import UserProfile from "./pages/UserProfile";
import MyProfile from "./pages/MyProfile";
import Pricing from "./pages/Pricing";
import Events from "./pages/Events";
import AdminPanel from "./pages/AdminPanel";
import AboutUs from "./pages/AboutUs";
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
            <Route path="/" element={<Landing />} />
            
            {/* Library */}
            <Route path="/library" element={<Library />} />

            {/* Auth page with Spline background */}
            <Route path="/auth" element={<Auth />} />

            {/* Book + Thread pages */}
            <Route path="/book/:bookId" element={<BookDetail />} />
            <Route path="/thread/:threadId" element={<ThreadDetail />} />
            
            {/* User pages */}
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/search-users" element={<UserSearch />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/events" element={<Events />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/about" element={<AboutUs />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
