import React from 'react';
import { Star, Clock, Bike } from 'lucide-react';

interface RestaurantCardProps {
  name: string;
  image: string;
  tag?: string;
  rating?: number;
  reviewCount?: number;
  deliveryTime?: string;
  deliveryFee?: string;
  isOpen?: boolean;
  onClick?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  image,
  tag = 'ROI DU HERGMA',
  rating = 4.9,
  reviewCount = 142,
  deliveryTime = '20-30 min',
  deliveryFee = '2.000 DT',
  isOpen = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative w-full bg-slate-900 rounded-[28px] overflow-hidden shadow-lg border border-slate-200/50 cursor-pointer select-none my-3"
    >
      {/* Container Image */}
      <div className="relative w-full h-56 bg-slate-950">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Custom Red Crown Badge (Replaced Orange with Red) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#E70013] text-white shadow-md">
            <span className="text-xs">👑</span>
            <span className="text-[11px] font-black uppercase tracking-wide">
              {tag}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md text-slate-900 shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-none" />
            <span className="text-xs font-black">{rating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-500 font-bold">({reviewCount})</span>
          </div>
        </div>

        {/* Floating Bottom Info Pill (Exact match to screenshot 3) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md text-slate-900 text-xs font-black">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>{deliveryTime}</span>
          </div>

          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md text-slate-900 text-xs font-black">
            <Bike className="w-3.5 h-3.5 text-slate-600" />
            <span>{deliveryFee}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-md text-xs font-black text-white ${
            isOpen ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{isOpen ? 'OUVERT' : 'FERMÉ'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
