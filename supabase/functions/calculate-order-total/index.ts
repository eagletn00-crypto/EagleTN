import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { items, promoCode, userLocation, merchantId } = await req.json();

    // 1. Fetch authoritative prices from DB
    const productIds = items.map((i: any) => i.productId);
    const { data: products } = await supabaseClient
      .from('products')
      .select('id, price, is_taxable')
      .in('id', productIds);

    let subtotal_ht = 0;
    let tva_amount = 0;

    // 2. Calculate Subtotals securely
    items.forEach((item: any) => {
      const dbProduct = products?.find(p => p.id === item.productId);
      if (!dbProduct) throw new Error(`Product ${item.productId} not found or inactive`);
      
      const itemTotal = dbProduct.price * item.quantity; // Modifiers calculation logic goes here
      subtotal_ht += itemTotal;
      if (dbProduct.is_taxable) {
        tva_amount += itemTotal * 0.19; // 19% TVA example
      }
    });

    // 3. Dynamic Delivery Fee (Mocked logic - implement GPS distance here)
    const FREE_DELIVERY_THRESHOLD = 40.0;
    let delivery_fee = subtotal_ht >= FREE_DELIVERY_THRESHOLD ? 0 : 2.5;

    // 4. Promo Code Validation
    if (promoCode === 'EAGLE1' && subtotal_ht >= 20) {
      delivery_fee = 0;
    }

    const timbre_fiscal = 1.000;
    const grand_total = subtotal_ht + tva_amount + timbre_fiscal + delivery_fee;

    const invoiceBreakdown = {
      subtotal_ht,
      tva_amount,
      timbre_fiscal,
      delivery_fee,
      grand_total,
      currency: 'TND',
      is_free_delivery: delivery_fee === 0
    };

    return new Response(JSON.stringify(invoiceBreakdown), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
