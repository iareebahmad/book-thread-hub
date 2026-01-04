import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, LogOut, Heart, Settings, Users, Menu, CreditCard, Calendar, User, Shield, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';
import { useIsAdmin } from '@/hooks/useIsAdmin';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-users?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  return (
    <nav className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-50 glow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold gradient-text">BookThreads</span>
        </button>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-1.5">
            {/* Desktop Search Box */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-9 pr-4 h-9 bg-secondary/50 border-border/50 rounded-full text-sm focus:w-72 transition-all duration-300"
              />
            </form>

            {/* Mobile Search Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              {showMobileSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/my-profile')}
            >
              <User className="w-6 h-6" />
            </Button>

            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>

              {/* Modern dropdown */}
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl bg-card/90 backdrop-blur-xl border border-border/40 shadow-xl p-2 animate-in fade-in-0 zoom-in-95 duration-150"
              >
                {/* Section: Navigation */}
                <div className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase">
                  Navigation
                </div>

                <DropdownMenuItem
                  onClick={() => navigate('/events')}
                  className="rounded-md cursor-pointer py-2 px-2"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Events
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate('/favorites')}
                  className="rounded-md cursor-pointer py-2 px-2"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favourites
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate('/pricing')}
                  className="rounded-md cursor-pointer py-2 px-2"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pricing
                </DropdownMenuItem>

                {/* Admin Section */}
                {isAdmin && (
                  <>
                    <div className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase mt-2">
                      Admin
                    </div>
                    <DropdownMenuItem
                      onClick={() => navigate('/admin')}
                      className="rounded-md cursor-pointer py-2 px-2 text-primary"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  </>
                )}

                {/* Section: Preferences */}
                <div className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase mt-2">
                  Preferences
                </div>

                <DropdownMenuItem
                  onClick={() => navigate('/settings')}
                  className="rounded-md cursor-pointer py-2 px-2"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>

                {/* Divider */}
                <div className="border-t border-border/40 my-2" />

                {/* Logout */}
                <DropdownMenuItem
                  onClick={signOut}
                  className="rounded-md cursor-pointer py-2 px-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Mobile Search Bar */}
      {user && showMobileSearch && (
        <div className="md:hidden border-t border-border/30 px-4 py-3 bg-card/80">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 h-10 bg-secondary/50 border-border/50 rounded-full"
                autoFocus
              />
            </div>
            <Button type="submit" size="sm" className="rounded-full px-4">
              Search
            </Button>
          </form>
        </div>
      )}
    </nav>
  );
};
