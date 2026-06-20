import { supabase } from './services/supabaseClient';

async function testConnection() {
  console.log("🚀 Testing Connection to 'partners' table...");
  const { data, error } = await supabase.from('partners').select('*').limit(1);
  if (error) {
    console.error("❌ CONNECTION FAILED:", error.message);
  } else {
    console.log("✅ SUCCESS! Data retrieved:", data);
  }
}
testConnection();
