import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useBookVotes } from '@/hooks/useBookVotes';
import { useFavorite } from '@/hooks/useFavorite';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    description: string | null;
    cover_url: string | null;
    genres?: { name: string }[];
  };
}

export const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();
  const { voteCount, userVote, vote } = useBookVotes(book.id);
  const { isFavorite, toggleFavorite } = useFavorite(book.id);

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  const handleVote = (e: React.MouseEvent, value: number) => {
    e.stopPropagation();
    vote(value);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  };

  return (
    <Card 
      className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/95 to-card/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 cursor-pointer rounded-3xl"
      onClick={handleCardClick}
    >
      {/* Cover Image with Overlay */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {book.cover_url ? (
          <>
            <img 
              src={book.cover_url} 
              alt={book.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
            <BookOpen className="w-20 h-20 text-muted-foreground/20" />
          </div>
        )}
        
        {/* Floating Favorite Button */}
        <Button
          size="icon"
          className="absolute top-3 right-3 h-11 w-11 rounded-full backdrop-blur-md bg-background/70 hover:bg-background/90 border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110"
          onClick={handleFavorite}
        >
          <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-primary text-primary scale-110' : 'text-foreground'}`} />
        </Button>

        {/* Genre Tags - Floating on Image */}
        {book.genres && book.genres.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            {book.genres.slice(0, 2).map((genre, idx) => (
              <Badge 
                key={idx} 
                className="backdrop-blur-md bg-background/80 text-foreground border-0 text-[10px] px-2.5 py-1 shadow-lg font-medium"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Vote Display Badge */}
        <div className="absolute top-3 left-3 backdrop-blur-md bg-background/80 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-xl border border-border/50">
          <ThumbsUp className="w-3 h-3 text-primary" />
          <span className="text-xs font-bold tabular-nums">{voteCount}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title & Author */}
        <div>
          <h3 className="font-bold text-base leading-tight line-clamp-2 mb-1.5 group-hover:text-primary transition-colors duration-300">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground font-medium">{book.author}</p>
        </div>

        {/* Interactive Vote Bar */}
        <div className="flex items-center gap-2 p-2 rounded-full bg-muted/30 border border-border/30">
          <Button
            size="sm"
            variant={userVote === 1 ? "default" : "ghost"}
            className="h-8 w-8 rounded-full p-0 hover:scale-110 transition-all"
            onClick={(e) => handleVote(e, 1)}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </Button>
          
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, ((voteCount + 10) / 20) * 100))}%` }}
            />
          </div>
          
          <Button
            size="sm"
            variant={userVote === -1 ? "default" : "ghost"}
            className="h-8 w-8 rounded-full p-0 hover:scale-110 transition-all"
            onClick={(e) => handleVote(e, -1)}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl ring-2 ring-primary/50" />
      </div>
    </Card>
  );
};