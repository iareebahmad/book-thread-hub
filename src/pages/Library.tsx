import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { BookCard } from '@/components/BookCard';
import { AddBookDialog } from '@/components/AddBookDialog';
import { Navbar } from '@/components/Navbar';
import { LibraryBig, Search, BookOpen, Sparkles, Filter, X, BookMarked, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useTrendingBooks } from '@/hooks/useTrendingBooks';
import { ActiveEventBanner } from '@/components/ActiveEventBanner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
  created_by: string | null;
  genres?: { name: string }[];
}

interface Genre {
  id: string;
  name: string;
}

interface Profile {
  username: string;
  avatar_url: string | null;
  favorite_genre: string | null;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isTrending } = useTrendingBooks();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, selectedGenre, selectedAuthor]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url, favorite_genre')
      .eq('id', user.id)
      .single();
    if (data) setProfile(data);
  };

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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedAuthor('all');
  };

  const hasActiveFilters = searchQuery || selectedGenre !== 'all' || selectedAuthor !== 'all';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse">
              <LibraryBig className="w-12 h-12 text-primary float-animation" />
            </div>
            <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-pulse" />
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-muted-foreground text-sm font-medium">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[5%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>
      
      <main className="relative container mx-auto px-4 py-8 slide-up">
        {/* Active Event Banner */}
        <ActiveEventBanner />

        {/* Hero Section with User Avatar */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            {/* Left Side - Title and User Info */}
            <div className="flex items-start gap-5">
              {/* User Avatar Card */}
              {profile && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative p-1 bg-gradient-to-br from-primary to-accent rounded-2xl">
                    <div className="bg-background rounded-xl p-3">
                      <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-primary/30">
                        <AvatarImage src={profile.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-bold">
                          {profile.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold gradient-text">Library</h1>
                    {profile && (
                      <p className="text-muted-foreground">
                        Welcome back, <span className="text-primary font-medium">{profile.username}</span>
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm md:text-base text-muted-foreground max-w-md">
                  Discover, discuss, and dive into your favorite books
                </p>
              </div>
            </div>

            {/* Right Side - Stats and Add Book */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Quick Stats */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/60 border border-border/50 backdrop-blur-sm">
                <BookMarked className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{books.length} Books</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/60 border border-border/50 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{genres.length} Genres</span>
              </div>
              <AddBookDialog onBookAdded={fetchBooks} genres={genres} />
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="relative mb-10">
          <div className="glass-card p-4 md:p-6">
            {/* Main Search Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                <Input
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 md:h-14 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 md:h-14 px-6 rounded-xl border-border/50 hover:border-primary/50 transition-all ${showFilters ? 'bg-primary/10 border-primary/50' : ''}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
                    {(selectedGenre !== 'all' ? 1 : 0) + (selectedAuthor !== 'all' ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>
            
            {/* Expandable Filters */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden transition-all duration-300 ${showFilters ? 'mt-4 max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl hover:border-primary/50 transition-colors">
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
                <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl hover:border-primary/50 transition-colors">
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
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Showing {filteredBooks.length} of {books.length} books
                </span>
                <div className="flex flex-wrap gap-2 ml-2">
                  {selectedGenre !== 'all' && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                      {selectedGenre}
                      <button onClick={() => setSelectedGenre('all')} className="ml-1.5 hover:text-primary-foreground">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedAuthor !== 'all' && (
                    <Badge variant="secondary" className="bg-accent/10 text-accent border border-accent/20">
                      {selectedAuthor}
                      <button onClick={() => setSelectedAuthor('all')} className="ml-1.5 hover:text-accent-foreground">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors ml-auto"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="glass-card p-12 md:p-16 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative w-28 h-28 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center float-animation border border-primary/20">
                  <LibraryBig className="w-14 h-14 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold gradient-text">No books found</h3>
                <p className="text-muted-foreground">
                  {hasActiveFilters
                    ? 'Try adjusting your filters to discover more books'
                    : 'Be the first to add a book to the library'}
                </p>
              </div>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="border-primary/30 hover:bg-primary/10">
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredBooks.map((book, index) => (
              <div 
                key={book.id} 
                className="stagger-animation"
                style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
              >
                <BookCard book={book} isTrending={isTrending(book.id)} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Library;