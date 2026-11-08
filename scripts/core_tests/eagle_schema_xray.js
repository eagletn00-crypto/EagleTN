import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const possiblePaths = [
  '.env', '.env.local', 'apps/admin/.env', 'apps/admin/.env.local', '../.env', '../../.env'
];

let envContent = '';
for (const p of possiblePaths) {
  try {
    envContent = fs.readFileSync(path.resolve(p), 'utf8');
    break;
  } catch (e) { continue; }
}

const getEnv = (key) => { 
  if (!envContent) return null;
  const match = envContent.match(new RegExp(`${key}=(.*)`)); 
  return match ? match[1].replace(/['"]/g, '').trim() : null; 
};

const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('VITE_SUPABASE_ANON_KEY'));

async function runXRay() {
  console.log("\n🔍 EAGLE TN - X-RAY DATABASE STRUCTURE 🔍\n");

  const tablesToScan = ['orders', 'drivers', 'partners', 'incidents', 'financial_ledger'];

  for (const table of tablesToScan) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.log(`❌ جدول [${table}]: غير موجود في قاعدة البيانات.`);
      } else {
        console.log(`⚠️ جدول [${table}]: موجود ولكن لا يمكن قراءته (تحقق من RLS) - ${error.message}`);
      }
    } else if (data && data.length > 0) {
      console.log(`✅ جدول [${table}] - الأعمدة المتاحة:`);
      console.log(`   [ ${Object.keys(data[0]).join(', ')} ]\n`);
    } else {
      console.log(`⚠️ جدول [${table}]: موجود لكنه فارغ تماماً. لا يمكن استنتاج الأعمدة.\n`);
    }
  }
}

runXRay();
