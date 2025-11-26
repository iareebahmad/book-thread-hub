import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface CreateThreadDialogProps {
  bookId: string;
}

export const CreateThreadDialog = ({ bookId }: CreateThreadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('threads')
      .insert({
        book_id: bookId,
        title,
        content,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating thread",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thread created!",
        description: "Your discussion has been started.",
      });
      setTitle('');
      setContent('');
      setOpen(false);
      navigate(`/thread/${data.id}`);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif">Start a Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts and spark a conversation
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="thread-title">Title *</Label>
            <Input
              id="thread-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="What's on your mind about this book?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thread-content">Your thoughts *</Label>
            <Textarea
              id="thread-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Share your insights, questions, or opinions..."
              rows={8}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Thread'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};