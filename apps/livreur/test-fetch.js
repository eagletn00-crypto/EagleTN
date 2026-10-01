import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrders() {
  console.log('📡 جاري الاتصال بـ Supabase...');
  const { data, error } = await supabase.from('orders').select('*').limit(5);

  if (error) {
    console.error('❌ خطأ:', error.message);
  } else {
    console.log('✅ البيانات المجلوبة من Supabase:');
    console.dir(data, { depth: null });
  }
}

checkOrders();
