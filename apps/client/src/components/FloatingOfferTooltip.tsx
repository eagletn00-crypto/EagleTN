import React, { useState } from 'react';

export const FloatingOfferTooltip: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-sm transition-all duration-300 animate-bounce-subtle">
      <div className="relative bg-white/80 backdrop-blur-xl border border-amber-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-2xl p-3 flex items-center justify-between gap-3">
        {/* Left Golden Gift Icon */}
        <div className="bg-amber-100/80 p-2 rounded-xl text-lg shrink-0 border border-amber-300/50">
          🎁
        </div>

        {/* Bilingual Content */}
        <div className="flex-1 space-y-0.5">
          <p className="text-[10px] font-black tracking-wider text-amber-900 uppercase font-['Plus_Jakarta_Sans']">
            PROFITEZ DE 2 SEMAINES D'ESSAI GRATUIT !
          </p>
          <p className="text-xs font-bold text-slate-800 font-['Cairo'] dir-rtl">
            جرب خدماتنا مجاناً لمدة أسبوعين!
          </p>
        </div>

        {/* Quick Close Button */}
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors shrink-0"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FloatingOfferTooltip;
