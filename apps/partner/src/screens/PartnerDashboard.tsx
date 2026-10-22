import React, { useState } from 'react';
import KitchenKDS from './KitchenKDS';
import StockageTab from '../components/tabs/StockageTab';
import FinancesTab from '../components/tabs/FinancesTab';
import ParametresTab from '../components/tabs/ParametresTab';
import { usePartnerDashboardData } from '../hooks/usePartnerDashboardData';

type ActiveTab = 'kitchen' | 'stock' | 'finances' | 'parametres';

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('kitchen');
  
  const { partner, isLoading, error } = usePartnerDashboardData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E9EBEF] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-[#E9EBEF] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] border-t-emerald-500 animate-spin"></div>
      </div>
    );
  }

  if (error || !partner || !partner.id) {
    return (
      <div className="min-h-screen bg-[#E9EBEF] flex flex-col items-center justify-center p-6 text-center shadow-[inset_8px_8px_16px_#c8cad0,inset_-8px_-8px_16px_#ffffff]">
        <svg className="w-12 h-12 text-rose-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span className="text-stone-600 font-bold">Données du partenaire inaccessibles ou session expirée.</span>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'kitchen':
        return <KitchenKDS partnerId={partner.id} />;
      case 'stock':
        return <StockageTab />;
      case 'finances':
        return <FinancesTab />;
      case 'parametres':
        return <ParametresTab />;
      default:
        return <KitchenKDS partnerId={partner.id} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#E9EBEF] text-[#2D3142] relative">
      <main className="pb-28">
        {renderActiveTab()}
      </main>

      <div className="fixed bottom-0 left-0 w-full px-4 pb-4 pt-2 bg-[#E9EBEF]/80 backdrop-blur-xl border-t border-white/40 z-50 rounded-t-[2rem] shadow-[0px_-8px_16px_rgba(200,202,208,0.3)]">
        <nav className="flex justify-between items-center max-w-md mx-auto h-16 px-2">
          
          <button
            onClick={() => setActiveTab('kitchen')}
            className={`flex flex-col items-center justify-center w-[72px] h-14 transition-all duration-300 ${
              activeTab === 'kitchen'
                ? 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] rounded-2xl'
                : 'text-stone-400 hover:text-stone-600 active:scale-95 bg-transparent'
            }`}
          >
            <svg className={`w-6 h-6 transition-colors ${activeTab === 'kitchen' ? 'text-emerald-600' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'kitchen' ? 2.5 : 2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            <span className={`text-[10px] mt-1 tracking-tight transition-colors ${activeTab === 'kitchen' ? 'font-black text-emerald-700' : 'font-bold'}`}>
              Cuisine
            </span>
          </button>

          <button
            onClick={() => setActiveTab('stock')}
            className={`flex flex-col items-center justify-center w-[72px] h-14 transition-all duration-300 ${
              activeTab === 'stock'
                ? 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] rounded-2xl'
                : 'text-stone-400 hover:text-stone-600 active:scale-95 bg-transparent'
            }`}
          >
            <svg className={`w-6 h-6 transition-colors ${activeTab === 'stock' ? 'text-stone-800' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'stock' ? 2.5 : 2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <span className={`text-[10px] mt-1 tracking-tight transition-colors ${activeTab === 'stock' ? 'font-black text-stone-800' : 'font-bold'}`}>
              Stock
            </span>
          </button>

          <button
            onClick={() => setActiveTab('finances')}
            className={`flex flex-col items-center justify-center w-[72px] h-14 transition-all duration-300 ${
              activeTab === 'finances'
                ? 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] rounded-2xl'
                : 'text-stone-400 hover:text-stone-600 active:scale-95 bg-transparent'
            }`}
          >
            <svg className={`w-6 h-6 transition-colors ${activeTab === 'finances' ? 'text-stone-800' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'finances' ? 2.5 : 2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className={`text-[10px] mt-1 tracking-tight transition-colors ${activeTab === 'finances' ? 'font-black text-stone-800' : 'font-bold'}`}>
              Finances
            </span>
          </button>

          <button
            onClick={() => setActiveTab('parametres')}
            className={`flex flex-col items-center justify-center w-[72px] h-14 transition-all duration-300 ${
              activeTab === 'parametres'
                ? 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] rounded-2xl'
                : 'text-stone-400 hover:text-stone-600 active:scale-95 bg-transparent'
            }`}
          >
            <svg className={`w-6 h-6 transition-colors ${activeTab === 'parametres' ? 'text-stone-800' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'parametres' ? 2.5 : 2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'parametres' ? 2.5 : 2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className={`text-[10px] mt-1 tracking-tight transition-colors ${activeTab === 'parametres' ? 'font-black text-stone-800' : 'font-bold'}`}>
              Réglages
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
