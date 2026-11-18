import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Navigation, RefreshCw, Flame, CheckCircle2, Bike, UtensilsCrossed, Banknote, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
// 🦅 الاستيراد السيادي
import { Order } from '@eagletn/types';
import LiveOrderMap from '../../components/LiveOrderMap';
import { useGeolocation } from '../../hooks/useGeolocation';

export interface OrderTrackingProps {
  orderId?: string;
  order?: Order | null;
  onBack?: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId: propOrderId, order: initialOrder, onBack }) => {
  const navigate = useNavigate();
  const { order_id } = useParams<{ order_id: string }>();
  
  // 🦅 استخدام النوع السيادي مباشرة (تم معالجة المشاكل في قاعدة البيانات)
  const [liveOrder, setLiveOrder] = useState<any | null>(initialOrder || null);
  const activeOrderId = liveOrder?.id || propOrderId || order_id || '';
  const [loading, setLoading] = useState<boolean>(!initialOrder && !!activeOrderId);
  const [copied, setCopied] = useState(false);
  const { coords: userRealCoords } = useGeolocation(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!activeOrderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('orders').select('*').eq('id', activeOrderId).single();
      if (!error && data) setLiveOrder(data);
      setLoading(false);
    };

    if (!initialOrder) fetchOrderDetails();

    const orderSubscription = supabase
      .channel(`public:orders:id=eq.${activeOrderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${activeOrderId}` }, 
        (payload: any) => setLiveOrder((prev: any) => ({ ...prev, ...(payload.new) }))
      ).subscribe();

    return () => { supabase.removeChannel(orderSubscription); };
  }, [activeOrderId, initialOrder]);

  const handleBack = () => {
    if (onBack) return onBack();
    navigate('/', { replace: true });
  };

  const pinCode = useMemo(() => {
    const rawPin = liveOrder?.verification_code || liveOrder?.pin_code;
    if (rawPin && String(rawPin).trim().length >= 4) return String(rawPin).trim();
    return activeOrderId ? activeOrderId.slice(-4).toUpperCase() : '4540';
  }, [liveOrder, activeOrderId]);

  const orderStatus = liveOrder?.status || 'pending';
  const isDelivered = orderStatus === 'delivered';

  const pLat = Number(liveOrder?.pickup_lat || 36.8065);
  const pLng = Number(liveOrder?.pickup_lng || 10.1815);
  const cLat = userRealCoords?.latitude || Number(liveOrder?.delivery_lat || 36.8188);
  const cLng = userRealCoords?.longitude || Number(liveOrder?.delivery_lng || 10.1658);

  const partnerLoc = useMemo(() => ({ lat: pLat, lng: pLng }), [pLat, pLng]);
  const clientLoc = useMemo(() => ({ lat: cLat, lng: cLng }), [cLat, cLng]);

  const handleCopyPin = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(30);
    navigator.clipboard.writeText(pinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStory = useMemo(() => {
    switch (orderStatus) {
      case 'pending': return { title: 'Commande validée', subtitle: 'Transmission sécurisée (تم التأكيد)' };
      case 'preparing': return { title: 'Préparation en cours', subtitle: 'Le chef prépare votre commande (جاري التحضير)' };
      case 'on_way': return { title: 'En route vers vous', subtitle: 'Votre coursier est en déplacement (في الطريق)' };
      case 'delivered': return { title: 'Commande livrée', subtitle: 'Bon appétit ! (صحة وبالشفاء)' };
      default: return { title: 'Traitement en cours', subtitle: 'Synchronisation logistique (جاري المعالجة)' };
    }
  }, [orderStatus]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#FAF8F5] flex flex-col items-center justify-center space-y-4 w-full">
        <div className="w-12 h-12 border-[3px] border-gray-200 border-t-[#C1121F] rounded-full animate-spin mb-2" />
        <p className="text-[11px] font-black uppercase tracking-widest text-[#1C1917]">Synchronisation...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] bg-[#FAF8F5] font-sans antialiased pb-32 selection:bg-[#C1121F]/20">
      
      {/* 🦅 LIVE RADAR (THE MAP) */}
      <div className="relative h-[45dvh] w-full bg-gray-100 shadow-[inset_0_-20px_50px_rgba(0,0,0,0.05)]">
        <LiveOrderMap partnerLoc={partnerLoc} clientLoc={clientLoc} status={orderStatus} />
        
        <div className="absolute top-[env(safe-area-inset-top,16px)] left-4 z-10">
          <button onClick={handleBack} className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-xl text-[#1C1917] shadow-md border border-gray-100 flex items-center justify-center active:scale-90 transition-transform outline-none">
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="p-4 space-y-4 relative z-20 -mt-8">
          
          {/* 🦅 STATUS CARD */}
          <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-[20px] font-black text-[#1C1917] tracking-tight">{currentStory.title}</h2>
              <p className="text-[12px] font-bold text-gray-500 mt-1">{currentStory.subtitle}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
              {orderStatus === 'preparing' ? <UtensilsCrossed className="w-6 h-6 text-[#1C1917]" strokeWidth={2.5} /> : <Bike className="w-6 h-6 text-[#1C1917]" strokeWidth={2.5} />}
            </div>
          </div>

          {!isDelivered && (
            <div className="flex flex-col gap-4">
              
              {/* 🦅 SOVEREIGN PIN CARD */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-[24px] p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C1121F]" />
                
                <div className="flex items-center justify-between mb-4 pl-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                    <p className="text-[12px] font-black uppercase tracking-widest text-[#1C1917]">Code PIN Sécurisé</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pl-2">
                  <span className="text-[36px] font-black text-[#C1121F] tracking-[0.2em] font-mono leading-none drop-shadow-sm">
                    {pinCode}
                  </span>
                  
                  <button onClick={handleCopyPin} className="w-12 h-12 rounded-xl text-[#1C1917] bg-gray-50 border border-gray-200 shadow-sm active:scale-95 transition-all outline-none flex items-center justify-center">
                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2.5} /> : <Copy className="w-5 h-5" strokeWidth={2.5} />}
                  </button>
                </div>
                
                <p className="text-[12px] font-bold text-gray-500 leading-snug mt-5 pl-2">
                  Veuillez communiquer ce code PIN à votre coursier EAGLE TN lors de la réception.
                  <br/><span className="text-[11px] font-arabic mt-1 block">يرجى مد المندوب بهذا الرمز عند استلام طلبك.</span>
                </p>
              </div>

              {/* 🦅 FINANCIAL CARD */}
              {liveOrder && (
                <div className="bg-white p-5 rounded-[24px] border border-gray-200 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Banknote className="w-5 h-5 text-[#1C1917]" strokeWidth={2.5} />
                      <span className="text-[13px] font-black text-[#1C1917] uppercase tracking-wider">
                        À Payer (الدفع عند الاستلام)
                      </span>
                    </div>
                    <span className="text-[18px] font-black text-[#1C1917] tabular-nums tracking-tight bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
                      {Number(liveOrder.grand_total || liveOrder.total_amount || 0).toFixed(3)} DT
                    </span>
                  </div>

                  {liveOrder.change_needed_for && (
                    <div className="flex items-start gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" strokeWidth={3} />
                      <p className="text-[11px] font-black text-emerald-800 leading-snug">
                        Monnaie prévue par le coursier sur <strong className="text-emerald-900 font-mono text-[12px]">{liveOrder.change_needed_for} DT</strong>.
                        <br/><span className="font-arabic font-bold text-emerald-700 mt-1 block">تم إعلام المندوب بتوفير الصرف المناسب.</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OrderTracking;
