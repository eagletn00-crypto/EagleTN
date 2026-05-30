import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

function LivreurDashboard() {
  const [deliveryOrders, setDeliveryOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveryOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['Prête pour Livreur', 'En cours de livraison'])
        .order('id', { ascending: false });

      if (error) console.error("خطأ واجهة السائق:", error.message);
      else setDeliveryOrders(data || []);
    } catch (err) {
      console.error("فشل جلب التوصيل:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryOrders();

    const subscription = supabase
      .channel('livreur:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchDeliveryOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const updateStatus = async (orderId: number, nextStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', orderId);

    if (error) alert('خطأ في تحديث التوصيل: ' + error.message);
    else alert(`الحالة الجديدة: ${nextStatus} 🛵`);
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-bold bg-slate-950 min-h-screen">جاري تحميل لوحة السائق...</div>;

  const list = deliveryOrders || [];

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans pb-10">
      <div className="p-5 bg-amber-500 text-slate-900 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black">⚡ Livreur Express</h1>
          <p className="text-xs font-bold opacity-80">Livraison Premium 4K • Eagle.tn</p>
        </div>
        <span className="bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-full">⚡ LIVE</span>
      </div>

      <div className="px-4 mt-6 space-y-4">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider">Courses Disponibles ({list.length})</h2>

        {list.length === 0 ? (
          <div className="text-center p-12 text-gray-600 font-bold">لا توجد طلبات جاهزة للشحن حالياً. في انتظار المطبخ... 👨‍🍳</div>
        ) : (
          list.map((order) => (
            <div key={order.id} className="bg-slate-900 border border-slate-800 p-5 rounded-[24px] space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-amber-400">Commande #{order.id}</span>
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-md font-bold">{order.status}</span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-black">{order.customer_name || 'Client'}</p>
                <p className="text-xs text-gray-400">📍 {order.customer_address || 'N/A'}</p>
                <p className="text-xs text-gray-400">📞 {order.customer_phone || 'N/A'}</p>
              </div>

              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl font-mono text-xs">
                <span className="text-gray-400">Montant à collecter:</span>
                <span className="font-black text-green-400">{(parseFloat(order.total_price) || 0).toFixed(3)} DT</span>
              </div>

              {order.status === 'Prête pour Livreur' && (
                <button 
                  onClick={() => updateStatus(order.id, 'En cours de livraison')}
                  className="w-full bg-amber-500 text-slate-900 font-black py-3 rounded-xl text-xs shadow-md"
                >
                  Accepté la course & En route 🛵
                </button>
              )}

              {order.status === 'En cours de livraison' && (
                <button 
                  onClick={() => updateStatus(order.id, 'Livré')}
                  className="w-full bg-green-500 text-white font-black py-3 rounded-xl text-xs shadow-md"
                >
                  تم الوصول وتجنيب المبلغ (Livré) ✔️
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default LivreurDashboard;
