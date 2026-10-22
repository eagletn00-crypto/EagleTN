import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import AdminOverview from './screens/AdminOverview';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التحقق من الجلسة الحالية عند تحميل التطبيق
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // الاستماع لأي تغيير في حالة تسجيل الدخول/الخروج
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9EBEF] flex items-center justify-center">
        <span className="text-xs font-black text-stone-500 uppercase tracking-widest animate-pulse">Initialisation Sécurisée...</span>
      </div>
    );
  }

  // إذا لم يكن هناك جلسة، اعرض شاشة الدخول، وإلا اعرض لوحة القيادة
  return !session ? <LoginScreen /> : <AdminOverview />;
}
