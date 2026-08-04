import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  client_name: string;
  total_ttc: number;
  status: string;
  created_at: string;
}

export default function PartnerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);

  // 1. تفعيل التنبيه الصوتي واهتزاز الجهاز عند وصول طلب جديد
  const triggerNewOrderAlert = () => {
    try {
      // تفعيل الاهتزاز (Haptic Feedback) إذا كان مدعوماً على الهاتف
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 300]);
      }
      
      // تشغيل نغمة تنبيه احترافية قصيرة
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // نغمة D5
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio/Vibration feedback blocked by browser policies until user interaction.");
    }
  };

  useEffect(() => {
    // 2. جلب الطلبات السابقة المخزنة للشريك الحقيقي (Chez Am Ali)
    const fetchInitialOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, client_name, total_ttc, status, created_at')
        .eq('partner_id', '7ee8b022-f38b-4b21-8848-bfb81f185da1')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    };

    fetchInitialOrders();

    // 3. قنوات الاستماع الفوري وعزل البيانات للشريك المعني
    const ordersChannel = supabase
      .channel('partner-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: 'partner_id=eq.7ee8b022-f38b-4b21-8848-bfb81f185da1'
        },
        (payload) => {
          console.log('Realtime payload captured:', payload.new);
          const newOrder = payload.new as Order;
          
          // حقن الطلب اللحظي في أعلى قائمة العرض
          setOrders((prevOrders) => [newOrder, ...prevOrders]);
          
          // إطلاق التنبيهات الحسية والصوتية فوراً
          triggerNewOrderAlert();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsListening(true);
        }
      });

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen p-6 text-zinc-900 font-sans">
      {/* الهوية البصرية الفاخرة والتقشفية لمنصة Eagle */}
      <div className="flex justify-between items-center border-b border-zinc-100 pb-5 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Tableau des Commandes</h1>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">Chez Am Ali</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`} />
          <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
            {isListening ? 'LIVE FEED ACTIVE' : 'CONNECTING...'}
          </span>
        </div>
      </div>

      {/* عرض قائمة الطلبات المستلمة حياً */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-sm text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
            Aucune commande active pour le moment.
          </div>
        ) : (
          orders.map((order) => (
            <div 
              key={order.id} 
              className="flex justify-between items-center p-4 bg-white border border-zinc-100 rounded-xl shadow-sm hover:border-zinc-200 transition-all"
            >
              <div className="space-y-1">
                <div className="text-sm font-semibold text-zinc-900">{order.client_name}</div>
                <div className="text-xs text-zinc-400">Ref: #{order.id.substring(0, 8)}</div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm font-bold text-zinc-900">{Number(order.total_ttc).toFixed(3)} DT</div>
                <span className="inline-block px-2.5 py-0.5 bg-zinc-900 text-white rounded-md text-[10px] font-medium tracking-wider uppercase">
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
