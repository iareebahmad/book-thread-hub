import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VoteButtons } from '@/components/VoteButtons';
import { MessageSquare, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_comment_id: string | null;
  profiles: {
    username: string;
  } | null;
  replies?: Comment[];
}

interface CommentSectionProps {
  threadId: string;
}

export const CommentSection = ({ threadId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [threadId]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (data) {
      // Fetch profiles for all comments
      const userIds = [...new Set(data.map(c => c.created_by))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      // Organize comments into tree structure
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      data.forEach(comment => {
        commentMap.set(comment.id, { 
          ...comment, 
          profiles: profilesMap.get(comment.created_by) || null,
          replies: [] 
        });
      });

      data.forEach(comment => {
        const commentObj = commentMap.get(comment.id)!;
        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies!.push(commentObj);
          }
        } else {
          rootComments.push(commentObj);
        }
      });

      setComments(rootComments);
    }
  };

  const handleAddComment = async (parentId: string | null = null) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to be signed in to comment",
        variant: "destructive",
      });
      return;
    }

    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    setLoading(true);

    const { error } = await supabase
      .from('comments')
      .insert({
        thread_id: threadId,
        parent_comment_id: parentId,
        content,
        created_by: user.id,
      });

    if (error) {
      toast({
        title: "Error posting comment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      if (parentId) {
        setReplyContent('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }
      fetchComments();
      toast({
        title: "Comment posted!",
      });
    }

    setLoading(false);
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-12 mt-4' : 'mb-6'}`}>
      <div className="book-page p-4">
        <div className="flex gap-4">
          <VoteButtons votableType="comment" votableId={comment.id} />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="font-semibold text-foreground">
                {comment.profiles?.username || 'Anonymous'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            
            <p className="text-foreground mb-3 whitespace-pre-wrap">{comment.content}</p>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(comment.id)}
              className="gap-2 h-8"
            >
              <MessageSquare className="w-3 h-3" />
              Reply
            </Button>

            {replyingTo === comment.id && (
              <div className="mt-4">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  rows={3}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddComment(comment.id)}
                    disabled={loading}
                  >
                    Post Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Comments</h2>

      <div className="book-page p-6 mb-8">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          className="mb-4"
        />
        <Button
          onClick={() => handleAddComment()}
          disabled={loading || !newComment.trim()}
        >
          Post Comment
        </Button>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div>
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};