import fs from 'fs';
import path from 'path';

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

const baseUrl = env.url.replace(/\/$/, '');
const headers = {
  'apikey': env.key,
  'Authorization': `Bearer ${env.key}`,
  'Content-Type': 'application/json'
};

async function inspectBackend() {
  console.log(`🔍 جاري الاستعلام المباشر عن Supabase Backend (${baseUrl})...\n`);

  // 1. استعلام جدول orders
  try {
    const response = await fetch(`${baseUrl}/rest/v1/orders?select=*&limit=1`, { headers });
    if (!response.ok) {
      const errText = await response.text();
      console.log(`❌ خطأ الاستعلام عن جدول orders: HTTP ${response.status} - ${errText}`);
    } else {
      const data = await response.json();
      console.log('✅ جدول [orders]: موجود ومتاح للربط!');
      if (data && data.length > 0) {
        console.log('📋 أعمدة جدول orders المكتشفة في الباك إند:');
        console.log(Object.keys(data[0]));
      } else {
        console.log('ℹ️ جدول [orders]: فارغ حالياً.');
      }
    }
  } catch (err) {
    console.error('❌ تعذر الاتصال بـ REST API:', err.message);
  }

  console.log('\n-----------------------------------\n');

  // 2. استعلام الجداول المساندة
  const tables = ['profiles', 'drivers', 'partners', 'restaurants'];
  for (const table of tables) {
    try {
      const res = await fetch(`${baseUrl}/rest/v1/${table}?select=id&limit=1`, { headers });
      if (res.ok) {
        console.log(`✅ جدول [${table}]: موجود ومتاح.`);
      } else {
        console.log(`⚠️ جدول [${table}]: غير متاح - HTTP ${res.status}`);
      }
    } catch (e) {
      console.log(`⚠️ جدول [${table}]: تعذر الفحص.`);
    }
  }
}

inspectBackend();
