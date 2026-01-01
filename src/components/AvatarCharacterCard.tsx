import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAvatarCharacter } from '@/hooks/useAvatarCharacter';
import { BookOpen, Share2, Sparkles, Download, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AvatarCharacterCard = () => {
  const { loading, characterMatch, generateCharacter } = useAvatarCharacter();
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!characterMatch) return;
    
    setIsSharing(true);
    try {
      const shareText = `🎭 I'm ${characterMatch.character} from "${characterMatch.book}"!\n\n${characterMatch.reason}\n\nDiscover your book character at BookThreads!`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My BookThreads Character',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied!",
          description: "Share text copied to clipboard.",
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share error:', error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || !characterMatch) return;
    
    try {
      // Create a canvas from the card
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a1b20',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `bookthreads-${characterMatch.character.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Downloaded!",
        description: "Your character card has been saved.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Could not save the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!characterMatch) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/20 p-6 text-center">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-bold mb-2">Discover Your Book Character</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Based on your reading preferences and activity, we'll match you with a famous literary character!
        </p>
        <Button onClick={generateCharacter} disabled={loading} className="gap-2">
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Find My Character
            </>
          )}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(225,10%,12%)] via-[hsl(215,20%,15%)] to-[hsl(200,15%,10%)] border border-primary/30 p-6"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(215, 85%, 60%) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
        </div>
        
        {/* Logo */}
        <div className="relative flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">BookThreads</span>
        </div>

        {/* Character Info */}
        <div className="relative space-y-4">
          <div>
            <p className="text-muted-foreground text-sm mb-1">You are</p>
            <h2 className="text-2xl md:text-3xl font-bold gradient-text">
              {characterMatch.character}
            </h2>
            <p className="text-primary text-sm mt-1">
              from "{characterMatch.book}"
            </p>
          </div>

          <div className="bg-background/30 rounded-xl p-4 border border-border/30">
            <p className="text-sm text-foreground/90 italic">
              "{characterMatch.reason}"
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -left-8 -top-8 w-24 h-24 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleShare} disabled={isSharing} variant="outline" className="flex-1 gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button onClick={handleDownload} variant="outline" className="flex-1 gap-2">
          <Download className="w-4 h-4" />
          Save Image
        </Button>
        <Button onClick={generateCharacter} disabled={loading} variant="ghost" size="icon" title="Generate again">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
