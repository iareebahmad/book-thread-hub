import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useBookVotes = (bookId: string) => {
  const [voteCount, setVoteCount] = useState(0);
  const [userVote, setUserVote] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchVotes();
  }, [bookId, user]);

  const fetchVotes = async () => {
    // Get total votes for this book
    const { data: votes } = await supabase
      .from('votes')
      .select('value')
      .eq('votable_type', 'book')
      .eq('votable_id', bookId);

    if (votes) {
      const total = votes.reduce((sum, vote) => sum + vote.value, 0);
      setVoteCount(total);
    }

    // Get user's vote if logged in
    if (user) {
      const { data: userVoteData } = await supabase
        .from('votes')
        .select('value')
        .eq('votable_type', 'book')
        .eq('votable_id', bookId)
        .eq('user_id', user.id)
        .maybeSingle();

      setUserVote(userVoteData?.value ?? null);
    }
  };

  const vote = async (value: number) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      if (userVote === value) {
        // Remove vote if clicking the same button
        await supabase
          .from('votes')
          .delete()
          .eq('votable_type', 'book')
          .eq('votable_id', bookId)
          .eq('user_id', user.id);
        
        setUserVote(null);
        setVoteCount(prev => prev - value);
      } else if (userVote) {
        // Update existing vote
        await supabase
          .from('votes')
          .update({ value })
          .eq('votable_type', 'book')
          .eq('votable_id', bookId)
          .eq('user_id', user.id);
        
        setVoteCount(prev => prev - userVote + value);
        setUserVote(value);
      } else {
        // Create new vote
        await supabase
          .from('votes')
          .insert({
            votable_type: 'book',
            votable_id: bookId,
            user_id: user.id,
            value,
          });
        
        setVoteCount(prev => prev + value);
        setUserVote(value);
      }
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  return { voteCount, userVote, vote };
};
