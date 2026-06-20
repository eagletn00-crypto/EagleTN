import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// ⚠️ تنبيه صارم لبيئة Linux: يجب أن تكون أسماء المجلدات والملفات مطابقة تماماً لهذه الأحرف!
import CustomerHome from '../screens/customer/CustomerHome';
import { useSecurityStore } from '../context/useSecurityStore';
import { supabase } from '../services/supabaseClient';

const ClientRoutes: React.FC = () => {
  // استخدام المتجر بأمان لتجنب أي أخطاء متعلقة بالـ Named Exports
  const store = (useSecurityStore as any).useSecurityStore ? (useSecurityStore as any).useSecurityStore() : (useSecurityStore as any).default ? (useSecurityStore as any).default() : useSecurityStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (store && typeof store.updateSession === 'function') {
        store.updateSession(session);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [store]);

  return (
    <Routes>
      {/* عرض الشاشة الحقيقية للزبون الآن بدلاً من النص المؤقت */}
      <Route index element={<CustomerHome />} />
    </Routes>
  );
};

export default ClientRoutes;
