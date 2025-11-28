import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useFavorite = (bookId: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkFavorite();
    }
  }, [bookId, user]);

  const checkFavorite = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .maybeSingle();

    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to add favourites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('book_id', bookId);
        
        setIsFavorite(false);
        toast.success('Removed from favourites');
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            book_id: bookId,
          });
        
        setIsFavorite(true);
        toast.success('Added to favourites');
      }
    } catch (error) {
      toast.error('Failed to update favourites');
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, loading, toggleFavorite };
};
