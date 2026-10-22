import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const possiblePaths = ['.env', '.env.local', 'apps/admin/.env', '../.env'];
let envContent = '';
for (const p of possiblePaths) {
  try { envContent = fs.readFileSync(path.resolve(p), 'utf8'); break; } catch (e) {}
}
const getEnv = (key) => { 
  const match = envContent.match(new RegExp(`${key}=(.*)`)); 
  return match ? match[1].replace(/['"]/g, '').trim() : null; 
};
const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('VITE_SUPABASE_ANON_KEY'));

async function seedData() {
  console.log("🚀 Lancement de l'injection tactique (Correction de Schema)...");

  // 1. إنشاء شريك (مطعم) بدون حقل commission_rate لتطابق القاعدة
  const { data: partner, error: pErr } = await supabase.from('partners').insert([
    { name: 'KFC Lac 2', is_active: true, category: 'Fast Food' }
  ]).select().single();
  
  if (pErr) return console.log("❌ Erreur Partenaire:", pErr.message);
  console.log("✅ Partenaire créé.");

  // 2. إنشاء سائقين (مع توفير status فقط كما طلب المحرك)
  const { data: drivers, error: dErr } = await supabase.from('drivers').insert([
    { status: 'available' }, 
    { status: 'on_delivery' }, 
    { status: 'offline' }
  ]).select();
  
  if (dErr) return console.log("❌ Erreur Livreurs:", dErr.message);
  console.log("✅ Livreurs créés.");

  // 3. إنشاء طلبات حقيقية
  const orders = [
    { partner_id: partner.id, driver_id: drivers[1].id, status: 'delivered', total_amount: 45.500 },
    { partner_id: partner.id, driver_id: null, status: 'ready_for_pickup', total_amount: 22.000 },
    { partner_id: partner.id, driver_id: drivers[0].id, status: 'in_preparation', total_amount: 18.500 }
  ];

  const { error: oErr } = await supabase.from('orders').insert(orders);
  
  if (oErr) return console.log("❌ Erreur Commandes:", oErr.message);
  console.log("✅ Commandes créées avec succès !");
  
  console.log("\n🏁 Base de données prête. Nous pouvons maintenant réveiller le moteur Zustand.");
}

seedData();
