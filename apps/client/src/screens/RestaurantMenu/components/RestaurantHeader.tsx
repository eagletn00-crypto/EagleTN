import React from 'react';
import { ArrowLeft, Star, Clock, Phone, Share2 } from 'lucide-react';

export interface RestaurantHeaderProps {
  name?: string;
  nameAr?: string;
  rating?: number;
  reviewCount?: number;
  deliveryTime?: string;
  deliveryFee?: string;
  coverUrl?: string;
  logoUrl?: string;
  badge?: string;
  isOpen?: boolean;
  onBack?: () => void;
  onShare?: () => void;
  onCall?: () => void;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
  name = 'ROYAL HERGMA & GRILLADES',
  nameAr = 'رويال هرقمة ومشاوي',
  rating = 4.9,
  reviewCount = 142,
  deliveryTime = '20-30 min',
  deliveryFee = '2.000 DT',
  coverUrl = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  logoUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
  badge = 'ROI DU HERGMA',
  isOpen = true,
  onBack,
  onShare,
  onCall,
}) => {
  return (
    <div className="relative w-full bg-[#EAEAEA]">
      {/* Cover Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-200">
        <img
          src={coverUrl}
          alt={name}
          loading="eager"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#EAEAEA] via-slate-900/20 to-slate-900/40" />
      </div>

      {/* Top Floating Action Buttons */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          type="button"
          aria-label="Retour"
          className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md text-slate-900 border border-white/80 shadow-md flex items-center justify-center hover:bg-white active:scale-95 transition-all outline-none focus:ring-2 focus:ring-[#E70013]"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onShare}
            type="button"
            aria-label="Partager l'établissement"
            className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md text-slate-900 border border-white/80 shadow-md flex items-center justify-center hover:bg-white active:scale-95 transition-all outline-none focus:ring-2 focus:ring-[#E70013]"
          >
            <Share2 className="w-4 h-4 text-slate-800" />
          </button>
          <button
            onClick={onCall}
            type="button"
            aria-label="Appeler le restaurant"
            className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md text-slate-900 border border-white/80 shadow-md flex items-center justify-center hover:bg-white active:scale-95 transition-all outline-none focus:ring-2 focus:ring-[#E70013]"
          >
            <Phone className="w-4 h-4 text-slate-800" />
          </button>
        </div>
      </div>

      {/* Main Info Card with Overlapping Partner Logo */}
      <div className="px-4 -mt-12 relative z-10 pb-2">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 border border-white shadow-md space-y-3">
          
          {/* Header Top Row: Logo + Badge & Rating */}
          <div className="flex items-start justify-between gap-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white ring-4 ring-white shadow-md border border-slate-100 flex-none -mt-8">
              <img
                src={logoUrl}
                alt={name}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-1.5 flex-1 pt-0.5">
              {badge && (
                <span className="bg-[#E70013]/10 border border-[#E70013]/20 text-[#E70013] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <span aria-hidden="true">👑</span> {badge}
                </span>
              )}
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-xl text-xs font-black text-amber-900">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{rating.toFixed(1)}</span>
                <span className="text-slate-400 font-bold text-[10px]">({reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Partner Titles */}
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-tight uppercase line-clamp-2">
              {name}
            </h1>
            {nameAr && (
              <p className="text-xs font-bold text-slate-500 mt-0.5" dir="rtl">
                {nameAr}
              </p>
            )}
          </div>

          {/* Delivery Details & Operational Status */}
          <div className="flex items-center justify-between gap-2 text-[11px] font-extrabold text-slate-700 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200/60 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E70013]" />
                <span className="text-slate-800">{deliveryTime}</span>
              </div>

              <div className="bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200/60 text-slate-800 flex items-center gap-1">
                <span aria-hidden="true">🛵</span> {deliveryFee}
              </div>
            </div>

            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-black uppercase ${
              isOpen 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              <span 
                className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} 
                aria-hidden="true" 
              />
              <span>{isOpen ? 'OUVERT' : 'FERMÉ'}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
