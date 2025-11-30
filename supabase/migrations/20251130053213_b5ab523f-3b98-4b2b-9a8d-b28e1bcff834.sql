-- Drop the existing check constraint on votes.votable_type
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_votable_type_check;

-- Add a new check constraint that allows 'book', 'thread', and 'comment'
ALTER TABLE votes ADD CONSTRAINT votes_votable_type_check 
  CHECK (votable_type IN ('book', 'thread', 'comment'));