import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  X, 
  Star, 
  Clock, 
  Home, 
  Search as SearchIcon, 
  Bike, 
  User,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ClientHeader from '../components/ClientHeader';

export const ClientHome: React.FC = () => {
  const [showPromo, setShowPromo] = useState(true);
  const { activeTab, setActiveTab, setCurrentScreen } = useAppStore();

  const categories = [
    { id: 1, title: 'RESTAURANTS', icon: '🍔🍟' },
    { id: 2, title: 'PÂTISSERIE', icon: '🎂🍰' },
    { id: 3, title: 'MODE & SHOPPING', icon: '👜🛍️' },
    { id: 4, title: 'COSMÉTIQUE', icon: '🧴✨' },
    { id: 5, title: 'BOUTIQUE', icon: '🎁🎀' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-32 relative selection:bg-emerald-500/15 antialiased">
      {/* 1. En-tête (Top Bar) via ClientHeader */}
      <ClientHeader />

      <main className="px-4 space-y-6">
        
        {/* Pilule d'adresse (Sélection d'adresse) */}
        <div className="flex items-center justify-center -mt-2">
          <button className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm px-4 py-2.5 rounded-full active:scale-95 transition-all">
            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-stone-700" />
            </div>
            <span className="text-[11px] font-black text-stone-800 tracking-wide">
              Avenue Habib Bourguiba, Tunis
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* 2. Barre de recherche (Pill-shaped) */}
        <div className="relative flex items-center">
          <div className="absolute left-4 text-stone-400">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>
          <input 
            type="text" 
            placeholder="Chercher un restaurant, pâtisserie, boutique..."
            className="w-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-full py-4 pl-12 pr-14 text-xs font-bold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
          />
          <button className="absolute right-2 p-2.5 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-600 transition-colors active:scale-95">
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 3. Section EXPLORER L'ÉCOSYSTÈME */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-black text-stone-800 uppercase tracking-widest pl-1">
            Explorer l'écosystème
          </h2>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 -mx-4 px-4 snap-x">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => cat.id === 1 && setCurrentScreen('RESTAURANT_MENU')}
                className="snap-start shrink-0 w-[105px] flex flex-col items-center p-3 bg-white/80 backdrop-blur-xl border-2 border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgba(5,150,105,0.08)] rounded-[1.5rem] active:scale-95 transition-all group"
              >
                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-2 group-hover:bg-emerald-50 transition-colors border border-stone-100">
                  <span className="text-2xl drop-shadow-sm">{cat.icon}</span>
                </div>
                <span className="text-[9px] font-black text-stone-700 text-center uppercase tracking-wider leading-tight">
                  {cat.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Bannière Centrale "Eagle TN" */}
        {showPromo && (
          <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl p-5 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <button 
                onClick={() => setShowPromo(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
            <div className="pr-6 relative z-10">
              <h3 className="text-sm font-black text-stone-900 tracking-tight mb-1">
                Eagle TN - Votre destination gourmande.
              </h3>
              <p className="text-[11px] font-bold text-stone-500 mb-3">
                La qualité supérieure, le goût local.
              </p>
              <p className="text-xs font-black text-amber-600 bg-amber-50 inline-block px-3 py-1.5 rounded-xl border border-amber-100/50">
                بنة عالمية وتوصيل في رمشة عين 🛵
              </p>
            </div>
          </div>
        )}

        {/* 5. Section NOS PARTENAIRES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pl-1">
            <h2 className="text-[11px] font-black text-stone-800 uppercase tracking-widest">
              Nos Partenaires
            </h2>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
              2 disponibles
            </span>
          </div>

          {/* Restaurant Card (ROI DU HERGMA) */}
          <button 
            onClick={() => setCurrentScreen('RESTAURANT_MENU')}
            className="w-full relative h-[220px] rounded-[2rem] overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-transform text-left border border-white/60"
          >
            {/* Image de fond avec gradient */}
            <div className="absolute inset-0 bg-stone-800">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop" 
                alt="Restaurant" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Badges du haut */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
              <div className="bg-amber-500 text-stone-900 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-amber-400">
                <span className="text-sm">👑</span> ROI DU HERGMA
              </div>
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg border border-white/50">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-[11px] font-black text-stone-800">4.9 <span className="text-stone-400 font-bold">(142)</span></span>
              </div>
            </div>

            {/* Barre d'informations basse (Glassmorphism) */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-3 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] font-bold text-white">20-30 min</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-2xl flex items-center border border-white/50 shadow-sm">
                  <span className="text-[10px] font-black text-stone-800">2.000 DT</span>
                </div>
              </div>
              <div className="bg-emerald-500 px-4 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg border border-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Ouvert</span>
              </div>
            </div>
          </button>
        </div>

        {/* 7. Pied de page (Footer réglementaire) */}
        <div className="pt-8 pb-12 text-center space-y-2">
          <a href="#" className="text-[10px] font-bold text-stone-400 underline underline-offset-2 hover:text-stone-600 transition-colors">
            Conditions d'utilisation
          </a>
          <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">
            Copyright réservé by EAGLE TN DIGYTAL SYSTEM Avril 2026
          </p>
        </div>
      </main>

      {/* 6. Barre de Navigation Basse (Bottom Navigation Floating) */}
      <div className="fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-[2rem] px-2 py-2 flex items-center justify-between">
          
          <button 
            onClick={() => setActiveTab('home')}
            className="relative flex-1 flex flex-col items-center justify-center py-2 group"
          >
            {activeTab === 'home' && (
              <span className="absolute top-1 right-[35%] w-2 h-2 rounded-full bg-rose-500 border-2 border-white z-10" />
            )}
            <div className={`w-12 h-10 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'home' ? 'bg-white shadow-sm border border-stone-100/50' : 'text-stone-400 group-hover:text-stone-600'}`}>
              <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-stone-800 stroke-[2.5]' : 'stroke-[2]'}`} />
            </div>
            <span className={`text-[9px] font-black mt-1 tracking-wider ${activeTab === 'home' ? 'text-stone-800' : 'text-stone-400'}`}>Accueil</span>
          </button>

          <button 
            onClick={() => setActiveTab('search')}
            className="flex-1 flex flex-col items-center justify-center py-2 group text-stone-400 hover:text-stone-600 transition-colors"
          >
            <div className="w-12 h-10 rounded-2xl flex items-center justify-center">
              <SearchIcon className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[9px] font-black mt-1 tracking-wider">Recherche</span>
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            className="flex-1 flex flex-col items-center justify-center py-2 group text-stone-400 hover:text-stone-600 transition-colors"
          >
            <div className="w-12 h-10 rounded-2xl flex items-center justify-center">
              <Bike className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[9px] font-black mt-1 tracking-wider">Livraison</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className="flex-1 flex flex-col items-center justify-center py-2 group text-stone-400 hover:text-stone-600 transition-colors"
          >
            <div className="w-12 h-10 rounded-2xl flex items-center justify-center">
              <User className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[9px] font-black mt-1 tracking-wider">Profil</span>
          </button>

        </div>
      </div>
      
    </div>
  );
};

export default ClientHome;
