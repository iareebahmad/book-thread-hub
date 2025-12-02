import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface FollowersListProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FollowersList = ({ userId, isOpen, onClose }: FollowersListProps) => {
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && userId) {
      fetchFollowersAndFollowing();
    }
  }, [isOpen, userId]);

  const fetchFollowersAndFollowing = async () => {
    setLoading(true);
    try {
      // Fetch followers
      const { data: followersData, error: followersError } = await supabase
        .from('follows')
        .select(`
          follower_id,
          profiles!follows_follower_id_fkey(id, username, avatar_url)
        `)
        .eq('following_id', userId);

      if (followersError) throw followersError;

      // Fetch following
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select(`
          following_id,
          profiles!follows_following_id_fkey(id, username, avatar_url)
        `)
        .eq('follower_id', userId);

      if (followingError) throw followingError;

      setFollowers(followersData?.map((f: any) => f.profiles).filter(Boolean) || []);
      setFollowing(followingData?.map((f: any) => f.profiles).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching followers/following:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (profileId: string) => {
    onClose();
    navigate(`/user/${profileId}`);
  };

  const UserList = ({ users }: { users: Profile[] }) => (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {users.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No users to display</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleProfileClick(user.id)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="font-medium">@{user.username}</span>
          </div>
        ))
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connections</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="followers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">
              Followers ({followers.length})
            </TabsTrigger>
            <TabsTrigger value="following">
              Following ({following.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="followers" className="mt-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <UserList users={followers} />
            )}
          </TabsContent>
          <TabsContent value="following" className="mt-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <UserList users={following} />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
