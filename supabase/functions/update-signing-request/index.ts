import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestBody = await req.json();
    const { token, signature_data } = requestBody;

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!signature_data) {
      return new Response(
        JSON.stringify({ error: 'Signature data is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Updating signing request with token:', token);

    // First, verify the signing request exists and is not expired
    const { data: existingRequest, error: fetchError } = await supabase
      .from('signing_requests')
      .select('id, expires_at, signed_at')
      .eq('token', token)
      .single();

    if (fetchError) {
      console.error('Database error fetching signing request:', fetchError);
      if (fetchError.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if already signed
    if (existingRequest.signed_at) {
      return new Response(
        JSON.stringify({ error: 'Document has already been signed' }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if expired
    if (new Date(existingRequest.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Signing request has expired' }),
        { 
          status: 410, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update the signing request with signature data
    const { data: updatedRequest, error: updateError } = await supabase
      .from('signing_requests')
      .update({
        signature_data,
        signed_at: new Date().toISOString()
      })
      .eq('token', token)
      .select('id, signed_at')
      .single();

    if (updateError) {
      console.error('Database error updating signing request:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update signing request' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully updated signing request');

    return new Response(
      JSON.stringify({
        success: true,
        id: updatedRequest.id,
        signed_at: updatedRequest.signed_at
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});