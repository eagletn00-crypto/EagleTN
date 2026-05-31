import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientHome from './components/ClientHome';
import RestaurantMenu from './components/RestaurantMenu';
import Cart from './components/Cart';
import PartnerDashboard from './components/PartnerDashboard';
import LivreurDashboard from './components/LivreurDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientHome />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/livreur" element={<LivreurDashboard />} />
        <Route path="/admin" element={<SuperAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
