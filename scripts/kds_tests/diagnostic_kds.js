import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// جلب المفاتيح من ملف البيئة
const envPath = path.resolve('apps/partner/.env');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error("❌ ملف .env غير موجود");
  process.exit(1);
}

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const URL = getEnv('VITE_SUPABASE_URL');
const KEY = getEnv('VITE_SUPABASE_ANON_KEY');
const supabase = createClient(URL, KEY);
const MASTER_PARTNER_ID = 'c468b8f6-46ec-4653-8f43-7b387c719e80';

async function checkKDS() {
  console.log("========================================");
  console.log("[EAGLE TN] فحص الاستعلام المعقد للكوجينة");
  console.log("========================================");

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
        notes,
        menu_items (
          name_fr,
          name,
          name_ar
        )
      )
    `)
    .eq('partner_id', MASTER_PARTNER_ID);
    
  if (error) {
    console.error("❌ تم رفض الاستعلام من Supabase!");
    console.error("السبب (Message):", error.message);
    console.error("التفاصيل (Details):", error.details || error.hint);
  } else {
    console.log("✅ الاستعلام ناجح! تم جلب:", data.length, "طلبات.");
    console.log(JSON.stringify(data[0], null, 2));
  }
}

checkKDS();
