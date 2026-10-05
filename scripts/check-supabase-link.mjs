import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n==================================================');
console.log('  🔍 [The-Eagletn] Supabase & Monorepo Link Audit');
console.log('==================================================\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطأ: متغيرات البيئة VITE_SUPABASE_URL أو VITE_SUPABASE_ANON_KEY غير معرفة!');
  console.log('💡 تأكد من وجود ملف .env يحتوي على هذه المتغيرات.');
  process.exit(1);
}

console.log(`📡 URL: ${supabaseUrl}`);
console.log('🔑 Key: [OK]\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function runAudit() {
  const tables = ['partners', 'orders', 'menu_items', 'profiles', 'deliveries'];
  let successCount = 0;

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`⚠️ الجدول [${table}]: يتعذر الوصول أو غير موجود (${error.message})`);
      } else {
        console.log(`✅ الجدول [${table}]: متصل بنجاح | عدد السجلات الحقيقية: ${count ?? 0}`);
        successCount++;
      }
    } catch (e) {
      console.log(`❌ الجدول [${table}]: خطأ اتصال (${e.message})`);
    }
  }

  console.log('\n--------------------------------------------------');
  console.log(`📊 النتيجة الإجمالية: تم التحقق من ${successCount}/${tables.length} جداول رئيسية.`);
  console.log('--------------------------------------------------\n');
}

runAudit();
