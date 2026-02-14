import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InteractionRequest {
  whatIGave: string
  whatIGot: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the JWT token and get user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token or user not found' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { whatIGave, whatIGot }: InteractionRequest = await req.json()

    // Validate input
    if (!whatIGave || !whatIGot) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: whatIGave and whatIGot' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate input length
    if (whatIGave.length > 200 || whatIGot.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Input too long. Maximum 200 characters per field.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize input (basic XSS prevention)
    const sanitizedWhatIGave = whatIGave.trim().replace(/<[^>]*>/g, '')
    const sanitizedWhatIGot = whatIGot.trim().replace(/<[^>]*>/g, '')

    if (sanitizedWhatIGave.length === 0 || sanitizedWhatIGot.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Fields cannot be empty after sanitization' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check rate limit
    const { data: rateLimitCheck, error: rateLimitError } = await supabaseClient
      .rpc('check_rate_limit', {
        p_user_id: user.id,
        p_action_type: 'interaction',
        p_max_requests: 10,
        p_time_window_minutes: 60
      })

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError)
      return new Response(
        JSON.stringify({ error: 'Failed to check rate limit' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!rateLimitCheck) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. You can submit maximum 10 interactions per hour.',
          retryAfter: 3600 // seconds
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log the rate limit action
    const { error: logError } = await supabaseClient
      .rpc('log_rate_limit_action', {
        p_user_id: user.id,
        p_action_type: 'interaction',
        p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        p_user_agent: req.headers.get('user-agent') || 'unknown'
      })

    if (logError) {
      console.error('Failed to log rate limit action:', logError)
      // Continue anyway, logging is not critical
    }

    // Create interaction record
    const { data: interaction, error: interactionError } = await supabaseClient
      .from('interactions')
      .insert({
        user_id: user.id,
        method: 'simple_exchange',
        status: 'confirmed',
        metadata: {
          whatIGave: sanitizedWhatIGave,
          whatIGot: sanitizedWhatIGot
        }
      })
      .select()
      .single()

    if (interactionError) {
      console.error('Failed to create interaction:', interactionError)
      return new Response(
        JSON.stringify({ error: 'Failed to create interaction' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Award points (1 point per interaction)
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('points')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Failed to get user data:', userError)
      // Continue anyway, we created the interaction
    }

    const newPoints = (userData?.points || 0) + 1

    const { error: updateError } = await supabaseClient
      .from('users')
      .update({ points: newPoints })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update user points:', updateError)
      // Continue anyway, we created the interaction
    }

    return new Response(
      JSON.stringify({
        success: true,
        interaction,
        newPoints
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
