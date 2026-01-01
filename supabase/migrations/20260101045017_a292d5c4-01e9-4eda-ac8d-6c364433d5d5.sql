-- Create table to store archived event statistics
CREATE TABLE public.event_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL,
  book_title TEXT NOT NULL,
  book_author TEXT NOT NULL,
  participant_count INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on event_stats
ALTER TABLE public.event_stats ENABLE ROW LEVEL SECURITY;

-- Only admins can view event stats
CREATE POLICY "Admins can view event stats"
ON public.event_stats
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert event stats (via edge function)
CREATE POLICY "Admins can insert event stats"
ON public.event_stats
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow service role to insert (for cron job)
CREATE POLICY "Service role can insert event stats"
ON public.event_stats
FOR INSERT
WITH CHECK (true);

-- Security fix: Allow users to delete their own threads
CREATE POLICY "Users can delete own threads"
ON public.threads
FOR DELETE
USING (auth.uid() = created_by);

-- Security fix: Allow users to delete their own comments
CREATE POLICY "Users can delete own comments"
ON public.comments
FOR DELETE
USING (auth.uid() = created_by);