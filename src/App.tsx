import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ClientRoutes from './routes/ClientRoutes';
import LivreurRoutes from './routes/LivreurRoutes';
import PartnerRoutes from './routes/PartnerRoutes';
import AdminRoutes from './routes/AdminRoutes';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* التوجيه الافتراضي */}
        <Route path="/" element={<Navigate to="/client" replace />} />

        {/* مسار الزبائن + حماية ضد الحروف الكبيرة */}
        <Route path="/client/*" element={<ClientRoutes />} />
        <Route path="/Client/*" element={<Navigate to="/client" replace />} />

        {/* مسار الشركاء + حماية ضد الحروف الكبيرة */}
        <Route path="/partner/*" element={<PartnerRoutes />} />
        <Route path="/Partner/*" element={<Navigate to="/partner" replace />} />

        {/* مسار السائقين + حماية ضد الحروف الكبيرة */}
        <Route path="/livreur/*" element={<LivreurRoutes />} />
        <Route path="/Livreur/*" element={<Navigate to="/livreur" replace />} />

        {/* مسار الإدارة + حماية ضد الحروف الكبيرة */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/Admin/*" element={<Navigate to="/admin" replace />} />

        {/* مسار الأخطاء الحقيقي */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
