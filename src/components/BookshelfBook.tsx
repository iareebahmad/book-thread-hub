import { useNavigate } from 'react-router-dom';
import { Heart, TrendingUp, MessageCircle } from 'lucide-react';
import { useBookVotes } from '@/hooks/useBookVotes';
import { useFavorite } from '@/hooks/useFavorite';
import { useBookThreadCount } from '@/hooks/useBookThreadCount';

interface BookshelfBookProps {
  book: {
    id: string;
    title: string;
    author: string;
    cover_url: string | null;
  };
  isTrending?: boolean;
}

export const BookshelfBook = ({ book, isTrending = false }: BookshelfBookProps) => {
  const navigate = useNavigate();
  const { voteCount } = useBookVotes(book.id);
  const { isFavorite, toggleFavorite } = useFavorite(book.id);
  const threadCount = useBookThreadCount(book.id);

  const handleClick = () => {
    navigate(`/book/${book.id}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  };

  return (
    <div
      className="book-on-shelf group cursor-pointer"
      onClick={handleClick}
    >
      {/* Book spine visible from front */}
      <div className="book-wrapper relative">
        {/* Trending indicator */}
        {isTrending && (
          <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-1.5 shadow-lg animate-pulse">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
        )}

        {/* The book cover */}
        <div className="book-cover relative overflow-hidden rounded-sm shadow-lg transition-all duration-300 group-hover:shadow-2xl">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-24 h-36 md:w-28 md:h-40 object-cover"
            />
          ) : (
            <div className="w-24 h-36 md:w-28 md:h-40 bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center p-2">
              <span className="text-amber-100 text-[10px] text-center font-serif line-clamp-3">
                {book.title}
              </span>
            </div>
          )}
          
          {/* Book spine shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/40 to-transparent" />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <p className="text-white text-[10px] font-medium line-clamp-2 mb-1">{book.title}</p>
              <p className="text-white/70 text-[8px]">{book.author}</p>
            </div>
          </div>

          {/* Quick action buttons */}
          <button
            onClick={handleFavorite}
            className="absolute top-1 right-1 p-1.5 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/60 hover:scale-110"
          >
            <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>

          {/* Stats badges */}
          <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {voteCount > 0 && (
              <span className="bg-primary/90 text-primary-foreground text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                ↑{voteCount}
              </span>
            )}
            {threadCount > 0 && (
              <span className="bg-accent/90 text-accent-foreground text-[8px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                <MessageCircle className="w-2 h-2" />
                {threadCount}
              </span>
            )}
          </div>
        </div>

        {/* 3D book effect */}
        <div className="book-3d-side" />
        <div className="book-3d-bottom" />
      </div>

      {/* Book label below */}
      <div className="mt-2 text-center max-w-24 md:max-w-28">
        <p className="text-[10px] text-foreground font-medium line-clamp-1">{book.title}</p>
        <p className="text-[8px] text-muted-foreground line-clamp-1">{book.author}</p>
      </div>
    </div>
  );
};