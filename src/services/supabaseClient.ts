import { createClient } from '@supabase/supabase-js';

// استخدم المتغيرات البيئية أو ضع الروابط المباشرة الخاصة بمشروعك هنا
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'VOTRE_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'VOTRE_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
