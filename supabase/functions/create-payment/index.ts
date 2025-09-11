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
    console.log("[CREATE-PAYMENT] Function started");

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Initialize Supabase with service role for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get request data
    const { packageType = 'baspaket', estateData, userEmail } = await req.json();

    console.log("[CREATE-PAYMENT] Request data received", { packageType, userEmail: userEmail ? "provided" : "not provided" });

    // Try to get authenticated user (optional for guest checkout)
    let user = null;
    let email = userEmail || "guest@arvskifte.se";

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabaseService.auth.getUser(token);
        user = userData.user;
        if (user?.email) {
          email = user.email;
        }
        console.log("[CREATE-PAYMENT] Authenticated user found", { userId: user?.id, email });
      } catch (e) {
        console.log("[CREATE-PAYMENT] No valid auth token, proceeding as guest");
      }
    }

    // Determine price based on package type
    let amount = 49900; // 499 kr in öre (default to baspaket)
    let productName = "Baspaket - Digitalt Arvsskifte";
    
    if (packageType === 'basic' || packageType === 'baspaket') {
      amount = 49900; // 499 kr
      productName = "Baspaket - Digitalt Arvsskifte";
    } else if (packageType === 'komplett' || packageType === 'complete') {
      amount = 249900; // 2499 kr
      productName = "Komplett - Digitalt Arvsskifte";
    }

    console.log("[CREATE-PAYMENT] Package details", { packageType, amount, productName });

    // Check if customer already exists in Stripe
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("[CREATE-PAYMENT] Existing Stripe customer found", { customerId });
    } else {
      console.log("[CREATE-PAYMENT] No existing customer, will create during checkout");
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: { 
              name: productName,
              description: "Komplett digital arvsskifteshantering"
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/demo-baspaket`,
      metadata: {
        package_type: packageType,
        user_id: user?.id || "guest",
        email: email
      }
    });

    console.log("[CREATE-PAYMENT] Stripe checkout session created", { sessionId: session.id });

    // Store order in database
    const orderData = {
      user_id: user?.id || null,
      email: email,
      stripe_session_id: session.id,
      amount: amount,
      currency: "sek",
      status: "pending",
      package_type: packageType,
      estate_data: estateData || null,
    };

    const { data: order, error: orderError } = await supabaseService
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error("[CREATE-PAYMENT] Error creating order:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log("[CREATE-PAYMENT] Order created successfully", { orderId: order.id });

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
        orderId: order.id
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("[CREATE-PAYMENT] Error:", error);
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