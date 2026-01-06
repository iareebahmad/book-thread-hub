import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTrendingBooks = () => {
  const [trendingBookIds, setTrendingBookIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTrendingBooks();
  }, []);

  const fetchTrendingBooks = async () => {
    // Get all books with their vote counts
    const { data: votes } = await supabase
      .from('votes')
      .select('votable_id, value')
      .eq('votable_type', 'book');

    // Get all comment counts per book (through threads)
    const { data: threads } = await supabase
      .from('threads')
      .select('book_id');

    const { data: comments } = await supabase
      .from('comments')
      .select('thread_id');

    // Calculate scores for each book
    const bookScores: Record<string, number> = {};

    // Add votes (only upvotes count)
    if (votes) {
      votes.forEach(vote => {
        if (vote.value === 1) {
          bookScores[vote.votable_id] = (bookScores[vote.votable_id] || 0) + 1;
        }
      });
    }

    // Count comments per book
    if (threads && comments) {
      const threadToBook: Record<string, string> = {};
      threads.forEach(t => {
        threadToBook[t.book_id] = t.book_id;
      });

      // Get thread IDs with their book associations
      const { data: threadData } = await supabase
        .from('threads')
        .select('id, book_id');

      if (threadData) {
        const threadBookMap: Record<string, string> = {};
        threadData.forEach(t => {
          threadBookMap[t.id] = t.book_id;
        });

        comments.forEach(comment => {
          const bookId = threadBookMap[comment.thread_id];
          if (bookId) {
            bookScores[bookId] = (bookScores[bookId] || 0) + 1;
          }
        });
      }
    }

    // Sort and get top 3
    const sortedBooks = Object.entries(bookScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([bookId]) => bookId);

    setTrendingBookIds(new Set(sortedBooks));
  };

  const isTrending = (bookId: string) => trendingBookIds.has(bookId);

  return { isTrending, trendingBookIds };
};
