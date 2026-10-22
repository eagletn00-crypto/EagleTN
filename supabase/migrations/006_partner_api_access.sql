-- =================================================================
-- EAGLE TN: Migration 006 - Partner Table API Access & Schema Fix
-- =================================================================

BEGIN;

-- 1. التأكد من ربط المفتاح الأجنبي (Foreign Keys) بـ auth.users
ALTER TABLE IF EXISTS public.partners 
    ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. توثيق الجدول ليتم الكشف عنه وإبرازه عبر Data API
COMMENT ON TABLE public.partners IS 'Partners directory exposed to Supabase Data API';
COMMENT ON TABLE public.partner_users IS 'Partner user mapping with role permissions';

-- 3. تفعيل RLS بشكل آمن وحضاري
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_users ENABLE ROW LEVEL SECURITY;

-- 4. إزالة السياسات القديمة المتضاربة إن وجدت
DROP POLICY IF EXISTS "Public read access for partners" ON public.partners;
DROP POLICY IF EXISTS "Owners can manage their partner profile" ON public.partners;
DROP POLICY IF EXISTS "Partner users read access" ON public.partner_users;

-- 5. إنشاء سياسات RLS متوازنة وبدون ثغرات
-- السماح للقراءة العامة أو للمستخدمين المسجلين
CREATE POLICY "Public read access for partners" 
    ON public.partners FOR SELECT 
    TO anon, authenticated 
    USING (true);

-- السماح للمالك فقط بالتعديل
CREATE POLICY "Owners can manage their partner profile" 
    ON public.partners FOR ALL 
    TO authenticated 
    USING (auth.uid() = owner_id OR auth.uid() = id)
    WITH CHECK (auth.uid() = owner_id OR auth.uid() = id);

-- سياسة partner_users
CREATE POLICY "Partner users read access"
    ON public.partner_users FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- 6. منح صلاحيات الاستخدام الأساسية
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.partners TO anon, authenticated;
GRANT ALL ON public.partners TO authenticated;
GRANT ALL ON public.partner_users TO authenticated;

-- 7. إجبار PostgREST على إعادة تحميل الـ Schema Cache
NOTIFY pgrst, 'reload schema';

COMMIT;
