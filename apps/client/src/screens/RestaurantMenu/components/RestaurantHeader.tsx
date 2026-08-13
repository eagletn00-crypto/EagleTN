import React, { useState } from 'react';
import { RestaurantPartner } from '../types';

interface RestaurantHeaderProps {
  restaurant: RestaurantPartner | null;
  onBack?: () => void;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant, onBack }) => {
  const [showRatingTooltip, setShowRatingTooltip] = useState(false);

  const name = restaurant?.name_fr || restaurant?.name || 'Chez Am Ali';
  const tagLine = restaurant?.name_ar || 'البنة التونسية الأصيلة';
  const coverUrl = restaurant?.cover_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80';

  return (
    <div className="relative w-full bg-[#faf8f5]">
      {/* 1. الغلاف الذكي المحرر عمودياً */}
      <div className="relative h-60 w-full overflow-hidden">
        <img src={coverUrl} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {/* أعلى اليسار: زر العودة الزجاجي */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/20 text-white font-bold text-xs border border-white/20 shadow-md active:scale-95 transition-transform"
          >
            <span>←</span>
            <span>Accueil</span>
          </button>
        </div>

        {/* أعلى اليمين: زر التقييم والـ Tooltip المنبثق للمصداقية */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowRatingTooltip(!showRatingTooltip)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/20 text-white border border-white/20 shadow-md text-xs font-black active:scale-95 transition-transform"
          >
            <span className="text-rose-500">❤️</span>
            <span>{restaurant?.rating || '4.9'}</span>
            <span className="text-white/70 font-normal text-[10px]">(120+)</span>
          </button>

          {/* 4. التفصيلة الخفية: Tooltip التقييم والمصداقية */}
          {showRatingTooltip && (
            <div className="absolute right-0 mt-2 w-56 p-3 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl shadow-2xl text-white text-xs z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="font-bold text-emerald-400 mb-1 flex items-center justify-between">
                <span>Avis Clients</span>
                <span className="text-[10px] text-zinc-400">En direct</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-zinc-200">
                <div className="flex items-center gap-1.5">
                  <span>👍</span>
                  <span className="font-semibold text-emerald-300">95%</span>
                  <span className="text-zinc-400">Gout & Propreté</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>👎</span>
                  <span className="font-semibold text-rose-400">5%</span>
                  <span className="text-zinc-400">Retard aux heures de pointe</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* أسفل الغلاف: دمج المعلومات الهندسية واسم المطعم بالأخضر الزمردي */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex flex-col justify-end gap-1">
          <div className="flex items-center justify-between">
            {/* 2. اسم المطعم بالأخضر التونسي الحيوي */}
            <h1 className="text-2xl font-black text-emerald-400 tracking-wide drop-shadow-md">
              {name}
            </h1>

            {/* حالة المطعم */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ouvert</span>
            </div>
          </div>

          {/* 1. التحرير العمودي: دمج شريط المعلومات في السطر الأخير من الـ Cover */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-white/90 drop-shadow">
            <span>🛵 {restaurant?.delivery_fee ? `${Number(restaurant.delivery_fee).toFixed(3)}` : '2.500'} DT</span>
            <span className="text-white/40">•</span>
            <span>🕒 11:00 - 22:00</span>
            <span className="text-white/40">•</span>
            <span className="truncate">📍 Cité Khaldoun</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
