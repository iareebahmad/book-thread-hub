import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the user from the request
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log(`Deleting account for user: ${user.id}`);

    // Delete user data in order (respecting foreign key constraints)
    // Votes, comments, threads, book_genres, books will be deleted by cascade
    // But we'll delete them explicitly for logging purposes

    // Delete votes
    const { error: votesError } = await supabaseAdmin
      .from('votes')
      .delete()
      .eq('user_id', user.id);
    
    if (votesError) console.error('Error deleting votes:', votesError);

    // Delete comments
    const { error: commentsError } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('created_by', user.id);
    
    if (commentsError) console.error('Error deleting comments:', commentsError);

    // Delete threads
    const { error: threadsError } = await supabaseAdmin
      .from('threads')
      .delete()
      .eq('created_by', user.id);
    
    if (threadsError) console.error('Error deleting threads:', threadsError);

    // Get books created by user to delete their genres
    const { data: userBooks } = await supabaseAdmin
      .from('books')
      .select('id')
      .eq('created_by', user.id);

    if (userBooks && userBooks.length > 0) {
      const bookIds = userBooks.map(book => book.id);
      
      // Delete book genres
      const { error: bookGenresError } = await supabaseAdmin
        .from('book_genres')
        .delete()
        .in('book_id', bookIds);
      
      if (bookGenresError) console.error('Error deleting book genres:', bookGenresError);
    }

    // Delete books
    const { error: booksError } = await supabaseAdmin
      .from('books')
      .delete()
      .eq('created_by', user.id);
    
    if (booksError) console.error('Error deleting books:', booksError);

    // Delete profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', user.id);
    
    if (profileError) console.error('Error deleting profile:', profileError);

    // Finally, delete the auth user
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteAuthError) {
      throw deleteAuthError;
    }

    console.log(`Successfully deleted account for user: ${user.id}`);

    return new Response(
      JSON.stringify({ message: 'Account deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error deleting account:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
