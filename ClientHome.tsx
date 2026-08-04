import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, ShoppingBag, User } from 'lucide-react';

export const ClientHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-[#1c1c1e] dark:text-[#f4f4f5] font-sans antialiased pb-24">
      {/* Top Pure Iconographic Navigation Bar */}
      <header className="w-full h-16 bg-white/80 dark:bg-[#121214]/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 fixed top-0 inset-x-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center font-black text-white dark:text-black text-xs tracking-tighter">
            E
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
            <Search className="w-4 h-4 text-black/60 dark:text-white/60" />
          </button>
        </div>
      </header>

      {/* Hero Display Layer */}
      <section className="pt-24 px-4 max-w-xl mx-auto">
        <div 
          onClick={() => navigate('/menu/chez-am-ali')}
          className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden bg-[#e4e4e7] dark:bg-[#18181b] border border-black/5 dark:border-white/5 cursor-pointer group shadow-sm"
        >
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200" 
            alt="" 
            className="w-full h-full object-cover filter brightness-[0.8] transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
            <span className="text-[8px] font-mono tracking-widest text-white/80 uppercase">PREMIUM PARTNER</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end">
            <h2 className="text-xl font-black text-white tracking-tight">Chez Am Ali</h2>
            <div className="flex items-center space-x-2 mt-1.5 text-white/60 text-[10px] font-medium uppercase tracking-wide">
              <span>Cuisine Tunisienne</span>
              <span>•</span>
              <span>2.3 km</span>
              <span>•</span>
              <span className="text-emerald-400">Disponible</span>
            </div>
          </div>
        </div>
      </section>

      {/* Micro Grid - Secondary Discovery Ecosystem */}
      <section className="mt-4 px-4 max-w-xl mx-auto grid grid-cols-2 gap-3">
        <div className="h-28 bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-black/40 dark:text-white/30 uppercase">EXCLUSIF</span>
        </div>
        <div className="h-28 bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="w-7 h-7 bg-rose-500/10 rounded-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-black/40 dark:text-white/30 uppercase">CONFORMITÉ INPDP</span>
        </div>
      </section>

      {/* Bottom Silent Structural Tab Bar */}
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-white/80 dark:bg-[#121214]/80 backdrop-blur-md border-t border-black/5 dark:border-white/5 z-50 flex items-center justify-around px-6">
        <button className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-sm transition-all">
          <Compass className="w-4 h-4" />
        </button>
        <button className="p-3 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-all">
          <ShoppingBag className="w-4 h-4" />
        </button>
        <button className="p-3 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-all">
          <User className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
};
