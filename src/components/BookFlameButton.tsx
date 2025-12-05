import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Flame, Sparkles } from 'lucide-react';

interface BookFlameButtonProps {
  targetUserId: string;
  targetUsername: string;
}

export const BookFlameButton = ({ targetUserId, targetUsername }: BookFlameButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [breakdown, setBreakdown] = useState({
    favoriteGenre: 0,
    booksUploaded: 0,
    likesOnBooks: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      calculateMatch();
    }
  }, [open, user, targetUserId]);

  const calculateMatch = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Get both users' profiles
      const [currentUserProfile, targetUserProfile] = await Promise.all([
        supabase.from('profiles').select('favorite_genre').eq('id', user.id).single(),
        supabase.from('profiles').select('favorite_genre').eq('id', targetUserId).single(),
      ]);

      // Get genres from books uploaded by both users
      const [currentUserBooks, targetUserBooks] = await Promise.all([
        supabase
          .from('books')
          .select('id, book_genres(genres(name))')
          .eq('created_by', user.id),
        supabase
          .from('books')
          .select('id, book_genres(genres(name))')
          .eq('created_by', targetUserId),
      ]);

      // Get genres from books liked by both users
      const [currentUserLikes, targetUserLikes] = await Promise.all([
        supabase
          .from('votes')
          .select('votable_id')
          .eq('user_id', user.id)
          .eq('votable_type', 'book')
          .eq('value', 1),
        supabase
          .from('votes')
          .select('votable_id')
          .eq('user_id', targetUserId)
          .eq('votable_type', 'book')
          .eq('value', 1),
      ]);

      // Calculate favorite genre match (40 points max)
      let favoriteGenreScore = 0;
      if (
        currentUserProfile.data?.favorite_genre &&
        targetUserProfile.data?.favorite_genre &&
        currentUserProfile.data.favorite_genre === targetUserProfile.data.favorite_genre
      ) {
        favoriteGenreScore = 40;
      }

      // Extract genres from uploaded books
      const extractGenres = (books: any[]) => {
        const genres = new Set<string>();
        books?.forEach((book) => {
          book.book_genres?.forEach((bg: any) => {
            if (bg.genres?.name) genres.add(bg.genres.name);
          });
        });
        return genres;
      };

      const currentGenres = extractGenres(currentUserBooks.data || []);
      const targetGenres = extractGenres(targetUserBooks.data || []);

      // Calculate books uploaded genre overlap (30 points max)
      let booksUploadedScore = 0;
      if (currentGenres.size > 0 && targetGenres.size > 0) {
        const intersection = [...currentGenres].filter((g) => targetGenres.has(g));
        const union = new Set([...currentGenres, ...targetGenres]);
        booksUploadedScore = Math.round((intersection.length / union.size) * 30);
      }

      // Calculate liked books overlap (30 points max)
      let likesScore = 0;
      const currentLikedIds = new Set(currentUserLikes.data?.map((v) => v.votable_id) || []);
      const targetLikedIds = new Set(targetUserLikes.data?.map((v) => v.votable_id) || []);

      if (currentLikedIds.size > 0 && targetLikedIds.size > 0) {
        const intersection = [...currentLikedIds].filter((id) => targetLikedIds.has(id));
        const union = new Set([...currentLikedIds, ...targetLikedIds]);
        likesScore = Math.round((intersection.length / union.size) * 30);
      }

      const total = favoriteGenreScore + booksUploadedScore + likesScore;
      setBreakdown({
        favoriteGenre: favoriteGenreScore,
        booksUploaded: booksUploadedScore,
        likesOnBooks: likesScore,
      });
      setMatchPercentage(total);
    } catch (error) {
      console.error('Error calculating match:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === targetUserId) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-orange-500/50 text-orange-500 hover:bg-orange-500/10">
          <Flame className="w-4 h-4" />
          BookFlame
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            BookFlame Match
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Main Score */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border-4 border-orange-500/30">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-orange-500">{matchPercentage}%</span>
                    <Sparkles className="w-5 h-5 text-orange-400 mx-auto mt-1" />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                Your reading compatibility with <strong className="text-foreground">@{targetUsername}</strong>
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Match Breakdown</h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Favorite Genre</span>
                    <span className="text-orange-500">{breakdown.favoriteGenre}/40</span>
                  </div>
                  <Progress value={(breakdown.favoriteGenre / 40) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Books Uploaded</span>
                    <span className="text-orange-500">{breakdown.booksUploaded}/30</span>
                  </div>
                  <Progress value={(breakdown.booksUploaded / 30) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Likes on Books</span>
                    <span className="text-orange-500">{breakdown.likesOnBooks}/30</span>
                  </div>
                  <Progress value={(breakdown.likesOnBooks / 30) * 100} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};