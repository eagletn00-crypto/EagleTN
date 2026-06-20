import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const ClientRoutes = lazy(() => import('./routes/ClientRoutes'));
const LivreurRoutes = lazy(() => import('./routes/LivreurRoutes'));
const PartnerRoutes = lazy(() => import('./routes/PartnerRoutes'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AppLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-300/20 border-b-amber-300 rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/client" replace />} />
          <Route path="/client/*" element={<ClientRoutes />} />
          <Route path="/livreur/*" element={<LivreurRoutes />} />
          <Route path="/partner/*" element={<PartnerRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
export default App;
