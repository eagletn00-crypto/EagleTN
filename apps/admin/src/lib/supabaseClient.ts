import { createEagleClient } from '@eagle/database';

export const supabase = createEagleClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);
