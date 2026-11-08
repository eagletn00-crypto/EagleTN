import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// جلب المفاتيح
const envPath = path.resolve('apps/client/.env'); // سنستخدم بيئة العميل
let envContent = '';
try { envContent = fs.readFileSync(envPath, 'utf8'); } catch (e) { 
  try { envContent = fs.readFileSync(path.resolve('apps/partner/.env'), 'utf8'); } catch(err) { process.exit(1); }
}
const getEnv = (key) => { const match = envContent.match(new RegExp(`${key}=(.*)`)); return match ? match[1].trim() : null; };

const URL = getEnv('VITE_SUPABASE_URL');
const KEY = getEnv('VITE_SUPABASE_ANON_KEY');
const supabase = createClient(URL, KEY);
const MASTER_PARTNER_ID = 'c468b8f6-46ec-4653-8f43-7b387c719e80';

async function checkOrderFlow() {
  console.log("==================================================");
  console.log("[EAGLE TN] تشخيص تدفق الطلب الفعلي (End-to-End)");
  console.log("==================================================");

  // 1. هل الطلب الذي قمت به عبر فيسبوك موجود في قاعدة البيانات أصلاً؟
  console.log("\n-> 1. فحص قاعدة البيانات بحثاً عن طلبك الأخير...");
  const { data: latestOrders, error: fetchError } = await supabase
    .from('orders')
    .select('id, partner_id, client_id, status, total_amount, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  if (fetchError) {
    console.error("❌ خطأ في القراءة (السبب RLS SELECT Policy):", fetchError.message);
  } else {
    if (latestOrders && latestOrders.length > 0) {
        console.log("✅ الطلبات موجودة في قاعدة البيانات! (المشكلة في الـ Frontend للشريك):");
        console.table(latestOrders);
    } else {
        console.log("⚠️ جدول الطلبات لا يُرجع أي بيانات. إما أنه فارغ، أو أن RLS يمنع القراءة.");
    }
  }

  // 2. اختبار الإدخال المباشر لاكتشاف جدار حماية (RLS INSERT)
  console.log("\n-> 2. اختبار إدخال طلب جديد لاكتشاف قيود الحفظ...");
  const { data: insertData, error: insertError } = await supabase
    .from('orders')
    .insert([{
        partner_id: MASTER_PARTNER_ID,
        status: 'pending',
        total_amount: 15.000,
        grand_total: 15.000,
        payment_method: 'COD',
        customer_name: 'Test RLS'
    }])
    .select('id');

  if (insertError) {
    console.error("❌ فشل الإدخال (INSERT Error) - تم الحظر بواسطة Supabase RLS:");
    console.error("الرسالة:", insertError.message);
    console.error("التفاصيل:", insertError.details || insertError.hint);
  } else {
    console.log("✅ الإدخال ناجح! (RLS لا يمنع الحفظ). تم إنشاء طلب تجريبي بمعرف:", insertData[0].id);
    // تنظيف
    await supabase.from('orders').delete().eq('id', insertData[0].id);
  }
}

checkOrderFlow();
