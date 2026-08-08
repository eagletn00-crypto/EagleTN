import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'resto', label: 'RESTAURANTS', img: '/categories/restaurants.png' },
  { id: 'patisserie', label: 'PÂTISSERIE', img: '/categories/patisserie.png' },
  { id: 'mode', label: 'MODE & SHOPPING', img: '/categories/mode.png' },
  { id: 'fleurs', label: 'FLEURS', img: '/categories/fleurs.png' },
  { id: 'cosmetique', label: 'BEAUTÉ', img: '/categories/cosmetique.png' },
];

interface PartnerCardProps {
  id: string;
  title: string;
  location: string;
  badge: string;
  rating: string;
  reviews: string;
  time: string;
  price: string;
  bgImage: string;
  onClick: () => void;
}

const PremiumPartnerCard: React.FC<PartnerCardProps> = React.memo(({ 
  title, location, badge, rating, reviews, time, price, bgImage, onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className="relative w-full aspect-[16/10] rounded-[32px] overflow-hidden shadow-xl shadow-black/[0.03] border border-white/20 bg-white/40 backdrop-blur-md active:scale-[0.98] transition-all duration-200 mb-6 cursor-pointer"
    >
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt={title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
      </div>

      <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between">
        <span className="bg-amber-500/80 backdrop-blur-md text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-full tracking-wider flex items-center gap-1">
          👑 {badge}
        </span>
        <span className="bg-white/50 backdrop-blur-md text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
          ⭐ {rating} <span className="opacity-60 font-normal">({reviews})</span>
        </span>
      </div>

      <div className="absolute bottom-4 inset-x-4 z-10 flex flex-col gap-3">
        <div>
          <h3 className="text-xl font-black text-white tracking-wide leading-tight">{title}</h3>
          <p className="text-xs text-white/70 font-medium mt-0.5">{location}</p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="bg-white/20 border border-white/20 backdrop-blur-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white">
            <span className="text-xs">⏱️</span>
            <span className="text-xs font-black tracking-wide">{time}</span>
          </div>
          <div className="bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 text-slate-950 ml-auto shadow-xs">
            <span className="text-xs font-black">{price}</span>
          </div>
          <span className="bg-emerald-500/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
            ● Ouvert
          </span>
        </div>
      </div>
    </div>
  );
});

export function ClientHome() {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F4] via-[#F5F5F7] to-[#EAECEF] pb-28 text-slate-900 antialiased font-sans px-4">
      <header className="pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-black text-[#4A2810] tracking-tight">Eagle TN</h1>
          <span className="text-xl">🇹🇳</span>
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className="bg-white/60 border border-white/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold text-slate-800 shadow-xs active:scale-95 transition-transform"
        >
          📍 <span className="tracking-wider">TUNIS</span>
        </button>
      </header>

      {/* Pill Search Bar */}
      <div className="relative my-4">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 text-sm">🔍</span>
        <input 
          type="search" 
          placeholder="Chercher un plat, un restaurant..." 
          className="w-full bg-white/50 backdrop-blur-md border border-white/40 rounded-full py-3.5 pl-10 pr-4 text-sm placeholder-slate-400 focus:outline-none focus:bg-white/80 focus:border-slate-300 shadow-xs transition-all" 
        />
      </div>

      {/* Categories Horizontal Bar */}
      <section className="my-6">
        <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">EXPLORER L'ÉCOSYSTÈME</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => navigate(`/category/${cat.id}`)}
              className="flex-shrink-0 w-24 bg-white/60 border border-white/40 backdrop-blur-md pt-3 pb-2.5 rounded-[24px] flex flex-col items-center justify-between gap-1 shadow-xs active:scale-95 transition-all"
            >
              <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
                <img 
                  src={cat.img} 
                  alt={cat.label} 
                  className="w-full h-full object-contain drop-shadow-md" 
                />
              </div>
              <span className="text-[10px] font-black text-slate-700 tracking-tight px-1 text-center truncate w-full">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      {showBanner && (
        <div className="relative bg-white/60 border border-white/40 backdrop-blur-md rounded-[28px] p-5 my-6 shadow-xs">
          <button onClick={() => setShowBanner(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xs">✕</button>
          <div className="flex flex-col gap-1.5 pr-4">
            <h3 className="text-sm font-black text-slate-900">Eagle TN - Votre destination gourmande.</h3>
            <p className="text-xs text-slate-500 font-medium">La qualité supérieure, le goût local.</p>
            <p className="text-sm font-bold text-[#D2691E] mt-1 flex items-center gap-1">🛵 بنة عالمية وتوصيل في رمشة عين</p>
          </div>
        </div>
      )}

      {/* Partners Section */}
      <section className="my-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-900 tracking-wide uppercase">NOS PARTENAIRES</h2>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">2 disponibles</span>
        </div>

        <PremiumPartnerCard 
          id="1"
          title="Chez Am Ali (Cité Ibn Khaldoun)" 
          location="Plats Populaires • Tunis" 
          badge="ROI DU HERGMA" 
          rating="4.9" 
          reviews="142" 
          time="20-30 min" 
          price="2.000 DT" 
          bgImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" 
          onClick={() => navigate('/restaurant/1')}
        />
        <PremiumPartnerCard 
          id="2"
          title="Baguette Farcie Express" 
          location="Fast Food • Cité El Khadra" 
          badge="BAGUETTE FARCIE" 
          rating="4.7" 
          reviews="98" 
          time="15-25 min" 
          price="2.000 DT" 
          bgImage="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800" 
          onClick={() => navigate('/restaurant/2')}
        />
      </section>

      {/* Floating Navigation */}
      <nav className="fixed bottom-4 inset-x-4 z-50 bg-white/70 backdrop-blur-xl border border-white/30 px-6 py-3 flex items-center justify-between max-w-md mx-auto shadow-xl shadow-black/[0.03] rounded-[24px]">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-slate-900 relative">
          <span className="text-lg">🏠</span>
          <span className="text-[10px] font-black tracking-wide">Accueil</span>
          <span className="absolute -bottom-1.5 w-4 h-[3px] bg-[#4A2810] rounded-full" />
        </button>
        <button onClick={() => navigate('/search')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
          <span className="text-lg">🔍</span>
          <span className="text-[10px] font-bold tracking-wide">Recherche</span>
        </button>
        <button onClick={() => navigate('/checkout')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
          <span className="text-lg">🛵</span>
          <span className="text-[10px] font-bold tracking-wide">Livraison</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
          <span className="text-lg">👤</span>
          <span className="text-[10px] font-bold tracking-wide">Profil</span>
        </button>
      </nav>
    </div>
  );
}

export default ClientHome;
