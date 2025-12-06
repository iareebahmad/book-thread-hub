import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, User, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  book_count?: number;
}

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter a username",
        description: "Please enter a username to search",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${searchQuery}%`)
        .limit(20);

      if (error) throw error;

      const profilesWithBooks = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { count } = await supabase
            .from('books')
            .select('*', { count: 'exact', head: true })
            .eq('created_by', profile.id);

          return {
            ...profile,
            book_count: count || 0
          };
        })
      );

      setUsers(profilesWithBooks);
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Search Users</h1>
            <p className="text-muted-foreground">Find readers and see what books they've added</p>
          </div>

          <div className="flex gap-2 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="space-y-4">
            {users.length === 0 && searchQuery && !loading && (
              <Card className="p-8 text-center">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No users found matching "{searchQuery}"
                </p>
              </Card>
            )}

            {users.map((user) => (
              <Card
                key={user.id}
                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/user/${user.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">@{user.username}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {user.book_count} {user.book_count === 1 ? 'book' : 'books'} added
                      </p>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserSearch;
