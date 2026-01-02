import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AvatarCharacter {
  name: string;
  image: string;
  description: string;
  traits: string[];
}

const AVATAR_CHARACTERS: Record<string, AvatarCharacter> = {
  // Fantasy lovers
  fantasy_explorer: {
    name: "Elara the Dreamer",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
    description: "A mystical wanderer who finds magic in every page. Your love for fantasy shows your imaginative spirit and desire to explore worlds beyond reality.",
    traits: ["Imaginative", "Adventurous", "Dreamy"]
  },
  // Romance enthusiasts
  romance_poet: {
    name: "Sebastian Hearts",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "A hopeless romantic who believes in the power of love stories. Your passion for romance reveals your emotional depth and belief in human connections.",
    traits: ["Romantic", "Empathetic", "Passionate"]
  },
  // Mystery/Thriller fans
  mystery_detective: {
    name: "Detective Noir",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    description: "A sharp-minded sleuth who loves unraveling puzzles. Your affinity for mysteries shows your analytical mind and love for suspense.",
    traits: ["Analytical", "Curious", "Observant"]
  },
  // Sci-Fi enthusiasts
  scifi_voyager: {
    name: "Nova Starlight",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    description: "A futuristic visionary who dreams of what could be. Your love for sci-fi reveals your forward-thinking nature and fascination with technology.",
    traits: ["Visionary", "Innovative", "Futuristic"]
  },
  // Non-fiction/Self-help readers
  knowledge_seeker: {
    name: "Professor Sage",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    description: "A wisdom collector who values growth and learning. Your preference for knowledge-based reading shows your commitment to self-improvement.",
    traits: ["Wise", "Curious", "Grounded"]
  },
  // Horror fans
  shadow_walker: {
    name: "Raven Darkholme",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
    description: "A fearless soul who embraces the darkness. Your love for horror shows your courage to face fears and explore the unknown.",
    traits: ["Brave", "Intense", "Mysterious"]
  },
  // Historical fiction lovers
  time_traveler: {
    name: "Victoria Chronicles",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    description: "A history enthusiast who learns from the past. Your love for historical fiction shows your appreciation for heritage and storytelling.",
    traits: ["Cultured", "Reflective", "Wise"]
  },
  // Active community member
  community_champion: {
    name: "Atlas the Connector",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    description: "A social butterfly who brings readers together. Your high engagement shows your passion for building community and sharing ideas.",
    traits: ["Social", "Engaging", "Leader"]
  },
  // Adventure lovers
  adventure_seeker: {
    name: "Marco Explorer",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    description: "A bold adventurer who craves thrilling journeys. Your taste for adventure books reflects your restless spirit and hunger for new experiences.",
    traits: ["Bold", "Energetic", "Fearless"]
  },
  // Literary fiction readers
  literary_artist: {
    name: "Ophelia Prose",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
    description: "A connoisseur of beautiful writing and deep themes. Your appreciation for literary fiction shows your refined taste and love for artful storytelling.",
    traits: ["Thoughtful", "Artistic", "Introspective"]
  },
  // Comedy/Humor fans
  comedy_jester: {
    name: "Charlie Laughmore",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop",
    description: "A joyful soul who finds humor in everything. Your love for comedic reads shows your positive outlook and ability to find light in any situation.",
    traits: ["Witty", "Cheerful", "Lighthearted"]
  },
  // Young Adult enthusiasts
  young_adult_hero: {
    name: "Zara Brave",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
    description: "A spirited champion of coming-of-age stories. Your love for YA books shows your youthful heart and belief in growth and transformation.",
    traits: ["Youthful", "Hopeful", "Resilient"]
  },
  // Poetry lovers
  poetry_muse: {
    name: "Luna Verse",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    description: "A soul touched by the rhythm of words. Your affinity for poetry reveals your sensitivity to beauty and emotional depth.",
    traits: ["Poetic", "Sensitive", "Expressive"]
  },
  // Memoir/Autobiography readers
  memoir_chronicler: {
    name: "James Journey",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
    description: "A seeker of authentic human experiences. Your love for memoirs shows your empathy and desire to understand diverse life stories.",
    traits: ["Empathetic", "Insightful", "Authentic"]
  },
  // Default/Balanced reader
  balanced_reader: {
    name: "Phoenix Reader",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    description: "A versatile bibliophile who appreciates all genres. Your diverse reading habits show your open mind and appreciation for storytelling.",
    traits: ["Balanced", "Open-minded", "Versatile"]
  }
};

const GENRE_MAPPING: Record<string, string> = {
  'fantasy': 'fantasy_explorer',
  'romance': 'romance_poet',
  'mystery': 'mystery_detective',
  'thriller': 'mystery_detective',
  'science fiction': 'scifi_voyager',
  'sci-fi': 'scifi_voyager',
  'non-fiction': 'knowledge_seeker',
  'self-help': 'knowledge_seeker',
  'horror': 'shadow_walker',
  'historical fiction': 'time_traveler',
  'history': 'time_traveler',
  'biography': 'knowledge_seeker',
  'adventure': 'adventure_seeker',
  'action': 'adventure_seeker',
  'literary fiction': 'literary_artist',
  'classics': 'literary_artist',
  'comedy': 'comedy_jester',
  'humor': 'comedy_jester',
  'young adult': 'young_adult_hero',
  'ya': 'young_adult_hero',
  'poetry': 'poetry_muse',
  'memoir': 'memoir_chronicler',
  'autobiography': 'memoir_chronicler',
};

export const useAvatarCard = (userId: string | undefined) => {
  const [character, setCharacter] = useState<AvatarCharacter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      calculateAvatar();
    }
  }, [userId]);

  const calculateAvatar = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Get user's favorite genre
      const { data: profile } = await supabase
        .from('profiles')
        .select('favorite_genre')
        .eq('id', userId)
        .maybeSingle();

      // Get genres from books user has uploaded
      const { data: userBooks } = await supabase
        .from('books')
        .select('id')
        .eq('created_by', userId);

      const bookIds = userBooks?.map(b => b.id) || [];
      
      // Get genres from user's books
      let bookGenres: string[] = [];
      if (bookIds.length > 0) {
        const { data: bookGenreData } = await supabase
          .from('book_genres')
          .select('genres(name)')
          .in('book_id', bookIds);
        
        bookGenres = bookGenreData?.map((bg: any) => bg.genres?.name?.toLowerCase()).filter(Boolean) || [];
      }

      // Get genres from books user has upvoted
      const { data: userVotes } = await supabase
        .from('votes')
        .select('votable_id')
        .eq('user_id', userId)
        .eq('votable_type', 'book')
        .eq('value', 1);

      const votedBookIds = userVotes?.map(v => v.votable_id) || [];
      
      let votedGenres: string[] = [];
      if (votedBookIds.length > 0) {
        const { data: votedBookGenres } = await supabase
          .from('book_genres')
          .select('genres(name)')
          .in('book_id', votedBookIds);
        
        votedGenres = votedBookGenres?.map((bg: any) => bg.genres?.name?.toLowerCase()).filter(Boolean) || [];
      }

      // Count threads started
      const { count: threadCount } = await supabase
        .from('threads')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId);

      // Count total votes given
      const { count: voteCount } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Determine avatar based on engagement and genres
      const allGenres = [
        ...(profile?.favorite_genre ? [profile.favorite_genre.toLowerCase()] : []),
        ...bookGenres,
        ...votedGenres
      ];

      // Count genre occurrences
      const genreCounts: Record<string, number> = {};
      allGenres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });

      // Find dominant genre
      let dominantGenre = '';
      let maxCount = 0;
      Object.entries(genreCounts).forEach(([genre, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantGenre = genre;
        }
      });

      // Check for high engagement (community champion)
      const totalEngagement = (threadCount || 0) + (voteCount || 0) + (userBooks?.length || 0);
      if (totalEngagement >= 20) {
        setCharacter(AVATAR_CHARACTERS.community_champion);
      } else if (dominantGenre && GENRE_MAPPING[dominantGenre]) {
        setCharacter(AVATAR_CHARACTERS[GENRE_MAPPING[dominantGenre]]);
      } else if (profile?.favorite_genre) {
        const favoriteKey = GENRE_MAPPING[profile.favorite_genre.toLowerCase()];
        if (favoriteKey) {
          setCharacter(AVATAR_CHARACTERS[favoriteKey]);
        } else {
          setCharacter(AVATAR_CHARACTERS.balanced_reader);
        }
      } else {
        setCharacter(AVATAR_CHARACTERS.balanced_reader);
      }
    } catch (error) {
      console.error('Error calculating avatar:', error);
      setCharacter(AVATAR_CHARACTERS.balanced_reader);
    } finally {
      setLoading(false);
    }
  };

  return { character, loading };
};
