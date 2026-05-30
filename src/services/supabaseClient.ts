import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qydluewlkgprehqksxwl.supabase.co';
const supabaseKey = 'sb_publishable_kivWuOpflPb1A6LsKGwENA_JWScBQej';

export const supabase = createClient(supabaseUrl, supabaseKey);
