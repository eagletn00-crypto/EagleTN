import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// استيراد الشاشات الأساسية
import SplashScreen from './screens/SplashScreen';
import LandingPage from './screens/LandingPage';
import ClientHome from './screens/ClientHome';
import CustomerHome from './screens/customer/CustomerHome';
import PartnerDashboard from './screens/partner/PartnerDashboard';
import OrderTracking from './screens/OrderTracking';
import MenuPage from './screens/MenuPage';

// استيراد واجهات القطاعات الفرعية
import ClientRoutes from './routes/ClientRoutes';
import PartnerRoutes from './routes/PartnerRoutes';
import AdminRoutes from './routes/AdminRoutes';

const MainInitialRoute = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <LandingPage />;
};

// مكون فحص الانهيار الصامت
const RouteCrashFallback = () => (
  <div style={{ padding: '20px', background: '#000', color: '#ff0055', fontFamily: 'monospace', minHeight: '100vh' }}>
    <h1 style={{ fontSize: '20px' }}>🚨 تم اعتراض انهيار في التوجيه (Route Crash Intercepted)</h1>
    <p>التطبيق حاول القذف بك إلى مسار مجهول أو مكسور بسبب فشل الـ Auth Store.</p>
    <p>الموقع الحالي: {window.location.pathname}</p>
    <button onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }} style={{ background: '#ff0055', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>
      تطهير الكاش القسري وإعادة التشغيل
    </button>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* البوابة ونقطة الانطلاق الفخمة */}
        <Route path="/" element={<MainInitialRoute />} />
        
        {/* قطاع الزبائن واللوجستيك */}
        <Route path="/home" element={<ClientHome />} />
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/client/*" element={<ClientRoutes />} />
        
        {/* قطاع الشركاء والمطاعم */}
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        <Route path="/partner/*" element={<PartnerRoutes />} />
        
        {/* القوائم والتتبع الميداني */}
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/track/:orderId" element={<OrderTracking />} />
        
        {/* قطاع الإدارة */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* بدلاً من التوجيه التلقائي للمسار القديم، سنمسك بالخطأ هنا */}
        <Route path="*" element={<RouteCrashFallback />} />
      </Routes>
    </BrowserRouter>
  );
}
