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

    const limitValue = Number(max_cash_limit) || 200;

    // 3. Create auth user with driver role
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name.trim(), phone: phone?.trim() || "", role: "DRIVER" },
      app_metadata: { role: "DRIVER" },
    });

    if (createError || !created.user) {
      return new Response(JSON.stringify({ error: createError?.message || "User creation failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const driverId = created.user.id;

    // 4. Upsert profile (uppercase DRIVER to match user_role enum)
    await adminClient.from("profiles").upsert(
      {
        id: driverId,
        full_name: full_name.trim(),
        phone: phone?.trim() || null,
        role: "DRIVER",
      },
      { onConflict: "id" }
    );

    // 5. Initialize or update drivers table
    const { data: existingDriver } = await adminClient
      .from("drivers")
      .select("id")
      .eq("user_id", driverId)
      .maybeSingle();

    if (existingDriver) {
      await adminClient
        .from("drivers")
        .update({ full_name: full_name.trim(), cash_limit: limitValue })
        .eq("user_id", driverId);
    } else {
      await adminClient.from("drivers").insert({
        user_id: driverId,
        full_name: full_name.trim(),
        caisse_terrain_current: 0,
        cash_limit: limitValue,
        total_gains: 0,
        total_commissions_owed: 0,
      });
    }

    // 6. Initialize or update real wallets table
    const { data: existingWallet } = await adminClient
      .from("wallets")
      .select("id")
      .eq("profile_id", driverId)
      .maybeSingle();

    const walletRes = existingWallet
      ? await adminClient
          .from("wallets")
          .update({ max_cash_threshold: limitValue, is_frozen: false })
          .eq("profile_id", driverId)
      : await adminClient.from("wallets").insert({
          profile_id: driverId,
          current_cash_balance: 0,
          total_earnings: 0,
          max_cash_threshold: limitValue,
          is_frozen: false,
        });

    if (walletRes.error) {
      return new Response(
        JSON.stringify({ error: `Compte créé mais erreur portefeuille: ${walletRes.error.message}` }),
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
          max_cash_limit: limitValue,
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
