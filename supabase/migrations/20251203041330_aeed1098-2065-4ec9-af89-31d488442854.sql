-- Create events table for book reading events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event participants table
CREATE TABLE public.event_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Events are viewable by everyone
CREATE POLICY "Events are viewable by everyone"
ON public.events FOR SELECT USING (true);

-- Event participants are viewable by everyone
CREATE POLICY "Event participants are viewable by everyone"
ON public.event_participants FOR SELECT USING (true);

-- Users can join events
CREATE POLICY "Users can join events"
ON public.event_participants FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can leave events
CREATE POLICY "Users can leave events"
ON public.event_participants FOR DELETE
USING (auth.uid() = user_id);