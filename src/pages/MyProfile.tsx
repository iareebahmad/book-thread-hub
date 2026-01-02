import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { ProfileEditor } from '@/components/ProfileEditor';
import { MyBooksManager } from '@/components/MyBooksManager';
import { FollowersList } from '@/components/FollowersList';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, BookOpen, ThumbsUp, MessageSquare } from 'lucide-react';
import { UserBadge } from '@/components/UserBadge';
import { AvatarCardDialog, AvatarCharacterName } from '@/components/AvatarCardDialog';

interface UserProfile {
  username: string;
  avatar_url: string | null;
  bio: string | null;
  favorite_genre: string | null;
  follower_count: number;
  following_count: number;
}

interface UserStats {
  totalBooks: number;
  totalUpvotes: number;
  totalThreads: number;
}

const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ totalBooks: 0, totalUpvotes: 0, totalThreads: 0 });
  const [loading, setLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfileData();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    setLoading(true);

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Fetch stats
    const { count: booksCount } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id);

    const { data: userBooks } = await supabase
      .from('books')
      .select('id')
      .eq('created_by', user.id);

    let totalUpvotes = 0;
    if (userBooks && userBooks.length > 0) {
      const bookIds = userBooks.map(b => b.id);
      const { data: votes } = await supabase
        .from('votes')
        .select('value')
        .eq('votable_type', 'book')
        .in('votable_id', bookIds);
      
      if (votes) {
        totalUpvotes = votes.filter(v => v.value === 1).length;
      }
    }

    const { count: threadsCount } = await supabase
      .from('threads')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id);

    setStats({
      totalBooks: booksCount || 0,
      totalUpvotes,
      totalThreads: threadsCount || 0
    });

    setLoading(false);
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="glass-card mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl font-bold">{profile?.username}</h1>
                  {user && <UserBadge userId={user.id} showLabel />}
                  {user && <AvatarCharacterName userId={user.id} />}
                </div>
                {profile?.bio && (
                  <p className="text-muted-foreground mb-3">{profile.bio}</p>
                )}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {profile?.favorite_genre && (
                    <Badge variant="secondary">
                      Loves {profile.favorite_genre}
                    </Badge>
                  )}
                  {user && <AvatarCardDialog userId={user.id} />}
                </div>
                
                <div className="flex justify-center md:justify-start gap-6 text-sm">
                  <button 
                    className="hover:text-primary transition-colors"
                    onClick={() => setShowFollowers(true)}
                  >
                    <span className="font-bold">{profile?.follower_count || 0}</span>
                    <span className="text-muted-foreground ml-1">followers</span>
                  </button>
                  <button 
                    className="hover:text-primary transition-colors"
                    onClick={() => setShowFollowers(true)}
                  >
                    <span className="font-bold">{profile?.following_count || 0}</span>
                    <span className="text-muted-foreground ml-1">following</span>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="glass-card text-center p-4">
            <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalBooks}</p>
            <p className="text-xs text-muted-foreground">Books Added</p>
          </Card>
          <Card className="glass-card text-center p-4">
            <ThumbsUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalUpvotes}</p>
            <p className="text-xs text-muted-foreground">Upvotes Received</p>
          </Card>
          <Card className="glass-card text-center p-4">
            <MessageSquare className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalThreads}</p>
            <p className="text-xs text-muted-foreground">Threads Created</p>
          </Card>
        </div>

        {/* Profile Editor & Books Manager */}
        <div className="space-y-6">
          <ProfileEditor />
          <MyBooksManager />
        </div>

        {/* Followers Dialog */}
        <FollowersList 
          userId={user?.id || ''} 
          isOpen={showFollowers} 
          onClose={() => setShowFollowers(false)} 
        />
      </main>
    </div>
  );
};

export default MyProfile;
