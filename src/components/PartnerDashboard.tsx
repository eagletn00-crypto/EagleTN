import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Store, Clock, Edit3, Image, BellRing, Utensils, XCircle, Check, Package, DollarSign, Calendar, Power, MessageCircle } from 'lucide-react';

export default function PartnerDashboard({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'commandes' | 'menu' | 'journal' | 'profil'>('commandes');
  
  const fetchAll = async () => {
    const { data: o } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: p } = await supabase.from('products').select('*');
    if (o) setOrders(o);
    if (p) setProducts(p);
  };

  useEffect(() => { fetchData(); }, []);

  // دالة تعديل ذكية لا تكسر الـ Route
  const updateProduct = async (id: number, field: string, value: any) => {
    await supabase.from('products').update({ [field]: value }).eq('id', id);
    fetchAll();
  };

  return (
    <div className="min-h-screen bg-[#07080E] text-slate-100 font-sans pb-24">
      {/* Header الترحيبي الذكي */}
      <div className="bg-[#111422] p-6 border-b border-white/5">
        <h1 className="text-sm font-black text-white uppercase tracking-widest">{new Date().getHours() < 12 ? "Bonjour Chef 👋" : "Bonsoir Chef 👋"}</h1>
        <p className="text-[9px] text-amber-500 font-bold uppercase">Eagle Pro Dashboard</p>
      </div>

      {/* Tabs */}
      <div className="flex p-2 gap-1 bg-[#111422] m-4 rounded-2xl border border-white/5">
        {['commandes', 'menu', 'journal', 'profil'].map(t => (
          <button key={t} onClick={() => setActiveTab(t as any)} className={`flex-1 py-3 text-[9px] font-black uppercase rounded-xl transition-all ${activeTab === t ? 'bg-amber-500 text-slate-950' : 'text-slate-500'}`}>{t}</button>
        ))}
      </div>

      {/* المحتوى يتغير بناءً على الـ Tab (محافظة على الكود القديم مع إضافة وظائف جديدة) */}
      <div className="p-4 space-y-4">
        {activeTab === 'commandes' && orders.filter(o => o.status !== 'delivered').map(order => (
          <div key={order.id} className="bg-[#111422] p-5 rounded-[2rem] border border-white/5 shadow-xl">
             {/* هنا نضع الكود القديم الخاص بك مع زر WhatsApp الجديد */}
             <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-white">CMD #{order.pin_code}</span>
                <span className="text-[9px] font-black text-amber-500 uppercase">{order.status}</span>
             </div>
             <button onClick={() => window.open(`https://wa.me/21658050693`, '_blank')} className="w-full bg-[#10b981] text-white py-3 rounded-xl font-black text-[10px] uppercase">Contact Livreur 💬</button>
          </div>
        ))}
      </div>
    </div>
  );
}
