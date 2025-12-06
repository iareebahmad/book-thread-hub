import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, BookOpen, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { EventParticipantsList } from '@/components/EventParticipantsList';

interface Event {
  id: string;
  book_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  book: {
    id: string;
    title: string;
    author: string;
    cover_url: string | null;
  };
  participant_count: number;
  is_participating: boolean;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchEvents();
  }, [user, navigate]);

  const fetchEvents = async () => {
    setLoading(true);
    
    // Fetch active events with book info
    const { data: eventsData, error } = await supabase
      .from('events')
      .select(`
        *,
        book:books(id, title, author, cover_url)
      `)
      .eq('is_active', true)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
      return;
    }

    if (eventsData && user) {
      // Get participant counts and user participation status
      const eventsWithDetails = await Promise.all(
        eventsData.map(async (event) => {
          const { count } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);

          const { data: participation } = await supabase
            .from('event_participants')
            .select('id')
            .eq('event_id', event.id)
            .eq('user_id', user.id)
            .maybeSingle();

          return {
            ...event,
            participant_count: count || 0,
            is_participating: !!participation,
          };
        })
      );

      setEvents(eventsWithDetails as Event[]);
    }
    setLoading(false);
  };

  const joinEvent = async (eventId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('event_participants')
      .insert({ event_id: eventId, user_id: user.id });

    if (error) {
      toast.error('Failed to join event');
      return;
    }

    toast.success('You joined the event!');
    fetchEvents();
  };

  const leaveEvent = async (eventId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to leave event');
      return;
    }

    toast.success('You left the event');
    fetchEvents();
  };

  const getDaysRemaining = (endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date());
    return days > 0 ? days : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Calendar className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Reading Events</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the community in reading and discussing the featured book of the week
          </p>
        </div>

        {events.length === 0 ? (
          <Card className="glass-card max-w-md mx-auto text-center p-8">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Active Events</h3>
            <p className="text-muted-foreground">Check back soon for new reading events!</p>
          </Card>
        ) : (
          <div className="grid gap-8 max-w-4xl mx-auto">
            {events.map((event) => (
              <Card key={event.id} className="glass-card overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Book Cover */}
                  <div className="md:w-48 h-64 md:h-auto shrink-0">
                    {event.book?.cover_url ? (
                      <img
                        src={event.book.cover_url}
                        alt={event.book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <Badge className="mb-2 bg-primary/20 text-primary border-0">
                          Featured Book
                        </Badge>
                        <h2 
                          className="text-2xl font-bold hover:text-primary cursor-pointer transition-colors"
                          onClick={() => navigate(`/book/${event.book.id}`)}
                        >
                          {event.book?.title}
                        </h2>
                        <p className="text-muted-foreground">{event.book?.author}</p>
                      </div>
                      {event.is_participating && (
                        <Badge variant="secondary" className="shrink-0">
                          <Check className="w-3 h-3 mr-1" />
                          Joined
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(event.start_date), 'MMM d')} - {format(new Date(event.end_date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{getDaysRemaining(event.end_date)} days remaining</span>
                      </div>
                      <EventParticipantsList eventId={event.id} participantCount={event.participant_count}>
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                          <Users className="w-4 h-4" />
                          <span>{event.participant_count} participants</span>
                        </button>
                      </EventParticipantsList>
                    </div>

                    <div className="flex gap-3">
                      {event.is_participating ? (
                        <Button
                          variant="outline"
                          onClick={() => leaveEvent(event.id)}
                        >
                          Leave Event
                        </Button>
                      ) : (
                        <Button onClick={() => joinEvent(event.id)}>
                          Join Event
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => navigate(`/book/${event.book.id}`)}
                      >
                        View Book
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;
