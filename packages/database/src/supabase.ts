// packages/database/src/supabase.ts
// CRITICAL: The URL polyfill must be imported before Supabase is initialized
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Depending on your bundler (Expo vs Bare RN), use the correct env prefix.
// Assuming Expo for standard RN monorepos:
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('FATAL: Supabase URL and Anon Key are missing. Check your .env file routing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Must be false for React Native
  },
  realtime: {
    // Termux WebSocket stability fix: tune timeout and ping intervals
    timeout: 20000,
    params: {
      eventsPerSecond: 10,
    }
  }
});
