import { createClient } from '@supabase/supabase-js'; export const supabase = createClient('https://eagletn.supabase.co', 'public-key') as any;
