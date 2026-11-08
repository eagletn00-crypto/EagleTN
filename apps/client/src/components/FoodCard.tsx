import React, { memo } from 'react';
import { Clock, Star, Banknote } from 'lucide-react';

export interface FoodCardProps {
  readonly id: string;
  readonly title: string;
  readonly partnerName: string;
  readonly priceDT: number;
  readonly rating: number;
  readonly deliveryEtaMinutes: number;
  readonly imageUrl: string;
  readonly isPopular?: boolean;
  readonly onClick: (id: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = memo(({
  id,
  title,
  partnerName,
  priceDT,
  rating,
  deliveryEtaMinutes,
  imageUrl,
  isPopular = false,
  onClick
}) => {
  return (
    <article className="@container w-full">
      <div
        onClick={() => onClick(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick(id)}
        className="group relative flex flex-col w-full bg-white border border-[#F1ECE4]/80 rounded-[28px] p-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.03)] transition-all duration-400 ease-out hover:shadow-[0_16px_40px_rgba(231,0,19,0.08)] hover:border-[#E70013]/20 active:scale-[0.97] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E70013] focus-visible:ring-offset-2 transform-gpu"
      >
        {/* Strict Geometry: 22px inner radius inside 28px outer radius with 10px (p-2.5) padding */}
        <div className="relative w-full aspect-[16/10] bg-[#F9F6F0] rounded-[22px] overflow-hidden isolate mb-3.5">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Logistics Dynamic Badge (Frosted Glass for Image Clarity) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.06)] z-10">
            <Clock className="w-3.5 h-3.5 text-slate-700" strokeWidth={2.5} />
            <span className="text-[10px] font-black tracking-tight text-slate-800 tabular-nums">
              {deliveryEtaMinutes} min
            </span>
          </div>

          {/* COD Indicator (Premium Styling) */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0F0F10]/75 backdrop-blur-xl border border-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] z-10">
            <Banknote className="w-3.5 h-3.5 text-[#E70013]" strokeWidth={2.5} />
            <span className="text-[9px] font-black tracking-wider uppercase mt-[1px]">COD</span>
          </div>

          {/* Popular Tag (Tunisian Red Accent) */}
          {isPopular && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#E70013] text-white text-[9px] font-black uppercase tracking-widest shadow-[0_4px_12px_rgba(231,0,19,0.3)] z-10 border border-[#E70013]/50">
              Top Vente
            </div>
          )}
        </div>

        {/* Content Hierarchy */}
        <div className="flex flex-col px-1.5 gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0 gap-0.5">
              <h4 className="text-[16px] font-black tracking-tight text-slate-900 truncate group-hover:text-[#E70013] transition-colors duration-300 leading-tight">
                {title}
              </h4>
              <p className="text-[12px] font-bold text-slate-500 truncate">
                {partnerName}
              </p>
            </div>

            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F9F6F0] border border-[#F1ECE4]/80 shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#FACC15] text-[#FACC15]" />
              <span className="text-[11px] font-black text-slate-800 tabular-nums mt-[1px]">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Fiscal Baseline */}
          <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-100/80">
            <span className="text-[9px] font-black tracking-[0.1em] text-slate-400 uppercase">
              Espèces à la livraison
            </span>
            <span className="text-[15px] font-black tracking-tight text-[#E70013]">
              <span className="tabular-nums">{priceDT.toFixed(3)}</span> <span className="text-[11px] font-bold text-slate-500 ml-0.5">DT</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
});

FoodCard.displayName = 'FoodCard';
export default FoodCard;
