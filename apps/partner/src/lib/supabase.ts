import { createClient } from '@supabase/supabase-js';
import type { Database } from '@eagletn/types';

// سيتم تعبئة هذه المتغيرات لاحقاً في بيئة الإنتاج
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
