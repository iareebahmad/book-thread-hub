import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { toast } from '@/hooks/use-toast';
import { Shield, Calendar, Plus, Trash2, BookOpen, Users, MessageSquare, Heart, TrendingUp, Search } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  created_at: string | null;
}

interface Event {
  id: string;
  book_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  book: Book;
  participant_count: number;
}

interface Stats {
  totalBooks: number;
  totalUsers: number;
  totalThreads: number;
  totalComments: number;
  totalVotes: number;
  totalFavorites: number;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [books, setBooks] = useState<Book[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalUsers: 0,
    totalThreads: 0,
    totalComments: 0,
    totalVotes: 0,
    totalFavorites: 0,
  });
  const [bookSearch, setBookSearch] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      fetchStats();
    }
  }, [isAdmin]);

  useEffect(() => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.author.toLowerCase().includes(bookSearch.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [bookSearch, books]);

  const fetchStats = async () => {
    const [booksCount, usersCount, threadsCount, commentsCount, votesCount, favoritesCount] = await Promise.all([
      supabase.from('books').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('threads').select('*', { count: 'exact', head: true }),
      supabase.from('comments').select('*', { count: 'exact', head: true }),
      supabase.from('votes').select('*', { count: 'exact', head: true }),
      supabase.from('favorites').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      totalBooks: booksCount.count || 0,
      totalUsers: usersCount.count || 0,
      totalThreads: threadsCount.count || 0,
      totalComments: commentsCount.count || 0,
      totalVotes: votesCount.count || 0,
      totalFavorites: favoritesCount.count || 0,
    });
  };

  const fetchData = async () => {
    setLoading(true);
    
    const { data: booksData } = await supabase
      .from('books')
      .select('id, title, author, cover_url, created_at')
      .order('created_at', { ascending: false });

    const { data: eventsData } = await supabase
      .from('events')
      .select(`
        id,
        book_id,
        start_date,
        end_date,
        is_active,
        book:books(id, title, author, cover_url)
      `)
      .order('created_at', { ascending: false });

    if (booksData) {
      setBooks(booksData);
      setFilteredBooks(booksData);
    }
    
    if (eventsData) {
      const eventsWithCounts = await Promise.all(
        eventsData.map(async (event) => {
          const { count } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);
          
          return {
            ...event,
            book: event.book as unknown as Book,
            participant_count: count || 0,
          };
        })
      );
      setEvents(eventsWithCounts);
    }
    
    setLoading(false);
  };

  const createEvent = async () => {
    if (!selectedBook) {
      toast({
        title: "Select a book",
        description: "Please select a book for the event.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    const startDate = new Date();
    const endDate = addDays(startDate, 7);

    const { error } = await supabase.from('events').insert({
      book_id: selectedBook,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      is_active: true,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Event Created",
        description: "The reading event has been created successfully!",
      });
      setSelectedBook('');
      fetchData();
    }
    setCreating(false);
  };

  const deleteEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Event Deleted",
        description: "The event has been removed.",
      });
      fetchData();
    }
  };

  const toggleEventStatus = async (eventId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('events')
      .update({ is_active: !currentStatus })
      .eq('id', eventId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update event status.",
        variant: "destructive",
      });
    } else {
      fetchData();
    }
  };

  const deleteBook = async (bookId: string, bookTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${bookTitle}"? This will also delete all associated threads, comments, and votes.`)) {
      return;
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete book: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Book Deleted",
        description: `"${bookTitle}" has been removed from the library.`,
      });
      fetchData();
      fetchStats();
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Shield className="w-12 h-12 animate-pulse text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{stats.totalBooks}</p>
              <p className="text-xs text-muted-foreground">Books</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-xs text-muted-foreground">Users</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{stats.totalThreads}</p>
              <p className="text-xs text-muted-foreground">Threads</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{stats.totalComments}</p>
              <p className="text-xs text-muted-foreground">Comments</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-pink-500" />
              <p className="text-2xl font-bold">{stats.totalVotes}</p>
              <p className="text-xs text-muted-foreground">Votes</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold">{stats.totalFavorites}</p>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Create Event Section */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Select Book</label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a book for the event" />
                    </SelectTrigger>
                    <SelectContent>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.title} - {book.author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={createEvent} disabled={creating || !selectedBook} className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  {creating ? 'Creating...' : 'Start Event (1 Week)'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Active Events ({events.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {events.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No events created yet</p>
                ) : (
                  <div className="space-y-3">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50"
                      >
                        {event.book?.cover_url ? (
                          <img
                            src={event.book.cover_url}
                            alt={event.book.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{event.book?.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={event.is_active ? "default" : "secondary"} className="text-[10px]">
                              {event.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {event.participant_count} joined
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEventStatus(event.id, event.is_active)}
                          >
                            {event.is_active ? 'End' : 'Start'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Book Management */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Manage Books ({books.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search books by title or author..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      {book.created_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Added: {format(new Date(book.created_at), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/book/${book.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteBook(book.id, book.title)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
