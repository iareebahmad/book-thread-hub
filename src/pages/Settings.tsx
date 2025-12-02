import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { AccountSettings } from '@/components/AccountSettings';
import { ProfileEditor } from '@/components/ProfileEditor';
import { MyBooksManager } from '@/components/MyBooksManager';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 page-turn max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-serif font-bold text-foreground">Account Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <div className="space-y-6">
          <ProfileEditor />
          <MyBooksManager />
          <AccountSettings />
        </div>
      </main>
    </div>
  );
};

export default Settings;
