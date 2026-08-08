import React, { useState } from 'react';
import { Partner } from '../types';

export interface PartnerCardProps {
  partner: Partner;
  onClick?: () => void;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const fallbackImg = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800";

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white/75 rounded-[24px] p-2.5 border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden space-y-2.5 active:scale-[0.99]"
    >
      {/* Cover Image & Overlay Badges */}
      <div className="relative h-44 w-full rounded-[18px] overflow-hidden bg-slate-100">
        <img 
          src={imgError ? fallbackImg : (partner.image || partner.cover_url || fallbackImg)} 
          alt={partner.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
        
        {/* Royal Badge */}
        {partner.tag && (
          <span className="absolute top-2.5 left-2.5 bg-slate-900/90 text-amber-400 text-[9.5px] font-black tracking-wider px-2.5 py-1 rounded-full border border-white/10 shadow-xs font-['Plus_Jakarta_Sans']">
            👑 {partner.tag}
          </span>
        )}

        {/* Rating Glass Badge */}
        {partner.rating && (
          <span className="absolute top-2.5 right-2.5 bg-white/90 text-slate-900 text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs font-['Plus_Jakarta_Sans']">
            ⭐ {partner.rating} <span className="text-slate-400 font-normal text-[9px]">({partner.reviewsCount ?? 0})</span>
          </span>
        )}

        {/* Overlay Title */}
        <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-end gap-2">
          <h3 className="text-sm font-black text-white tracking-tight leading-tight drop-shadow-sm font-['Plus_Jakarta_Sans'] line-clamp-1">
            {partner.name_fr || partner.name}
          </h3>
          <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs font-['Plus_Jakarta_Sans'] shrink-0">
            {partner.isOpen ?? true ? 'OUVERT' : 'FERMÉ'}
          </span>
        </div>
      </div>

      {/* Logistics Capsules with Font-Black Metrics Hierarchy */}
      <div className="flex items-center justify-between px-0.5 font-['Plus_Jakarta_Sans']">
        {/* Time Capsule */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-slate-700">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="12 8v4l3 3m6-3a9 9 0 11-18 0 9 7 0 0118 0z" />
          </svg>
          <span className="text-xs font-black text-slate-900">20-30</span>
          <span className="text-[10px] font-bold text-slate-400">min</span>
        </div>

        {/* Dynamic Surge/Price Capsule */}
        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-xl text-amber-950">
          <span className="text-xs font-black text-slate-900">2.000</span>
          <span className="text-[10px] font-bold text-amber-800">DT</span>
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;
