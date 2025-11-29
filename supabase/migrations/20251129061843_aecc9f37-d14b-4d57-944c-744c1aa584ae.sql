-- Enable cascade deletes for user-related data
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE books DROP CONSTRAINT IF EXISTS books_created_by_fkey;
ALTER TABLE books 
  ADD CONSTRAINT books_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE threads DROP CONSTRAINT IF EXISTS threads_created_by_fkey;
ALTER TABLE threads 
  ADD CONSTRAINT threads_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_created_by_fkey;
ALTER TABLE comments 
  ADD CONSTRAINT comments_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_user_id_fkey;
ALTER TABLE votes 
  ADD CONSTRAINT votes_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;
ALTER TABLE favorites 
  ADD CONSTRAINT favorites_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referrer_id_fkey;
ALTER TABLE referrals 
  ADD CONSTRAINT referrals_referrer_id_fkey 
  FOREIGN KEY (referrer_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE notifications 
  ADD CONSTRAINT notifications_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Create triggers for notifications
DROP TRIGGER IF EXISTS notify_thread_comment_trigger ON comments;
CREATE TRIGGER notify_thread_comment_trigger
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_thread_comment();

DROP TRIGGER IF EXISTS notify_book_vote_trigger ON votes;
CREATE TRIGGER notify_book_vote_trigger
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION notify_book_vote();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;