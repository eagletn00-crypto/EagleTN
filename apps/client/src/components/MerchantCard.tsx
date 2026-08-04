import React, { useState } from 'react';
import { MapPin, Star, ShieldCheck, ArrowUpRight, Info } from 'lucide-react';

interface Merchant {
  id: string;
  name: string;
  category: string;
  address: string;
  distance_km: number;
  delivery_time_mins: number;
  rating: number;
  reviews_count: number;
  cover_image: string;
  is_available: boolean;
  legal_mf: string;
}

interface MerchantCardProps {
  merchant: Merchant;
  onClick: (id: string) => void;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({ merchant, onClick }) => {
  const [showMf, setShowMf] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80';
  
  const handleCardClick = () => {
    if (merchant?.is_available) {
      onClick(merchant.id);
    }
  };

  const handleMfToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMf(!showMf);
  };

  const safeName = merchant?.name || "Établissement Partenaire";
  const safeAddress = merchant?.address || "Tunis, Tunisie";
  const safeDistance = merchant?.distance_km !== undefined ? merchant.distance_km : 1.5;
  const safeRating = merchant?.rating !== undefined ? merchant.rating : 4.8;
  const safeReviews = merchant?.reviews_count !== undefined ? merchant.reviews_count : 120;
  const safeTime = merchant?.delivery_time_mins !== undefined ? merchant.delivery_time_mins : 25;
  const safeMf = merchant?.legal_mf || "MF-0000000/X/A/P/000";

  return (
    <div 
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border border-zinc-200/40 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col relative will-change-transform ${
        !merchant?.is_available ? 'opacity-75 grayscale-[20%] cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className="relative w-full h-52 overflow-hidden bg-zinc-100">
        <img 
          src={merchant?.cover_image || fallbackImage} 
          alt={safeName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-black tracking-wider px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-sm">
            <span className="w-1 h-1 rounded-full bg-rose-500" />
            {safeTime} MIN
          </span>

          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${merchant?.is_available ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
            <span className="text-[10px] font-black text-zinc-900 tracking-wide uppercase">
              {merchant?.is_available ? 'Disponibilité Immédiate' : 'Fermé'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between relative bg-white">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-black text-zinc-950 text-base tracking-tight leading-snug group-hover:text-rose-600 transition-colors duration-200 line-clamp-1">
              {safeName}
            </h3>
            <div className="pt-0.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-rose-500" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-700 font-bold mb-4 bg-zinc-50 border border-zinc-100 p-2.5 rounded-xl">
            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="truncate tracking-wide font-medium text-zinc-600">{safeAddress}</span>
            <span className="text-zinc-300 font-normal shrink-0">•</span>
            <span className="text-rose-600 font-black shrink-0 whitespace-nowrap">À {safeDistance} km</span>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-4 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
            </div>
            <span className="text-xs font-black text-zinc-900">{safeRating.toFixed(1)}</span>
            <span className="text-[10px] text-zinc-400 font-bold">({safeReviews} avis)</span>
          </div>

          <div className="relative">
            <button 
              onClick={handleMfToggle}
              className="text-[10px] text-zinc-400 hover:text-zinc-900 transition-colors duration-200 font-bold flex items-center gap-1 py-1 px-2 hover:bg-zinc-50 rounded-lg group/btn"
            >
              <Info className="w-3 h-3 text-zinc-400 group-hover/btn:text-zinc-600" />
              <span>Garantie Légale</span>
            </button>
            
            {showMf && (
              <div className="absolute bottom-full right-0 mb-2 bg-zinc-950 text-white text-[10px] p-3 rounded-xl shadow-2xl w-52 border border-zinc-800 z-30 leading-normal animate-fadeIn">
                <div className="flex items-center gap-1.5 text-zinc-400 font-bold mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Identifiant Unique (MF)</span>
                </div>
                <code className="block bg-zinc-900 p-2 rounded border border-zinc-800 text-rose-400 select-all font-mono font-medium text-center">
                  {safeMf}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantCard;
