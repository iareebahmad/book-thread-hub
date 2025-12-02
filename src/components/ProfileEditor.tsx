import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User } from 'lucide-react';

export const ProfileEditor = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchGenres();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio, favorite_genre')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setUsername(data.username || '');
        setBio(data.bio || '');
        setFavoriteGenre(data.favorite_genre || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setGenres(data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          bio: bio.trim() || null,
          favorite_genre: favoriteGenre || null,
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Edit Profile
        </CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">About / Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="favorite-genre">Favorite Genre</Label>
          <Select value={favoriteGenre} onValueChange={setFavoriteGenre}>
            <SelectTrigger id="favorite-genre">
              <SelectValue placeholder="Select your favorite genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.name}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleUpdateProfile} disabled={loading} className="w-full">
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </CardContent>
    </Card>
  );
};
