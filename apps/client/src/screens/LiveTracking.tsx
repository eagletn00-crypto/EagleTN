import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LiveTracking: React.FC = () => {
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState<'validated' | 'preparing' | 'delivering' | 'delivered'>('delivering');

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-slate-800 font-sans max-w-md mx-auto relative overflow-hidden shadow-2xl selection:bg-amber-500 selection:text-white">
      
      {/* 🗺️ Background Full-Bleed Live Map Simulation */}
      <div className="absolute inset-0 bg-slate-200 z-0 overflow-hidden">
        {/* Visual Map Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"
        />

        {/* Map Elements / Roads SVG Simulation */}
        <svg className="w-full h-full opacity-60 stroke-slate-400 stroke-[3]" viewBox="0 0 400 800" fill="none">
          <path d="M-50 150 C 100 150, 150 300, 200 400 C 250 500, 300 650, 450 700" />
          <path d="M 50 0 C 120 200, 280 200, 350 800" strokeDasharray="6 6" className="stroke-amber-500 stroke-[4]" />
          <path d="M 400 100 L 0 500" />
        </svg>

        {/* Restaurant Pin */}
        <div className="absolute top-[28%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="bg-slate-900 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md border border-slate-700 whitespace-nowrap mb-1">
            Chez Om Ali
          </div>
          <div className="w-8 h-8 bg-amber-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-sm animate-bounce">
            🏬
          </div>
        </div>

        {/* Driver Live Scooter Pin */}
        <div className="absolute top-[42%] left-[55%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center transition-all duration-1000">
          <div className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <span>Moneem (En route)</span>
          </div>
          <div className="w-10 h-10 bg-slate-900 border-2 border-emerald-400 rounded-full shadow-2xl flex items-center justify-center text-lg">
            🛵
          </div>
        </div>

        {/* Customer Delivery Pin */}
        <div className="absolute top-[62%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="bg-white/90 backdrop-blur-md text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md border border-white mb-1">
            Votre Adresse
          </div>
          <div className="w-8 h-8 bg-red-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-sm">
            📍
          </div>
        </div>
      </div>

      {/* 🔝 Floating Top Header Navigation */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')} 
          className="h-10 w-10 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/80 shadow-md flex items-center justify-center text-slate-800 font-extrabold hover:bg-white transition-all active:scale-95"
        >
          ←
        </button>
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 px-4 py-2 rounded-2xl shadow-md text-center">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">RÉFÉRENCE COMMANDE</p>
          <p className="text-xs font-black text-slate-900">EAGLE-9821-TN</p>
        </div>
        <button 
          onClick={() => alert('Assistance EAGLE TN: +216 71 000 000')} 
          className="h-10 w-10 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/80 shadow-md flex items-center justify-center text-slate-800 font-extrabold hover:bg-white transition-all active:scale-95"
        >
          💬
        </button>
      </header>

      {/* 📄 Bottom Draggable Glass Sheet (Live Timeline & Driver Details) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/85 backdrop-blur-2xl border-t border-white/80 rounded-t-[32px] p-5 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto scrollbar-none">
        
        {/* Handle bar */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-1 mb-2" />

        {/* Estimated Time Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <div>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              • EN LIVRAISON MIGRATOIRE
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">Temps estimé : 12-18 min</h2>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-amber-600">🛵</span>
          </div>
        </div>

        {/* ⏱️ Interactive Live Order Timeline */}
        <div className="space-y-3 py-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">STATUT DE LA COMMANDE</p>
          
          <div className="grid grid-cols-4 gap-1.5 relative">
            {/* Step 1 */}
            <div className={`p-2 rounded-xl border text-center transition-all ${
              orderStatus === 'validated' || orderStatus === 'preparing' || orderStatus === 'delivering' || orderStatus === 'delivered'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
              <span className="text-sm block mb-0.5">✅</span>
              <span className="text-[9px] font-extrabold block leading-tight">Validée</span>
            </div>

            {/* Step 2 */}
            <div className={`p-2 rounded-xl border text-center transition-all ${
              orderStatus === 'preparing' || orderStatus === 'delivering' || orderStatus === 'delivered'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
              <span className="text-sm block mb-0.5">👨‍🍳</span>
              <span className="text-[9px] font-extrabold block leading-tight">En prép.</span>
            </div>

            {/* Step 3 (Active) */}
            <div className={`p-2 rounded-xl border text-center transition-all ring-2 ring-emerald-500/40 ${
              orderStatus === 'delivering' || orderStatus === 'delivered'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
              <span className="text-sm block mb-0.5 animate-pulse">🛵</span>
              <span className="text-[9px] font-black block leading-tight">Livraison</span>
            </div>

            {/* Step 4 */}
            <div className={`p-2 rounded-xl border text-center transition-all ${
              orderStatus === 'delivered'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
              <span className="text-sm block mb-0.5">🏠</span>
              <span className="text-[9px] font-extrabold block leading-tight">Libré</span>
            </div>
          </div>
        </div>

        {/* 👤 Live Driver Contact Card */}
        <div className="bg-white/80 border border-white/90 rounded-2xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-xl shadow-md border border-slate-800">
              👨‍✈️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-xs text-slate-900">Moneem Tounsi</h4>
                <span className="text-[10px] text-amber-500 font-bold">★ 4.95</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Livreur certifié Eagle TN 🛵</p>
            </div>
          </div>
          
          <a 
            href="tel:+21698000000" 
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <span>Appeler</span>
            <span>📞</span>
          </a>
        </div>

        {/* 💳 Payment & Total Summary Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 space-y-2 shadow-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <span>Mode de paiement :</span>
            <span className="bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-lg border border-emerald-500/30">
              Espèces à la livraison
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">MONTANT TOTAL</span>
              <span className="text-lg font-black text-amber-400">14.500 DT</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-1 rounded-md block">
                Carte Bancaire / E-Dinar <span className="text-amber-500 font-bold">À BIENTÔT</span>
              </span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Assistance */}
        <div className="text-center pt-1 pb-2">
          <p className="text-[9px] text-slate-400 font-medium">
            Besoin d'aide ? Contactez notre support 24/7 • <a href="#terms" className="underline">Conditions d'utilisation</a>
          </p>
        </div>

      </div>

    </div>
  );
};

export default LiveTracking;
