import React from 'react';
import { Bike, CheckCheck, Wallet } from 'lucide-react';

interface Props {
  activeTab: 'encours' | 'livre' | 'wallet';
  setActiveTab: (tab: 'encours' | 'livre' | 'wallet') => void;
  activeOrdersCount: number;
  completedTripsToday: number;
}

export const BottomNav: React.FC<Props> = ({ 
  activeTab, setActiveTab, activeOrdersCount, completedTripsToday 
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2.5 z-40 shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        <button 
          onClick={() => setActiveTab('encours')}
          className={`py-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
            activeTab === 'encours' ? 'bg-red-600 text-white font-black shadow-md shadow-red-200' : 'text-slate-500 font-bold hover:bg-slate-50'
          }`}
        >
          <Bike className="w-5 h-5" />
          <span className="text-[11px]">En Cours ({activeOrdersCount})</span>
        </button>

        <button 
          onClick={() => setActiveTab('livre')}
          className={`py-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
            activeTab === 'livre' ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-200' : 'text-slate-500 font-bold hover:bg-slate-50'
          }`}
        >
          <CheckCheck className="w-5 h-5" />
          <span className="text-[11px]">Livré ({completedTripsToday})</span>
        </button>

        <button 
          onClick={() => setActiveTab('wallet')}
          className={`py-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
            activeTab === 'wallet' ? 'bg-slate-900 text-white font-black shadow-md' : 'text-slate-500 font-bold hover:bg-slate-50'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[11px]">Caisse / Wallet</span>
        </button>
      </div>
    </nav>
  );
};
