import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { BookOpen, Trash2 } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
}

export const MyBooksManager = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMyBooks();
    }
  }, [user]);

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author, cover_url')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load your books');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;
      
      setBooks(books.filter((book) => book.id !== bookId));
      toast.success('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    } finally {
      setDeleteBookId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Books
          </CardTitle>
          <CardDescription>Manage books you've added to the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading your books...</div>
          ) : books.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>You haven't added any books yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{book.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteBookId(book.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteBookId} onOpenChange={() => setDeleteBookId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this book and all associated threads, comments, and votes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteBookId && handleDeleteBook(deleteBookId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
