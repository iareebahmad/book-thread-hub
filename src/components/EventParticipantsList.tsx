import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Users, User } from 'lucide-react';

interface Participant {
  user_id: string;
  profile: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface EventParticipantsListProps {
  eventId: string;
  participantCount: number;
  children: React.ReactNode;
}

export const EventParticipantsList = ({ eventId, participantCount, children }: EventParticipantsListProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchParticipants();
    }
  }, [open, eventId]);

  const fetchParticipants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('event_participants')
      .select(`
        user_id,
        profile:profiles!user_id(username, avatar_url)
      `)
      .eq('event_id', eventId);

    if (!error && data) {
      setParticipants(data as unknown as Participant[]);
    }
    setLoading(false);
  };

  const handleUserClick = (userId: string) => {
    setOpen(false);
    navigate(`/user/${userId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Participants ({participants.length})
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No participants yet
            </div>
          ) : (
            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.user_id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleUserClick(participant.user_id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={participant.profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{participant.profile?.username || 'Unknown'}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};