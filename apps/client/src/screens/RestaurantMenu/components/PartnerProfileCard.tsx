import React from 'react';

interface Props {
  partner: any;
}

export const PartnerProfileCard: React.FC<Props> = ({ partner }) => {
  return (
    <div className="relative -mt-10 px-0 z-20">
      <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-5 border border-slate-200/80 shadow-xs space-y-3">
        
        {/* Title & Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            <h1 className="text-xl font-black text-slate-950 tracking-tight leading-snug truncate">
              {partner?.name || 'Chez Am Ali'}
            </h1>
            <p className="text-[11px] font-bold text-slate-500">
              Spécialités tunisiennes • Kafteji • Mlawi
            </p>
          </div>

          <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Ouvert
          </span>
        </div>

        {/* Unified French Logistics Row */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-black text-slate-700">
          <div className="flex items-center gap-1 text-slate-900">
            <span className="text-amber-500">⭐</span>
            <span>{partner?.rating || '4.9'}</span>
            <span className="text-slate-400 font-bold text-[10px]">(120+)</span>
          </div>

          <span className="text-slate-300">•</span>

          <div className="flex items-center gap-1.5 text-slate-600">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>15-25 min</span>
          </div>

          <span className="text-slate-300">•</span>

          <div className="flex items-center gap-1.5 text-slate-600">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>1.2 km</span>
          </div>

          <span className="text-slate-300">•</span>

          <span className="text-emerald-600 font-black">$$$</span>
        </div>

      </div>
    </div>
  );
};
