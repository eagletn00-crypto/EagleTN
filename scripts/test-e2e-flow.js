import fs from 'fs';
import path from 'path';

function getEnv() {
  const envPaths = ['apps/client/.env', '.env'];
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
const baseUrl = env.url.replace(/\/$/, '');
const headers = {
  'apikey': env.key,
  'Authorization': `Bearer ${env.key}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function runE2EWorkflow() {
  console.log('🚀 بدء تجربة التدفق الميداني المباشر (Closed-Loop E2E Test)...\n');

  // 1. الزبون ينشئ طلباً جديداً
  console.log('1️⃣  [Client] إنشاء طلب تجريبي جديد...');
  const newOrder = {
    client_name: 'حريف تجريبي - eagle_tn',
    client_phone: '+21699000111',
    status: 'pending',
    subtotal_ht: 25.000,
    tva_amount: 4.750,
    delivery_fee: 3.500,
    total_amount: 33.250,
    grand_total: 33.250,
    platform_fee: 2.000,
    driver_earning: 3.000,
    partner_payout: 25.000,
    payment_method: 'CASH',
    verification_code: '4321',
    delivery_address: 'تونس العاصمة - Rue Habib Bourguiba',
    delivery_lat: 36.8008,
    delivery_lng: 10.1800
  };

  const createRes = await fetch(`${baseUrl}/rest/v1/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newOrder)
  });

  if (!createRes.ok) {
    console.error('❌ فشل إنشاء الطلب:', await createRes.text());
    return;
  }

  const createdData = await createRes.json();
  const orderId = createdData[0].id;
  console.log(`✅ تم إنشاء الطلب بنجاح! ID: ${orderId}\n`);

  // 2. الشريك/المطعم يوافق على الطلب ويبدأ التحضير
  console.log('2️⃣  [Partner] قبول الطلب وتغيير الحالة إلى (preparing)...');
  const partnerUpdate = await fetch(`${baseUrl}/rest/v1/orders?id=eq.${orderId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status: 'preparing', prep_timer_started_at: new Date().toISOString() })
  });
  if (partnerUpdate.ok) console.log('✅ المطعم بدأ التحضير بنجاح.');

  // 3. السائق يستلم الشحنة وينطلق للتوصيل
  console.log('3️⃣  [Livreur] ربط السائق وتحديث الموقع والحالة إلى (delivering)...');
  const driverUpdate = await fetch(`${baseUrl}/rest/v1/orders?id=eq.${orderId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ 
      status: 'delivering',
      courier_id: '00000000-0000-0000-0000-000000000001',
      latitude: 36.8015,
      longitude: 10.1810
    })
  });
  if (driverUpdate.ok) console.log('✅ السائق استلم الشحنة وانطلق.');

  // 4. تسليم الطلب بنجاح بـ PIN Code
  console.log('4️⃣  [Admin / Livreur] التأكيد النهائي واستكمال التسليم (delivered)...');
  const finalUpdate = await fetch(`${baseUrl}/rest/v1/orders?id=eq.${orderId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status: 'delivered', status_updated_at: new Date().toISOString() })
  });
  if (finalUpdate.ok) console.log('🎉 تم تسليم الطلب واكتملت الدورة المغلقة بنجاح!');

  // تنظيف السجل التجريبي
  await fetch(`${baseUrl}/rest/v1/orders?id=eq.${orderId}`, { method: 'DELETE', headers });
  console.log('\n🧹 تم تنظيف السجل التجريبي لتبقى قاعدة البيانات نظيفة.');
}

runE2EWorkflow();
