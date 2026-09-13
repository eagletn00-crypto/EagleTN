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
  'Content-Type': 'application/json'
};

async function debugOrder() {
  console.log('🔍 جاري فحص الطلب الأخير المتروك وتحديد partner_id...\n');

  // 1. جلب الطلب الأخير
  const res = await fetch(`${baseUrl}/rest/v1/orders?select=*&order=created_at.desc&limit=1`, { headers });
  if (res.ok) {
    const orders = await res.json();
    if (orders.length > 0) {
      const order = orders[0];
      console.log('📦 تفاصيل الطلب الموجود في قاعدة البيانات:');
      console.log(`- ID الطلب: ${order.id}`);
      console.log(`- partner_id المسجل في الطلب: [ ${order.partner_id} ]`);
      console.log(`- الحالة: ${order.status}`);
      console.log(`- رمز PIN: ${order.verification_code || order.verification_pin}`);
      
      // 2. جلب جميع الشركاء والمطاعم للتحقق من ID "Am Ali"
      console.log('\n🏪 جاري البحث عن قائمة الشركاء (Partners/Restaurants) المقيدين:');
      const pRes = await fetch(`${baseUrl}/rest/v1/partners?select=id,name`, { headers });
      if (pRes.ok) {
        const partners = await pRes.json();
        console.log(partners);
      } else {
        const rRes = await fetch(`${baseUrl}/rest/v1/restaurants?select=id,name`, { headers });
        if (rRes.ok) console.log(await rRes.json());
      }
    } else {
      console.log('❌ لا يوجد أي طلبات في الجدول حالياً.');
    }
  }
}

debugOrder();
