import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { VoteButtons } from '@/components/VoteButtons';
import { CommentSection } from '@/components/CommentSection';
import { ArrowLeft, Clock, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Thread {
  id: string;
  title: string;
  content: string;
  created_at: string;
  book_id: string;
  profiles: {
    username: string;
  } | null;
  books: {
    title: string;
  } | null;
}

const ThreadDetail = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (threadId) {
      fetchThread();
    }
  }, [threadId]);

  const fetchThread = async () => {
    const { data, error } = await supabase
      .from('threads')
      .select(`
        *,
        profiles:created_by (username),
        books (title)
      `)
      .eq('id', threadId)
      .single();

    if (!error && data) {
      setThread(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <MessageSquare className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Thread not found</h2>
          <Button onClick={() => navigate('/')}>Return to Library</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 page-turn max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/book/${thread.book_id}`)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {thread.books?.title}
        </Button>

        <div className="book-page p-8 mb-8">
          <h1 className="text-3xl font-serif font-bold mb-4">{thread.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span>Posted by {thread.profiles?.username || 'Anonymous'}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
            </span>
          </div>

          <div className="flex gap-6">
            <VoteButtons 
              votableType="thread" 
              votableId={thread.id} 
            />
            
            <div className="flex-1">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{thread.content}</p>
            </div>
          </div>
        </div>

        <CommentSection threadId={thread.id} />
      </main>
    </div>
  );
};

export default ThreadDetail;