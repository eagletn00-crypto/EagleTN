import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// استخراج مفاتيح Supabase مباشرة من ملف البيئة .env
const envPath = path.resolve('apps/partner/.env');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error("❌ ملف .env غير موجود في apps/partner");
  process.exit(1);
}

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const URL = getEnv('VITE_SUPABASE_URL');
const KEY = getEnv('VITE_SUPABASE_ANON_KEY');

if (!URL || !KEY) {
  console.error("❌ لم يتم العثور على مفاتيح Supabase في ملف .env");
  process.exit(1);
}

const supabase = createClient(URL, KEY);
const MASTER_PARTNER_ID = 'c468b8f6-46ec-4653-8f43-7b387c719e80';

async function runAudit() {
  console.log("========================================");
  console.log("[EAGLE TN] بدء الفحص العميق لقاعدة البيانات");
  console.log("========================================");

  // 1. فحص جدول الشركاء
  console.log("\n-> فحص جدول partners...");
  const { data: partner, error: pErr } = await supabase
    .from('partners')
    .select('id, name')
    .eq('id', MASTER_PARTNER_ID)
    .single();
    
  if (pErr) {
    console.error("❌ فشل الوصول للشريك (RLS مفعل أو المعرف خاطئ):", pErr.message);
  } else {
    console.log("✅ الشريك موجود:", partner.name);
  }

  // 2. فحص جدول الطلبات
  console.log("\n-> فحص جدول orders...");
  const { data: orders, error: oErr } = await supabase
    .from('orders')
    .select('id, status')
    .eq('partner_id', MASTER_PARTNER_ID);
    
  if (oErr) {
    console.error("❌ فشل الوصول للطلبات:", oErr.message);
  } else {
    console.log(`✅ تم العثور على ${orders.length} طلبات.`);
  }
}

runAudit();
