import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function run() {
  console.log('\n====================================================');
  console.log('  🔍 Supabase Schema Inspector (Pure REST API)');
  console.log('====================================================\n');

  const supabaseUrl = process.env.VITE_SUPABASE_URL || await ask('أدخل رابط Supabase URL: ');
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || await ask('أدخل Anon API Key: ');

  rl.close();

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ خطأ: البيانات المدخلة غير كاملة.');
    process.exit(1);
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/?apikey=${supabaseKey}`;

  try {
    console.log('\nجاري استعلام OpenAPI Schema لمعرفة جميع الجداول الحالية...');
    const res = await fetch(endpoint, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!res.ok) {
      throw new Error(`فشل الاتصال: ${res.status} ${res.statusText}`);
    }

    const schema = await res.json();
    const tables = Object.keys(schema.definitions || {});

    console.log('\n====================================================');
    console.log(`✅ تم العثور على (${tables.length}) جداول قائمة في قاعدة البيانات:`);
    console.log('====================================================');

    tables.forEach((table, index) => {
      console.log(`\n[${index + 1}] Table: ${table}`);
      const properties = schema.definitions[table].properties || {};
      const columns = Object.keys(properties);
      console.log(`    Columns (${columns.length}): ${columns.join(', ')}`);
    });

  } catch (err) {
    console.error('\n❌ تعذر جلب المخطط:', err.message);
  }
}

run();
