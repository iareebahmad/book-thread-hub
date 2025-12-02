import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookCard } from '@/components/BookCard';
import { AddBookDialog } from '@/components/AddBookDialog';
import { Navbar } from '@/components/Navbar';
import { LibraryBig, UserRoundPen, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface Genre {
  id: string;
  name: string;
}

const Library = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, selectedGenre, selectedAuthor]);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_genres!inner(
          genres(name)
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const booksWithGenres = data.map(book => ({
        ...book,
        genres: book.book_genres?.map((bg: any) => bg.genres).filter(Boolean) || []
      }));
      setBooks(booksWithGenres);
      
      // Extract unique authors
      const uniqueAuthors = Array.from(new Set(data.map(book => book.author)));
      setAuthors(uniqueAuthors.sort());
    }
    setLoading(false);
  };

  const fetchGenres = async () => {
    const { data } = await supabase
      .from('genres')
      .select('*')
      .order('name');
    
    if (data) setGenres(data);
  };

  const filterBooks = () => {
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(book =>
        book.genres?.some(g => g.name === selectedGenre)
      );
    }

    if (selectedAuthor !== 'all') {
      filtered = filtered.filter(book => book.author === selectedAuthor);
    }

    setFilteredBooks(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LibraryBig className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        backgroundImage: "url('/bookbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 slide-up">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <p className="text-lg text-muted-foreground">
              Discover and discuss your favorite books
            </p>
            <AddBookDialog onBookAdded={fetchBooks} genres={genres} />
          </div>

          {/* Stats Bar */}
          <div className="glass-card p-6 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <LibraryBig className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{books.length}</p>
                <p className="text-sm text-muted-foreground">Books</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Filter className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{genres.length}</p>
                <p className="text-sm text-muted-foreground">Genres</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserRoundPen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{authors.length}</p>
                <p className="text-sm text-muted-foreground">Authors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative group">
              <UserRoundPen  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-background/50 border-border/50 focus:border-primary transition-all"
              />
            </div>
            
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="h-12 bg-background/50 border-border/50">
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger className="h-12 bg-background/50 border-border/50">
                <SelectValue placeholder="Filter by author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {authors.map(author => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Active Filters Display */}
          {(searchQuery || selectedGenre !== 'all' || selectedAuthor !== 'all') && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filteredBooks.length} of {books.length} books</span>
            </div>
          )}
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                <LibraryBig className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold">No books found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedGenre !== 'all' || selectedAuthor !== 'all'
                  ? 'Try adjusting your filters to discover more books'
                  : 'Be the first to add a book to the library'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Library;