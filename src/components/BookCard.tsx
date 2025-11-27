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
        <div className="aspect-[2/3] bg-muted flex items-center justify-center overflow-hidden">
          {book.cover_url ? (
            <img 
              src={book.cover_url} 
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-8 h-8 text-muted-foreground/50" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <h3 className="font-bold text-sm mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex flex-wrap gap-1">
        {book.genres?.slice(0, 2).map((genre, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">
            {genre.name}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};