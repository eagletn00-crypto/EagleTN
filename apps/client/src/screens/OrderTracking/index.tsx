import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Copy,
  CheckCircle2,
  QrCode,
  Phone,
  MessageCircle,
  Headphones,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  X,
  UserCheck,
  Star,
  Check,
  ThumbsUp,
  MapPin,
  RefreshCw,
  Home,
  Search,
  ShoppingBag,
  User
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

  const pinCode = String(liveOrder?.pin_code || liveOrder?.pin || '4540');
  const orderNumber = liveOrder?.order_number || (liveOrder?.id ? `EAGLE-${liveOrder.id.slice(0, 6).toUpperCase()}` : 'EAGLE-59');
  const subtotal = Number(liveOrder?.subtotal || liveOrder?.items_total || 65.000);
  const deliveryFee = Number(liveOrder?.delivery_fee || 2.000);
  const totalAmount = subtotal + deliveryFee;
  const deliveryAddress = liveOrder?.delivery_address || liveOrder?.address || 'Avenue Habib Bourguiba, Tunis';
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
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">EAGLE TN Live Engine...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] antialiased max-w-md mx-auto border-x border-slate-200/50 shadow-2xl pb-24 selection:bg-emerald-500/10">
      
      {/* 1. ULTRA MAP CONTAINER WITH GLASS OVERLAYS */}
      <div 
        className={`transition-all duration-500 ease-out relative overflow-hidden ${
          isFullscreenMap 
            ? 'fixed inset-0 z-50 h-[100dvh] w-full bg-slate-100' 
            : 'h-[270px] w-full bg-slate-100'
        }`}
      >
        <iframe
          title="Ultra Precise GPS Engine"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src="https://maps.google.com/maps?q=Tunis,Tunisia&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full grayscale-[0.08] contrast-[1.03] opacity-95 pointer-events-auto filter scale-105"
        />

        {/* Floating Glass Bar */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-auto">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md text-slate-800 shadow-xl shadow-slate-900/5 ring-1 ring-black/5 hover:bg-white flex items-center justify-center active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl ring-1 ring-black/5 shadow-xl shadow-slate-900/5 flex items-center gap-2">
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
            className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md text-slate-800 shadow-xl shadow-slate-900/5 ring-1 ring-black/5 hover:bg-white flex items-center justify-center active:scale-95 transition-all"
          >
            {isFullscreenMap ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Minimal Floating ETA Badge */}
        {!isDelivered && (
          <div className="absolute top-16 left-4 z-10 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-xl shadow-lg shadow-slate-900/5 ring-1 ring-black/5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="text-[11px] font-black font-mono text-emerald-700">~15 min</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. MAIN ULTRA-PREMIUM BODY CONTENT */}
      {!isFullscreenMap && (
        <div className="p-4 space-y-3 relative z-20 -mt-3">

          {/* SUCCESS BANNER */}
          {isDelivered ? (
            <div className="bg-white rounded-[28px] p-6 text-slate-900 text-center space-y-4 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-emerald-500/20">
                <Check className="w-6 h-6 text-emerald-600 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-base font-black text-slate-900 tracking-tight">Commande Livrée avec Succès !</h2>
                <p className="text-xs text-slate-500 font-medium">Merci pour votre confiance en EAGLE TN.</p>
              </div>

              {/* Rating Component */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Évaluer le livreur</p>
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
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
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
            /* ULTRA STEPPER PROGRESS */
            <div className="bg-white rounded-[26px] p-4 ring-1 ring-slate-200/70 shadow-xl shadow-slate-200/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  EN COURS
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  Mise à jour en direct
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

          {/* ULTRA COURIER CARD */}
          <div className="bg-white rounded-[26px] p-3.5 ring-1 ring-slate-200/70 shadow-xl shadow-slate-200/40 flex items-center justify-between">
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
                  {liveOrder?.driver?.full_name || 'Livreur EAGLE TN'}
                </h4>
                <p className="text-[10px] font-bold text-slate-400">Chauffeur Partenaire</p>
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

          {/* REFINED VALIDATION CODE CARD */}
          {!isDelivered && (
            <div className="bg-white rounded-[26px] p-4 ring-1 ring-slate-200/70 shadow-xl shadow-slate-200/40 space-y-3">
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

          {/* FINANCIAL RECAP & INTEGRATED ADDRESS */}
          <div className="bg-white rounded-[26px] p-4.5 ring-1 ring-slate-200/70 shadow-xl shadow-slate-200/40 space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RÉCAPITULATIF FINANCIER</h3>

            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-500">Sous-total</span>
                <span className="font-bold font-mono text-slate-900">{subtotal.toFixed(3)} TND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Frais de livraison</span>
                <span className="font-bold font-mono text-slate-900">{deliveryFee.toFixed(3)} TND</span>
              </div>
              <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Total à Payer</span>
                <span className="text-emerald-600 font-mono text-base font-black">{totalAmount.toFixed(3)} TND</span>
              </div>
            </div>

            {deliveryAddress && (
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700 truncate">{deliveryAddress}</span>
              </div>
            )}
          </div>

          {/* SUPPORT */}
          <div className="bg-white rounded-[26px] p-3.5 ring-1 ring-slate-200/70 shadow-xl shadow-slate-200/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black text-slate-900">Assistance Client EAGLE TN</span>
            </div>

            <button
              type="button"
              onClick={handleSupport}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-800 active:scale-95 transition-all"
            >
              Contact
            </button>
          </div>

        </div>
      )}

      {/* ULTRA QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-xs w-full text-center space-y-4 shadow-2xl ring-1 ring-white/20 relative animate-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pt-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">QR Code de Validation</h3>
              <p className="text-xs font-semibold text-slate-500">Scanner par le livreur à la réception</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-200/80 inline-block mx-auto shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(orderNumber + '-' + pinCode)}`}
                alt="Delivery Validation QR Code"
                className="w-52 h-52 rounded-xl mx-auto"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white text-xs font-black transition-all hover:bg-slate-800 shadow-lg active:scale-95"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* 3. ULTRA PREMIUM VECTOR BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-200/60 px-6 py-2.5 flex justify-between items-center z-40 shadow-2xl">
        <button type="button" onClick={handleBack} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-bold">Accueil</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-bold">Recherche</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-emerald-600 relative">
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-black">Commandes</span>
          <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
          <User className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-bold">Profil</span>
        </button>
      </div>

    </div>
  );
};

export default OrderTracking;
