import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import SplashScreen from './screens/SplashScreen';
import LandingPage from './screens/LandingPage';

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
        {/* تشغيل الواجهة الفخمة ونقطة الانطلاق الرئيسية مباشرة */}
        <Route path="/" element={<MainInitialRoute />} />
        
        {/* إعادة توجيه أي مسار آخر مؤقتاً للـ Root لضمان الاستقرار التام */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
