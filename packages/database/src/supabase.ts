import { createClient } from '@supabase/supabase-js';
import type { Database } from '@eagletn/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL or Anon Key is missing from environment variables.');
}

// 1. Singleton Instance (Used by Client App)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// 2. Factory Function (Expected by Admin and Livreur Apps)
// Supports optional overrides if the apps provide their own env vars
export const createEagleClient = (url?: string, key?: string) => {
  if (url && key) {
    return createClient<Database>(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabase;
};
