import React, { useState } from 'react';
import { UtensilsCrossed, Package, DollarSign, Settings, Signal } from 'lucide-react';
import KitchenKDS from './KitchenKDS';
import FinancesTab from '../components/tabs/FinancesTab';
import StockageTab from '../components/tabs/StockageTab';
import ParametresTab from '../components/tabs/ParametresTab';

type ActiveTab = 'kitchen' | 'stock' | 'finances' | 'settings';

export const PartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('kitchen');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans select-none">
      {/* Top Enterprise Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              EAGLE TN • Direct
            </span>
            <h1 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
              Restaurant Am Ali
            </h1>
            <p className="text-[11px] font-semibold text-slate-500">
              Rue El Gharbi El Issaoui, Cité Ibn Khaldoun
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/60 px-3 py-1.5 rounded-2xl">
            <Signal className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="text-xs font-black text-emerald-800">En Ligne</span>
          </div>
        </div>
      </header>

      {/* Main Tab Screen */}
      <main className="flex-1">
        {activeTab === 'kitchen' && <KitchenKDS />}
        {activeTab === 'stock' && <StockageTab />}
        {activeTab === 'finances' && <FinancesTab />}
        {activeTab === 'settings' && <ParametresTab />}
      </main>

      {/* Bottom Ultra-Premium Light Navigation Bar */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/90 backdrop-blur-2xl border border-slate-200/80 p-1.5 z-40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex justify-around items-center">
        <button
          type="button"
          onClick={() => setActiveTab('kitchen')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 cursor-pointer ${
            activeTab === 'kitchen'
              ? 'bg-emerald-600 text-white shadow-2xs font-black scale-102'
              : 'text-slate-400 hover:text-slate-700 font-semibold'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span className="text-[10px]">Cuisine</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stock')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 cursor-pointer ${
            activeTab === 'stock'
              ? 'bg-emerald-600 text-white shadow-2xs font-black scale-102'
              : 'text-slate-400 hover:text-slate-700 font-semibold'
          }`}
        >
          <Package className="w-4 h-4" />
          <span className="text-[10px]">Stock</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('finances')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 cursor-pointer ${
            activeTab === 'finances'
              ? 'bg-emerald-600 text-white shadow-2xs font-black scale-102'
              : 'text-slate-400 hover:text-slate-700 font-semibold'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-[10px]">Finances</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-emerald-600 text-white shadow-2xs font-black scale-102'
              : 'text-slate-400 hover:text-slate-700 font-semibold'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-[10px]">Réglages</span>
        </button>
      </nav>
    </div>
  );
};

export default PartnerDashboard;
