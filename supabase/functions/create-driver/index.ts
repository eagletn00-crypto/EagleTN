import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

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
      return jsonResponse({ error: "En-tête d'autorisation manquant." }, 401);
    }

    // 1. Verify caller identity & admin role
    const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller }, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !caller) {
      return jsonResponse({ error: "Session expirée ou non autorisée." }, 401);
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
      return jsonResponse({ error: "Accès refusé : rôle administrateur requis." }, 403);
    }

    // 2. Validate payload
    const { full_name, email, phone, password, max_cash_limit = 200 } = await req.json();
    const cleanName = full_name?.trim();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPhone = phone?.trim() || "";

    if (!cleanName || !cleanEmail || !password || password.length < 6) {
      return jsonResponse(
        { error: "Nom complet, email et mot de passe (min. 6 caractères) requis." },
        400
      );
    }

    const limitValue = Number(max_cash_limit) || 200;

    // 3. Create auth user
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: cleanName, phone: cleanPhone, role: "DRIVER" },
      app_metadata: { role: "DRIVER" },
    });

    if (createError || !created.user) {
      const msg = createError?.message?.toLowerCase().includes("already")
        ? "Cet email est déjà enregistré dans le système."
        : createError?.message || "Échec de la création du compte.";
      return jsonResponse({ error: msg }, 400);
    }

    const driverId = created.user.id;

    // Helper for atomic rollback if any downstream DB step fails
    const rollbackUser = async (reason: string) => {
      await adminClient.auth.admin.deleteUser(driverId);
      return jsonResponse(
        { error: `Annulation automatique (Rollback) : ${reason}` },
        500
      );
    };

    // 4. Upsert profile
    const { error: profileError } = await adminClient.from("profiles").upsert(
      {
        id: driverId,
        full_name: cleanName,
        phone: cleanPhone || null,
        role: "DRIVER",
      },
      { onConflict: "id" }
    );
    if (profileError) return rollbackUser(`profiles -> ${profileError.message}`);

    // 5. Initialize or update drivers table
    const { data: existingDriver } = await adminClient
      .from("drivers")
      .select("id")
      .eq("user_id", driverId)
      .maybeSingle();

    const driverRes = existingDriver
      ? await adminClient
          .from("drivers")
          .update({ full_name: cleanName, cash_limit: limitValue })
          .eq("user_id", driverId)
      : await adminClient.from("drivers").insert({
          user_id: driverId,
          full_name: cleanName,
          caisse_terrain_current: 0,
          cash_limit: limitValue,
          total_gains: 0,
          total_commissions_owed: 0,
        });

    if (driverRes.error) return rollbackUser(`drivers -> ${driverRes.error.message}`);

    // 6. Initialize or update wallets table (Single Source of Truth for Cash)
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

    if (walletRes.error) return rollbackUser(`wallets -> ${walletRes.error.message}`);

    return jsonResponse(
      {
        success: true,
        driver: {
          id: driverId,
          email: created.user.email,
          full_name: cleanName,
          phone: cleanPhone,
          max_cash_limit: limitValue,
        },
      },
      200
    );
  } catch (err: any) {
    return jsonResponse({ error: err?.message || "Internal Server Error" }, 500);
  }
});
