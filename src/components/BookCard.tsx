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
      className="glass-card hover-lift cursor-pointer overflow-hidden transition-all relative group border-0"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 relative">
        <div className="aspect-[2/3] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center overflow-hidden relative">
          {book.cover_url ? (
            <>
              <img 
                src={book.cover_url} 
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          ) : (
            <BookOpen className="w-16 h-16 text-muted-foreground/30" />
          )}
        </div>
        
        {/* Favorite button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 h-10 w-10 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm bg-background/80 hover:bg-background border-0 shadow-lg"
          onClick={handleFavorite}
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-foreground'}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pb-3">
        <h3 className="font-bold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
        
        {/* Genres */}
        {book.genres && book.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {book.genres.slice(0, 2).map((genre, idx) => (
              <Badge key={idx} variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted/50 border-0">
                {genre.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/30">
        {/* Vote buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant={userVote === 1 ? "default" : "ghost"}
            className="h-8 w-8 p-0 hover:scale-110 transition-transform"
            onClick={(e) => handleVote(e, 1)}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </Button>
          <span className="text-sm font-semibold min-w-[2rem] text-center tabular-nums">
            {voteCount}
          </span>
          <Button
            size="sm"
            variant={userVote === -1 ? "default" : "ghost"}
            className="h-8 w-8 p-0 hover:scale-110 transition-transform"
            onClick={(e) => handleVote(e, -1)}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};