import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('apps/admin/.env');
let envContent = '';
try { envContent = fs.readFileSync(envPath, 'utf8'); } catch (e) { process.exit(1); }
const getEnv = (key) => { const match = envContent.match(new RegExp(`${key}=(.*)`)); return match ? match[1].trim() : null; };
const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('VITE_SUPABASE_ANON_KEY'));

async function inspectIncidents() {
  console.log("==================================================");
  console.log("🦅 EAGLE TN - استعلام هيكلة جدول النزاعات (incidents)");
  console.log("==================================================");

  const { data, error } = await supabase.from('incidents').select('*').limit(1);

  if (error) {
     console.error("❌ خطأ:", error.message);
  } else if (data && data.length > 0) {
     console.log("✅ أعمدة الجدول:");
     console.log(Object.keys(data[0]).join(' | '));
  } else {
     // إذا كان الجدول فارغاً، نسحب الهيكلة عبر استعلام خطأ متعمد
     const { error: schemaError } = await supabase.from('incidents').select('non_existent_column').limit(1);
     console.log("⚠️ الجدول فارغ، لكن هذه رسالة الخطأ قد تكشف الهيكلة:", schemaError?.message);
  }
}
inspectIncidents();
