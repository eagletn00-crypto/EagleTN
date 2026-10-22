import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// إعداد الاتصال
const envPath = path.resolve('apps/partner/.env');
let envContent = '';
try { envContent = fs.readFileSync(envPath, 'utf8'); } catch (e) { process.exit(1); }
const getEnv = (key) => { const match = envContent.match(new RegExp(`${key}=(.*)`)); return match ? match[1].trim() : null; };

const URL = getEnv('VITE_SUPABASE_URL');
const KEY = getEnv('VITE_SUPABASE_ANON_KEY');
const supabase = createClient(URL, KEY);
const MASTER_PARTNER_ID = 'c468b8f6-46ec-4653-8f43-7b387c719e80';

async function runDeepAudit() {
  console.log("==================================================");
  console.log("[EAGLE TN] بدء التشخيص الجذري للكوجينة (KDS)");
  console.log("==================================================");

  // الاختبار الأول: هل جدول order_items موجود ومتاح للقراءة؟ (فحص RLS والأعمدة)
  console.log("\n-> 1. فحص هيكل جدول order_items...");
  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .limit(1);

  if (itemsError) {
    console.error("❌ فشل قراءة order_items:", itemsError.message);
  } else {
    if (itemsData && itemsData.length > 0) {
      console.log("✅ الجدول موجود ومتاح. الأعمدة المتوفرة هي:");
      console.log(Object.keys(itemsData[0]).join(' | '));
    } else {
      console.log("⚠️ الجدول متاح لكنه فارغ (لا توجد بيانات حالياً للاختبار).");
    }
  }

  // الاختبار الثاني: فحص استعلام الربط (Join)
  console.log("\n-> 2. فحص استعلام ربط الطلبات (orders -> order_items)...");
  const { data: joinData, error: joinError } = await supabase
    .from('orders')
    .select(`
      id, 
      status, 
      order_items (
        id,
        quantity,
        notes,
        menu_item_id,
        item_name
      )
    `)
    .eq('partner_id', MASTER_PARTNER_ID)
    .limit(1);

  if (joinError) {
    console.error("❌ فشل الربط الاستعلامي (Join Error):");
    console.error("السبب (Message):", joinError.message);
    console.error("التفاصيل (Details):", joinError.details || joinError.hint);
  } else {
    console.log("✅ استعلام الربط ناجح!");
    console.log(JSON.stringify(joinData, null, 2));
  }
}

runDeepAudit();
