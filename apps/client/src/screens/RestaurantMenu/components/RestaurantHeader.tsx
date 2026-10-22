import React, { memo } from 'react';
import { ArrowLeft, Star, Clock, Phone, Share2, Crown, Bike } from 'lucide-react';

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

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = memo(({
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
    <div className="relative w-full bg-[#F8FAFC] font-sans selection:bg-emerald-500 selection:text-white">
      {/* Immersive Cover Image */}
      <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
        <img
          src={coverUrl}
          alt={`Couverture de ${name}`}
          loading="eager"
          className="w-full h-full object-cover opacity-80"
        />
        {/* Advanced Vignette Gradient: Fades perfectly into the #F8FAFC app background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/10 to-[#F8FAFC]" />
        
        {/* Dynamic Glass Navigation Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <button
            onClick={onBack}
            type="button"
            aria-label="Retour"
            className="w-11 h-11 rounded-[18px] bg-white/20 backdrop-blur-xl text-white border border-white/30 shadow-lg flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onShare}
              type="button"
              aria-label="Partager l'établissement"
              className="w-11 h-11 rounded-[18px] bg-white/20 backdrop-blur-xl text-white border border-white/30 shadow-lg flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50"
            >
              <Share2 className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={onCall}
              type="button"
              aria-label="Appeler le restaurant"
              className="w-11 h-11 rounded-[18px] bg-emerald-500/80 backdrop-blur-xl text-white border border-emerald-400/50 shadow-lg shadow-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 active:scale-95 transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50"
            >
              <Phone className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Info Card */}
      <div className="px-4 -mt-20 relative z-30 pb-4">
        <div className="bg-white/80 backdrop-blur-3xl rounded-[32px] p-5 border border-white/60 shadow-[0_20px_40px_rgb(0,0,0,0.06)] space-y-4 animate-in slide-in-from-bottom-4 duration-500 ease-out">

          {/* Top Row: Floating Avatar + Primary Badges */}
          <div className="flex items-start justify-between gap-4">
            {/* Ultra-Premium Avatar */}
            <div className="w-20 h-20 rounded-[22px] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-[3px] border-white flex-none -mt-10 ring-1 ring-slate-100 relative group">
              <img
                src={logoUrl}
                alt={`Logo de ${name}`}
                loading="eager"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 flex-1 pt-1">
              {badge && (
                <span className="bg-emerald-50 border border-emerald-100/80 text-emerald-600 text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1.5 rounded-[14px] flex items-center gap-1.5 shadow-sm">
                  <Crown className="w-3 h-3 stroke-[2.5]" />
                  <span>{badge}</span>
                </span>
              )}
              <div className="flex items-center gap-1.5 bg-white border border-amber-200/60 shadow-sm px-2.5 py-1.5 rounded-[14px] text-[12px] font-black text-slate-900">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{rating.toFixed(1)}</span>
                <span className="text-slate-400 font-bold text-[10px]">({reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Typography / Titles */}
          <div className="space-y-1">
            <h1 className="text-[22px] font-black tracking-tighter text-slate-900 leading-none uppercase line-clamp-2">
              {name}
            </h1>
            {nameAr && (
              <p className="text-[14px] font-bold text-slate-500 tracking-tight" dir="rtl" lang="ar">
                {nameAr}
              </p>
            )}
          </div>

          {/* Operational Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100/80">
            <div className="flex items-center gap-2">
              {/* Delivery Time Pill */}
              <div className="bg-slate-50 px-3 py-2 rounded-[16px] border border-slate-100 flex items-center gap-2 text-[11px] font-extrabold text-slate-700 shadow-sm">
                <Clock className="w-3.5 h-3.5 stroke-[2.5] text-emerald-500" />
                <span>{deliveryTime}</span>
              </div>

              {/* Delivery Fee Pill */}
              <div className="bg-slate-50 px-3 py-2 rounded-[16px] border border-slate-100 flex items-center gap-2 text-[11px] font-extrabold text-slate-700 shadow-sm">
                <Bike className="w-3.5 h-3.5 stroke-[2.5] text-slate-400" />
                <span>{deliveryFee}</span>
              </div>
            </div>

            {/* Status Indicator */}
            <div 
              className={`flex items-center gap-2 px-3 py-2 rounded-[16px] border text-[10px] font-black uppercase tracking-widest shadow-sm transition-colors duration-300 ${
                isOpen
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                {isOpen && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </span>
              <span>{isOpen ? 'OUVERT' : 'FERMÉ'}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

RestaurantHeader.displayName = 'RestaurantHeader';

export default RestaurantHeader;
