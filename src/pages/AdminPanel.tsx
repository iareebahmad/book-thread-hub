import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { toast } from '@/hooks/use-toast';
import { Shield, Calendar, Plus, Trash2, BookOpen, Users } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
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

export default function AdminPanel() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [books, setBooks] = useState<Book[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch books
    const { data: booksData } = await supabase
      .from('books')
      .select('id, title, author, cover_url')
      .order('title');

    // Fetch events with book details
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

    if (booksData) setBooks(booksData);
    
    if (eventsData) {
      // Get participant counts
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
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        {/* Create Event Section */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
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
              <Button onClick={createEvent} disabled={creating || !selectedBook}>
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
              All Events ({events.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No events created yet</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50"
                  >
                    {event.book?.cover_url ? (
                      <img
                        src={event.book.cover_url}
                        alt={event.book.title}
                        className="w-16 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-muted rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.book?.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.book?.author}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant={event.is_active ? "default" : "secondary"}>
                          {event.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.start_date), 'MMM d')} - {format(new Date(event.end_date), 'MMM d, yyyy')}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.participant_count} joined
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEventStatus(event.id, event.is_active)}
                      >
                        {event.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
