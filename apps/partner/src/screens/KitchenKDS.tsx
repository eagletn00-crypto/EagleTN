import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, CheckCircle2, ChefHat, AlertCircle, Play, Check } from 'lucide-react';
import { Order } from '@eagletn/types';

export interface KitchenKDSProps {
  partnerId: string;
}

// واجهة مساعدة لتسهيل التعامل مع البيانات في واجهة المستخدم
interface OrderUI extends Order {
  parsedItems?: any[];
}

const KitchenKDS: React.FC<KitchenKDSProps> = ({ partnerId }) => {
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [loading, setLoading] = useState(true);

  // نظام التنبيه الصوتي (Web Audio API) لتفادي مشاكل الملفات المفقودة
  const playAlertSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // Beep
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio alert not supported or blocked');
    }
  }, []);

  const fetchOrders = async () => {
    if (!partnerId) return;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('partner_id', partnerId)
      .in('status', ['pending', 'preparing'])
      .order('created_at', { ascending: true });

    if (!error && data) {
      // معالجة البيانات بأمان
      const formattedOrders = (data as any[]).map((order: any) => ({
        ...order,
        parsedItems: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      })) as OrderUI[];
      setOrders(formattedOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // الاستماع الفوري للطلبات الجديدة (Supabase Realtime)
    const channel = supabase
      .channel('kitchen_orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders',
        filter: `partner_id=eq.${partnerId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          playAlertSound(); // إطلاق الإنذار الصوتي للطلب الجديد
        }
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partnerId, playAlertSound]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // التحديث الفوري في الواجهة (Optimistic UI Update) لسرعة استجابة المطبخ
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // التحديث في قاعدة البيانات
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    
    if (newStatus === 'ready') {
      // إخفاء الطلب من لوحة المطبخ بمجرد أن يصبح جاهزاً للمندوب
      setTimeout(() => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }, 1000);
    }
  };

  if (!partnerId) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 font-bold">
        En attente de connexion...
      </div>
    );
  }

  // تصنيف الطلبات
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 overflow-hidden">
      
      {/* 🔴 العمود الأول: طلبات جديدة (Nouvelles) */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#C1121F] p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-white animate-pulse" />
            <h2 className="text-xl font-black text-white uppercase tracking-wider">جديد</h2>
            <span className="text-white/80 text-xs font-bold uppercase ml-2">(Nouveau)</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black">
            {pendingOrders.length}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
          {pendingOrders.length === 0 && (
            <div className="m-auto text-gray-400 font-bold">لا توجد طلبات جديدة</div>
          )}
          {pendingOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-md border-l-4 border-[#C1121F]">
              <div className="flex justify-between items-start mb-3">
                <span className="font-black text-lg text-[#1C1917]">#{order.id.slice(0, 5).toUpperCase()}</span>
                <span className="text-xs font-bold text-gray-400">منذ دقيقة</span>
              </div>
              
              <div className="space-y-2 mb-4">
                {order.parsedItems?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm font-bold text-[#1C1917]">
                    <span>{item.quantity}x {item.nameAr || item.name}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => updateOrderStatus(order.id, 'preparing')}
                className="w-full h-14 bg-[#1C1917] hover:bg-black text-white rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
              >
                <Play className="w-5 h-5 fill-current" />
                أبدا التحضير
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🟠 العمود الثاني: قيد التحضير (En Préparation) */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-amber-500 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-white" />
            <h2 className="text-xl font-black text-white uppercase tracking-wider">جاري التحضير</h2>
            <span className="text-white/80 text-xs font-bold uppercase ml-2">(En cours)</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black">
            {preparingOrders.length}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
          {preparingOrders.length === 0 && (
            <div className="m-auto text-gray-400 font-bold">لا يوجد طلبات قيد التحضير</div>
          )}
          {preparingOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-md border-l-4 border-amber-500">
              <div className="flex justify-between items-start mb-3">
                <span className="font-black text-lg text-[#1C1917]">#{order.id.slice(0, 5).toUpperCase()}</span>
                <Clock className="w-5 h-5 text-amber-500 animate-spin-slow" />
              </div>
              
              <div className="space-y-2 mb-4">
                {order.parsedItems?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm font-bold text-[#1C1917]">
                    <span>{item.quantity}x {item.nameAr || item.name}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => updateOrderStatus(order.id, 'ready')}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
              >
                <Check className="w-6 h-6" strokeWidth={3} />
                الطلب جاهز
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default KitchenKDS;
