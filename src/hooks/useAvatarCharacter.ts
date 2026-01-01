import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CharacterMatch {
  character: string;
  book: string;
  reason: string;
}

export const useAvatarCharacter = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [characterMatch, setCharacterMatch] = useState<CharacterMatch | null>(null);

  const generateCharacter = useCallback(async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to discover your book character.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-avatar-character');

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setCharacterMatch(data);
      return data;
    } catch (error) {
      console.error('Error generating character:', error);
      toast({
        title: "Error",
        description: "Failed to generate your character match. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { loading, characterMatch, generateCharacter, setCharacterMatch };
};
