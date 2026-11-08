import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

try {
  const env = fs.readFileSync('.env', 'utf8');
  const url = env.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
  const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

  if (!url || !key || url.includes('placeholder')) {
    console.error('❌ المفاتيح غير صالحة أو غير موجودة في ملف .env');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log('🔄 جاري فحص الاتصال بـ Supabase...');
  const { error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('❌ فشل الاتصال. الخلل في الرابط أو المفتاح:\n', error.message);
  } else {
    console.log('✅ الاتصال ممتاز! الخوادم متوافقة وجاهزة تماماً.');
  }
} catch (err) {
  console.error('❌ تعذر قراءة ملف .env، هل أنت في المسار الصحيح؟');
}
