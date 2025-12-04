import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBookThreadCount = (bookId: string) => {
  const [threadCount, setThreadCount] = useState(0);

  useEffect(() => {
    const fetchThreadCount = async () => {
      const { count } = await supabase
        .from('threads')
        .select('*', { count: 'exact', head: true })
        .eq('book_id', bookId);

      setThreadCount(count || 0);
    };

    fetchThreadCount();
  }, [bookId]);

  return threadCount;
};
