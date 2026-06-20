import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientRoutes from './routes/ClientRoutes';
import LivreurRoutes from './routes/LivreurRoutes';
import PartnerRoutes from './routes/PartnerRoutes';
import AdminRoutes from './routes/AdminRoutes';
import NotFound from './pages/NotFound';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/client" replace />} />
      <Route path="/client/*" element={<ClientRoutes />} />
      <Route path="/livreur/*" element={<LivreurRoutes />} />
      <Route path="/partner/*" element={<PartnerRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
export default App;
