import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// دالة قراءة متغيرة البيئة تلقائياً من ملفات .env الموجودة بالمشروع
function getEnvVar(key) {
  const envPaths = [
    '.env',
    '.env.local',
    'apps/client/.env',
    'apps/partner/.env',
    'apps/livreur/.env'
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(new RegExp(`${key}=(.*)`));
      if (match && match[1]) {
        return match[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return null;
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
  console.error('❌ خطأ: لم يتم العثور على VITE_SUPABASE_URL أو VITE_SUPABASE_ANON_KEY الحقيقي في ملفات .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrders() {
  console.log('📡 جاري الاتصال المباشر بـ Supabase...');
  console.log('🔗 URL:', supabaseUrl);

  const { data, error } = await supabase.from('orders').select('*').limit(5);

  if (error) {
    console.error('❌ خطأ في قاعدة البيانات:', error.message);
  } else {
    console.log('✅ تم جلب البيانات بنجاح من قاعدة البيانات:');
    console.dir(data, { depth: null });
  }
}

checkOrders();
