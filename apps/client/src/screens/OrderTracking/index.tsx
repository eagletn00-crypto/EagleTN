import React, { useEffect, useState } from 'react';
import { Phone, ShieldCheck, CheckCircle2, Clock, Navigation, Check, ArrowLeft, QrCode, Heart, MapPin, ExternalLink, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Order } from '../../types/order';

interface OrderTrackingProps {
  order?: Order;
  onBackToHome: () => void;
  onOpenSupport: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  order: initialOrder,
  onBackToHome,
  onOpenSupport,
}) => {
  const defaultOrder: Order = {
    id: `EAGLE-${Math.floor(100000 + Math.random() * 900000)}`,
    customer_id: 'cust-field',
    partner_id: 'partner-om-ali',
    items: [],
    subtotal: 18.500,
    delivery_fee: 2.500,
    tax_amount: 0,
    total_amount: 21.000,
    payment_method: 'COD',
    payment_status: 'PENDING',
    status: 'delivering',
    delivery_address: 'Avenue Habib Bourguiba, Tunis',
    verification_pin: '8840',
    qr_code_data: 'EAGLE-TN-8840',
    created_at: new Date().toISOString()
  };

  const [orderState, setOrderState] = useState<Order>(initialOrder || defaultOrder);

  useEffect(() => {
    if (initialOrder) {
      setOrderState(initialOrder);
    }
  }, [initialOrder]);

  // Realtime Supabase Sync
  useEffect(() => {
    if (!orderState?.id) return;

    const subscription = supabase
      .channel(`order-status-${orderState.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderState.id}`,
        },
        (payload) => {
          if (payload.new && payload.new.status) {
            setOrderState((prev) => ({
              ...prev,
              status: payload.new.status,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [orderState?.id]);

  const getStatusStep = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
      case 'delivering':
        return 3;
      case 'completed':
        return 4;
      case 'pending':
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep(orderState?.status);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 dir-ltr selection:bg-emerald-500 selection:text-white font-sans">
      {/* 🗺️ Map-First UX Banner (Silver/Light Styled Simulation) */}
      <div className="relative h-72 w-full bg-slate-200 overflow-hidden flex flex-col justify-between p-4 border-b border-slate-200/80 shadow-sm">
        {/* Subtle Map Tile Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-transparent to-slate-900/30" />

        {/* Top Header */}
        <div className="relative z-10 flex justify-between items-center">
          <button
            onClick={onBackToHome}
            className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-center text-slate-800 hover:bg-white active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-emerald-800 px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-sm text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Suivi de votre commande</span>
          </div>
        </div>

        {/* Live Location Dynamic Marker Card */}
        <div className="relative z-10 my-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/95 border border-slate-200/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl text-slate-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              🛵
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-slate-900">Votre coursier, Sami, est en route</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Arrivée estimée dans 12 - 18 min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ultra-Premium Container */}
      <div className="max-w-md mx-auto px-4 -mt-10 relative z-20 space-y-4">
        {/* 🛵 Micro-Context Card: Coursier Info with Masked Phone */}
        <div className="bg-white p-4 rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-xl flex items-center justify-center border border-emerald-100">
              🦅
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Sami Ben Ahmed</h4>
              <p className="text-[11px] text-slate-400 font-mono">Coursier Certifié • Honda TN-8840</p>
            </div>
          </div>

          {/* Secure Call Button (Capsule Shape) */}
          <button
            onClick={onOpenSupport}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-full shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all text-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Appeler</span>
          </button>
        </div>

        {/* 🔐 Code de Sécurité & Validation Card */}
        <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700">Code de Sécurité & Validation</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              À transmettre au coursier
            </span>
          </div>

          <div className="flex items-center justify-around bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Code PIN</div>
              <div className="text-2xl font-black text-emerald-600 font-mono tracking-widest">{orderState?.verification_pin || '8840'}</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">N° Commande</div>
              <div className="text-xs font-bold text-slate-800 font-mono mt-1">{orderState?.id}</div>
            </div>
          </div>
        </div>

        {/* 📈 Dynamic Timeline (Line Stepper) */}
        <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4">
          <h3 className="text-xs font-black text-slate-900 tracking-tight">Avancement de la livraison</h3>

          {/* Stepper Steps */}
          <div className="space-y-4 relative pl-2">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Commande acceptée ✅</h5>
                <p className="text-[11px] text-slate-400">Le partenaire a validé votre commande</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">En préparation 👨‍🍳</h5>
                <p className="text-[11px] text-slate-400">Le chef prépare actuellement votre repas</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${currentStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Votre coursier se dirige vers le restaurant 🛵</h5>
                <p className="text-[11px] text-slate-400">Récupération de votre commande en cours</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${currentStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Votre coursier est proche • Restez joignable 📞</h5>
                <p className="text-[11px] text-emerald-700 font-medium">Merci de garder votre téléphone à proximité</p>
              </div>
            </div>
          </div>
        </div>

        {/* 💖 Thank you Note */}
        <div className="bg-emerald-50/60 border border-emerald-200/50 p-4 rounded-2xl text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900">
            <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>Merci de votre confiance !</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            L'équipe Eagle TN vous remercie. Bon appétit et à très bientôt !
          </p>
        </div>

        {/* ⚖️ Legal & Privacy Compliance */}
        <div className="text-center space-y-1 pt-2 pb-6">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conformité & Sécurité des Transports • Eagle TN System 2026</span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-2">
            <button onClick={onOpenSupport} className="underline hover:text-slate-600">Mentions Légales</button>
            <span>•</span>
            <button onClick={onOpenSupport} className="underline hover:text-slate-600">CGU & Protection des Données</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
