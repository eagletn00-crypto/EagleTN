import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Bike } from 'lucide-react';
import SmartImage from './SmartImage';
// 🦅 الاستيراد السيادي المركزي (لا وجود لـ any بعد اليوم)
import { Restaurant } from '@eagletn/types';

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

const splitBilingual = (raw: string | undefined | null) => {
  const str = String(raw || '').trim();
  const match = str.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) return { primary: match[1].trim(), secondary: match[2].trim() };
  return { primary: str, secondary: null };
};

export const RestaurantCard: React.FC<RestaurantCardProps> = memo(({ restaurant, onClick }) => {
  // المعالجة الآمنة للبيانات
  const coverImg = restaurant.cover_url || restaurant.image_url;
  const isOpen = restaurant.is_open !== false;
  const fee = restaurant.delivery_fee || 0;
  const eta = restaurant.delivery_time || '20-30 min';
  const rating = Number(restaurant.rating || 0).toFixed(1);

  const rawNameFr = restaurant.name_fr || restaurant.name || '';
  const pNames = splitBilingual(rawNameFr);
  const parsedNameFr = pNames.primary;
  let parsedNameAr = restaurant.name_ar || pNames.secondary || '';

  if (parsedNameAr === 'عند عم على') parsedNameAr = 'عند عم علي';

  return (
    <motion.article
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="group w-full flex flex-col bg-white border border-gray-100 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer outline-none overflow-hidden transition-all duration-400 hover:border-[#C1121F]/20 hover:shadow-[0_8px_30px_-6px_rgba(193,18,31,0.12)]"
    >
      {/* 16:9 CINEMATIC COVER WITH GLASSMORPHISM */}
      <div className="relative w-full aspect-[16/9] bg-gray-50 overflow-hidden">
        <SmartImage
          src={coverImg || ''}
          alt={parsedNameFr}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ease-[cubic-bezier(0.16,1,0.3,1)] ${!isOpen ? 'grayscale-[50%] opacity-90' : ''}`}
        />
        
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-transparent to-transparent pointer-events-none" />

        {/* LIVE STATUS GLASS BADGE */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-white/50">
            {isOpen ? (
              <>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-700 mt-0.5">Ouvert</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                <span className="text-gray-500 mt-0.5">Fermé</span>
              </>
            )}
          </span>
        </div>

        {/* RATING FLOATING BADGE (Visual Weight Engineering) */}
        {Number(rating) > 0 && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-lg shadow-sm border border-white/50 flex items-center gap-1 z-10">
            <Star className="w-3.5 h-3.5 text-[#C1121F] fill-[#C1121F]" />
            <span className="text-[12px] font-black text-[#1C1917] mt-0.5">{rating}</span>
          </div>
        )}
      </div>

      {/* CARD BODY - ULTRA CLEAN UI */}
      <div className="p-4 bg-white relative z-10 flex flex-col w-full text-left">
        <div className="flex flex-col w-full min-w-0">
          <h3 className="text-[18px] font-black text-[#1C1917] leading-tight truncate">
            {parsedNameFr}
          </h3>
          {parsedNameAr && (
            <h4 dir="auto" className="text-[14px] font-bold text-gray-400 leading-tight mt-1 truncate w-full text-left">
              {parsedNameAr}
            </h4>
          )}
        </div>

        {/* METRICS - COMPRESSED ROW */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 w-full overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
            <span className="text-[12px] font-bold text-[#1C1917] mt-0.5">{eta}</span>
          </div>
          
          <div className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
          
          <div className="flex items-center gap-1.5 truncate">
            <Bike className={`w-4 h-4 shrink-0 ${fee === 0 ? 'text-emerald-500' : 'text-gray-400'}`} strokeWidth={2.5} />
            <span className={`text-[12px] font-bold mt-0.5 truncate ${fee === 0 ? 'text-emerald-600' : 'text-[#1C1917]'}`}>
              {fee === 0 ? 'Livraison offerte' : `${fee.toFixed(3)} DT`}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

RestaurantCard.displayName = 'RestaurantCard';
export default RestaurantCard;
