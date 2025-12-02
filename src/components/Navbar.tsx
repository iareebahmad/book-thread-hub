import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, Heart, Settings, Library, Users, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <Library className="w-6 h-6" />
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
                  onClick={() => navigate('/favorites')}
                  className="rounded-md cursor-pointer py-2 px-2"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favourites
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate('/search-users')}
                  className="rounded-md cursor-pointer py-2 px-2"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Search People
                </DropdownMenuItem>

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
    </nav>
  );
};
