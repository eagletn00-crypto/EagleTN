import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// استدعاء الشاشات الرئيسية كـ Modular Folders
import { ClientHome } from './screens/ClientHome';
import RestaurantMenu from './screens/RestaurantMenu'; 

export interface CartItemWithDetails {
  item: any;
  quantity: number;
  totalPrice: number;
}

const RestaurantRouteWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <button
        onClick={() => navigate('/home')}
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200/80 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-white transition-all active:scale-95 cursor-pointer"
      >
        ← Accueil
      </button>

      <RestaurantMenu />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<ClientHome />} />
          <Route path="/restaurant" element={<RestaurantRouteWrapper />} />
          <Route path="/restaurant/:id" element={<RestaurantRouteWrapper />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
