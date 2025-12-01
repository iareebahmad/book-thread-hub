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
            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Hamburger visible on all screen sizes */}
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/')}>
                  <Library className="w-4 h-4 mr-2" /> Library
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/favorites')}>
                  <Heart className="w-4 h-4 mr-2" /> Favourites
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/search-users')}>
                  <Users className="w-4 h-4 mr-2" /> Search People
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};
