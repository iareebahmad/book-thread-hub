import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserSettings } from './UserSettings';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-text">About BookThreads</DialogTitle>
                <DialogDescription className="text-base">
                  Where readers gather to discuss
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to BookThreads, where every book sparks a conversation. We're building a community 
                  of passionate readers who believe that the best part of reading is sharing the experience.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Dive into discussions, share your thoughts, and connect with fellow book lovers. Whether 
                  you're into fantasy, non-fiction, or anything in between, there's a thread waiting for you.
                </p>
                <p className="text-primary font-semibold text-center italic pt-4 border-t border-border/50">
                  Of the readers, by a reader, for the readers
                </p>
              </div>
            </DialogContent>
          </Dialog>
        
          {user && (
            <>
              <span className="text-sm text-muted-foreground hidden md:inline">
                Welcome back!
              </span>
              <UserSettings />
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};