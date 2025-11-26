import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddBookDialogProps {
  onBookAdded: () => void;
  genres: { id: string; name: string }[];
}

export const AddBookDialog = ({ onBookAdded, genres }: AddBookDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    // Insert book
    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert({
        title,
        author,
        description: description || null,
        cover_url: coverUrl || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (bookError) {
      toast({
        title: "Error creating book",
        description: bookError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Insert book-genre relationships
    if (selectedGenres.length > 0 && book) {
      const bookGenres = selectedGenres.map(genreId => ({
        book_id: book.id,
        genre_id: genreId,
      }));

      await supabase.from('book_genres').insert(bookGenres);
    }

    toast({
      title: "Book added!",
      description: `${title} has been added to the library.`,
    });

    setTitle('');
    setAuthor('');
    setDescription('');
    setCoverUrl('');
    setSelectedGenres([]);
    setOpen(false);
    setLoading(false);
    onBookAdded();
  };

  const toggleGenre = (genreId: string) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">Add a New Book</DialogTitle>
          <DialogDescription>
            Share a book with the community and start discussions
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter book title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="Enter author name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image URL</Label>
            <Input
              id="cover"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the book..."
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label>Genres</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {genres.map(genre => (
                <div key={genre.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={genre.id}
                    checked={selectedGenres.includes(genre.id)}
                    onCheckedChange={() => toggleGenre(genre.id)}
                  />
                  <label
                    htmlFor={genre.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {genre.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Book'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};