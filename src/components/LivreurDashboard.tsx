import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function LivreurDashboard() {
  const [deliveryOrders, setDeliveryOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // حالة داخلية وهمية لمحاكاة الانتقال من "مقبول" إلى "وصول للمطعم" داخل نفس الطلب النشط
  const [arrivedToRest, setArrivedToRest] = useState<{ [key: string]: boolean }>({});

  const fetchDeliveryOrders = async () => {
    try {
      setLoading(true);
      // جلب الطلبات المقبولة من المطعم (accepte) أو الطلبات التي تحت التوصيل (en_cours)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['accepte', 'en_cours'])
        .order('id', { ascending: false });

      if (error) console.error("Error fetching delivery orders:", error.message);
      else setDeliveryOrders(data || []);
    } catch (err) {
      console.error("Failed delivery fetch:", err);
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

  // تحديث حالة الطلب بالتوافق مع الـ Enum الحقيقي في قاعدة البيانات
  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: nextStatus })
        .eq('id', orderId);

      if (error) throw error;
      fetchDeliveryOrders();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b111e] flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500 mb-3"></div>
        <p className="text-xs text-gray-400 font-bold">Chargement de l'Espace Capitaine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b111e] text-white font-sans select-none pb-12" dir="ltr">
      
      {/* 🏛️ الترويسة العلوية الفخمة المطابقة للـ UI الأصلي */}
      <div className="bg-[#161f30] p-4 rounded-b-3xl border-b border-gray-800 flex justify-between items-center shadow-2xl mb-6">
        <div>
          <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
            Eagle Livreur <span className="text-sm">🏍️</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">Espace Capitaine • Tunis</p>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-gray-500 block font-bold uppercase tracking-wider">Portefeuille</span>
          <span className="text-xs font-mono font-black text-[#10b981]">38.500 DT</span>
        </div>
      </div>

      <div className="px-4 space-y-5">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider border-l-2 border-[#10b981] pl-2">
          Course Disponible Proche
        </h2>

        {deliveryOrders.length === 0 ? (
          <div className="bg-[#161f30] p-8 rounded-2xl border border-gray-800 text-center py-12 shadow-inner">
            <p className="text-xs text-gray-400 font-bold">Aucune course disponible</p>
            <p className="text-amber-500/80 font-black text-[11px] mt-1">لا توجد طلبات جاهزة للشحن حالياً. في انتظار المطبخ... 🧑‍🍳</p>
          </div>
        ) : (
          deliveryOrders.map((order) => {
            const isAcceptedLocally = order.status === 'en_cours';
            const isArrivedToRestaurant = arrivedToRest[order.id] || false;

            return (
              <div key={order.id} className="bg-[#161f30] border border-gray-800/80 p-5 rounded-[28px] space-y-4 shadow-2xl relative overflow-hidden">
                
                {/* الجزء العلوي لبطاقة الشحنة */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-gray-500 font-mono block">CODE: #DEL-{order.id.slice(0,4).toUpperCase()}</span>
                    <span className="text-[11px] font-black text-gray-300 block mt-0.5">Dist. Livraison: 2.4 KM</span>
                  </div>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-black text-xs px-3 py-1 rounded-xl">
                    + 4.500 DT
                  </span>
                </div>

                {/* 🗺️ الخريطة التفاعلية الفخمة - تظهر بمجرد قبول الرحلة */}
                {isAcceptedLocally && !isArrivedToRestaurant && (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-inner h-36 bg-slate-900">
                    <img 
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400" 
                      alt="Map Tracking" 
                      className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161f30] via-transparent to-transparent"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-bounce">📍</div>
                    <div className="absolute bottom-2 left-2 right-2 bg-[#0b111e]/90 border border-amber-500/20 px-3 py-1.5 rounded-xl text-center">
                      <p className="text-[10px] font-black text-amber-400 flex items-center justify-center gap-1">
                        🚨 ALERTE : En route vers Am Ali Kitchen (1.0 KM)
                      </p>
                    </div>
                  </div>
                )}

                {/* رسالة توجيهية ثانية بعد استلام الطرد والتحرك نحو العميل */}
                {isAcceptedLocally && isArrivedToRestaurant && (
                  <div className="bg-[#0b111e] border border-blue-500/20 p-3 rounded-xl text-center">
                    <p className="text-[11px] font-black text-blue-400">
                      📍 Allez au restaurant Am Ali pour récupérer le colis
                    </p>
                  </div>
                )}

                {/* تفاصيل العناوين والاتصال */}
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-wider">Enlèvement (Restaurant)</p>
                      <p className="text-xs font-bold text-gray-200 mt-0.5">Am Ali Kitchen • Cité Tunis</p>
                    </div>
                    <a href={`tel:+21655123456`} className="bg-[#1e293b] text-amber-500 font-black text-[11px] px-3 py-1.5 rounded-xl border border-gray-800 flex items-center gap-1">
                      📞 Appeler
                    </a>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-800/60 pt-3">
                    <div>
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-wider">Destination (Client)</p>
                      <p className="text-xs font-bold text-gray-200 mt-0.5">{order.customer_name} • {order.delivery_address || 'Cité El Khadra'}</p>
                    </div>
                    <a href={`tel:${order.customer_phone}`} className="bg-[#1e293b] text-blue-400 font-black text-[11px] px-3 py-1.5 rounded-xl border border-gray-800 flex items-center gap-1">
                      📞 Appeler
                    </a>
                  </div>
                </div>

                {/* تدفق الأزرار التفاعلية الثلاثي الصارم */}
                <div className="pt-2">
                  {/* المرحلة 1: قبول الرحلة وتحويل الحالة إلى en_cours */}
                  {!isAcceptedLocally && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'en_cours')}
                      className="w-full bg-[#10b981] hover:bg-[#0e9f6e] text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wide shadow-lg transition-all active:scale-95"
                    >
                      Accepter la Course 🚀
                    </button>
                  )}

                  {/* المرحلة 2: تأكيد الوصول للمطعم */}
                  {isAcceptedLocally && !isArrivedToRestaurant && (
                    <button 
                      onClick={() => setArrivedToRest(prev => ({ ...prev, [order.id]: true }))}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wide shadow-lg transition-all active:scale-95"
                    >
                      Confirmer l'Arrivée au Restaurant 🧑‍🍳
                    </button>
                  )}

                  {/* المرحلة 3: تأكيد التسليم النهائي للزبون وتحويل الحالة إلى livre */}
                  {isAcceptedLocally && isArrivedToRestaurant && (
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

    </div>
  );
}
