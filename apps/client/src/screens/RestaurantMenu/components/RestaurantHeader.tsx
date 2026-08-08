import React from 'react';
import { ArrowLeft, Star, Heart, Search, Clock, MapPin } from 'lucide-react';

interface RestaurantHeaderProps {
  name: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  coverImage: string;
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
  name,
  rating,
  reviewCount,
  deliveryTime,
  coverImage,
  onBack,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative font-sans antialiased">
      {/* Cover Image & Overlay */}
      <div className="relative h-48 w-full overflow-hidden">
        <img src={coverImage} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

        {/* Top Floating Controls */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md text-slate-900 flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            <ArrowLeft size={18} />
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md text-rose-500 flex items-center justify-center shadow-md active:scale-95 transition-transform">
            <Heart size={18} className="fill-rose-500" />
          </button>
        </div>

        {/* Restaurant Badge Info overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white space-y-1">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black tracking-tight">{name}</h1>
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
              OUVERT
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-200 font-medium">
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Star size={13} className="fill-amber-400" /> {rating} ({reviewCount})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {deliveryTime}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Glass Search Input */}
      <div className="p-4 -mt-3 relative z-20">
        <div className="relative bg-white/85 backdrop-blur-md border border-white/90 rounded-2xl shadow-md overflow-hidden">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un plat, boisson... / ابحث عن طبق"
            className="w-full pl-10 pr-4 py-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
