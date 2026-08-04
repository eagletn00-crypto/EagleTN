import React from 'react';
import { DeliveryOrder } from '../types/order';
import { PhoneCall, Navigation2, CheckCheck, ArrowRight, AlertTriangle } from 'lucide-react';

interface Props {
  order: DeliveryOrder;
  onStartTrip: (id: string) => void;
  onOpenConfirmModal: (order: DeliveryOrder) => void;
  onOpenIssueModal: (order: DeliveryOrder) => void;
  onOpenNavigation: (lat: number, lng: number) => void;
}

export const OrderCard: React.FC<Props> = ({ 
  order, onStartTrip, onOpenConfirmModal, onOpenIssueModal, onOpenNavigation 
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-lg shadow-slate-200/60 space-y-4 relative">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase block">COMMANDE</span>
          <span className="text-lg font-black text-slate-950">
            {order.order_code} <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md">#{order.short_code}</span>
          </span>
        </div>

        <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${
          order.status === 'EN_ROUTE' 
            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
            : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          {order.status === 'EN_ROUTE' ? '🚙 En Route' : '⏳ En Préparation'}
        </span>
      </div>

      <div className="space-y-2.5 bg-slate-50/80 rounded-2xl p-3 border border-slate-100 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Restaurant</span>
            <p className="font-extrabold text-slate-900">🏪 {order.restaurant_name}</p>
          </div>
          <a href={`tel:${order.restaurant_phone}`} className="p-2 bg-white text-emerald-600 rounded-xl border border-slate-200 shadow-sm font-black flex items-center gap-1 active:scale-95">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Appeler</span>
          </a>
        </div>

        <div className="border-t border-slate-200/60 pt-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Client & Adresse</span>
            <p className="font-extrabold text-slate-900">👤 {order.customer_name}</p>
            <p className="text-[11px] text-slate-600 font-semibold">{order.customer_address}</p>
          </div>
          <a href={`tel:${order.customer_phone}`} className="p-2 bg-white text-emerald-600 rounded-xl border border-slate-200 shadow-sm font-black flex items-center gap-1 active:scale-95">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Appeler</span>
          </a>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-3.5 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-400">Frais Livraison (Gain):</span>
          <span className="font-black text-amber-400 text-sm">+{order.delivery_fee.toFixed(3)} DT</span>
        </div>
        <div className="flex justify-between items-center text-sm border-t border-slate-800 pt-2">
          <span className="font-black text-white">À Collecter (Cash):</span>
          <span className="font-black text-emerald-400 text-xl tracking-tight">{order.order_value.toFixed(3)} DT</span>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <button 
          onClick={() => onOpenNavigation(order.lat, order.lng)}
          className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-900 font-black rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all"
        >
          <Navigation2 className="w-4 h-4 text-red-600 fill-red-600" />
          <span>🗺️ OUVRIR DANS GOOGLE MAPS</span>
        </button>

        {order.status === 'EN_ROUTE' ? (
          <button 
            onClick={() => onOpenConfirmModal(order)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all"
          >
            <CheckCheck className="w-5 h-5" />
            <span>✅ CONFIRMER LIVRAISON</span>
          </button>
        ) : (
          <button 
            onClick={() => onStartTrip(order.id)}
            className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all"
          >
            <ArrowRight className="w-5 h-5" />
            <span>🚀 COMMENCER COURSE</span>
          </button>
        )}

        <button 
          onClick={() => onOpenIssueModal(order)}
          className="w-full py-2 text-slate-400 hover:text-slate-600 font-bold text-[11px] flex items-center justify-center gap-1 pt-1"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Signaler un problème sur cette commande</span>
        </button>
      </div>
    </div>
  );
};
