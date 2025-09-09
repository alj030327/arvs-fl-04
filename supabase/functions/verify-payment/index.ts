import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[VERIFY-PAYMENT] Function started");

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Initialize Supabase with service role
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    console.log("[VERIFY-PAYMENT] Verifying session", { sessionId });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log("[VERIFY-PAYMENT] Stripe session retrieved", { 
      status: session.payment_status,
      amount: session.amount_total 
    });

    // Update order in database
    const updateData: any = {
      status: session.payment_status === 'paid' ? 'paid' : 'failed',
      updated_at: new Date().toISOString()
    };

    if (session.payment_status === 'paid') {
      updateData.paid_at = new Date().toISOString();
    }

    const { data: order, error: updateError } = await supabaseService
      .from("orders")
      .update(updateData)
      .eq("stripe_session_id", sessionId)
      .select()
      .single();

    if (updateError) {
      console.error("[VERIFY-PAYMENT] Error updating order:", updateError);
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    console.log("[VERIFY-PAYMENT] Order updated successfully", { 
      orderId: order.id, 
      status: order.status 
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        paymentStatus: session.payment_status,
        order: order,
        amount: session.amount_total,
        currency: session.currency
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("[VERIFY-PAYMENT] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred" 
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});