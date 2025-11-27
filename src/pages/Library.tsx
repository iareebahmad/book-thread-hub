import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookCard } from '@/components/BookCard';
import { AddBookDialog } from '@/components/AddBookDialog';
import { Navbar } from '@/components/Navbar';
import { BookOpen, Search, Filter } from 'lucide-react';
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
          <BookOpen className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animated-bg">
      <div className="floating-books">
        <div className="floating-book"></div>
        <div className="floating-book"></div>
        <div className="floating-book"></div>
        <div className="floating-book"></div>
      </div>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 slide-up">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-3 gradient-text">The Library</h1>
            <p className="text-muted-foreground text-lg">Discover and discuss your favorite books</p>
          </div>
          <AddBookDialog onBookAdded={fetchBooks} genres={genres} />
        </div>

        {/* About Section */}
        <section className="glass-card p-8 mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">About BookThreads</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Welcome to BookThreads, where every book sparks a conversation. We're building a community 
            of passionate readers who believe that the best part of reading is sharing the experience.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Dive into discussions, share your thoughts, and connect with fellow book lovers. Whether 
            you're into fantasy, non-fiction, or anything in between, there's a thread waiting for you.
          </p>
        </section>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger>
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
            <SelectTrigger>
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

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold mb-2">No books found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedGenre !== 'all' || selectedAuthor !== 'all'
                ? 'Try adjusting your filters'
                : 'Be the first to add a book to the library'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* Footer Tagline */}
        <footer className="mt-16 py-8 text-center border-t border-border/50">
          <p className="text-muted-foreground text-lg italic">
            Of the readers, by a reader, for the readers
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Library;