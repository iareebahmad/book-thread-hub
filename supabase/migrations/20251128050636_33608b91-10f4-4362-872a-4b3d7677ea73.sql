-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, book_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_email TEXT NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted BOOLEAN DEFAULT false
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- Function to create notification when someone comments on a thread
CREATE OR REPLACE FUNCTION public.notify_thread_comment()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify thread creator if someone else comments
  IF NEW.created_by != (SELECT created_by FROM threads WHERE id = NEW.thread_id) THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    SELECT 
      threads.created_by,
      'comment',
      'New comment on your thread',
      (SELECT username FROM profiles WHERE id = NEW.created_by) || ' commented on your thread',
      '/thread/' || NEW.thread_id
    FROM threads
    WHERE threads.id = NEW.thread_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_thread_comment();

-- Function to create notification when someone votes on a book
CREATE OR REPLACE FUNCTION public.notify_book_vote()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify book creator if someone else votes
  IF NEW.votable_type = 'book' AND NEW.user_id != (SELECT created_by FROM books WHERE id = NEW.votable_id) THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    SELECT 
      books.created_by,
      'vote',
      'New vote on your book',
      (SELECT username FROM profiles WHERE id = NEW.user_id) || ' voted on your book',
      '/book/' || NEW.votable_id
    FROM books
    WHERE books.id = NEW.votable_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_book_vote_created
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_book_vote();