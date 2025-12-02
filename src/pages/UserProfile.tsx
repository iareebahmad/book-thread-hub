import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, User, UserPlus, UserMinus } from 'lucide-react';
import { useFollow } from '@/hooks/useFollow';

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  follower_count: number;
  following_count: number;
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
  const [loading, setLoading] = useState(true);
  const { isFollowing, loading: followLoading, toggleFollow } = useFollow(userId || '');

  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, follower_count, following_count')
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
    <div className="min-h-screen bg-background">
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
              <h1 className="text-3xl font-serif font-bold mb-2">@{profile.username}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <strong className="text-foreground">{profile.follower_count || 0}</strong> followers
                </span>
                <span className="flex items-center gap-1">
                  <strong className="text-foreground">{profile.following_count || 0}</strong> following
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <strong className="text-foreground">{books.length}</strong> {books.length === 1 ? 'book' : 'books'}
                </span>
              </div>

              {user && user.id !== profile.id && (
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
              )}
            </div>
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
    </div>
  );
};

export default UserProfile;
