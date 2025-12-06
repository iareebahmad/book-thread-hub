import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type BadgeLevel = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

interface BadgeInfo {
  level: BadgeLevel;
  engagements: number;
  label: string;
  color: string;
}

export const useUserBadge = (userId: string) => {
  const [badge, setBadge] = useState<BadgeInfo>({ 
    level: 'none', 
    engagements: 0, 
    label: '', 
    color: '' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      calculateBadge();
    }
  }, [userId]);

  const calculateBadge = async () => {
    setLoading(true);
    
    // Get the start of the current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    try {
      // Count books added this month
      const { count: booksCount } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId)
        .gte('created_at', monthStart);

      // Count threads started this month
      const { count: threadsCount } = await supabase
        .from('threads')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId)
        .gte('created_at', monthStart);

      // Count likes given this month
      const { count: likesCount } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('value', 1)
        .gte('created_at', monthStart);

      const totalEngagements = (booksCount || 0) + (threadsCount || 0) + (likesCount || 0);

      let badgeInfo: BadgeInfo;

      if (totalEngagements >= 10) {
        badgeInfo = { level: 'platinum', engagements: totalEngagements, label: 'Platinum Reader', color: 'from-slate-300 via-slate-100 to-slate-400' };
      } else if (totalEngagements >= 7) {
        badgeInfo = { level: 'gold', engagements: totalEngagements, label: 'Gold Reader', color: 'from-yellow-400 via-yellow-300 to-yellow-500' };
      } else if (totalEngagements >= 5) {
        badgeInfo = { level: 'silver', engagements: totalEngagements, label: 'Silver Reader', color: 'from-gray-300 via-gray-200 to-gray-400' };
      } else if (totalEngagements >= 3) {
        badgeInfo = { level: 'bronze', engagements: totalEngagements, label: 'Bronze Reader', color: 'from-amber-600 via-amber-500 to-amber-700' };
      } else {
        badgeInfo = { level: 'none', engagements: totalEngagements, label: '', color: '' };
      }

      setBadge(badgeInfo);
    } catch (error) {
      console.error('Error calculating badge:', error);
    } finally {
      setLoading(false);
    }
  };

  return { badge, loading };
};
