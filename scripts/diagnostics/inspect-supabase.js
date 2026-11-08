import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// قراءة ملف .env يدوياً لتفادي أخطاء الحزم الخارجية
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.log('⚠️ Could not parse .env file');
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('--- SUPABASE INSPECTION (NATIVE) ---');
console.log('URL Defined:', !!supabaseUrl);
console.log('Key Defined:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing credentials in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  try {
    console.log('⏳ Connecting to Supabase...');
    const { data, error, status } = await supabase.from('partners').select('*').limit(1);
    if (error) {
      console.error('❌ Error from Supabase:', error.message);
    } else {
      console.log('✅ Connected successfully! HTTP Status:', status);
      console.log('📦 Data Sample:', data);
    }
  } catch (err) {
    console.error('❌ Fetch failed / Network Error:', err.message);
  }
}

run();
