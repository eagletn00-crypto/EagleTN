import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// استيراد الشاشات الأساسية من المجلدات التي تحققنا منها
import SplashScreen from '@/screens/SplashScreen';
import ClientHome from '@/screens/ClientHome';
import CustomerHome from '@/screens/customer/CustomerHome'; // تأكد من الاسم الفعلي للمجلد الداخلي
import PartnerDashboard from '@/screens/partner/PartnerDashboard'; 
import OrderTracking from '@/screens/OrderTracking';
import MenuPage from '@/screens/MenuPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* صفحة الانطلاق والترحيب */}
        <Route path="/" element={<SplashScreen />} />
        
        {/* مسارات الزبائن والعملاء */}
        <Route path="/home" element={<ClientHome />} />
        <Route path="/customer" element={<CustomerHome />} />
        
        {/* لوحة تحكم الشركاء والمطاعم */}
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        
        {/* تتبع الطلبات والقوائم */}
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/track/:orderId" element={<OrderTracking />} />
        
        {/* توجيه تلقائي للمسارات غير المعروفة */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
