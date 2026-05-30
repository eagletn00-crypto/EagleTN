import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

function SuperAdminDashboard() {
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('id', { ascending: false });

      if (error) console.error("خطأ الأدمن العام:", error.message);
      else setAllOrders(data || []);
    } catch (err) {
      console.error("فشل الجلب:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();

    const adminSub = supabase
      .channel('admin:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchAllOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(adminSub);
    };
  }, []);

  // تأمين الحسابات الحية بقيم افتراضية لمنع الصفحة البيضاء نهائياً
  const ordersList = allOrders || [];
  const deliveredOrders = ordersList.filter(o => o && o.status === 'Livré');
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);
  const pendingCount = ordersList.filter(o => o && o.status === 'En attente').length;

  if (loading) return <div className="p-10 text-center text-gray-500 font-bold bg-gray-950 min-h-screen">جاري فتح النظام المركزي للإدارة...</div>;

  return (
    <div className="bg-gray-950 min-h-screen text-white font-sans pb-12">
      <div className="p-6 bg-gradient-to-r from-red-700 to-amber-600 shadow-xl flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tight">🦅 Eagle TN - Super Admin</h1>
          <span className="text-[10px] bg-black/30 font-black px-2.5 py-1 rounded-full border border-white/10">Central System</span>
        </div>
        <p className="text-xs text-white/80 font-medium">لوحة المراقبة العامة لمشروع الحاضنة التكنولوجية Startup Act</p>
      </div>

      <div className="grid grid-cols-3 gap-3 px-4 mt-6">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center shadow-md">
          <span className="text-lg block">📦</span>
          <span className="text-xs font-bold text-gray-400 block mt-1">Total</span>
          <span className="text-base font-mono font-black text-white mt-0.5 block">{ordersList.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center shadow-md">
          <span className="text-lg block">🚨</span>
          <span className="text-xs font-bold text-gray-400 block mt-1">En attente</span>
          <span className="text-base font-mono font-black text-red-400 mt-0.5 block">{pendingCount}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center shadow-md">
          <span className="text-lg block">💰</span>
          <span className="text-xs font-bold text-gray-400 block mt-1">Chiffre</span>
          <span className="text-xs font-mono font-black text-green-400 mt-0.5 block truncate">{totalRevenue.toFixed(0)} DT</span>
        </div>
      </div>

      <div className="px-4 mt-8 space-y-4">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider">Flux des transactions en temps réel</h2>
        
        {ordersList.length === 0 ? (
          <div className="text-center p-10 text-gray-600 font-bold">لا توجد سجلات معاملات حالياً.</div>
        ) : (
          <div className="space-y-3">
            {ordersList.map((order) => (
              <div key={order.id} className="bg-slate-900 border border-slate-800/60 p-4 rounded-2xl flex justify-between items-center shadow-inner">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500">#{order.id}</span>
                    <h4 className="text-sm font-extrabold text-white">{order.customer_name || 'Anonyme'}</h4>
                  </div>
                  <p className="text-[11px] text-gray-400">📍 {order.customer_address || 'N/A'} • 📞 {order.customer_phone || 'N/A'}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-sm font-mono font-black text-amber-500 block">{(parseFloat(order.total_price) || 0).toFixed(3)} DT</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md block text-center ${
                    order.status === 'Livré' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'En attente' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.status || 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default SuperAdminDashboard;
