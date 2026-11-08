import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// رادار البحث عن ملفات البيئة
const possiblePaths = [
  '.env',
  '.env.local',
  'apps/admin/.env',
  'apps/admin/.env.local',
  '../.env',
  '../../.env'
];

let envContent = '';
let foundPath = '';

for (const p of possiblePaths) {
  try {
    const fullPath = path.resolve(p);
    envContent = fs.readFileSync(fullPath, 'utf8');
    foundPath = p;
    break; // توقف عند العثور على أول ملف يحتوي على الإعدادات
  } catch (e) {
    continue;
  }
}

const getEnv = (key) => { 
  if (!envContent) return null;
  const match = envContent.match(new RegExp(`${key}=(.*)`)); 
  // تنظيف القيمة من علامات التنصيص أو المسافات
  return match ? match[1].replace(/['"]/g, '').trim() : null; 
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

async function runGlobalDiagnostic() {
  console.log("\n==================================================");
  console.log("🦅 EAGLE TN - DIAGNOSTIC ARCHITECTURAL GLOBAL 🦅");
  console.log("==================================================\n");

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ فشل هندسي: لم أتمكن من استخراج مفاتيح Supabase.");
    console.error("يرجى التأكد من وجود متغيرات VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env الخاص بك.");
    process.exit(1);
  }

  console.log(`✅ تم سحب المفاتيح السرية بنجاح من: ${foundPath}`);
  console.log("1️⃣ [فحص الاتصال المركزي]: جارٍ الاتصال بـ Supabase...\n");
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  // فحص جدول الطلبات
  const { error: ordersError } = await supabase.from('orders').select('id').limit(1);
  if (ordersError) console.error("❌ فشل في الوصول إلى جدول الطلبات (orders):", ordersError.message);
  else console.log("✅ جدول الطلبات (Orders): متصل ويعمل كمركز عبور.");

  // فحص جدول السائقين
  const { error: driversError } = await supabase.from('drivers').select('id').limit(1);
  if (driversError) console.error("❌ فشل في الوصول إلى جدول السائقين (drivers).");
  else console.log("✅ جدول السائقين (Drivers): متصل ومستعد للتوجيه.");

  // فحص جدول الشركاء
  const { error: partnersError } = await supabase.from('partners').select('id').limit(1);
  if (partnersError) console.error("❌ فشل في الوصول إلى جدول الشركاء (partners).");
  else console.log("✅ جدول الشركاء (Partners): متصل ومستعد لاستقبال الطلبات.");

  // فحص الترابط الهندسي (Joins)
  console.log("\n2️⃣ [فحص المثلث الذهبي - Joins]:");
  const { error: joinError } = await supabase
    .from('orders')
    .select(`id, drivers ( id ), partners ( id )`)
    .limit(1);

  if (joinError) {
    console.error("❌ خلل في العلاقات (Foreign Keys) بين الجداول:", joinError.message);
  } else {
    console.log("✅ العلاقات المرجعية (Foreign Keys): سليمة. يمكن للطلب ربط العميل، السائق، والشريك بنجاح.");
  }

  console.log("\n==================================================");
  console.log("🏁 انتهى الفحص المعماري.");
  console.log("==================================================\n");
}

runGlobalDiagnostic();
