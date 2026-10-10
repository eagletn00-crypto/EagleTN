import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Copy,
  CheckCircle2,
  QrCode,
  Phone,
  MessageCircle,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  Star,
  Check,
  ThumbsUp,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Order } from '../../types/order';

export interface OrderTrackingProps {
  orderId?: string;
  order?: Order | null;
  onBack?: () => void;
  onBackToHome?: () => void;
  onContactSupport?: () => void;
  onOpenSupport?: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  order: initialOrder,
  onBack,
  onBackToHome,
  onContactSupport,
  onOpenSupport,
}) => {
  const [liveOrder, setLiveOrder] = useState<Order | null>(initialOrder || null);
  const [loading, setLoading] = useState<boolean>(!initialOrder && !!orderId);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [rated, setRated] = useState(false);

  const activeOrderId = liveOrder?.id || orderId || '';

  useEffect(() => {
    if (!activeOrderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*, driver:drivers(*), partner:partners(*)')
        .eq('id', activeOrderId)
        .single();

      if (!error && data) {
        setLiveOrder(data as Order);
      }
      setLoading(false);
    };

    if (!initialOrder) {
      fetchOrderDetails();
    }

    const orderSubscription = supabase
      .channel(`public:orders:id=eq.${activeOrderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${activeOrderId}` },
        (payload) => {
          setLiveOrder((prev) => ({ ...prev, ...payload.new } as Order));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, [activeOrderId, initialOrder]);

  const handleBack = onBackToHome || onBack || (() => window.history.back());
  const handleSupport = onOpenSupport || onContactSupport || (() => {});

  // دعم شامل لجميع مسميات حقل الـ PIN في قاعدة البيانات
  const pinCode = String(
    liveOrder?.pin_code || 
    liveOrder?.verification_code || 
    (liveOrder as any)?.pin || 
    '4540'
  );

  const orderNumber = liveOrder?.order_number || (liveOrder?.id ? `EAGLE-${liveOrder.id.slice(0, 6).toUpperCase()}` : 'EAGLE-TN');
  
  const subtotalHT = Number(liveOrder?.subtotal_ht || liveOrder?.subtotal || 0);
  const tvaAmount = Number(liveOrder?.tva_amount || (subtotalHT * 0.19));
  const timbreFiscal = Number(liveOrder?.timbre_fiscal || 1.000);
  const deliveryFee = Number(liveOrder?.delivery_fee || 2.000);
  const grandTotal = Number(liveOrder?.grand_total || liveOrder?.total_amount || (subtotalHT + tvaAmount + timbreFiscal + deliveryFee));

  const orderStatus = liveOrder?.status || 'pending';
  const isDelivered = orderStatus === 'delivered';

  const handleCopyPin = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
    navigator.clipboard.writeText(pinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { key: 'pending', label: 'Confirmée', completed: true },
    { key: 'preparing', label: 'Préparation', completed: ['preparing', 'on_way', 'delivered'].includes(orderStatus) },
    { key: 'on_way', label: 'En Route', completed: ['on_way', 'delivered'].includes(orderStatus), current: orderStatus === 'on_way' },
    { key: 'delivered', label: 'Livrée', completed: orderStatus === 'delivered', current: orderStatus === 'delivered' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
        <RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" />
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">EAGLE TN Engine...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FDFEFE] font-['Plus_Jakarta_Sans',sans-serif] antialiased max-w-md mx-auto border-x border-slate-200/60 shadow-2xl pb-32 selection:bg-emerald-500/10">
      
      {/* 1. MAP CONTAINER WITH ABSOLUTE NON-OVERLAPPING CONTROLS */}
      <div
        className={`transition-all duration-500 ease-out relative overflow-hidden ${
          isFullscreenMap
            ? 'fixed inset-0 z-50 h-[100dvh] w-full bg-white'
            : 'h-[250px] w-full bg-slate-100'
        }`}
      >
        <iframe
          title="Ultra Precise GPS Engine"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src="https://maps.google.com/maps?q=Tunis,Tunisia&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full grayscale-[0.05] contrast-[1.02] opacity-95"
        />

        {/* Top Floating Controls with Zero Overlap Architecture */}
        <div className="absolute top-4 inset-x-4 h-10 pointer-events-none z-10 flex items-center">
          <button
            type="button"
            onClick={handleBack}
            className="absolute left-0 w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 hover:bg-white flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl ring-1 ring-slate-900/5 shadow-xl shadow-slate-900/5 flex items-center gap-2 pointer-events-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 font-mono">
              {orderNumber}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreenMap(!isFullscreenMap)}
            className="absolute right-0 w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 hover:bg-white flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
          >
            {isFullscreenMap ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

        {!isDelivered && (
          <div className="absolute top-16 left-4 z-10">
            <div className="bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-xl shadow-lg ring-1 ring-slate-900/5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="text-[11px] font-black font-mono text-emerald-700">~15 min</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. MAIN PURE WHITE BODY */}
      {!isFullscreenMap && (
        <div className="p-4 space-y-3.5 relative z-20 -mt-3">

          {isDelivered ? (
            <div className="bg-white rounded-[28px] p-6 text-slate-900 text-center space-y-4 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/80">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-emerald-500/20">
                <Check className="w-6 h-6 text-emerald-600 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-base font-black text-slate-900 tracking-tight">Commande Livrée avec Succès !</h2>
                <p className="text-xs text-slate-500 font-medium">Conforme aux standards de certification EAGLE TN.</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Évaluer le service</p>
                <div className="flex justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setRating(star);
                        setRated(true);
                      }}
                      className="p-1 transition-transform active:scale-125"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
                {rated && (
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1 pt-1">
                    <ThumbsUp className="w-3.5 h-3.5" /> Évaluation enregistrée !
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleBack}
                className="w-full py-3 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all"
              >
                Retour à l'accueil
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[26px] p-4 ring-1 ring-slate-200/80 shadow-xl shadow-slate-900/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  EN COURS DE TRAITEMENT
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  Realtime Active
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {steps.map((step) => (
                  <div key={step.key} className="space-y-1.5 text-center">
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                          step.completed || step.current ? 'bg-emerald-600 shadow-sm shadow-emerald-600/30' : 'bg-slate-100'
                        }`}
                      />
                    </div>
                    <p className={`text-[10px] font-black tracking-tight ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[26px] p-3.5 ring-1 ring-slate-200/80 shadow-xl shadow-slate-900/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center text-emerald-700 font-black text-sm">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[8px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white flex items-center gap-0.5 shadow-sm">
                  <Star className="w-2 h-2 fill-slate-900" /> 4.9
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  {liveOrder?.driver?.full_name || liveOrder?.driver_name || 'Livreur EAGLE TN'}
                </h4>
                <p className="text-[10px] font-bold text-slate-400">Chauffeur Partenaire Certifié</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSupport}
                className="p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-90 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
              </button>
              <button
                type="button"
                onClick={handleSupport}
                className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 active:scale-90 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isDelivered && (
            <div className="bg-white rounded-[26px] p-4 ring-1 ring-slate-200/80 shadow-xl shadow-slate-900/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">VALIDATION DE RÉCEPTION</span>
                </div>
                
                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-extrabold hover:bg-slate-200 transition-all active:scale-95"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copié' : 'Copier'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded-2xl ring-1 ring-slate-200/60">
                <div className="flex gap-1.5">
                  {pinCode.padStart(4, '0').split('').map((char, i) => (
                    <span
                      key={i}
                      className="w-9 h-11 bg-white ring-1 ring-slate-200 rounded-xl flex items-center justify-center text-base font-black font-mono text-emerald-600 shadow-sm"
                    >
                      {char}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Afficher QR</span>
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-[26px] p-4.5 ring-1 ring-slate-200/80 shadow-xl shadow-slate-900/5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RÉCAPITULATIF FINANCIER & LÉGAL</h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Conforme</span>
            </div>
            
            <div className="space-y-2 text-slate-600 font-medium">
              <div className="flex justify-between">
                <span>Sous-total HT</span>
                <span className="font-bold font-mono text-slate-900">{subtotalHT.toFixed(3)} TND</span>
              </div>
              <div className="flex justify-between">
                <span>TVA (19%)</span>
                <span className="font-bold font-mono text-slate-900">{tvaAmount.toFixed(3)} TND</span>
              </div>
              <div className="flex justify-between">
                <span>Timbre Fiscal</span>
                <span className="font-bold font-mono text-slate-900">{timbreFiscal.toFixed(3)} TND</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison</span>
                <span className="font-bold font-mono text-slate-900">{deliveryFee.toFixed(3)} TND</span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Total Global TTC</span>
              <span className="text-emerald-600 font-mono text-base font-black">{grandTotal.toFixed(3)} TND</span>
            </div>
          </div>

        </div>
      )}

      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-white rounded-[32px] p-6 max-w-xs w-full space-y-4 text-center shadow-2xl">
            <h3 className="font-black text-base text-slate-900">QR Code de Réception</h3>
            <p className="text-xs text-slate-500">Présentez ce code au livreur EAGLE TN.</p>
            <div className="w-48 h-48 bg-slate-100 mx-auto rounded-2xl flex items-center justify-center border border-slate-200">
              <QrCode className="w-28 h-28 text-slate-800" />
            </div>
            <p className="text-xs font-mono font-black text-emerald-600 tracking-widest">{pinCode}</p>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl font-black text-xs active:scale-95 transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderTracking;
