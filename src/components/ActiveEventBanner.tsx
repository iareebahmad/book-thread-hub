import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, BookOpen, Clock, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { EventParticipantsList } from './EventParticipantsList';

interface Event {
  id: string;
  book_id: string;
  start_date: string;
  end_date: string;
  book: {
    id: string;
    title: string;
    author: string;
    cover_url: string | null;
  };
  participant_count: number;
  is_participating: boolean;
}

export const ActiveEventBanner = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveEvent();
  }, [user]);

  const fetchActiveEvent = async () => {
    const { data: eventData, error } = await supabase
      .from('events')
      .select(`
        id,
        book_id,
        start_date,
        end_date,
        book:books(id, title, author, cover_url)
      `)
      .eq('is_active', true)
      .order('start_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !eventData) {
      setLoading(false);
      return;
    }

    // Get participant count and user participation
    const { count } = await supabase
      .from('event_participants')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventData.id);

    let isParticipating = false;
    if (user) {
      const { data: participation } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventData.id)
        .eq('user_id', user.id)
        .maybeSingle();
      isParticipating = !!participation;
    }

    setEvent({
      ...eventData,
      book: eventData.book as Event['book'],
      participant_count: count || 0,
      is_participating: isParticipating,
    });
    setLoading(false);
  };

  const joinEvent = async () => {
    if (!user || !event) return;

    const { error } = await supabase
      .from('event_participants')
      .insert({ event_id: event.id, user_id: user.id });

    if (error) {
      toast.error('Failed to join event');
      return;
    }

    toast.success('You joined the event!');
    fetchActiveEvent();
  };

  const leaveEvent = async () => {
    if (!user || !event) return;

    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', event.id)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to leave event');
      return;
    }

    toast.success('You left the event');
    fetchActiveEvent();
  };

  const getDaysRemaining = (endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date());
    return days > 0 ? days : 0;
  };

  if (loading) return null;

  if (!event) {
    return (
      <Card className="glass-card mb-8 border-dashed border-muted-foreground/30">
        <CardContent className="py-6 text-center">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">No Upcoming Event</h3>
          <p className="text-sm text-muted-foreground">Check back soon for community reading events!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card mb-8 overflow-hidden border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Book Cover */}
          <div className="md:w-32 h-40 md:h-auto shrink-0">
            {event.book?.cover_url ? (
              <img
                src={event.book.cover_url}
                alt={event.book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="flex-1 p-4 md:p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <Badge className="mb-2 bg-primary/20 text-primary border-0 gap-1">
                  <Sparkles className="w-3 h-3" />
                  Active Reading Event
                </Badge>
                <h2 
                  className="text-lg md:text-xl font-bold hover:text-primary cursor-pointer transition-colors"
                  onClick={() => navigate(`/book/${event.book.id}`)}
                >
                  {event.book?.title}
                </h2>
                <p className="text-sm text-muted-foreground">{event.book?.author}</p>
              </div>
              {event.is_participating && (
                <Badge variant="secondary" className="shrink-0">
                  <Check className="w-3 h-3 mr-1" />
                  Joined
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-4 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>{format(new Date(event.start_date), 'MMM d')} - {format(new Date(event.end_date), 'MMM d')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{getDaysRemaining(event.end_date)} days left</span>
              </div>
              <EventParticipantsList eventId={event.id} participantCount={event.participant_count}>
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <Users className="w-3.5 h-3.5" />
                  <span>{event.participant_count} participants</span>
                </button>
              </EventParticipantsList>
            </div>

            <div className="flex gap-2">
              {event.is_participating ? (
                <Button variant="outline" size="sm" onClick={leaveEvent}>
                  Leave Event
                </Button>
              ) : (
                <Button size="sm" onClick={joinEvent}>
                  Join Event
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => navigate(`/book/${event.book.id}`)}>
                View Book
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};