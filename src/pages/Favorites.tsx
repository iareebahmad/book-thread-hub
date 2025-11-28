import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookCard } from '@/components/BookCard';
import { Navbar } from '@/components/Navbar';
import { Heart, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
  genres?: { name: string }[];
}

const Favorites = () => {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      fetchFavorites();
    }
  }, [user, navigate]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        book_id,
        books!inner(
          *,
          book_genres!inner(
            genres(name)
          )
        )
      `)
      .eq('user_id', user.id);

    if (!error && data) {
      const books = data.map((fav: any) => ({
        ...fav.books,
        genres: fav.books.book_genres?.map((bg: any) => bg.genres).filter(Boolean) || []
      }));
      setFavoriteBooks(books);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Heart className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 page-turn">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-4xl font-serif font-bold text-foreground">My Favourites</h1>
          </div>
          <p className="text-muted-foreground">Your curated collection of beloved books</p>
        </div>

        {favoriteBooks.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold mb-2">No favourites yet</h3>
            <p className="text-muted-foreground mb-6">
              Start adding books to your favourites from the library
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favoriteBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
