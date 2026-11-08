import { createClient } from '@supabase/supabase-js';
import type { Database } from '@eagletn/types';

export const createEagleClient = (supabaseUrl: string, supabaseAnonKey: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('FATAL: Supabase URL and Anon Key must be explicitly provided by the application environment.');
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { 
      persistSession: true, 
      autoRefreshToken: true, 
      detectSessionInUrl: true 
    },
    realtime: { 
      params: { events_per_second: 50 } 
    },
    db: { 
      schema: 'public' 
    },
  });
};
