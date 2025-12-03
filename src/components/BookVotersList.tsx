import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, User } from 'lucide-react';

interface Voter {
  user_id: string;
  value: number;
  profile: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface BookVotersListProps {
  bookId: string;
  voteCount: number;
  children: React.ReactNode;
}

export const BookVotersList = ({ bookId, voteCount, children }: BookVotersListProps) => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchVoters();
    }
  }, [open, bookId]);

  const fetchVoters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('votes')
      .select(`
        user_id,
        value,
        profile:profiles!user_id(username, avatar_url)
      `)
      .eq('votable_type', 'book')
      .eq('votable_id', bookId)
      .eq('value', 1);

    if (!error && data) {
      setVoters(data as unknown as Voter[]);
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
            <ThumbsUp className="w-5 h-5 text-primary" />
            Liked by ({voters.length})
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : voters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No likes yet
            </div>
          ) : (
            <div className="space-y-2">
              {voters.map((voter) => (
                <div
                  key={voter.user_id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleUserClick(voter.user_id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={voter.profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{voter.profile?.username || 'Unknown'}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
