import { createClient } from '@supabase/supabase-js';

// قراءة المتغيرات البيئية الآمنة من Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// التحقق الهيكلي لمنع كسر التطبيق أثناء التشغيل في بيئة التطوير
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials are missing. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env.local file.'
  );
}

// تصدير العميل الموحد للمشروع كاملاً
export const supabase = createClient(
  supabaseUrl || 'https://supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
