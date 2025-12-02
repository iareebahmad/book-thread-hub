-- Add bio and favorite_genre to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS favorite_genre TEXT;

-- Add delete policy for books so users can delete their own books
CREATE POLICY "Users can delete their own books"
ON public.books
FOR DELETE
USING (auth.uid() = created_by);