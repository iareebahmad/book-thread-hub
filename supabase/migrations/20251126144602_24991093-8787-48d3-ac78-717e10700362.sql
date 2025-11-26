-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create books table
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Books are viewable by everyone" 
ON public.books FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create books" 
ON public.books FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Create genres table
CREATE TABLE public.genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Genres are viewable by everyone" 
ON public.genres FOR SELECT 
USING (true);

-- Create book_genres junction table
CREATE TABLE public.book_genres (
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES public.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, genre_id)
);

ALTER TABLE public.book_genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Book genres are viewable by everyone" 
ON public.book_genres FOR SELECT 
USING (true);

CREATE POLICY "Users can add genres to their books" 
ON public.book_genres FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.books 
    WHERE id = book_id AND created_by = auth.uid()
  )
);

-- Create threads table
CREATE TABLE public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Threads are viewable by everyone" 
ON public.threads FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create threads" 
ON public.threads FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own threads" 
ON public.threads FOR UPDATE 
USING (auth.uid() = created_by);

-- Create comments table with nested replies support
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = created_by);

-- Create votes table (for threads and comments)
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  votable_type TEXT NOT NULL CHECK (votable_type IN ('thread', 'comment')),
  votable_id UUID NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(votable_type, votable_id, user_id)
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by everyone" 
ON public.votes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can vote" 
ON public.votes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" 
ON public.votes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" 
ON public.votes FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default genres
INSERT INTO public.genres (name) VALUES
  ('Fiction'),
  ('Non-Fiction'),
  ('Fantasy'),
  ('Science Fiction'),
  ('Mystery'),
  ('Thriller'),
  ('Romance'),
  ('Horror'),
  ('Biography'),
  ('History'),
  ('Philosophy'),
  ('Poetry');

-- Create indexes for better performance
CREATE INDEX idx_books_author ON public.books(author);
CREATE INDEX idx_books_created_at ON public.books(created_at DESC);
CREATE INDEX idx_threads_book_id ON public.threads(book_id);
CREATE INDEX idx_threads_created_at ON public.threads(created_at DESC);
CREATE INDEX idx_comments_thread_id ON public.comments(thread_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_comment_id);
CREATE INDEX idx_votes_votable ON public.votes(votable_type, votable_id);