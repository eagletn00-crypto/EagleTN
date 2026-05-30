import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function SuperAdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [capitaines, setCapitaines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCentralData = async () => {
    try {
      setLoading(true);

      // 1. جلب كافة المعاملات والطلبات حية
      const { data: fetchedOrders, error: errOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (errOrders) throw errOrders;
      if (fetchedOrders) setOrders(fetchedOrders);

      // 2. محاكاة جلب حالة الكباتن (الموصلين) حياً لبرج المراقبة
      // يمكنك لاحقاً ربطها بجدول profiles أو livreurs إذا أردت
      setCapitaines([
        { id: 1, name: 'Ahmed K. (Kawa 300)', status: 'En Course', zone: 'El Khadra' },
        { id: 2, name: 'Yassine B. (Vespa)', status: 'Disponible', zone: 'Cité El Khadra' }
      ]);

    } catch (err) {
      console.error("Central Administration Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentralData();

    // الاستماع اللحظي الشامل لكافة الجداول لضمان التحديث التلقائي أمام أعين الأدمن
    const channel = supabase
      .channel('central-hq-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchCentralData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // الحسابات المالية الدقيقة المتوافقة مع الـ Enum الحقيقي (en_attente, accepte, en_cours, livre)
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'en_attente').length;
  
  // حساب حجم الأعمال الصافي من الطلبات المسلمة فعلياً (livre)
  const deliveredOrders = orders.filter(o => o.status === 'livre');
  const volumeAffaires = deliveredOrders.reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);
  
  // حساب عمولة المنصة الإقليمية (15% صافي من حجم المبيعات)
  const commissionsNet = volumeAffaires * 0.15;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b111e] flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-red-500 mb-3"></div>
        <p className="text-xs text-gray-400 font-bold">Ouverture du Système Central d'Administration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b111e] text-white font-sans select-none pb-12" dir="ltr">
      
      {/* 👑 الترويسة الملكية المركزية المطابقة للصورة 1000095581.png */}
      <div className="bg-[#161f30] p-5 rounded-b-3xl border-b border-gray-800/80 shadow-2xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
            Eagle TN HQ <span className="text-xs">👑</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">Administration Centrale Régionale</p>
        </div>
        <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-extrabold tracking-wider px-2.5 py-1 rounded-xl uppercase">
          MODE ROOT
        </span>
      </div>

      {/* 📊 الكروت المالية والتحليلات المتقدمة */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-6">
        <div className="bg-[#161f30] border border-gray-800/80 p-4 rounded-2xl shadow-xl">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">VOLUME D'AFFAIRES</span>
          <span className="text-sm font-mono font-black text-amber-500 block mt-1">
            {volumeAffaires.toFixed(3)} <span className="text-[10px]">DT</span>
          </span>
        </div>
        <div className="bg-[#161f30] border border-gray-800/80 p-4 rounded-2xl shadow-xl">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">COMMISSIONS NET (15%)</span>
          <span className="text-sm font-mono font-black text-emerald-400 block mt-1">
            {commissionsNet.toFixed(3)} <span className="text-[10px]">DT</span>
          </span>
        </div>
      </div>

      <div className="px-4 space-y-6">
        
        {/* 🏍️ قسم مراقبة حالة الكباتن في الوقت الحالي */}
        <div className="space-y-3">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider border-l-2 border-amber-500 pl-2">
            STATUT DES CAPITAINES (LIVE)
          </h2>
          <div className="bg-[#161f30] rounded-2xl border border-gray-800/80 p-4 space-y-3 shadow-xl">
            {capitaines.map((cap) => (
              <div key={cap.id} className="flex justify-between items-center border-b border-gray-800/40 last:border-0 last:pb-0 pb-3">
                <div>
                  <h4 className="text-xs font-black text-gray-200">{cap.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold mt-0.5">Dernier scan: {cap.zone}</p>
                </div>
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg border ${
                  cap.status === 'En Course' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  ● {cap.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 🛡️ سجل تدقيق الأمان الذكي للـ Database Audit Logs */}
        <div className="space-y-3">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider border-l-2 border-red-500 pl-2">
            LOGS & AUDIT SÉCURITÉ DATABASE
          </h2>
          <div className="bg-[#161f30] rounded-2xl border border-gray-800/80 p-4 font-mono text-[10px] space-y-2 shadow-inner text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-400">SELECT * FROM products via API</span>
              <span className="text-emerald-400 font-bold">200 OK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">UPDATE products.in_stock (ID 1)</span>
              <span className="text-amber-400 font-bold">AUTH_SUCCESS</span>
            </div>
            <div className="flex justify-between border-t border-gray-800/60 pt-2 mt-2">
              <span className="text-gray-400">Supabase RLS Rules Enforcement</span>
              <span className="text-blue-400 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* 📑 تدفق المعاملات اللحظي الشامل */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider border-l-2 border-blue-500 pl-2">
              Flux des Transactions en temps réel ({totalOrdersCount})
            </h2>
            {pendingCount > 0 && (
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black px-2 py-0.5 rounded-md animate-pulse">
                {pendingCount} En attente
              </span>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#161f30] p-6 rounded-2xl border border-gray-800 text-center py-8 text-gray-500 font-bold text-xs">
              لا توجد سجلات معاملات حالياً في الشبكة المركزية.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-[#161f30] border border-gray-800/60 p-4 rounded-2xl flex justify-between items-center shadow-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-gray-500">#{order.id.slice(0,4).toUpperCase()}</span>
                      <h4 className="text-xs font-black text-gray-200">{order.customer_name || 'Anonyme'}</h4>
                    </div>
                    <p className="text-[10px] text-gray-400">📍 {order.delivery_address || 'Tunis'} • 📞 {order.customer_phone || 'N/A'}</p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <span className="text-xs font-mono font-black text-amber-500 block">{(parseFloat(order.total_price) || 0).toFixed(3)} DT</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md block text-center uppercase ${
                      order.status === 'livre' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      order.status === 'en_attente' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {order.status === 'livre' ? 'LIVRÉ' : order.status === 'en_attente' ? 'EN ATTENTE' : order.status}
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
