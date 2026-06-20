import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// استيراد الشاشات والواجهات الأساسية
import SplashScreen from '@/screens/SplashScreen';
import LandingPage from '@/screens/LandingPage';
import ClientHome from '@/screens/ClientHome';
import CustomerHome from '@/screens/customer/CustomerHome';
import PartnerDashboard from '@/screens/partner/PartnerDashboard';
import OrderTracking from '@/screens/OrderTracking';
import MenuPage from '@/screens/MenuPage';

// حارس البوابة الذكي لإدارة شاشة الانطلاق قبل الانتقال لصفحة الهبوط
const MainInitialRoute = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500); // 3.5 ثوانٍ لعرض صرخة النسر والأيقونة المتحركة بنقاء تسويقي

    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <LandingPage />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* نقطة الانطلاق الرسمية: السبراش سكرين تليها واجهة الهبوط الفاخرة */}
        <Route path="/" element={<MainInitialRoute />} />

        {/* مسارات القطاعات اللوجستية والزبائن */}
        <Route path="/home" element={<ClientHome />} />
        <Route path="/customer" element={<CustomerHome />} />

        {/* لوحة تحكم الشركاء والمطاعم */}
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />

        {/* تتبع الطلبات والقوائم الميدانية */}
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/track/:orderId" element={<OrderTracking />} />

        {/* حماية المسارات غير المعروفة والتوجيه للجذر */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
