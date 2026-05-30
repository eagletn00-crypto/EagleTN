import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function LivreurDashboard() {
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [historyOrders, setHistoryOrders] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // حالة رصد الوصول محلياً للمطعم
  const [arrivedToRest, setArrivedToRest] = useState<{ [key: string]: boolean }>({});

  const fetchLivreurData = async () => {
    try {
      // 1. جلب الطلبات النشطة (في الانتظار أو قيد التوصيل)
      const { data: actives } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['accepte', 'en_cours'])
        .order('created_at', { ascending: false });

      // 2. جلب سجل الطلبات التي تم تسليمها بنجاح (Historique)
      const { data: completed } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'livre')
        .order('updated_at', { ascending: false });

      if (actives) setActiveOrders(actives);
      if (completed) {
        setHistoryOrders(completed);
        // حساب المحفظة ديناميكياً: ربح الكابتن هو 4.500 DT عن كل طلب مكتمل
        setWalletBalance(completed.length * 4.500);
      }
    } catch (err) {
      console.error("Error connecting with Supabase database logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivreurData();

    // التسمع اللحظي لحالة الطلبات لتحديث الشاشة فوراً عند حدوث تغيير
    const channel = supabase
      .channel('livreur-realtime-cluster')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchLivreurData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: nextStatus })
        .eq('id', orderId);

      if (error) throw error;
      fetchLivreurData();
    } catch (err: any) {
      alert('Erreur Transaction Supabase: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b111e] flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-emerald-500 mb-3"></div>
        <p className="text-xs text-gray-400 font-bold">Mise à jour de l'Espace Capitaine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b111e] text-white font-sans select-none pb-20" dir="ltr">
      
      {/* 🏛️ الترويسة العلوية الفخمة والمحفظة الديناميكية الحقيقية */}
      <div className="bg-[#161f30] p-4 rounded-b-3xl border-b border-gray-800 flex justify-between items-center shadow-2xl mb-6">
        <div>
          <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
            Eagle Livreur <span className="text-sm">🏍️</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">Espace Capitaine • Tunis</p>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-gray-500 block font-bold uppercase tracking-wider">Portefeuille</span>
          <span className="text-sm font-mono font-black text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-xl border border-[#10b981]/20 block mt-0.5">
            {walletBalance.toFixed(3)} DT
          </span>
        </div>
      </div>

      <div className="px-4 space-y-6">
        
        {/* 🔥 أولاً: قسم الطلبات المتاحة والنشطة */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider border-l-2 border-[#10b981] pl-2">
            Course Disponible Proche ({activeOrders.length})
          </h2>

          {activeOrders.length === 0 ? (
            <div className="bg-[#161f30] p-8 rounded-2xl border border-gray-800 text-center py-10 shadow-inner">
              <p className="text-xs text-gray-400 font-bold">Aucune course active</p>
              <p className="text-amber-500/80 font-black text-[11px] mt-1">لا توجد طلبات جاهزة للشحن حالياً. في انتظار المطبخ... 🧑‍🍳</p>
            </div>
          ) : (
            activeOrders.map((order) => {
              const isAccepted = order.status === 'en_cours';
              const isArrived = arrivedToRest[order.id] || false;

              // بناء روابط ملاحة حقيقية لخرائط جوجل تفتح تطبيق الهاتف مباشرة
              const restaurantMapUrl = `https://www.google.com/maps/search/?api=1&query=Am+Ali+Kitchen+Cite+El+Khadra+Tunis`;
              const clientMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.delivery_address || 'Tunis')}`;

              return (
                <div key={order.id} className="bg-[#161f30] border border-gray-800/80 p-5 rounded-[28px] space-y-4 shadow-2xl relative overflow-hidden">
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-gray-500 font-mono block">CODE: #DEL-{order.id.slice(0,4).toUpperCase()}</span>
                      <span className="text-[11px] font-black text-gray-300 block mt-0.5">Dist. Livraison: 2.4 KM</span>
                    </div>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-black text-xs px-3 py-1 rounded-xl">
                      + 4.500 DT
                    </span>
                  </div>

                  {/* الخريطة التوجيهية مع زر الملاحة الحي والتفاعلي */}
                  {isAccepted && (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-inner h-36 bg-slate-900">
                      <img 
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400" 
                        alt="Map Tracking" 
                        className="w-full h-full object-cover opacity-30 mix-blend-luminosity" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161f30] via-transparent to-transparent"></div>
                      
                      {/* زر تشغيل نظام التوجيه الحقيقي لخرائط جوجل الجغرافية */}
                      <a 
                        href={!isArrived ? restaurantMapUrl : clientMapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1 active:scale-95 transition-all"
                      >
                        🗺️ Ouvrir GPS Live
                      </a>

                      <div className="absolute bottom-2 left-2 right-2 bg-[#0b111e]/90 border border-gray-800 px-3 py-2 rounded-xl text-center">
                        <p className="text-[10px] font-black text-emerald-400 flex items-center justify-center gap-1">
                          {!isArrived 
                            ? "🚨 ALERTE : En route vers Am Ali Kitchen (1.0 KM)" 
                            : "📦 COLIS RÉCUPÉRÉ : En route vers le Client"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-amber-500 font-black uppercase tracking-wider">Enlèvement (Restaurant)</p>
                        <p className="text-xs font-bold text-gray-200 mt-0.5">Am Ali Kitchen • Cité Tunis</p>
                      </div>
                      <a href="tel:+21655123456" className="bg-[#1e293b] text-amber-500 font-black text-[11px] px-3 py-1.5 rounded-xl border border-gray-800 flex items-center gap-1">
                        📞 Appeler
                      </a>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-800/60 pt-3">
                      <div>
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-wider">Destination (Client)</p>
                        <p className="text-xs font-bold text-gray-200 mt-0.5">{order.customer_name} • {order.delivery_address || 'Tunis'}</p>
                      </div>
                      <a href={`tel:${order.customer_phone || ''}`} className="bg-[#1e293b] text-blue-400 font-black text-[11px] px-3 py-1.5 rounded-xl border border-gray-800 flex items-center gap-1">
                        📞 Appeler
                      </a>
                    </div>
                  </div>

                  <div className="pt-2">
                    {!isAccepted && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id, 'en_cours')}
                        className="w-full bg-[#10b981] hover:bg-[#0e9f6e] text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wide shadow-lg transition-all active:scale-95"
                      >
                        Accepter la Course 🚀
                      </button>
                    )}

                    {isAccepted && !isArrived && (
                      <button 
                        onClick={() => setArrivedToRest(prev => ({ ...prev, [order.id]: true }))}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wide shadow-lg transition-all active:scale-95"
                      >
                        Confirmer l'Arrivée au Restaurant 🧑‍🍳
                      </button>
                    )}

                    {isAccepted && isArrived && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id, 'livre')}
                        className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wide shadow-lg transition-all active:scale-95"
                      >
                        Confirmer la Livraison au Client ✅
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* 📊 ثانياً: قسم السجل التاريخي للعمليات المكتملة اليوم (Historique Journalier) */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider border-l-2 border-blue-500 pl-2">
            Historique Journalier ({historyOrders.length})
          </h2>

          {historyOrders.length === 0 ? (
            <p className="text-[11px] text-gray-600 italic pl-1">Aucune course livrée aujourd'hui.</p>
          ) : (
            <div className="bg-[#161f30] rounded-2xl border border-gray-800 divide-y divide-gray-800/40 overflow-hidden shadow-2xl">
              {historyOrders.map((hOrder) => (
                <div key={hOrder.id} className="p-3.5 flex justify-between items-center bg-[#161f30]/60">
                  <div>
                    <p className="text-xs font-bold text-gray-200">{hOrder.customer_name}</p>
                    <span className="text-[9px] text-gray-500 block font-mono mt-0.5">ID: #EAG-{hOrder.id.slice(0,4).toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-[#10b981] block">+4.500 DT</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-bold inline-block mt-0.5">
                      ✓ Livré
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
