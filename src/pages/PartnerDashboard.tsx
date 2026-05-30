import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface PartnerDashboardProps {
  user: {
    id: string;
    email: string;
  };
}

export default function PartnerDashboard({ user }: PartnerDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب الطلبات القديمة والاستماع للطلبات الجديدة حياً
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('partner_id', user.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();

    // تشغيل البث الحي للطلبات الجديدة القادمة لمطبخ عم علي
    const orderSubscription = supabase
      .channel('partner-orders-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
        filter: `partner_id=eq.${user.id}`
      }, (payload) => {
        console.log('طلب جديد حقيقي وصل! 🔥', payload.new);
        // إدخال الطلب الجديد فوراً في أعلى القائمة أمام عم علي
        setOrders(prev => [payload.new, ...prev]);
        
        // تنبيه صوتي للمطبخ
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => console.log('🔔 طلب جديد لعم علي!'));
      })
      .subscribe();

    // تنظيف الاتصال عند مغادرة الشاشة
    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, [user.id]);

  // دالة لتحديث حالة الطلب (قبول / رفض)
  const updateOrderStatus = async (orderId: string, newStatus: 'accepte' | 'annule') => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      // تحديث الحالة في الواجهة تلقائياً
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  return (
    <div className="p-4 bg-slate-950 min-h-screen text-white font-sans" dir="rtl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-black text-amber-500">مطبخ عم علي 🍲</h1>
          <p className="text-gray-400 text-xs mt-0.5">لوحة التحكم الحية وتلقي الطلبات • Eagle TN</p>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/25 ready-pulse">
          متصل حيّاً
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-center text-gray-400 text-sm">جاري تحميل الطلبات الحية...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-gray-500 text-sm">لا توجد طلبات واردة حالياً.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center text-xs">
                <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                  order.status === 'en_attente' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                  order.status === 'accepte' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' :
                  order.status === 'livre' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                }`}>
                  {order.status === 'en_attente' && 'في الانتظار ⏳'}
                  {order.status === 'accepte' && 'قيد التحضير 👨‍🍳'}
                  {order.status === 'en_cours' && 'مع السائق 🚴'}
                  {order.status === 'livre' && 'تم التوصيل ✅'}
                  {order.status === 'annule' && 'ملغي ❌'}
                </span>
                <span className="text-gray-500">{new Date(order.created_at).toLocaleTimeString('fr-FR')}</span>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p className="text-slate-300"><span className="text-gray-500">العنوان:</span> {order.delivery_address}</p>
                <p className="text-slate-300"><span className="text-gray-500">الهاتف:</span> {order.client_phone || 'لا يوجد'}</p>
                <p className="text-amber-500 font-black mt-2 text-base">المجموع: {order.total_price} د.ت</p>
              </div>

              {order.status === 'en_attente' && (
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/60">
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'accepte')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95"
                  >
                    قبول وتحضير
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'annule')}
                    className="bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-gray-400 font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95"
                  >
                    رفض الطلب
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
