-- Fix search_path for notify_thread_comment function
CREATE OR REPLACE FUNCTION public.notify_thread_comment()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fix search_path for notify_book_vote function
CREATE OR REPLACE FUNCTION public.notify_book_vote()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;