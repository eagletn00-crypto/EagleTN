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

async function resetOrderStatus() {
  const orderId = '3fa0db5a-953a-4b91-8830-5a5c08cda7f8';
  console.log(`🔄 إرجاع حالة الطلب ${orderId} إلى (pending)...`);

  const res = await fetch(`${baseUrl}/rest/v1/orders?id=eq.${orderId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status: 'pending' })
  });

  if (res.ok) {
    console.log('✅ تم تحديث الحالة بنجاح إلى pending!');
    console.log('👉 تحقّق الآن من شاشة الشريك (http://localhost:5175) ستجد الطلب ظهر في الحين.');
  } else {
    console.error('❌ فشل التحديث:', await res.text());
  }
}

resetOrderStatus();
