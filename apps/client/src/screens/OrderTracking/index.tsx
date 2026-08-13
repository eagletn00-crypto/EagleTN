import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface OrderTrackingProps {
  orderId: string;
  onBackToHome: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId, onBackToHome }) => {
  const [order, setOrder] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let channel: any;

    async function fetchInitialOrder() {
      try {
        setIsLoading(true);

        const { data: orderData, error } = await supabase
          .from('orders')
          .select('*, partners(*)')
          .eq('id', orderId)
          .single();

        if (error) throw error;

        setOrder(orderData);
        if (orderData?.partners) {
          setPartner(orderData.partners);
        }

        // Realtime WebSockets Subscription
        channel = supabase
          .channel(`order_status_${orderId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'orders',
              filter: `id=eq.${orderId}`,
            },
            (payload) => {
              setOrder((prev: any) => ({ ...prev, ...payload.new }));
            }
          )
          .subscribe();

      } catch (err) {
        console.error('Error loading order tracking:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (orderId) {
      fetchInitialOrder();
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-slate-500 font-bold text-sm">
        جاري تحميل التتبع Mettre à jour...
      </div>
    );
  }

  const status = order?.status || 'PENDING';

  const steps = [
    { key: 'PENDING', label: 'تم إرسال الطلب', desc_fr: 'En attente de confirmation', desc_ar: 'في انتظار تأكيد المطعم' },
    { key: 'ACCEPTED', label: 'تم قبول الطلب', desc_fr: 'Commande acceptée', desc_ar: 'المطعم استلم طلبك الآن' },
    { key: 'PREPARING', label: 'جاري التحضير 🍳', desc_fr: 'En cours de préparation', desc_ar: 'الشيف يحضر أكلتك' },
    { key: 'ON_THE_WAY', label: 'الموصل في الطريق 🛵', desc_fr: 'En cours de livraison', desc_ar: 'الموصل قريب منك' },
    { key: 'DELIVERED', label: 'تم التسليم 🏁', desc_fr: 'Livrée avec succès', desc_ar: 'صحة وبالشفاء!' },
  ];

  const getCurrentStepIndex = () => {
    switch (status) {
      case 'PENDING': return 0;
      case 'ACCEPTED': return 1;
      case 'PREPARING': return 2;
      case 'ON_THE_WAY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 p-4 flex flex-col justify-between max-w-lg mx-auto">
      
      {/* Navigation Header */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-white border border-slate-200 rounded-full font-bold text-xs text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
          >
            ← الرئيسية Accueil
          </button>

          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            تتبع حي Direct
          </span>
        </div>

        {/* Visual Hook: A Bientôt Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl text-center space-y-2 border border-slate-800">
          <p className="text-emerald-400 font-serif italic text-2xl font-bold tracking-wide">
            A bientôt...
          </p>
          <p className="text-slate-300 text-xs font-medium">
            شكراً لثقتكم في <span className="font-bold text-white">Eagle TN</span> 🦅
          </p>
          <div className="pt-1">
            <span className="bg-white/10 text-slate-300 text-[10px] font-mono px-3 py-1 rounded-full border border-white/10">
              رقم الطلب: #{orderId?.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Partner Info Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm text-slate-900">{partner?.name_fr || partner?.name || 'Restaurant'}</h3>
            <p className="text-xs text-slate-400">الإجمالي: <span className="font-bold text-slate-900">{Number(order?.total_id || 0).toFixed(3)} DT</span></p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              الدفع: {order?.payment_method?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Floating Actions: Call Driver & Chat */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`tel:${partner?.phone || '21600000000'}`}
            className="p-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10 active:scale-95 transition-transform"
          >
            <span>📞</span> الاتصال بالمحل
          </a>
          <button
            onClick={() => alert('الدردشة الحية قيد التجهيز مع الموصل')}
            className="p-3 bg-slate-900 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
          >
            <span>💬</span> الدردشة الحية
          </button>
        </div>

        {/* Dynamic Stepper */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">مراحل الطلب Suivi</h4>

          <div className="space-y-5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
            {steps.map((step, idx) => {
              const isDone = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.key} className="relative flex items-start gap-3.5 z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div>
                    <h5 className={`text-xs font-black ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-medium leading-snug mt-0.5">
                      {step.desc_ar} • <span className="italic">{step.desc_fr}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="pb-4 pt-4">
        <button
          onClick={onBackToHome}
          className="w-full py-4 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-md active:scale-98 transition-transform"
        >
          العودة للقائمة Retour au menu
        </button>
      </div>

    </div>
  );
};

export default OrderTracking;
