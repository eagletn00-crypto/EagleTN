import { createClient } from '@supabase/supabase-js';

// استخراج المتغيرات المباشرة من البيئة
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطأ: يرجى توفير VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملفات البيئة.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  console.log('🔍 جاري استكشاف جداول قاعدة البيانات الحالية...\n');

  // 1. جلب قائمة الجداول الحالية
  const { data: tables, error } = await supabase
    .from('menu_items')
    .select('*')
    .limit(1);

  if (error) {
    console.error('⚠️ تعذر جلب جدول menu_items:', error.message);
  } else {
    console.log('✅ تم العثور على جدول menu_items. الأعمدة المتاحة:');
    console.log(Object.keys(tables[0] || {}));
  }
}

inspectSchema();
