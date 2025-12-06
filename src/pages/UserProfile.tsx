import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookOpen, User, UserPlus, UserMinus, TrendingUp, Heart } from 'lucide-react';
import { useFollow } from '@/hooks/useFollow';
import { FollowersList } from '@/components/FollowersList';
import { BookFlameButton } from '@/components/BookFlameButton';
import { UserBadge } from '@/components/UserBadge';

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  follower_count: number;
  following_count: number;
  bio: string | null;
  favorite_genre: string | null;
}

interface UserStats {
  totalBooks: number;
  totalUpvotes: number;
  totalThreads: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
  genres?: { name: string }[];
}

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<UserStats>({ totalBooks: 0, totalUpvotes: 0, totalThreads: 0 });
  const [loading, setLoading] = useState(true);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const { isFollowing, loading: followLoading, toggleFollow } = useFollow(userId || '');

  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, follower_count, following_count, bio, favorite_genre')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select(`
          *,
          book_genres(
            genres(name)
          )
        `)
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;

      const formattedBooks = booksData.map(book => ({
        ...book,
        genres: book.book_genres?.map((bg: any) => bg.genres).filter(Boolean) || []
      }));

      setBooks(formattedBooks);

      // Fetch user statistics
      const [votesResult, threadsResult] = await Promise.all([
        supabase
          .from('votes')
          .select('value', { count: 'exact' })
          .eq('votable_type', 'book')
          .in('votable_id', booksData.map(b => b.id)),
        supabase
          .from('threads')
          .select('id', { count: 'exact' })
          .eq('created_by', userId),
      ]);

      const totalUpvotes = votesResult.data?.reduce((sum, vote) => sum + vote.value, 0) || 0;

      setStats({
        totalBooks: booksData.length,
        totalUpvotes,
        totalThreads: threadsResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <User className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">User not found</h2>
          <Button onClick={() => navigate('/search-users')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/search-users')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-6 mb-8 pb-8 border-b">
            
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted border border-border">
              <User className="w-7 h-7 text-muted-foreground" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-serif font-bold">@{profile.username}</h1>
                <UserBadge userId={profile.id} showLabel />
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <button
                  onClick={() => setShowFollowersList(true)}
                  className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                >
                  <strong className="text-foreground">{profile.follower_count || 0}</strong> followers
                </button>
                <button
                  onClick={() => setShowFollowersList(true)}
                  className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                >
                  <strong className="text-foreground">{profile.following_count || 0}</strong> following
                </button>
              </div>

              {profile.bio && (
                <p className="text-sm text-muted-foreground mb-3">{profile.bio}</p>
              )}

              {profile.favorite_genre && (
                <div className="mb-3">
                  <Badge variant="secondary" className="gap-1">
                    <Heart className="w-3 h-3" />
                    Favorite: {profile.favorite_genre}
                  </Badge>
                </div>
              )}

              {user && user.id !== profile.id && (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={toggleFollow}
                    disabled={followLoading}
                    variant={isFollowing ? "outline" : "default"}
                    className="gap-2"
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </Button>
                  <BookFlameButton targetUserId={profile.id} targetUsername={profile.username} />
                </div>
              )}
            </div>
          </div>

          {/* User Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.totalBooks}</div>
                <div className="text-sm text-muted-foreground">Books Added</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.totalUpvotes}</div>
                <div className="text-sm text-muted-foreground">Total Upvotes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <User className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.totalThreads}</div>
                <div className="text-sm text-muted-foreground">Threads Created</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Books Added</h2>

            {books.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">This user hasn't added any books yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {books.map(book => (
                  <div key={book.id} className="scale-90 origin-top">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <FollowersList
        userId={userId || ''}
        isOpen={showFollowersList}
        onClose={() => setShowFollowersList(false)}
      />
    </div>
  );
};

export default UserProfile;
