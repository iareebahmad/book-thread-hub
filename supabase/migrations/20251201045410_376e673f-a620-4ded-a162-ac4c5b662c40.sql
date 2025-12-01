-- Drop duplicate notification triggers
DROP TRIGGER IF EXISTS on_comment_created ON comments;
DROP TRIGGER IF EXISTS on_book_vote_created ON votes;