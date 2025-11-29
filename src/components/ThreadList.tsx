import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Thread {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  } | null;
  comment_count?: number;
  vote_score?: number;
}

interface ThreadListProps {
  bookId: string;
}

export const ThreadList = ({ bookId }: ThreadListProps) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchThreads();
  }, [bookId]);

  const fetchThreads = async () => {
    const { data: threadsData } = await supabase
      .from('threads')
      .select(`
        *
      `)
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });

    if (threadsData) {
      // Fetch profiles for all threads
      const userIds = [...new Set(threadsData.map(t => t.created_by))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      // Fetch comment counts and vote scores for each thread
      const threadsWithStats = await Promise.all(
        threadsData.map(async (thread) => {
          const { count } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id);

          const { data: votes } = await supabase
            .from('votes')
            .select('value')
            .eq('votable_type', 'thread')
            .eq('votable_id', thread.id);

          const voteScore = votes?.reduce((sum, vote) => sum + vote.value, 0) || 0;

          return {
            ...thread,
            profiles: profilesMap.get(thread.created_by) || null,
            comment_count: count || 0,
            vote_score: voteScore,
          };
        })
      );

      setThreads(threadsWithStats);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading discussions...</div>;
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-serif font-bold mb-2">No discussions yet</h3>
        <p className="text-muted-foreground">Be the first to start a discussion about this book</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Card 
          key={thread.id}
          className="book-page hover-lift cursor-pointer"
          onClick={() => navigate(`/thread/${thread.id}`)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-serif font-bold text-lg mb-1">{thread.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>by {thread.profiles?.username || 'Anonymous'}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <Badge variant="outline" className="gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {thread.comment_count}
                </Badge>
                <Badge 
                  variant={thread.vote_score && thread.vote_score > 0 ? "default" : "outline"}
                  className="gap-1"
                >
                  {thread.vote_score && thread.vote_score > 0 ? (
                    <ThumbsUp className="w-3 h-3" />
                  ) : (
                    <ThumbsDown className="w-3 h-3" />
                  )}
                  {thread.vote_score || 0}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 line-clamp-2">{thread.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};