import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './services/supabaseClient';

import ClientHome from './components/ClientHome';
import RestaurantMenu from './components/RestaurantMenu';
import PartnerDashboard from './components/PartnerDashboard';
import LivreurDashboard from './components/LivreurDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import Cart from './components/Cart';
import Login from './components/Login';

interface MenuItem {
  id: any;
  name: string;
  price: number;
  in_stock: boolean;
  image_url: string;
  logo_url?: string;
  cover_url?: string;
  is_promo?: boolean;
  promo_price?: number;
  is_special?: boolean;
}

export default function App() {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    supabase.from('products').select('*').order('id', { ascending: true }).then(({ data }) => {
      if (data) setMenuItems(data as MenuItem[]);
    });
  }, []);

  const addToCart = (id: any) => {
    const k = String(id);
    setCart(prev => ({ ...prev, [k]: (prev[k] || 0) + 1 }));
  };

  const removeFromCart = (id: any) => {
    const k = String(id);
    setCart(prev => {
      const u = { ...prev };
      if (u[k] > 1) u[k]--; else delete u[k];
      return u;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const getCartTotal = () => {
    return Object.keys(cart).reduce((t, id) => {
      const item = menuItems.find(m => String(m.id) === String(id));
      return t + (item ? item.price * cart[id] : 0);
    }, 0);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientHome />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/livreur" element={<LivreurDashboard />} />
        <Route path="/admin" element={<SuperAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
