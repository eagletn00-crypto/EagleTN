import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurantStore } from '../store/useRestaurantStore';
import { Partner } from '../types';

export const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const { restaurants, fetchRestaurants, isLoading, error } = useRestaurantStore();
  const [showPromoBanner, setShowPromoBanner] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'profile'>('home');
  
  // State for Dynamic Floating Cart Dock & Gamification
  const [cartCount, setCartCount] = useState<number>(2);
  const [cartTotal, setCartTotal] = useState<number>(24.500);
  const [eaglePoints, setEaglePoints] = useState<number>(120);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const categories = [
    { id: 'TRADITIONNEL', label: 'Traditionnel', icon: '🍲', ringColor: 'border-amber-500/20', bgGlow: 'bg-amber-500/10' },
    { id: 'PIZZA', label: 'Pizza', icon: '🍕', ringColor: 'border-rose-500/20', bgGlow: 'bg-rose-500/10' },
    { id: 'BURGERS', label: 'Burgers', icon: '🍔', ringColor: 'border-orange-500/20', bgGlow: 'bg-orange-500/10' },
    { id: 'SUSHI', label: 'Sushi', icon: '🍣', ringColor: 'border-pink-500/20', bgGlow: 'bg-pink-500/10' },
    { id: 'BOISSONS', label: 'Boissons', icon: '🥤', ringColor: 'border-sky-500/20', bgGlow: 'bg-sky-500/10' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#FFFFFF] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center animate-bounce shadow-lg shadow-amber-500/10 backdrop-blur-md">
            <span className="text-3xl">🦅</span>
          </div>
          <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">Chargement de l'expérience...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#F5EFF8]/30 to-[#FFFFFF] text-slate-900 pb-36 max-w-md mx-auto px-4 font-sans antialiased selection:bg-amber-500 selection:text-white">
      
      {/* 1. Sticky Control Center (Top Hierarchy) */}
      <div className="sticky top-0 z-30 pt-3 pb-2 bg-[#FAF7F2]/80 backdrop-blur-xl space-y-3 -mx-4 px-4 transition-all border-b border-amber-900/5">
        
        {/* Compact Header Bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl drop-shadow-sm">🦅</span>
            <h1 className="text-xl font-black tracking-tight flex items-center">
              <span className="text-slate-900 font-extrabold tracking-tighter">Eagle</span>
              <span className="text-[#E53935] font-black ml-0.5">TN</span>
              <span className="text-xs ml-1">🇹🇳</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Eagle Points Gamification Badge */}
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md border border-amber-500/30 px-3 py-1 rounded-full text-[11px] font-black text-amber-900 shadow-[0_4px_12px_rgba(217,119,6,0.1)]">
              <span className="text-amber-500">💎</span>
              <span>{eaglePoints} Pts</span>
            </div>

            {/* Dynamic Geo-Location Badge */}
            <button className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[11px] font-black text-slate-800 hover:bg-slate-50 active:scale-95 transition-all">
              <span className="text-amber-500">📍</span>
              <span>Tunis, El Manar 2</span>
              <span className="text-[9px] text-slate-400 ml-0.5">▼</span>
            </button>
          </div>
        </header>

        {/* Hybrid Ultra-Premium Search Box */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Chercher un plat, un restaurant..."
              className="w-full bg-white/90 backdrop-blur-md py-2.5 pl-9 pr-4 rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
          
          {/* Centered Precision SVG Filter Accent Button */}
          <button className="w-10 h-10 bg-[#8B2D0F] text-white rounded-2xl shadow-md shadow-[#8B2D0F]/20 hover:bg-[#72240b] active:scale-95 transition-all flex items-center justify-center shrink-0 border border-white/10">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9m-9 12h9m-15-6h15M6 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6-6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </button>
        </div>

      </div>

      {/* Main Content Body */}
      <main className="mt-4 space-y-6">

        {/* 2. Glassmorphic Circular Categories Architecture */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              EXPLORER L'ÉCOSYSTÈME
            </h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 pt-1 -mx-4 px-4 scrollbar-none snap-x">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'ALL' : cat.id)}
                  className="snap-start flex flex-col items-center gap-2 transition-all duration-200 active:scale-95 group shrink-0"
                >
                  {/* Glassmorphic Spherical Icon Container */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 border ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/25 scale-105'
                        : `bg-white/80 backdrop-blur-md ${cat.ringColor} shadow-[0_8px_20px_-4px_rgba(0,0,0,0.06)] group-hover:bg-white group-hover:scale-105`
                    }`}
                  >
                    <span className="filter drop-shadow-xs">{cat.icon}</span>
                  </div>

                  <span className={`text-[11px] font-black tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Radiant High-Conversion Marketing Banner */}
        {showPromoBanner && (
          <section className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white rounded-3xl p-5 shadow-[0_16px_36px_-8px_rgba(234,88,12,0.35)] border border-white/20">
            {/* Subtle Overlay Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

            <button
              onClick={() => setShowPromoBanner(false)}
              className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/90 text-[10px] font-bold backdrop-blur-md transition-colors z-20 border border-white/10"
            >
              ✕
            </button>
            
            <div className="relative z-10 space-y-2.5 max-w-[68%]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black tracking-wider uppercase shadow-xs">
                <span>✨</span> 10% OFF COMMISSION
              </div>

              <div>
                <h3 className="text-base font-black tracking-tight leading-tight drop-shadow-md">
                  بنة عالمية وتوصيل في رمشة عين
                </h3>
                <p className="text-[11px] font-bold text-amber-50/90 mt-1 leading-snug drop-shadow-xs">
                  Eagle TN - عيش تونسي ودعم المحلي
                </p>
              </div>
            </div>

            <div className="absolute -right-2 -bottom-2 text-7xl pointer-events-none drop-shadow-2xl opacity-95 animate-pulse">
              🍔
            </div>
          </section>
        )}

        {/* 4. Soft Ambient Vendor Cards (Card Architecture) */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              NOS PARTENAIRES
            </h2>
            <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-500/20 backdrop-blur-xs">
              12 مطعم متاح حالياً 🟢
            </span>
          </div>

          {error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100">
              {error}
            </div>
          ) : (
            <div className="space-y-5">
              {restaurants.map((partner: unknown) => {
                const p = partner as Partner;
                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/restaurant/${p.id}`)}
                    className="group bg-white rounded-[32px] overflow-hidden border border-slate-200/60 shadow-[0_12px_30px_-5px_rgba(139,92,26,0.08)] hover:shadow-xl active:scale-[0.99] transition-all duration-300 cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                      <img
                        src={p.cover || p.logo || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop'}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <div className="bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] font-black px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1 shadow-md">
                          👑 موصى به
                        </div>

                        <div className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 border border-white/15 shadow-md">
                          <span className="text-amber-400">⭐</span> {p.rating || '5.0'}
                        </div>
                      </div>

                      {/* Partner Typography */}
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between">
                        <div className="pr-2 space-y-0.5">
                          <h3 className="text-base font-black text-white drop-shadow-md">
                            عند عم علي • Chez Am Ali
                          </h3>
                          <p className="text-[11px] font-bold text-slate-200/90 drop-shadow-sm">
                            Cuisine Tunisienne • Kafteji • Mlawi
                          </p>
                        </div>

                        {/* Live Status Indicator */}
                        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30 shrink-0">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">
                            Ouvert
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Logistics Footer */}
                    <div className="p-4 bg-white flex items-center justify-between text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 font-black flex items-center gap-1">
                          <span>🛵</span> 13-25 min
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>1.2 km</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-emerald-600 font-black">$$$</span>
                      </div>

                      <span className="bg-[#8B2D0F] text-white px-3.5 py-1.5 rounded-xl text-[11px] font-black shadow-sm group-hover:bg-[#72240b] transition-colors">
                        Voir menu →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* 5. Polished Floating Cart Dock (Glowing Capsule) */}
      {cartCount > 0 && (
        <div className="fixed bottom-[74px] left-3 right-3 max-w-md mx-auto z-40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gradient-to-r from-[#8B2D0F] via-[#B83214] to-[#E65100] text-white rounded-2xl p-3 shadow-xl shadow-orange-500/25 flex items-center justify-between border border-white/20 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md text-lg border border-white/20">
                🛒
                <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-orange-500">
                  {cartCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-100 block">
                  Votre Panier
                </span>
                <span className="text-sm font-black">
                  {cartTotal.toFixed(3)} DT
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/cart')}
              className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-md hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1"
            >
              Voir commande <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Root Navigation Bar (🏠 🔍 🛒 👤) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 bg-white/85 backdrop-blur-xl border-t border-slate-200/80 px-6 py-2.5 flex items-center justify-between">
        
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
            activeTab === 'home' ? 'text-[#8B2D0F] font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-extrabold tracking-tight">Accueil</span>
          {activeTab === 'home' && <span className="w-1 h-1 bg-[#8B2D0F] rounded-full animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
            activeTab === 'search' ? 'text-[#8B2D0F] font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="text-xl">🔍</span>
          <span className="text-[10px] font-extrabold tracking-tight">Recherche</span>
          {activeTab === 'search' && <span className="w-1 h-1 bg-[#8B2D0F] rounded-full animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`relative flex flex-col items-center gap-1 transition-all active:scale-90 ${
            activeTab === 'orders' ? 'text-[#8B2D0F] font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#E53935] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">Commandes</span>
          {activeTab === 'orders' && <span className="w-1 h-1 bg-[#8B2D0F] rounded-full animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
            activeTab === 'profile' ? 'text-[#8B2D0F] font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-extrabold tracking-tight">Compte</span>
          {activeTab === 'profile' && <span className="w-1 h-1 bg-[#8B2D0F] rounded-full animate-pulse" />}
        </button>

      </nav>

    </div>
  );
};

export default ClientHome;
