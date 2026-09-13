import React from 'react';

export type TabType = 'HOME' | 'ORDERS' | 'PROFILE';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto px-4 pb-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-white rounded-3xl p-2 shadow-2xl flex items-center justify-around">
        {/* Accueil */}
        <button
          onClick={() => onTabChange('HOME')}
          className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all duration-300 ${
            activeTab === 'HOME'
              ? 'bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-lg">🏠</span>
          <span className="text-[10px] mt-0.5 tracking-wide">Accueil</span>
        </button>

        {/* Commandes */}
        <button
          onClick={() => onTabChange('ORDERS')}
          className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all duration-300 ${
            activeTab === 'ORDERS'
              ? 'bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-lg">📦</span>
          <span className="text-[10px] mt-0.5 tracking-wide">Commandes</span>
        </button>

        {/* Mon Profil */}
        <button
          onClick={() => onTabChange('PROFILE')}
          className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all duration-300 ${
            activeTab === 'PROFILE'
              ? 'bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-lg">👤</span>
          <span className="text-[10px] mt-0.5 tracking-wide">Profil</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
