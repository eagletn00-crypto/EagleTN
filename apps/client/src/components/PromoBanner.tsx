import React, { useState } from 'react';

export const PromoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="px-4 py-1">
      <div className="relative bg-white/60 border border-white/80 rounded-2xl p-3.5 shadow-[0_2px_15px_rgba(0,0,0,0.015)] space-y-1.5 overflow-hidden">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 bg-white/80 rounded-full p-1 transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-0.5 font-['Plus_Jakarta_Sans']">
          <h3 className="text-xs font-black text-slate-900 tracking-tight">
            Eagle TN - Votre destination gourmande.
          </h3>
          <p className="text-[10.5px] font-bold text-slate-600">
            La qualité supérieure, le goût local.
          </p>
        </div>

        {/* Hyper-Local Tunsi Copywriting */}
        <p className="text-xs font-bold text-amber-900 font-['Cairo'] dir-rtl">
          بنة عالمية وتوصيل في رمشة عين 🛵
        </p>

        <div className="pt-1 border-t border-slate-200/40 flex flex-col gap-0.5">
          <span className="text-[9.5px] font-black text-slate-500 tracking-wider font-['Plus_Jakarta_Sans']">
            10% DE COMMISSION SUR VOS COMMANDES
          </span>
          <span className="text-[10.5px] font-black text-emerald-700 font-['Cairo'] dir-rtl">
            عيش تونسي ودعم المحلي.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
