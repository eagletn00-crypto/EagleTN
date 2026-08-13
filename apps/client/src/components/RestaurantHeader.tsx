import React from 'react';
import { ArrowLeft, Heart, Star, Clock, MapPin } from 'lucide-react';

interface RestaurantHeaderProps {
  nameAr: string;
  nameFr: string;
  coverUrl: string;
  rating: number;
  prepTime: string;
  distance: string;
  onBack?: () => void;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
  nameAr,
  nameFr,
  coverUrl,
  rating,
  prepTime,
  distance,
  onBack,
}) => {
  return (
    <div className="relative w-full h-[280px] bg-slate-900 overflow-hidden select-none">
      {/* خلفية الغلاف الممتدة */}
      <img
        src={coverUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000'}
        alt={nameFr}
        className="w-full h-full object-cover object-center scale-105 transform transition-transform duration-700"
      />

      {/* التدرج الظلي الناعم Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

      {/* أزرار العودة والمفضلة العلوية الزجاجية */}
      <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* النصوص البيضاء الطافية السفليّة */}
      <div className="absolute bottom-6 inset-x-5 z-10 text-white space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
            ● Ouvert
          </span>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
          {nameAr} <span className="text-slate-300 font-normal text-lg">({nameFr})</span>
        </h1>

        {/* السطر اللوجستي الفخم */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-200">
          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <strong className="text-white">{rating}</strong> (120+)
          </span>
          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {prepTime}
          </span>
          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-slate-300" />
            {distance}
          </span>
        </div>
      </div>
    </div>
  );
};
