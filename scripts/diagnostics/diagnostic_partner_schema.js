import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// جلب الإعدادات من ملف بيئة الأدمن
const envPath = path.resolve('apps/admin/.env');
let envContent = '';
try { envContent = fs.readFileSync(envPath, 'utf8'); } catch (e) { 
    console.error("لم يتم العثور على ملف .env في تطبيقات الأدمن.");
    process.exit(1); 
}
const getEnv = (key) => { const match = envContent.match(new RegExp(`${key}=(.*)`)); return match ? match[1].trim() : null; };

const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('VITE_SUPABASE_ANON_KEY'));

async function inspectPartners() {
  console.log("==================================================");
  console.log("🦅 EAGLE TN - استعلام هيكلة الشركاء (للتسوية المالية)");
  console.log("==================================================");

  const { data, error } = await supabase
    .from('partners') // نفترض أن اسم الجدول partners
    .select('*')
    .limit(1);

  if (error) {
     console.error("❌ خطأ:", error.message);
  } else if (data && data.length > 0) {
     console.log("✅ أعمدة جدول الشركاء الفعلية:");
     console.log(Object.keys(data[0]).join(' | '));
  } else {
     console.log("⚠️ الجدول فارغ أو غير موجود باسم 'partners'.");
  }
}

inspectPartners();
