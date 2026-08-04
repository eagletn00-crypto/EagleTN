import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  // انتهاء الفحص السريع لمنع وميض الواجهات
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-sm font-medium tracking-wide text-zinc-400 animate-pulse">
          VERIFYING SESSION...
        </div>
      </div>
    );
  }

  // إذا لم يكن مسجلاً، يتم توجيهه تلقائياً لصفحة تسجيل الدخول (سواء كانت /auth أو /login)
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
