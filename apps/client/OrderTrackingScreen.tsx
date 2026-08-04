import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Truck, ShoppingBag } from 'lucide-react';
import { useOrderRealtime } from './RestaurantMenu/hooks/useOrderRealtime';

interface OrderTrackingScreenProps {
  orderId: string;
  onBackToHome: () => void;
}

export function OrderTrackingScreen({ orderId, onBackToHome }: OrderTrackingScreenProps) {
  const [orderStatus, setOrderStatus] = useState<string>('pending');

  // الربط اللحظي عبر Supabase Realtime
  useOrderRealtime(orderId, (updatedOrder) => {
    if (updatedOrder && updatedOrder.status) {
      setOrderStatus(updatedOrder.status);
    }
  });

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'accepted':
      case 'in_preparation': return 2;
      case 'ready_for_pickup':
      case 'on_the_way': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(orderStatus);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <button
          onClick={onBackToHome}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 active:scale-90 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-black text-slate-900">Suivi de commande 🛵</h1>
          <p className="text-[10px] font-mono text-emerald-600 font-bold">#{orderId?.slice(0, 8).toUpperCase()}</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* LIVE STATUS CARD */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
            {currentStep === 1 && <Clock size={32} />}
            {currentStep === 2 && <ShoppingBag size={32} />}
            {currentStep === 3 && <Truck size={32} />}
            {currentStep === 4 && <CheckCircle2 size={32} />}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">
              {orderStatus === 'pending' && "Commande envoyée..."}
              {orderStatus === 'accepted' && "Commande acceptée par le partenaire"}
              {orderStatus === 'in_preparation' && "Préparation en cours..."}
              {orderStatus === 'ready_for_pickup' && "Commande prête, le livreur arrive"}
              {orderStatus === 'on_the_way' && "Livreur en route vers vous!"}
              {orderStatus === 'delivered' && "Commande livrée! Bon appétit 🎉"}
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              {currentStep < 4 ? "Mise à jour en temps réel via Supabase Realtime ⚡" : "Transaction terminée"}
            </p>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">État de la commande</h3>
          
          <div className="space-y-4 text-xs font-bold">
            <div className={`flex items-center gap-3 ${currentStep >= 1 ? 'text-emerald-600' : 'text-slate-300'}`}>
              <CheckCircle2 size={18} />
              <span>1. Reçue / En attente</span>
            </div>
            <div className={`flex items-center gap-3 ${currentStep >= 2 ? 'text-emerald-600' : 'text-slate-300'}`}>
              <CheckCircle2 size={18} />
              <span>2. Préparation chez le partenaire</span>
            </div>
            <div className={`flex items-center gap-3 ${currentStep >= 3 ? 'text-emerald-600' : 'text-slate-300'}`}>
              <CheckCircle2 size={18} />
              <span>3. En cours de livraison</span>
            </div>
            <div className={`flex items-center gap-3 ${currentStep >= 4 ? 'text-emerald-600' : 'text-slate-300'}`}>
              <CheckCircle2 size={18} />
              <span>4. Livrée</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTrackingScreen;
