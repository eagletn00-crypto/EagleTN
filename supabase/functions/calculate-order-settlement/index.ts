import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

interface OrderRecord {
  id: string;
  total_amount: number;
  status: string;
  partner_id: string;
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: OrderRecord;
  old_record?: OrderRecord;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const COMMISSION_RATE = 0.15; // 15% Standard

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();
    const { record } = payload;

    if (!record || !record.id || typeof record.total_amount !== 'number') {
      console.warn("[EAGLE TN] Rejet: Payload invalide ou 'total_amount' manquant.");
      return new Response(
        JSON.stringify({ error: "Structure de données invalide." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (record.status !== 'delivered') {
      return new Response(
        JSON.stringify({ message: "Opération ignorée. Statut non éligible au règlement." }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calcul Financier Strict (Millimes)
    const totalMillimes = Math.round(record.total_amount * 1000);
    const feeMillimes = Math.round(totalMillimes * COMMISSION_RATE);
    const netMillimes = totalMillimes - feeMillimes;

    const platformFeeDT = feeMillimes / 1000;
    const netRevenueDT = netMillimes / 1000;

    // Contournement RLS via Service Role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        platform_fee: platformFeeDT,
        net_revenue: netRevenueDT,
        updated_at: new Date().toISOString()
      })
      .eq('id', record.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`[EAGLE TN] Règlement appliqué pour ${record.id}: Commission ${platformFeeDT} DT`);

    return new Response(
      JSON.stringify({
        success: true,
        order_id: record.id,
        metrics: {
          gross: record.total_amount,
          platform_fee: platformFeeDT,
          net_revenue: netRevenueDT
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("[EAGLE TN] Échec critique du moteur de règlement :", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Défaillance interne du serveur." 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
