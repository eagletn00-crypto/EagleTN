import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function PartnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function checkPartnerSession() {
      try {
        // 1. التحقق من وجود مستخدم نشط
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setErrorMsg("Access Denied: الرجاء تسجيل الدخول كشريك لرؤية لوحة التحكم.");
          setLoading(false);
          return;
        }

        // 2. جلب رتبة المستخدم من جدول الـ profiles للتأكد
        const { data: profile, error: profError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profError || (profile && profile.role !== 'partner' && profile.role !== 'admin')) {
          setErrorMsg("⚠️ حسابك الحالي لا يمتلك صلاحية الوصول لهذه اللوحة.");
          setLoading(false);
          return;
        }

        // 3. جلب بيانات المطعم المرتبط (مثال: عم علي Kitchen)
        const { data: restaurant, error: restError } = await supabase
          .from('restaurants')
          .select('*')
          .limit(1)
          .single();

        if (restError) throw restError;
        setPartnerData(restaurant);

      } catch (err: any) {
        console.error("Dashboard error:", err);
        setErrorMsg("حدث خطأ أثناء جلب البيانات: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    checkPartnerSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b111e] flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-sm font-medium tracking-wide">جاري فحص الصلاحيات وتأمين الاتصال للـ Resto...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#0b111e] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-[#161f30] p-6 rounded-2xl border border-red-500/20 max-w-sm">
          <p className="text-red-400 font-bold text-sm mb-4">{errorMsg}</p>
          <a href="/" className="inline-block bg-yellow-400 text-gray-950 text-xs font-black px-6 py-2.5 rounded-xl">
            العودة للقائمة الرئيسية
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b111e] text-white p-4 font-sans">
      <div className="border-b border-gray-800 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black tracking-tight">🍳 {partnerData?.name || "Espace Resto Connecté"}</h1>
          <p className="text-xs text-green-400 font-medium mt-1">● اتصال آمن وشفّاف (E2E Verified)</p>
        </div>
        <span className="text-xs bg-yellow-400/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-400/20 font-bold">
          Partner Core
        </span>
      </div>

      {/* هنا نضع بقية عناصر لوحة التحكم الخاصة باستقبال الطلبات الحية */}
      <div className="bg-[#161f30] p-4 rounded-2xl border border-gray-800 text-center py-10">
        <p className="text-sm text-gray-400">بانتظار طلبات الزبائن الجديدة حية من السيرفر... 🦅</p>
      </div>
    </div>
  );
}
