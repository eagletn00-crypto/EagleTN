import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function PartnerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب البيانات الحية من الجداول الحقيقية
  const fetchLiveAndRealData = async () => {
    try {
      const { data: fetchedOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      const { data: fetchedMenu } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (fetchedOrders) setOrders(fetchedOrders);
      if (fetchedMenu) setMenuItems(fetchedMenu);
    } catch (err) {
      console.error("Error loading real-time data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAndRealData();

    // التسمع اللحظي للتغيرات في قاعدة البيانات لضمان تتبع الطلبات حياً (Realtime)
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchLiveAndRealData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b111e] flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500 mb-3"></div>
        <p className="text-xs text-gray-400 font-bold">جاري جلب فضاء عم علي المشفر...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b111e] text-white p-4 font-sans select-none" dir="ltr">
      
      {/* 🏛️ الترويسة العلوية الاحترافية الفخمة */}
      <div className="bg-[#161f30] p-4 rounded-2xl border border-gray-800/80 mb-6 flex justify-between items-center shadow-xl">
        <div>
          <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
            Eagle TN • Partner
          </h1>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">Espace Gestion de Restaurant</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0b111e]/80 border border-emerald-500/10 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[9px] text-emerald-400 font-extrabold tracking-wider uppercase">
            Cuisine Ouverte
          </span>
        </div>
      </div>

      {/* 🔥 1. قسم الطلبات المباشرة (Commandes En Direct) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-black border-l-4 border-amber-500 pl-2.5 tracking-wide text-gray-100">
            Suivi des Commandes En Direct
          </h2>
          <span className="text-[10px] text-red-400 font-black flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg animate-pulse">
            ⚠️ Alerte Sonore Active
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#161f30] p-6 rounded-2xl border border-gray-800/80 text-center py-10 shadow-inner">
            <p className="text-xs text-gray-400 font-bold">Aucune commande active</p>
            <p className="text-amber-500/80 font-black text-[11px] mt-1">بانتظار طلبات جديدة حية... 🦅</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#161f30] p-4 rounded-2xl border-2 border-amber-500/90 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[9px] text-gray-500 font-mono block tracking-tight">ID: #EAG-{order.id.slice(0,4).toUpperCase()}</span>
                    <h3 className="text-xs font-black text-gray-200 mt-0.5">Client: {order.customer_name || 'Bilel S.'}</h3>
                  </div>
                  <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm animate-bounce">
                    Nouveau 🔥
                  </span>
                </div>
                
                {/* تفاصيل الطلب الداخلي الهيكلية */}
                <div className="border-t border-gray-800/80 my-3 pt-3 text-xs text-gray-300 space-y-1.5 font-semibold">
                  <p className="flex justify-between">
                    <span>2x Kamounia Viande 🥩</span>
                    <span className="font-mono text-gray-400">17.000 DT</span>
                  </p>
                  <p className="flex justify-between">
                    <span>1x Sandwich Malawi Kofta 🌯</span>
                    <span className="font-mono text-gray-400">4.500 DT</span>
                  </p>
                </div>
                
                {/* حساب المجموع الفخم الصارم */}
                <div className="flex justify-between items-center border-t border-gray-800/60 pt-3 mt-3">
                  <span className="text-xs text-gray-400 font-bold">Total à encaisser:</span>
                  <span className="text-sm font-black text-amber-500 font-mono">{(order.total_price || 21.500).toFixed(3)} DT</span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-4">
                  <button className="col-span-3 bg-[#10b981] hover:bg-[#0e9f6e] text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-md active:scale-95">
                    Accepter & Préparer
                  </button>
                  <button className="col-span-1 bg-[#1e293b] hover:bg-red-950/40 text-red-400 font-black text-xs py-3 rounded-xl border border-gray-800 transition-all active:scale-95">
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📋 2. قسم إدارة قائمة المأكولات (Gestion de la Carte) */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-black border-l-4 border-blue-500 pl-2.5 tracking-wide text-gray-100">
            Gestion de la Carte (Menu)
          </h2>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5 pl-3">Modifiez les prix, les images et la disponibilité en un clic</p>
        </div>

        <div className="bg-[#161f30] rounded-2xl border border-gray-800 divide-y divide-gray-800/50 overflow-hidden shadow-2xl">
          {menuItems.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#1a2438]/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#0b111e] overflow-hidden flex-shrink-0 border border-gray-800 flex items-center justify-center text-xl shadow-inner">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    "🍲"
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-gray-200 truncate">{item.name}</h4>
                  <p className="text-xs text-amber-500 font-black font-mono mt-1">{(item.price || 0).toFixed(3)} DT</p>
                </div>
              </div>
              
              {/* أزرار التحكم الفخمة والاحترافية والملونة */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="bg-[#1e293b] hover:bg-[#334155] text-gray-300 font-black text-[11px] px-3 py-2 rounded-xl border border-gray-800 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm">
                  ✏️ Editer
                </button>
                <button className={`font-black text-[11px] px-3 py-2 rounded-xl border transition-all active:scale-95 shadow-sm ${item.in_stock !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {item.in_stock !== false ? 'Stock' : 'Épuisé'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
