import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. جلب حالة الجلسة الأمنية الحالية عند إقلاع التطبيق
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // الاستماع الفوري لأي تغيير في حالة تسجيل الدخول أو الخروج
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 2. جلب المنتجات من قاعدة البيانات بسوبابيس
    supabase.from('products').select('*').order('id', { ascending: true }).then(({ data }) => {
      if (data) setMenuItems(data as MenuItem[]);
    });

    return () => subscription.unsubscribe();
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

  // شاشة الانتظار الصغيرة أثناء التحقق من التوكن الأمني
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <span className="text-4xl animate-bounce">🦅</span>
          <p className="text-xs text-slate-500 font-bold mt-3">تحقق أمني آمن لـ Eagle TN...</p>
        </div>
      </div>
    );
  }

  // [جدار الحماية الحاسم]: إذا لم تكن هناك جلسة نشطة، اقطع الطريق واعرض صفحة الـ Login فوراً
  if (!session) {
    return <Login />;
  }

  // إذا كان المستخدم مسجلاً، اطلق له العنان لتصفح الراوتر الكامل للمنصة
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientHome />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* توجيه مسار اللوجن القديم تلقائياً إلى الصفحة الرئيسية لأنك مسجل بالفعل */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/livreur" element={<LivreurDashboard />} />
        <Route path="/admin" element={<SuperAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
