import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThreadList } from '@/components/ThreadList';
import { CreateThreadDialog } from '@/components/CreateThreadDialog';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  genres?: { name: string }[];
  created_by?: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

const BookDetail = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const fetchBook = async () => {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_genres(
          genres(name)
        )
      `)
      .eq('id', bookId)
      .single();

    if (!error && data) {
      // Fetch creator profile separately
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', data.created_by)
        .single();

      setBook({
        ...data,
        genres: data.book_genres?.map((bg: any) => bg.genres).filter(Boolean) || [],
        profiles: profileData || undefined
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <BookOpen className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Book not found</h2>
          <Button onClick={() => navigate('/')}>Return to Library</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 page-turn">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Button>

        <div className="grid md:grid-cols-[300px,1fr] gap-8 mb-12">
          <div>
            <div className="book-page overflow-hidden">
              <div className="aspect-[3/4] bg-muted flex items-center justify-center">
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
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
            {book.profiles?.username && (
              <p className="text-sm text-muted-foreground mb-4">
                Added by <span className="font-medium text-foreground">@{book.profiles.username}</span>
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-6">
              {book.genres?.map((genre, idx) => (
                <Badge key={idx} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            {book.description && (
              <div className="book-page p-6">
                <h2 className="text-lg font-serif font-bold mb-3">About</h2>
                <p className="text-foreground/90 leading-relaxed">{book.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold">Discussions</h2>
            <CreateThreadDialog bookId={book.id} />
          </div>
          
          <ThreadList bookId={book.id} />
        </div>
      </main>
    </div>
  );
};

export default BookDetail;