-- Create a function to notify all users when an event is created
CREATE OR REPLACE FUNCTION public.notify_event_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notify all users about the new event
  INSERT INTO public.notifications (user_id, type, title, message, link)
  SELECT 
    profiles.id,
    'event',
    'New Reading Event!',
    'A new community reading event has started for "' || (SELECT title FROM books WHERE id = NEW.book_id) || '". Join now!',
    '/events'
  FROM profiles;
  RETURN NEW;
END;
$$;

-- Create trigger for event notifications
DROP TRIGGER IF EXISTS on_event_created ON public.events;
CREATE TRIGGER on_event_created
  AFTER INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_event_created();

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);