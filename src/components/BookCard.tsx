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
      className="glass-card hover-lift cursor-pointer overflow-hidden transition-all relative group"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 relative">
        <div className="aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden">
          {book.cover_url ? (
            <img 
              src={book.cover_url} 
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-16 h-16 text-muted-foreground/50" />
          )}
        </div>
        
        {/* Favorite button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleFavorite}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
        {book.description && (
          <p className="text-sm text-foreground/80 line-clamp-2">{book.description}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {book.genres?.slice(0, 3).map((genre, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {genre.name}
            </Badge>
          ))}
        </div>
        
        {/* Vote buttons */}
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={userVote === 1 ? "default" : "ghost"}
              className="h-7 px-2"
              onClick={(e) => handleVote(e, 1)}
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <span className="text-sm font-medium min-w-[2rem] text-center">
              {voteCount}
            </span>
            <Button
              size="sm"
              variant={userVote === -1 ? "default" : "ghost"}
              className="h-7 px-2"
              onClick={(e) => handleVote(e, -1)}
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};