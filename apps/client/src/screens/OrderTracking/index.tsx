import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageSquare, Clock, ShieldCheck, ChevronDown } from 'lucide-react';

export const OrderTracking: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] max-w-md mx-auto font-sans antialiased relative overflow-hidden flex flex-col justify-between">
      {/* Background Map Placeholder / Light Layer */}
      <div className="absolute inset-0 bg-[#E8ECEF] opacity-60">
        <div className="w-full h-full bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Floating Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Bar */}
      <div className="relative z-20 p-4 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 text-slate-800 flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="bg-white/80 backdrop-blur-md border border-white/90 px-4 py-2 rounded-2xl shadow-md flex items-center gap-2">
          <span className="text-xs font-black text-slate-900">Total: 16.000 TND</span>
          <span className="text-[10px] font-bold text-amber-900 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
            Espèces
          </span>
        </div>
      </div>

      {/* Live Route Graphic Indicator */}
      <div className="relative z-10 my-auto p-6 flex justify-center">
        <div className="bg-white/70 backdrop-blur-md border border-white/90 rounded-3xl p-5 shadow-lg max-w-xs w-full space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 flex items-center justify-center mx-auto">
            <Clock size={24} className="animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Temps estimé</p>
            <h3 className="text-xl font-black text-slate-900">15 - 20 min</h3>
          </div>
        </div>
      </div>

      {/* Bottom Floating Details Sheet */}
      <div className="relative z-20 p-4 space-y-3">
        {/* Delivery Agent Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-4 shadow-xl space-y-3">
          {/* Status Badge */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span className="text-xs font-black text-slate-900">الموصل في الطريق إليك</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold">Vespa Scooter • 214-TUN-88</span>
          </div>

          {/* Courier Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-400 font-black flex items-center justify-center border border-white/80 shadow-sm">
                AH
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Ahmed / أحمد ★ 4.9</h4>
                <p className="text-[11px] text-slate-500">Chili's Tunisie - Accepte ta commande</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors">
                <MessageSquare size={16} />
              </button>
              <button className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors">
                <Phone size={16} />
              </button>
            </div>
          </div>

          {/* Change / Monnaie Option */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-950">Besoin de monnaie ? / هل تحتاج فكة؟</span>
            <div className="flex gap-1.5">
              <button className="bg-white/80 hover:bg-white text-slate-900 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-white/80 shadow-xs">
                20 DT
              </button>
              <button className="bg-white/80 hover:bg-white text-slate-900 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-white/80 shadow-xs">
                50 DT
              </button>
            </div>
          </div>
        </div>

        {/* Account & Details Accordion */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl p-3 shadow-sm flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Détails du compte / تفاصيل الحساب</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
