const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function getEnv() {
  const envPaths = [
    'apps/client/.env',
    'apps/livreur/.env',
    'apps/partner/.env',
    'apps/admin/.env',
    '.env'
  ];

  for (const envPath of envPaths) {
    const fullPath = path.resolve(envPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const urlMatch = content.match(/VITE_SUPABASE_URL=(.*)/);
      const keyMatch = content.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
      if (urlMatch && keyMatch) {
        return {
          url: urlMatch[1].trim().replace(/['"]/g, ''),
          key: keyMatch[1].trim().replace(/['"]/g, '')
        };
      }
    }
  }
  return null;
}

const env = getEnv();

if (!env || !env.url || env.url.includes('placeholder')) {
  console.log('⚠️ لم يتم العثور على مفاتيح Supabase حقيقية داخل ملفات .env للتطبيقات.');
  console.log('يرجى التحقق من وجود VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(env.url, env.key);

async function inspectBackend() {
  console.log('🔍 جاري فحص الاتصال وقاعدة البيانات في Supabase...\n');

  // فحص جدول orders
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .limit(1);

  if (ordersError) {
    console.error('❌ خطأ في الاستعلام عن جدول orders:', ordersError.message);
  } else {
    console.log('✅ جدول orders موجود وصالح!');
    if (orders && orders.length > 0) {
      console.log('📋 أعمدة جدول orders الحالية:');
      console.log(Object.keys(orders[0]));
    } else {
      console.log('ℹ️ جدول orders فارغ حالياً.');
    }
  }

  console.log('\n-----------------------------------\n');

  // فحص باقي الجداول
  const tables = ['profiles', 'drivers', 'partners', 'restaurants'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`⚠️ جدول [${table}]: غير موجود أو يتطلب RLS - (${error.message})`);
    } else {
      console.log(`✅ جدول [${table}]: متاح وموجود.`);
    }
  }
}

inspectBackend();
