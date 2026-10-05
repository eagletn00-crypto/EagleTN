import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('\n🧪 تجربة إدراج طلب بعد تحديث سياسات RLS...\n');

  const { data: partners } = await supabase.from('partners').select('id').limit(1);
  const partnerId = partners?.[0]?.id;

  if (!partnerId) {
    console.error('❌ لم يتم العثور على شريك في جدول partners.');
    return;
  }

  const dummyOrder = {
    partner_id: partnerId,
    status: 'pending',
    total_amount: 15.500,
    delivery_address: 'Tunis, Test Address'
  };

  const { data, error } = await supabase
    .from('orders')
    .insert([dummyOrder])
    .select();

  if (error) {
    console.error('❌ خطأ إدراج الطلب:', error.message);
  } else {
    console.log('✅ تم إدراج الطلب بنجاح! الأعمدة الفعلية المقبولة في جدول orders هي:');
    console.log(Object.keys(data[0]));

    // تنظيف السجل التجريبي
    await supabase.from('orders').delete().eq('id', data[0].id);
    console.log('\n🧹 تم حذف السجل التجريبي بنجاح.');
  }
}

testInsert();
