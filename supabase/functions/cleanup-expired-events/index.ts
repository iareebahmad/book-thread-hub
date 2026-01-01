import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting expired events cleanup...')
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all expired events (end_date is in the past)
    const { data: expiredEvents, error: fetchError } = await supabaseAdmin
      .from('events')
      .select(`
        id,
        book_id,
        start_date,
        end_date,
        book:books(title, author)
      `)
      .lt('end_date', new Date().toISOString())

    if (fetchError) {
      console.error('Error fetching expired events:', fetchError)
      throw fetchError
    }

    console.log(`Found ${expiredEvents?.length || 0} expired events`)

    if (!expiredEvents || expiredEvents.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No expired events to clean up', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Archive stats and delete each expired event
    for (const event of expiredEvents) {
      // Get participant count
      const { count: participantCount } = await supabaseAdmin
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)

      const bookData = event.book as unknown as { title: string; author: string } | null

      // Archive the event stats
      const { error: archiveError } = await supabaseAdmin
        .from('event_stats')
        .insert({
          book_id: event.book_id,
          book_title: bookData?.title || 'Unknown',
          book_author: bookData?.author || 'Unknown',
          participant_count: participantCount || 0,
          start_date: event.start_date,
          end_date: event.end_date,
        })

      if (archiveError) {
        console.error(`Error archiving event ${event.id}:`, archiveError)
        continue
      }

      console.log(`Archived event ${event.id} with ${participantCount} participants`)

      // Delete participants first (due to foreign key constraints)
      await supabaseAdmin
        .from('event_participants')
        .delete()
        .eq('event_id', event.id)

      // Delete the event
      const { error: deleteError } = await supabaseAdmin
        .from('events')
        .delete()
        .eq('id', event.id)

      if (deleteError) {
        console.error(`Error deleting event ${event.id}:`, deleteError)
      } else {
        console.log(`Deleted expired event ${event.id}`)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Expired events cleaned up successfully', 
        count: expiredEvents.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Cleanup error:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
