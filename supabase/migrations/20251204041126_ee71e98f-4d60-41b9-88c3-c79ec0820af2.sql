-- Allow admins to delete any book
CREATE POLICY "Admins can delete any book"
ON public.books
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));