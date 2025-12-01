import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, Heart, Settings, Share2, Library, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';
import { ReferralDialog } from './ReferralDialog';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [referralOpen, setReferralOpen] = useState(false);

  return (
    <nav className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-50 glow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold gradient-text">BookThreads</span>
        </button>
        
        {user && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2 hidden sm:flex"
            >
              <Library className="w-4 h-4" />
              Library
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/favorites')}
              className="gap-2 hidden sm:flex"
            >
              <Heart className="w-4 h-4" />
              Favourites
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/search-users')}
              className="gap-2 hidden sm:flex"
            >
              <Users className="w-4 h-4" />
              Users
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReferralOpen(true)}
              className="gap-2 hidden sm:flex"
            >
              <Share2 className="w-4 h-4" />
              Invite
            </Button>
            
            <NotificationBell />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        )}
        
        <ReferralDialog open={referralOpen} onOpenChange={setReferralOpen} />
      </div>
    </nav>
  );
};