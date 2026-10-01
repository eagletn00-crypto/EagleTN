import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const LegalFooter: React.FC = () => {
  return (
    <footer className="mt-8 px-4 pb-6 space-y-4 text-center">
      {/* Compliance Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-black tracking-wide">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>INPDP COMPLIANT • LIVE SECURE VIA SUPABASE</span>
        <Lock className="w-3 h-3 text-emerald-600" />
      </div>

      {/* Legal Text */}
      <div className="space-y-1.5 max-w-xs mx-auto">
        <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
          Conforme à la Loi Tunisienne N° 2004-63 & RGPD. Géolocalisation cryptée de bout en bout.
        </p>
        <p className="text-[9px] font-medium text-slate-300 leading-tight">
          © 2026 EAGLE GROUPE TN DIGITAL SYSTEM. Tous droits réservés (Art. 89 de la loi N° 2001-36).
        </p>
      </div>
    </footer>
  );
};

export default LegalFooter;
