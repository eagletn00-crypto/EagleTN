import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PartnerDashboard from './screens/PartnerDashboard';
import StockManagement from './screens/StockManagement';
import PartnerFinances from './screens/PartnerFinances';
import KitchenKDS from './screens/KitchenKDS';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-100">
        <Routes>
          <Route path="/" element={<PartnerDashboard />} />
          <Route path="/kitchen" element={<KitchenKDS />} />
          <Route path="/stock" element={<StockManagement />} />
          <Route path="/finances" element={<PartnerFinances />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
