import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// جلب المفاتيح من بيئة الشريك
const envPath = path.resolve('apps/partner/.env');
let envContent = '';
try { envContent = fs.readFileSync(envPath, 'utf8'); } catch (e) { process.exit(1); }
const getEnv = (key) => { const match = envContent.match(new RegExp(`${key}=(.*)`)); return match ? match[1].trim() : null; };

const URL = getEnv('VITE_SUPABASE_URL');
const KEY = getEnv('VITE_SUPABASE_ANON_KEY');
const supabase = createClient(URL, KEY);
const MASTER_PARTNER_ID = 'c468b8f6-46ec-4653-8f43-7b387c719e80';

async function getExactError() {
  console.log("==================================================");
  console.log("[EAGLE TN] استخراج الخطأ الخفي من واجهة الكوجينة");
  console.log("==================================================");

  // هذا هو الاستعلام المتطابق 100% مع تطبيق الكوجينة الحالي
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      created_at,
      total_amount,
      order_items (
        id,
        quantity,
        options,
        item_id,
        item_name
      )
    `)
    .eq('partner_id', MASTER_PARTNER_ID)
    .in('status', ['pending', 'preparing', 'ready_for_pickup']);

  if (error) {
    console.error("❌ الخطأ الجذري الذي يسبب شاشة Erreur هو:");
    console.error("الرسالة (Message):", error.message);
    console.error("التفاصيل (Details):", error.details || error.hint);
  } else {
    console.log("✅ الاستعلام يعمل بشكل ممتاز من الباك إند!");
    console.log("عدد الطلبات المرجعة:", data?.length || 0);
  }
}

getExactError();
