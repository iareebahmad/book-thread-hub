import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AvatarCharacter {
  name: string;
  image: string;
  description: string;
  traits: string[];
  book: string;
}

const AVATAR_CHARACTERS: Record<string, AvatarCharacter> = {
  // Fantasy - Harry Potter
  fantasy_explorer: {
    name: "Harry Potter",
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=400&fit=crop",
    description: "The Boy Who Lived! Like Harry, you're drawn to magical worlds and epic adventures. Your love for fantasy reveals a brave heart that believes in the power of friendship and good over evil.",
    traits: ["Brave", "Loyal", "Adventurous"],
    book: "Harry Potter Series"
  },
  // Romance - Elizabeth Bennet
  romance_poet: {
    name: "Elizabeth Bennet",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    description: "Sharp-witted and independent like Elizabeth Bennet. Your passion for romance reveals your emotional depth, wit, and belief in finding true love on your own terms.",
    traits: ["Witty", "Independent", "Passionate"],
    book: "Pride and Prejudice"
  },
  // Mystery/Thriller - Nancy Drew
  mystery_detective: {
    name: "Nancy Drew",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    description: "A brilliant amateur sleuth like Nancy Drew! Your love for mysteries shows your sharp analytical mind, keen intuition, and unstoppable curiosity to solve puzzles.",
    traits: ["Clever", "Curious", "Resourceful"],
    book: "Nancy Drew Mystery Series"
  },
  // Sci-Fi - Paul Atreides
  scifi_voyager: {
    name: "Paul Atreides",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "A visionary leader like Paul Atreides from Dune. Your love for sci-fi reveals your forward-thinking nature and fascination with destiny, power, and the future of humanity.",
    traits: ["Visionary", "Strategic", "Prescient"],
    book: "Dune"
  },
  // Non-fiction/Self-help - Santiago (The Alchemist)
  knowledge_seeker: {
    name: "Santiago",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    description: "A seeker of Personal Legend like Santiago. Your preference for wisdom and growth shows your commitment to following your dreams and listening to your heart.",
    traits: ["Dreamer", "Wise", "Persistent"],
    book: "The Alchemist"
  },
  // Horror - Victor Frankenstein
  shadow_walker: {
    name: "Victor Frankenstein",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    description: "A boundary-pusher like Victor Frankenstein. Your love for horror shows your courage to explore dark themes and question the limits of human ambition.",
    traits: ["Ambitious", "Intense", "Curious"],
    book: "Frankenstein"
  },
  // Historical fiction - Jay Gatsby
  time_traveler: {
    name: "Jay Gatsby",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    description: "A dreamer of the past like Jay Gatsby. Your love for historical fiction shows your romantic idealism and appreciation for the grandeur of bygone eras.",
    traits: ["Romantic", "Ambitious", "Mysterious"],
    book: "The Great Gatsby"
  },
  // Adventure - Julian from Famous Five
  adventure_seeker: {
    name: "Julian",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    description: "A natural leader like Julian from The Famous Five. Your taste for adventure reflects your bold spirit, sense of responsibility, and hunger for thrilling outdoor escapades.",
    traits: ["Bold", "Responsible", "Adventurous"],
    book: "The Famous Five"
  },
  // Literary fiction - Atticus Finch
  literary_artist: {
    name: "Atticus Finch",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
    description: "A moral compass like Atticus Finch. Your appreciation for literary fiction shows your thoughtful nature and commitment to justice and understanding.",
    traits: ["Wise", "Compassionate", "Principled"],
    book: "To Kill a Mockingbird"
  },
  // Comedy/Humor - Don Quixote
  comedy_jester: {
    name: "Don Quixote",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop",
    description: "An idealistic dreamer like Don Quixote! Your love for humor shows your ability to find joy in absurdity and your belief that imagination can change the world.",
    traits: ["Idealistic", "Humorous", "Imaginative"],
    book: "Don Quixote"
  },
  // Young Adult - Katniss Everdeen
  young_adult_hero: {
    name: "Katniss Everdeen",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
    description: "A fierce survivor like Katniss Everdeen. Your love for YA shows your rebellious spirit, protective nature, and belief in fighting for what's right.",
    traits: ["Fierce", "Protective", "Resilient"],
    book: "The Hunger Games"
  },
  // Poetry - Rumi
  poetry_muse: {
    name: "Rumi",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
    description: "A soul touched by divine words like Rumi. Your affinity for poetry reveals your deep spirituality, sensitivity to beauty, and quest for transcendent love.",
    traits: ["Spiritual", "Poetic", "Loving"],
    book: "Rumi's Poetry Collections"
  },
  // Memoir/Autobiography - Anne Frank
  memoir_chronicler: {
    name: "Anne Frank",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
    description: "A hopeful chronicler like Anne Frank. Your love for memoirs shows your deep empathy, belief in humanity's goodness, and appreciation for authentic stories.",
    traits: ["Hopeful", "Empathetic", "Reflective"],
    book: "The Diary of a Young Girl"
  },
  // Crime - Sherlock Holmes
  crime_solver: {
    name: "Sherlock Holmes",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    description: "The world's greatest detective! Like Sherlock Holmes, you possess exceptional observational skills and a brilliant deductive mind that craves intellectual challenges.",
    traits: ["Brilliant", "Observant", "Logical"],
    book: "Sherlock Holmes Series"
  },
  // Community champion - Gandalf
  community_champion: {
    name: "Gandalf",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    description: "A wise guide like Gandalf! Your high engagement shows your passion for bringing readers together and guiding others on their literary journeys.",
    traits: ["Wise", "Inspiring", "Leader"],
    book: "The Lord of the Rings"
  },
  // Default - Hermione Granger
  balanced_reader: {
    name: "Hermione Granger",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    description: "A voracious reader like Hermione Granger! Your diverse reading habits show your incredible thirst for knowledge and ability to find wisdom in every genre.",
    traits: ["Brilliant", "Studious", "Loyal"],
    book: "Harry Potter Series"
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
  'philosophy': 'knowledge_seeker',
  'horror': 'shadow_walker',
  'gothic': 'shadow_walker',
  'historical fiction': 'time_traveler',
  'history': 'time_traveler',
  'biography': 'memoir_chronicler',
  'adventure': 'adventure_seeker',
  'action': 'adventure_seeker',
  'literary fiction': 'literary_artist',
  'classics': 'literary_artist',
  'comedy': 'comedy_jester',
  'humor': 'comedy_jester',
  'satire': 'comedy_jester',
  'young adult': 'young_adult_hero',
  'ya': 'young_adult_hero',
  'dystopian': 'young_adult_hero',
  'poetry': 'poetry_muse',
  'memoir': 'memoir_chronicler',
  'autobiography': 'memoir_chronicler',
  'crime': 'crime_solver',
  'detective': 'crime_solver',
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
