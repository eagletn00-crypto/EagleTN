import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Verify caller identity & admin role
    const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller }, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    let isAdmin =
      caller.app_metadata?.role === "admin" ||
      caller.user_metadata?.role === "admin";

    if (!isAdmin) {
      const { data: profile } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", caller.id)
        .maybeSingle();
      if (profile?.role === "admin") isAdmin = true;
    }

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden: Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Validate payload
    const { full_name, email, phone, password, max_cash_limit = 200 } = await req.json();
    if (!full_name || !email || !password || password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Nom, email et mot de passe (min 6 caractères) requis." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Create auth user with driver role
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name.trim(), phone: phone?.trim() || "", role: "driver" },
      app_metadata: { role: "driver" },
    });

    if (createError || !created.user) {
      return new Response(JSON.stringify({ error: createError?.message || "User creation failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const driverId = created.user.id;

    // 4. Upsert profile (safe if trigger already created row)
    await adminClient.from("profiles").upsert(
      {
        id: driverId,
        full_name: full_name.trim(),
        phone: phone?.trim() || null,
        role: "driver",
      },
      { onConflict: "id" }
    );

    // 5. Initialize driver_wallets
    const { error: walletError } = await adminClient.from("driver_wallets").upsert(
      {
        driver_id: driverId,
        cash_in_hand: 0,
        commission_debt: 0,
        max_cash_limit: Number(max_cash_limit) || 200,
        is_locked: false,
      },
      { onConflict: "driver_id" }
    );

    if (walletError) {
      return new Response(
        JSON.stringify({ error: `Compte créé mais erreur portefeuille: ${walletError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        driver: {
          id: driverId,
          email: created.user.email,
          full_name: full_name.trim(),
          phone: phone?.trim() || "",
          max_cash_limit: Number(max_cash_limit) || 200,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
