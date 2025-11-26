import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

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

  return (
    <Card 
      className="glass-card hover-lift cursor-pointer overflow-hidden transition-all"
      onClick={() => navigate(`/book/${book.id}`)}
    >
      <CardHeader className="p-0">
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
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
        {book.description && (
          <p className="text-sm text-foreground/80 line-clamp-2">{book.description}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
        {book.genres?.slice(0, 3).map((genre, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {genre.name}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};