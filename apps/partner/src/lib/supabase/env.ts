export function resolveSupabaseEnv() {
  // استخدام طريقة Vite الصحيحة import.meta.env
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    console.error('🚨 [Supabase Env] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables!');
  }

  return { url, key };
}
