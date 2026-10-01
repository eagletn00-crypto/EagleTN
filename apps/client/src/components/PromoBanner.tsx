import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface PromoBannerProps {
  onClose?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onClose }) => {
  return (
    <div className="relative p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white rounded-3xl transition-all duration-300 space-y-3 shadow-[0_12px_30px_rgba(15,23,42,0.12)] border border-slate-800/80 overflow-hidden select-none">
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4 stroke-[2]" />
        </button>
      )}

      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] font-black uppercase tracking-wider text-amber-400 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>EXCELLENCE GUARANTEED</span>
        </div>
        <h3 className="text-base font-black tracking-tight text-white pt-1">
          EAGLE TN • <span className="text-[#E70013]">DIGYTAL SYSTEM</span>
        </h3>
        <p className="text-[11px] font-medium text-slate-300 tracking-tight">
          L'excellence à votre porte.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-white/10">
        <span className="text-[11px] font-bold text-amber-300/90 tracking-tight">
          بنة عالمية وتوصيل في رمشة عين 🛵
        </span>
        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
          PREMIUM
        </span>
      </div>
    </div>
  );
};

export default PromoBanner;
