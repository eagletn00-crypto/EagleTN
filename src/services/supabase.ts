import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qydluewlkgprehqksxwl.supabase.co';
// قمنا بتنظيف المفتاح تماماً لضمان عدم وجود أي مسافة أو رمز مكسور
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5ZGx1ZXdsa2dwcmVocXNreHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5MjgyNzYsImV4cCI6MjAyOTUwNDI3Nn0.8wN10Y-G3Y8D2wY1-7yXbY5Y3z8wN10Y_G3Y8D2wY1'.trim();

export const supabase = createClient(supabaseUrl, supabaseKey);
