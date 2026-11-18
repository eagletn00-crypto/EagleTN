import React, { useState, useEffect } from 'react';
import { ChefHat, LayoutGrid, UtensilsCrossed, Settings, LogOut, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import KitchenKDS from './KitchenKDS';

const PartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kds' | 'menu' | 'settings'>('kds');
  const [partnerId, setPartnerId] = useState<string>('');

  useEffect(() => {
    // جلب المعرف الفريد للمطعم من الجلسة النشطة
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setPartnerId(user.id);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen w-full bg-[#FAF8F5] overflow-hidden selection:bg-[#C1121F]/20">
      
      {/* 🦅 SOVEREIGN SIDEBAR (Designed for Tablets) */}
      <aside className="w-[100px] md:w-[280px] bg-[#1C1917] h-full flex flex-col items-center md:items-start py-6 shadow-2xl z-20 transition-all duration-300">
        <div className="flex items-center gap-3 px-0 md:px-6 mb-12 w-full justify-center md:justify-start">
          <div className="w-12 h-12 bg-[#C1121F] rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <ChefHat className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="hidden md:flex flex-col">
            <h1 className="text-white font-black text-xl tracking-tight leading-none">EAGLE</h1>
            <span className="text-[#C1121F] text-[11px] font-bold uppercase tracking-widest mt-0.5">Partner Portal</span>
          </div>
        </div>

        <nav className="flex flex-col w-full px-3 gap-2 flex-1">
          <button 
            onClick={() => setActiveTab('kds')}
            className={`w-full h-14 md:h-12 rounded-xl flex items-center justify-center md:justify-start px-0 md:px-4 gap-3 transition-all outline-none ${activeTab === 'kds' ? 'bg-[#C1121F] text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutGrid className="w-6 h-6 md:w-5 md:h-5 shrink-0" strokeWidth={activeTab === 'kds' ? 3 : 2} />
            <span className="hidden md:block text-[14px] font-black uppercase tracking-wide">Commandes (الطلبات)</span>
          </button>

          <button 
            onClick={() => setActiveTab('menu')}
            className={`w-full h-14 md:h-12 rounded-xl flex items-center justify-center md:justify-start px-0 md:px-4 gap-3 transition-all outline-none ${activeTab === 'menu' ? 'bg-[#C1121F] text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <UtensilsCrossed className="w-6 h-6 md:w-5 md:h-5 shrink-0" strokeWidth={activeTab === 'menu' ? 3 : 2} />
            <span className="hidden md:block text-[14px] font-black uppercase tracking-wide">Menu (قائمة الطعام)</span>
          </button>
        </nav>

        <div className="w-full px-3 mt-auto flex flex-col gap-2">
          <button className="w-full h-14 md:h-12 rounded-xl flex items-center justify-center md:justify-start px-0 md:px-4 gap-3 text-gray-400 hover:bg-white/5 hover:text-white transition-all outline-none">
            <Settings className="w-6 h-6 md:w-5 md:h-5 shrink-0" strokeWidth={2} />
            <span className="hidden md:block text-[14px] font-bold">Paramètres</span>
          </button>
          
          <button onClick={handleLogout} className="w-full h-14 md:h-12 rounded-xl flex items-center justify-center md:justify-start px-0 md:px-4 gap-3 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all outline-none border border-transparent hover:border-red-500/20">
            <LogOut className="w-6 h-6 md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />
            <span className="hidden md:block text-[14px] font-black uppercase tracking-wider">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* 🦅 MAIN CONTENT AREA */}
      <main className="flex-1 h-full overflow-hidden flex flex-col relative bg-[#FAF8F5]">
        {/* Topbar for mobile/tablet status */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
          <h2 className="text-[18px] font-black text-[#1C1917] tracking-tight">
            {activeTab === 'kds' ? 'Tableau de Bord des Commandes' : 'Gestion du Menu'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[#1C1917] hover:bg-gray-100 outline-none">
              <Bell className="w-5 h-5" strokeWidth={2} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-[#C1121F] border-2 border-white rounded-full animate-pulse"></span>
            </button>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-black text-[#1C1917] leading-none">Chez Am Ali</span>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 uppercase tracking-widest flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> En Ligne
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full h-full relative">
          {activeTab === 'kds' ? (
            <KitchenKDS partnerId={partnerId} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-50">
              <UtensilsCrossed className="w-16 h-16 text-gray-400 mb-4" strokeWidth={1} />
              <h3 className="text-xl font-black text-[#1C1917]">Gestion du Menu</h3>
              <p className="text-sm font-bold text-gray-500 mt-2">Module en cours de construction...</p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default PartnerDashboard;
