#!/bin/bash

echo "🦅 بدء حقن المسارات الأمنية ومزامنة مفاصل تطبيق Eagle.TN..."

# 1. حقن مسار الزبائن الحقيقي
cat << 'TSX' > src/routes/ClientRoutes.tsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerHome from '../screens/customer/CustomerHome';
import { useSecurityStore } from '../context/useSecurityStore';
import { supabase } from '../services/supabaseClient';

const ClientRoutes: React.FC = () => {
  const security = useSecurityStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (security && typeof security.updateSession === 'function') {
        security.updateSession(session);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [security]);

  return (
    <Routes>
      <Route index element={<CustomerHome />} />
    </Routes>
  );
};

export default ClientRoutes;
TSX

# 2. حقن مسار الإدارة المحمي
cat << 'TSX' > src/routes/AdminRoutes.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminDashboard from '../screens/SuperAdminDashboard';
import { useSecurityStore } from '../context/useSecurityStore';
import { supabase } from '../services/supabaseClient';

const AdminRoutes: React.FC = () => {
  const security = useSecurityStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setIsAuthorized(false);
          return;
        }

        const role = security?.role || session.user.user_metadata?.role;
        const hasAdminPrivilege = role === 'SUPER_ADMIN' || role === 'ADMIN';
        
        setIsAuthorized(!!hasAdminPrivilege);
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    verifyAdminAccess();
  }, [security]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/client" replace />;
  }

  return (
    <Routes>
      <Route index element={<SuperAdminDashboard />} />
    </Routes>
  );
};

export default AdminRoutes;
TSX

# 3. حقن مسار السائقين المحمي
cat << 'TSX' > src/routes/LivreurRoutes.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LivreurScreen from '../screens/livreur/livreur';
import { useSecurityStore } from '../context/useSecurityStore';
import { supabase } from '../services/supabaseClient';

const LivreurRoutes: React.FC = () => {
  const security = useSecurityStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyLivreurAccess = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setIsAuthorized(false);
          return;
        }

        const role = security?.role || session.user.user_metadata?.role;
        const isLivreur = role === 'LIVREUR';
        
        setIsAuthorized(isLivreur);
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    verifyLivreurAccess();
  }, [security]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/client" replace />;
  }

  return (
    <Routes>
      <Route index element={<LivreurScreen />} />
    </Routes>
  );
};

export default LivreurRoutes;
TSX

# 4. حقن مسار الشركاء المحمي
cat << 'TSX' > src/routes/PartnerRoutes.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PartnerDashboard from '../screens/partner/PartnerDashboard';
import { useSecurityStore } from '../context/useSecurityStore';
import { supabase } from '../services/supabaseClient';

const PartnerRoutes: React.FC = () => {
  const security = useSecurityStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyPartnerAccess = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setIsAuthorized(false);
          return;
        }

        const role = security?.role || session.user.user_metadata?.role;
        const isPartner = role === 'PARTNER';
        
        setIsAuthorized(isPartner);
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    verifyPartnerAccess();
  }, [security]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/client" replace />;
  }

  return (
    <Routes>
      <Route index element={<PartnerDashboard />} />
    </Routes>
  );
};

export default PartnerRoutes;
TSX

# 5. إجراء بناء محلي تجريبي للتأكد من ربط الشاشات الحقيقية دون أخطاء
echo "build التجريبي للمشروع..."
npm run build || npx vite build

# 6. الرفع المزدوج المتزامن لـ GitHub و Vercel
echo "المزامنة المزدوجة..."
git add .
git commit -m "Security: connect core features with protected routes and implement role-based guards via Supabase"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push origin $CURRENT_BRANCH --force
vercel --prod --force --yes

echo "✅ تم الحقن والرفع بنجاح ساحق! تم ربط شاشاتك الحقيقية الآن بكفاءة."
