import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PartnerDashboard from '../screens/partner/PartnerDashboard';
import { useSecurityStore } from '../context/useSecurityStore';
import { supabase } from '../services/supabaseClient';

const PartnerRoutes: React.FC = () => {
  const store = (useSecurityStore as any).useSecurityStore ? (useSecurityStore as any).useSecurityStore() : (useSecurityStore as any).default ? (useSecurityStore as any).default() : useSecurityStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return setIsAuthorized(false);
      const role = store?.role || session.user.user_metadata?.role;
      setIsAuthorized(role === 'PARTNER');
    };
    verifyAccess();
  }, [store]);

  if (isAuthorized === null) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthorized) return <Navigate to="/client" replace />;

  return (
    <Routes>
      <Route index element={<PartnerDashboard />} />
    </Routes>
  );
};

export default PartnerRoutes;
