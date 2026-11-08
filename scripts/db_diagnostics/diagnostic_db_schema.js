import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// استخدام مفاتيح البيئة المتاحة
const envPath = path.resolve('apps/partner/.env');
let envContent = '';
try { envContent = fs.readFileSync(envPath, 'utf8'); } catch (e) { 
    console.error("لم يتم العثور على ملف .env");
    process.exit(1); 
}
const getEnv = (key) => { const match = envContent.match(new RegExp(`${key}=(.*)`)); return match ? match[1].trim() : null; };

const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('VITE_SUPABASE_ANON_KEY'));

async function inspectSystem() {
  console.log("==================================================");
  console.log("🦅 EAGLE TN - استعلام الهيكلة الحقيقية للبيانات");
  console.log("==================================================");

  // سحب طلب واحد حديث لسبر أغوار الهيكلة الفعلية
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
     console.error("❌ خطأ في الاستعلام:", error.message);
  } else if (data && data.length > 0) {
     console.log("✅ أسماء الأعمدة الفعلية الموجودة في جدول (orders):");
     console.log(Object.keys(data[0]).join(' | '));
     
     console.log("\n✅ تفاصيل البيانات للطلب الأخير (Raw Data):");
     console.log(data[0]);
  } else {
     console.log("⚠️ قاعدة البيانات فارغة من الطلبات.");
  }
}

inspectSystem();
