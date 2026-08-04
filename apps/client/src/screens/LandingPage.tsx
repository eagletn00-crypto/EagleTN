import React from 'react';

export interface LandingPageProps {
  onSelectRole: (role: 'client' | 'guest') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 relative overflow-hidden dir-rtl" dir="rtl">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Logo */}
      <div className="flex flex-col items-center text-center mt-12 space-y-4 relative z-10">
        <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-amber-500/40 flex items-center justify-center shadow-2xl shadow-amber-500/10">
          <span className="text-5xl">🦅</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-wider text-amber-400 font-mono">
            EAGLE<span className="text-white">.TN</span>
          </h1>
          <p className="text-xs italic text-amber-200/80 font-serif">Delivery</p>
        </div>
        <p className="text-xs text-slate-400 max-w-xs pt-2">
          Livraison sécurisée, confidentielle, rapide
          <br />
          <span className="text-slate-300 font-semibold">توصيل آمن، سري، سريع</span>
        </p>
      </div>

      {/* Main Actions */}
      <div className="space-y-3 relative z-10 mb-8 max-w-sm mx-auto w-full">
        {/* Sign In / Sign Up Main Button */}
        <button
          onClick={() => onSelectRole('client')}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-xl transition active:scale-98 flex items-center justify-center gap-2 text-sm"
        >
          <span>👤</span>
          <span>SE CONNECTER / S'INSCRIRE</span>
        </button>

        {/* Guest Button */}
        <button
          onClick={() => onSelectRole('guest')}
          className="w-full py-3.5 bg-slate-900/80 hover:bg-slate-900 text-slate-300 font-bold rounded-2xl border border-slate-800 transition active:scale-98 text-xs tracking-wide"
        >
          CONTINUER SANS COMPTE
        </button>

        <p className="text-[11px] text-center text-slate-500 pt-2">
          التصفح كزائر يتيح لك استكشاف المأكولات والمطاعم
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
