import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { AddBookDialog } from '@/components/AddBookDialog';
import { Navbar } from '@/components/Navbar';
import { LibraryBig, Search, BookOpen, Sparkles, ChevronLeft, ChevronRight, TrendingUp, Star, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useTrendingBooks } from '@/hooks/useTrendingBooks';
import { ActiveEventBanner } from '@/components/ActiveEventBanner';
import { BookshelfBook } from '@/components/BookshelfBook';
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

const Library = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isTrending, trendingBooks } = useTrendingBooks();

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

  const featuredBooks = trendingBooks.slice(0, 5);
  const nextFeatured = () => setFeaturedIndex((prev) => (prev + 1) % Math.max(featuredBooks.length, 1));
  const prevFeatured = () => setFeaturedIndex((prev) => (prev - 1 + Math.max(featuredBooks.length, 1)) % Math.max(featuredBooks.length, 1));

  // Group books by genre for shelves
  const booksByGenre = genres.reduce((acc, genre) => {
    const genreBooks = filteredBooks.filter(book => 
      book.genres?.some(g => g.name === genre.name)
    );
    if (genreBooks.length > 0) {
      acc[genre.name] = genreBooks;
    }
    return acc;
  }, {} as Record<string, Book[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
          <div className="relative">
            <LibraryBig className="w-16 h-16 text-primary float-animation" />
            <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-pulse" />
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-muted-foreground text-sm">Opening the library doors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bookstore-room">
      <Navbar />
      
      {/* Wooden ceiling with hanging sign */}
      <div className="relative">
        <div className="wooden-ceiling h-16 flex items-end justify-center pb-2">
          <div className="hanging-sign px-8 py-3 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-900" />
            <span className="text-lg font-serif text-amber-900 font-bold tracking-wide">The Book Room</span>
            <BookOpen className="w-5 h-5 text-amber-900" />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 slide-up">
        {/* Active Event Banner */}
        <ActiveEventBanner />

        {/* Featured Display Table - Center of Room */}
        {featuredBooks.length > 0 && (
          <div className="mb-12">
            <div className="display-table relative">
              {/* Table surface */}
              <div className="table-surface rounded-xl p-6 md:p-8">
                <div className="text-center mb-6">
                  <div className="wooden-plaque inline-block px-6 py-2 mb-4">
                    <span className="text-amber-900 font-serif font-bold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Trending Now
                      <TrendingUp className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4 md:gap-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevFeatured}
                    className="h-10 w-10 rounded-full bg-amber-100/80 hover:bg-amber-200 text-amber-900"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div className="flex items-end justify-center gap-4 md:gap-6 perspective-1000">
                    {featuredBooks.map((book, idx) => {
                      const offset = idx - featuredIndex;
                      const isCenter = offset === 0;
                      const isVisible = Math.abs(offset) <= 2;
                      
                      if (!isVisible) return null;
                      
                      return (
                        <div
                          key={book.id}
                          className={`featured-book-stack transition-all duration-500 cursor-pointer ${
                            isCenter ? 'z-20 scale-110' : 'z-10 opacity-70 scale-90'
                          }`}
                          style={{
                            transform: `translateX(${offset * 20}px) translateZ(${isCenter ? 50 : 0}px) rotateY(${offset * -5}deg)`,
                          }}
                          onClick={() => navigate(`/book/${book.id}`)}
                        >
                          <div className={`relative ${isCenter ? 'featured-book-glow' : ''}`}>
                            {isCenter && (
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-30">
                                #1
                              </div>
                            )}
                            <div className="book-3d-wrapper">
                              <img
                                src={book.cover_url || '/placeholder.svg'}
                                alt={book.title}
                                className={`rounded-lg shadow-2xl object-cover ${
                                  isCenter ? 'w-32 h-48 md:w-40 md:h-60' : 'w-24 h-36 md:w-32 md:h-48'
                                }`}
                              />
                              <div className="book-3d-spine" />
                            </div>
                            {isCenter && (
                              <div className="text-center mt-4">
                                <h3 className="font-bold text-foreground text-sm md:text-base line-clamp-1">{book.title}</h3>
                                <p className="text-xs text-muted-foreground">{book.author}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextFeatured}
                    className="h-10 w-10 rounded-full bg-amber-100/80 hover:bg-amber-200 text-amber-900"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Table legs */}
              <div className="table-legs" />
            </div>
          </div>
        )}

        {/* Search & Filters - Like a librarian's desk */}
        <div className="librarian-desk mb-10">
          <div className="desk-surface p-6 rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="desk-lamp">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="font-serif text-xl text-foreground">Find Your Next Read</h2>
              </div>
              <AddBookDialog onBookAdded={fetchBooks} genres={genres} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                <Input
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-background/50 border-amber-800/30 focus:border-primary rounded-xl"
                />
              </div>
              
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="h-12 bg-background/50 border-amber-800/30 rounded-xl">
                  <SelectValue placeholder="Browse by genre" />
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
                <SelectTrigger className="h-12 bg-background/50 border-amber-800/30 rounded-xl">
                  <SelectValue placeholder="Browse by author" />
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

            {(searchQuery || selectedGenre !== 'all' || selectedAuthor !== 'all') && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Found {filteredBooks.length} of {books.length} books</span>
              </div>
            )}
          </div>
        </div>

        {/* Bookshelf Sections */}
        {filteredBooks.length === 0 ? (
          <div className="empty-shelf p-16 text-center rounded-xl">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-24 h-24 rounded-full bg-amber-900/20 flex items-center justify-center mx-auto float-animation">
                <LibraryBig className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-foreground">Empty Shelves</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedGenre !== 'all' || selectedAuthor !== 'all'
                  ? 'No books match your search. Try different filters.'
                  : 'Be the first to stock the shelves!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Show genre sections if no filter, otherwise show all results */}
            {selectedGenre === 'all' && !searchQuery && selectedAuthor === 'all' ? (
              Object.entries(booksByGenre).slice(0, 6).map(([genreName, genreBooks]) => (
                <div key={genreName} className="bookshelf-section">
                  <div className="shelf-label mb-4">
                    <div className="shelf-label-plaque inline-flex items-center gap-2 px-4 py-2 rounded-lg">
                      <Star className="w-4 h-4 text-amber-600" />
                      <span className="font-serif font-bold text-amber-900">{genreName}</span>
                    </div>
                  </div>
                  <div className="bookshelf">
                    <div className="shelf-back" />
                    <div className="shelf-books flex gap-3 px-4 py-6 overflow-x-auto">
                      {genreBooks.slice(0, 8).map((book, index) => (
                        <div 
                          key={book.id} 
                          className="stagger-animation flex-shrink-0"
                          style={{ animationDelay: `${index * 80}ms` }}
                        >
                          <BookshelfBook book={book} isTrending={isTrending(book.id)} />
                        </div>
                      ))}
                    </div>
                    <div className="shelf-bottom" />
                  </div>
                </div>
              ))
            ) : (
              <div className="bookshelf-section">
                <div className="shelf-label mb-4">
                  <div className="shelf-label-plaque inline-flex items-center gap-2 px-4 py-2 rounded-lg">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span className="font-serif font-bold text-amber-900">Search Results</span>
                  </div>
                </div>
                <div className="bookshelf">
                  <div className="shelf-back" />
                  <div className="shelf-books grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 px-4 py-6">
                    {filteredBooks.map((book, index) => (
                      <div 
                        key={book.id} 
                        className="stagger-animation"
                        style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
                      >
                        <BookshelfBook book={book} isTrending={isTrending(book.id)} />
                      </div>
                    ))}
                  </div>
                  <div className="shelf-bottom" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Decorative elements */}
        <div className="room-decorations pointer-events-none">
          <div className="plant-left" />
          <div className="plant-right" />
        </div>
      </main>
    </div>
  );
};

export default Library;