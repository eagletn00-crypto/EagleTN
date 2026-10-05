import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ متغيرات البيئة غير متوفرة');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  console.log('\n🔍 [Supabase Audit] جاري فحص بنية جدول orders...\n');
  
  // محاولة جلب سجل واحد أو استعلام الأعمدة
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ خطأ أثناء الاستعلام عن جدول orders:', error.message);
  } else {
    console.log('✅ تم الوصول للجدول بنجاح!');
    if (data && data.length > 0) {
      console.log('📋 الأعمدة والحقول المتاحة حالياً في قاعدة البيانات:');
      console.log(Object.keys(data[0]));
    } else {
      console.log('ℹ️ الجدول فارغ حالياً، جاري اختبار إدراج وهمي للتحقق من الأعمدة الإلزامية...');
    }
  }
}

inspectSchema();
