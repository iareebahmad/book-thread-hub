import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAvatarCard } from '@/hooks/useAvatarCard';
import { Sparkles, Share2, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface AvatarCardDialogProps {
  userId: string;
  showTrigger?: boolean;
  username?: string;
}

export const AvatarCardDialog = ({ userId, showTrigger = true, username }: AvatarCardDialogProps) => {
  const { character, loading } = useAvatarCard(userId);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = `🌟 My BookThreads Avatar: ${character?.name}\n\n"${character?.description}"\n\nTraits: ${character?.traits.join(', ')}\n\nDiscover your reading personality at BookThreads!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My BookThreads Avatar: ${character?.name}`,
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Share your avatar card with friends.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return showTrigger ? (
      <Button variant="outline" disabled className="gap-2">
        <Sparkles className="w-4 h-4 animate-pulse" />
        Loading...
      </Button>
    ) : null;
  }

  if (!character) return null;

  return (
    <Dialog>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
            My Avatar Card
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-serif flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {username ? `${username}'s Reading Avatar` : 'Your Reading Avatar'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Character Image */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg">
              <img 
                src={character.image} 
                alt={character.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-muted');
                  const fallback = document.createElement('div');
                  fallback.innerHTML = '<svg class="w-12 h-12 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
                  target.parentElement?.appendChild(fallback.firstChild!);
                }}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground shadow-md">
                Avatar
              </Badge>
            </div>
          </div>

          {/* Character Name */}
          <h3 className="text-2xl font-serif font-bold text-primary mt-4">
            {character.name}
          </h3>

          {/* Traits */}
          <div className="flex gap-2 flex-wrap justify-center">
            {character.traits.map((trait, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {trait}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed px-2">
            {character.description}
          </p>

          {/* Share Button */}
          <Button 
            onClick={handleShare} 
            variant="outline" 
            className="gap-2 mt-2 border-primary/30 hover:bg-primary/10"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share Avatar Card'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Component to just display the character name for profile
export const AvatarCharacterName = ({ userId }: { userId: string }) => {
  const { character, loading } = useAvatarCard(userId);

  if (loading || !character) return null;

  return (
    <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
      <Sparkles className="w-3 h-3" />
      {character.name}
    </Badge>
  );
};
