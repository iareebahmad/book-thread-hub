import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoteButtonsProps {
  votableType: 'thread' | 'comment';
  votableId: string;
}

export const VoteButtons = ({ votableType, votableId }: VoteButtonsProps) => {
  const [score, setScore] = useState(0);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchVoteData();
  }, [votableId]);

  const fetchVoteData = async () => {
    // Get total score
    const { data: votes } = await supabase
      .from('votes')
      .select('value')
      .eq('votable_type', votableType)
      .eq('votable_id', votableId);

    const totalScore = votes?.reduce((sum, vote) => sum + vote.value, 0) || 0;
    setScore(totalScore);

    // Get user's vote
    if (user) {
      const { data: userVoteData } = await supabase
        .from('votes')
        .select('value')
        .eq('votable_type', votableType)
        .eq('votable_id', votableId)
        .eq('user_id', user.id)
        .single();

      setUserVote(userVoteData?.value || null);
    }
  };

  const handleVote = async (value: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to be signed in to vote",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // If clicking the same vote, remove it
    if (userVote === value) {
      await supabase
        .from('votes')
        .delete()
        .eq('votable_type', votableType)
        .eq('votable_id', votableId)
        .eq('user_id', user.id);

      setUserVote(null);
      setScore(score - value);
    } else {
      // If changing vote or adding new vote
      const { error } = await supabase
        .from('votes')
        .upsert({
          votable_type: votableType,
          votable_id: votableId,
          user_id: user.id,
          value,
        });

      if (error) {
        toast({
          title: "Error voting",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const scoreDiff = userVote ? value - userVote : value;
        setScore(score + scoreDiff);
        setUserVote(value);
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant={userVote === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote(1)}
        disabled={loading}
        className="w-10 h-10 p-0"
      >
        <ThumbsUp className="w-4 h-4" />
      </Button>
      
      <span className="font-bold text-lg">{score}</span>
      
      <Button
        variant={userVote === -1 ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote(-1)}
        disabled={loading}
        className="w-10 h-10 p-0"
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>
    </div>
  );
};