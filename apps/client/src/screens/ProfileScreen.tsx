import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building2, Bike, PhoneCall, ShieldCheck, FileText, ChevronRight, Sparkles, LogOut } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32 max-w-md mx-auto relative font-sans antialiased selection:bg-amber-100">
      {/* 📍 Top Navigation Bar */}
      <div className="bg-[#FDFBF7]/90 backdrop-blur-xl px-4 py-3 border-b border-slate-200/50 sticky top-0 z-30 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full flex items-center justify-center transition-all active:scale-95"
          aria-label="Retour"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-black text-slate-900 tracking-tight">Mon Compte</h1>
        <div className="w-9"></div> {/* Spacer for balance */}
      </div>

      <div className="p-4 space-y-6">
        {/* 👤 User Card Header */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/60 shadow-xs flex items-center gap-3.5">
          <div className="w-14 h-14 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center text-xl font-black shadow-xs">
            E
          </div>
          <div className="space-y-0.5 flex-1">
            <h2 className="text-base font-black text-slate-900 leading-tight">Espace Client Eagle</h2>
            <p className="text-[11px] text-slate-500 font-medium">Gérez vos paramètres & opportunités</p>
          </div>
        </div>

        {/* 🚀 Partner & Rider Opportunities */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">Rejoignez L'Écosystème</h3>

          {/* Become Partner Card */}
          <button
            onClick={() => window.open('https://partner.eagletn.com', '_blank')}
            className="w-full bg-emerald-50/70 border border-emerald-200/60 p-4 rounded-2xl flex items-center justify-between text-left hover:bg-emerald-100/50 transition-all active:scale-98 group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-xs">
                <Building2 size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-950 group-hover:text-emerald-700 transition-colors">Devenir Partenaire</h4>
                <p className="text-[10px] text-emerald-700 font-medium">Digitalisez votre restaurant ou commerce</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Become Delivery Rider Card */}
          <button
            onClick={() => window.open('https://livreur.eagletn.com', '_blank')}
            className="w-full bg-blue-50/70 border border-blue-200/60 p-4 rounded-2xl flex items-center justify-between text-left hover:bg-blue-100/50 transition-all active:scale-98 group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-xs">
                <Bike size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-blue-950 group-hover:text-blue-700 transition-colors">Devenir Livreur 🛵</h4>
                <p className="text-[10px] text-blue-700 font-medium">Rejoignez la flotte logistique Eagle</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-blue-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Contact Support */}
          <button
            onClick={() => navigate('/contact')}
            className="w-full bg-white border border-slate-200/60 p-4 rounded-2xl flex items-center justify-between text-left hover:bg-slate-50 transition-all active:scale-98 group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center">
                <PhoneCall size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Contactez-nous</h4>
                <p className="text-[10px] text-slate-500 font-medium">Service client & réclamations 24/7</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 📜 Legal & Compliance (INPDP Tunisia) */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">Informations & Légal</h3>

          <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-2xs divide-y divide-slate-100">
            <button
              onClick={() => navigate('/privacy')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Politique de confidentialité (INPDP)</span>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>

            <button
              onClick={() => navigate('/terms')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <FileText size={16} className="text-slate-400" />
                <span>Conditions Générales d'Utilisation</span>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* 🛡️ Legal Footer */}
        <div className="pt-6 text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
            <Sparkles size={12} className="text-amber-500" />
            <span>Eagle TN Digital System • Version 2.4.0</span>
          </div>
          <p className="text-[9px] text-slate-400/80 font-medium">
            Conforme aux normes de protection des données INPDP Tunisie
          </p>
        </div>
      </div>
    </div>
  );
};
