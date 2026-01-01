import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Generating avatar character for user ${user.id}`)

    // Fetch user's interactions
    const [votesResult, threadsResult, booksResult, profileResult, favoritesResult] = await Promise.all([
      supabaseClient.from('votes').select('votable_id, votable_type, value').eq('user_id', user.id),
      supabaseClient.from('threads').select('book_id').eq('created_by', user.id),
      supabaseClient.from('books').select('id, genres:book_genres(genre:genres(name))').eq('created_by', user.id),
      supabaseClient.from('profiles').select('favorite_genre, bio').eq('id', user.id).single(),
      supabaseClient.from('favorites').select('book_id').eq('user_id', user.id),
    ])

    // Collect all book IDs from interactions
    const bookIds = new Set<string>()
    
    // From votes on books
    votesResult.data?.filter(v => v.votable_type === 'book').forEach(v => bookIds.add(v.votable_id))
    
    // From threads
    threadsResult.data?.forEach(t => bookIds.add(t.book_id))
    
    // From favorites
    favoritesResult.data?.forEach(f => bookIds.add(f.book_id))

    // Fetch genres of interacted books
    let interactedGenres: string[] = []
    if (bookIds.size > 0) {
      const { data: genreData } = await supabaseClient
        .from('book_genres')
        .select('genre:genres(name)')
        .in('book_id', Array.from(bookIds))
      
      interactedGenres = genreData?.map(g => (g.genre as unknown as { name: string })?.name).filter(Boolean) || []
    }

    // Genres from user's own books
    const ownBookGenres = booksResult.data?.flatMap(b => 
      (b.genres as unknown as { genre: { name: string } }[])?.map(g => g.genre?.name)
    ).filter(Boolean) || []

    // Count genre frequencies
    const genreCounts: Record<string, number> = {}
    const allGenres = [...interactedGenres, ...ownBookGenres]
    if (profileResult.data?.favorite_genre) {
      allGenres.push(profileResult.data.favorite_genre, profileResult.data.favorite_genre) // Weight favorite genre
    }
    
    allGenres.forEach(g => {
      if (g) genreCounts[g] = (genreCounts[g] || 0) + 1
    })

    // Get top genres
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre)

    // Calculate upvote/downvote ratio for personality
    const upvotes = votesResult.data?.filter(v => v.value > 0).length || 0
    const downvotes = votesResult.data?.filter(v => v.value < 0).length || 0
    const totalVotes = upvotes + downvotes
    const positivityRatio = totalVotes > 0 ? upvotes / totalVotes : 0.5

    // Build user profile context for AI
    const userContext = {
      topGenres,
      favoriteGenre: profileResult.data?.favorite_genre,
      bio: profileResult.data?.bio,
      positivityRatio,
      bookCount: booksResult.data?.length || 0,
      threadCount: threadsResult.data?.length || 0,
      favoriteCount: favoritesResult.data?.length || 0,
    }

    console.log('User context:', JSON.stringify(userContext))

    // Call Lovable AI to generate character match
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a literary character matcher. Based on a user's reading preferences and behavior, match them to a famous book character. Respond ONLY with valid JSON in this exact format:
{
  "character": "Character Name",
  "book": "Book Title",
  "reason": "A short 1-2 sentence explanation of why they match this character, written in second person (you are...)"
}
Choose characters from well-known classic and modern literature. Be creative but accurate in your matching.`
          },
          {
            role: 'user',
            content: `Match this reader to a book character:
- Top genres: ${topGenres.join(', ') || 'General fiction'}
- Favorite genre: ${userContext.favoriteGenre || 'Not specified'}
- Bio: ${userContext.bio || 'Not provided'}
- Positivity (upvote ratio): ${(positivityRatio * 100).toFixed(0)}%
- Books added: ${userContext.bookCount}
- Discussions started: ${userContext.threadCount}
- Books favorited: ${userContext.favoriteCount}

Consider: High positivity = optimistic/supportive characters. Low positivity = critical/analytical characters. High activity = passionate/dedicated characters.`
          }
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      console.error('AI API error:', errorText)
      throw new Error(`AI API error: ${aiResponse.status}`)
    }

    const aiData = await aiResponse.json()
    const content = aiData.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content in AI response')
    }

    // Parse JSON from response
    let characterMatch
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        characterMatch = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Content:', content)
      // Fallback
      characterMatch = {
        character: "Elizabeth Bennet",
        book: "Pride and Prejudice",
        reason: "You are a discerning reader with strong opinions and a love for intelligent discourse."
      }
    }

    console.log('Character match:', characterMatch)

    return new Response(
      JSON.stringify(characterMatch),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
