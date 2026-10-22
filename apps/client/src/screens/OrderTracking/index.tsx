import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Copy,
  CheckCircle2,
  Phone,
  MessageCircle,
  Maximize2,
  Minimize2,
  Sparkles,
  Star,
  RefreshCw,
  Headphones,
  MapPin,
  ExternalLink,
  Navigation,
  Flame,
  ChevronRight,
  Bike,
  UtensilsCrossed
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Order } from '../../types/order';
import LiveOrderMap from '../../components/LiveOrderMap';
import { useGeolocation } from '../../hooks/useGeolocation';

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
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [showQr, setShowQr] = useState(true);

  // استخدام الـ Hook النقي الجديد للـ GPS الميداني
  const { coords: userRealCoords } = useGeolocation(true);

  const activeOrderId = liveOrder?.id || orderId || '';

  // مزامنة لحظية حية مع جدول orders عبر Supabase Realtime
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
  const handleSupport = onOpenSupport || onContactSupport || (() => {
    window.location.href = 'tel:+21671000000';
  });

  const pinCode = useMemo(() => {
    const rawPin = (liveOrder as any)?.verification_code || (liveOrder as any)?.pin_code;
    if (rawPin && String(rawPin).trim().length >= 4) {
      return String(rawPin).trim();
    }
    return activeOrderId ? activeOrderId.slice(-4).toUpperCase() : '4540';
  }, [liveOrder, activeOrderId]);

  const orderNumber = liveOrder?.order_number || (liveOrder?.id ? `EAGLE-${liveOrder.id.slice(0, 6).toUpperCase()}` : 'EAGLE-TN');
  const orderStatus = liveOrder?.status || 'pending';
  const isDelivered = orderStatus === 'delivered';

  const partnerData = (liveOrder as any)?.partner;
  const driverData = (liveOrder as any)?.driver;

  // إحداثيات المطعم والعميل الميدانية المتوافقة مع PostGIS / Supabase
  const pLat = Number((liveOrder as any)?.pickup_lat || partnerData?.latitude || 36.8065);
  const pLng = Number((liveOrder as any)?.pickup_lng || partnerData?.longitude || 10.1815);

  const cLat = userRealCoords?.latitude || Number((liveOrder as any)?.delivery_lat || liveOrder?.delivery_latitude || 36.8188);
  const cLng = userRealCoords?.longitude || Number((liveOrder as any)?.delivery_lng || liveOrder?.delivery_longitude || 10.1658);

  const partnerLoc = useMemo(() => ({ lat: pLat, lng: pLng }), [pLat, pLng]);
  const clientLoc = useMemo(() => ({ lat: cLat, lng: cLng }), [cLat, cLng]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${pLat},${pLng}&destination=${cLat},${cLng}&travelmode=driving`;

  const qrData = JSON.stringify({
    order_id: activeOrderId,
    pin: pinCode,
    action: 'CONFIRM_DELIVERY'
  });
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}&color=059669&format=png`;

  const handleCopyPin = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
    navigator.clipboard.writeText(pinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStory = useMemo(() => {
    switch (orderStatus) {
      case 'pending':
        return { title: 'Commande validée', subtitle: 'Transmission sécurisée au partenaire' };
      case 'preparing':
        return { title: 'Préparation en cours', subtitle: 'Le chef prépare votre commande avec soin' };
      case 'on_way':
        return { title: 'En route vers vous', subtitle: 'Votre coursier est en déplacement' };
      case 'delivered':
        return { title: 'Commande livrée', subtitle: 'Bon appétit et merci de votre confiance !' };
      default:
        return { title: 'Traitement logistique', subtitle: 'Synchronisation en direct' };
    }
  }, [orderStatus]);

  const steps = [
    { key: 'pending', label: 'Validée', completed: true },
    { key: 'preparing', label: 'Cuisine', completed: ['preparing', 'on_way', 'delivered', 'accepted'].includes(orderStatus) },
    { key: 'on_way', label: 'En Route', completed: ['on_way', 'delivered'].includes(orderStatus), current: orderStatus === 'on_way' },
    { key: 'delivered', label: 'Livrée', completed: isDelivered, current: isDelivered },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
        <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Chargement de la mission...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] font-sans antialiased max-w-md mx-auto border-x border-slate-200/80 shadow-2xl pb-32 selection:bg-emerald-500/10">

      {/* الخريطة الحية Ultra-Premium */}
      <div
        className={`transition-all duration-500 ease-out relative overflow-hidden ${
          isFullscreenMap
            ? 'fixed inset-0 z-50 h-[100dvh] w-full bg-white'
            : 'h-[320px] w-full bg-slate-100 shadow-inner'
        }`}
      >
        <LiveOrderMap
          partnerLoc={partnerLoc}
          clientLoc={clientLoc}
          status={orderStatus}
        />

        {/* أزرار التحكم العائمة بتصميم Glassmorphism */}
        <div className="absolute top-4 inset-x-4 h-11 pointer-events-none z-10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-xl text-slate-800 shadow-lg shadow-slate-900/5 ring-1 ring-white/50 hover:bg-white flex items-center justify-center active:scale-95 transition-all pointer-events-auto cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-2xl ring-1 ring-white/50 shadow-lg shadow-slate-900/5 flex items-center gap-2 pointer-events-auto">
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
            className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-xl text-slate-800 shadow-lg shadow-slate-900/5 ring-1 ring-white/50 hover:bg-white flex items-center justify-center active:scale-95 transition-all pointer-events-auto cursor-pointer"
          >
            {isFullscreenMap ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-16 right-4 z-10 bg-white/90 backdrop-blur-xl text-slate-900 px-3.5 py-1.5 rounded-2xl shadow-lg ring-1 ring-white/50 flex items-center gap-1.5 text-[10px] font-extrabold hover:bg-white transition-all active:scale-95 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Google Maps</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        {!isDelivered && (
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-slate-900/90 backdrop-blur-xl text-white px-4 py-2.5 rounded-2xl shadow-xl ring-1 ring-white/10 flex items-center gap-3">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <div>
                <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Arrivée estimée</p>
                <p className="text-xs font-black font-mono text-emerald-400">
                  {liveOrder?.estimated_delivery_time ? `${liveOrder.estimated_delivery_time} min` : '~10-15 min'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isFullscreenMap && (
        <div className="p-4 space-y-4 relative z-25 -mt-4">

          {/* محرك السرد الذكي للانتظار */}
          <div className="bg-white rounded-[26px] p-4.5 ring-1 ring-slate-200/80 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs font-black text-slate-900">{currentStory.title}</h3>
                  <p className="text-[10px] font-medium text-slate-500">{currentStory.subtitle}</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Live
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {steps.map((step) => (
                <div key={step.key} className="space-y-1.5 text-center">
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                        step.completed || step.current ? 'bg-emerald-600' : 'bg-slate-100'
                      }`}
                    />
                  </div>
                  <p className={`text-[10px] font-extrabold tracking-tight ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* لوحة التحكم Segmented Control لـ QR Code / Code PIN */}
          {!isDelivered && (
            <div className="bg-white rounded-[26px] p-4.5 ring-1 ring-slate-200/80 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Sécurité & Validation</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl ring-1 ring-slate-200/50">
                  <button
                    type="button"
                    onClick={() => setShowQr(true)}
                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black transition-all duration-200 cursor-pointer ${
                      showQr ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQr(false)}
                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black transition-all duration-200 cursor-pointer ${
                      !showQr ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Code PIN
                  </button>
                </div>
              </div>

              {showQr ? (
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50/80 rounded-2xl ring-1 ring-slate-100 space-y-2">
                  <div className="bg-white p-3 rounded-2xl shadow-sm ring-1 ring-slate-200/60">
                    <img
                      src={qrApiUrl}
                      alt="Delivery QR Code"
                      className="w-36 h-36 object-contain"
                    />
                  </div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
                    Présentez ce QR Code au livreur lors de la réception
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-center gap-2 p-3 bg-slate-50/80 rounded-2xl ring-1 ring-slate-100">
                    <div className="flex gap-2">
                      {pinCode.split('').map((char, i) => (
                        <span
                          key={i}
                          className="w-10 h-12 bg-white ring-1 ring-slate-200/80 rounded-xl flex items-center justify-center text-lg font-black font-mono text-emerald-600 shadow-2xs"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCopyPin}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-[10px] font-extrabold transition-all active:scale-95 cursor-pointer"
                    >
                      {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Code copié !' : 'Copier le code PIN'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* مسار الخدمة المباشر */}
          <div className="bg-white rounded-[26px] p-4.5 ring-1 ring-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Itinéraire Logistique</h3>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase">Partenaire Cuisine (🧑‍🍳)</p>
                    <p className="text-xs font-black text-slate-900">{partnerData?.name || 'Restaurant Partenaire'}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{partnerData?.address || partnerData?.city || 'Tunis, Tunisie'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase">Destination Client</p>
                    <p className="text-xs font-black text-slate-900">{liveOrder?.delivery_address || 'Tunis, Tunisie'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* بيانات السائق الميداني */}
          <div className="bg-white rounded-[26px] p-4 ring-1 ring-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60 flex items-center justify-center font-black text-sm shadow-xs">
                  <Bike className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[8px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white flex items-center gap-0.5 shadow-xs">
                  <Star className="w-2 h-2 fill-slate-900" /> {driverData?.rating || '4.9'}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  {driverData?.full_name || (liveOrder as any)?.driver_name || 'Coursier EAGLE Express (🛵)'}
                </h4>
                <p className="text-[10px] font-bold text-slate-400">
                  {(liveOrder as any)?.driver_phone || driverData?.phone || '+216 20 000 000'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${(liveOrder as any)?.driver_phone || driverData?.phone || '+21620000000'}`}
                className="p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-90 transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
              </a>
              <button
                type="button"
                onClick={handleSupport}
                className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-90 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* شريط الدعم الفني */}
          <div className="bg-slate-900 rounded-[26px] p-4 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-slate-800 rounded-xl text-emerald-400">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black">Support Client 24/7</h4>
                <p className="text-[10px] text-slate-400 font-medium">Assistance dédiée EAGLE TN</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSupport}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Contact</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default OrderTracking;
