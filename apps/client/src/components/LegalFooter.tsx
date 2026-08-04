import React from 'react';

const LegalFooter: React.FC = () => {
  return (
    <footer className="w-full mt-10 pb-28 px-4 border-t border-slate-100 pt-6 flex flex-col items-center gap-4">
      {/* INPDP Professional Digital Green Badge with Micro-Glow Effect */}
      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
        <span className="text-[10px] tracking-widest font-black text-emerald-500 uppercase font-mono">
          INPDP COMPLIANT • LIVE SECURE VIA SUPABASE
        </span>
      </div>

      {/* Strict Tunisian Legal & Anti-Abuse Text */}
      <div className="w-full text-center flex flex-col gap-1 px-2">
        <p className="text-[10px] text-slate-400 font-medium font-sans">
          Conforme à la Loi Tunisienne N° 2004-63 & RGPD. Géolocalisation cryptée de bout en bout.
        </p>
        <p className="text-[9px] text-slate-400/70 font-mono tracking-tight leading-relaxed mt-1">
          © 2026 Copyright réservé par <span className="font-bold text-slate-600">EAGLE GROUPE TN DIGITAL SYSTEM</span>. 
          Toute reproduction, copie ou abus de cette interface système est strictement interdit et sera puni par la loi tunisienne (Art. 89 de la loi N° 2001-36).
        </p>
      </div>
    </footer>
  );
};

export default LegalFooter;
