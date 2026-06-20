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
        
        {/* اصطياد المسار القديم المكسور وتحويله فوراً للنظام الجديد لضمان الاستقرار */}
        <Route path="/category/partner" element={<Navigate to="/partner/dashboard" replace />} />
        <Route path="/category/partner" element={<Navigate to="/partner/dashboard" replace />} />
        
        {/* قطاع الشركاء والمطاعم المحدث */}
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        <Route path="/partner/*" element={<PartnerRoutes />} />
        
        {/* القوائم والتتبع الميداني */}
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/track/:orderId" element={<OrderTracking />} />
        
        {/* قطاع الإدارة */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* حماية الجذور */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
