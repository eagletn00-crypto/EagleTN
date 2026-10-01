import React from 'react';

export type TabType = 'home' | 'search' | 'orders' | 'profile' | 'accueil' | 'recherche' | 'commandes' | 'profil';

export interface BottomNavigationProps {
  activeTab: TabType | string;
  onTabChange: (tab: 'home' | 'search' | 'orders' | 'profile') => void;
}

export interface NavItem {
  id: 'home' | 'search' | 'orders' | 'profile';
  aliases: string[];
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', aliases: ['home', 'accueil'], label: 'Accueil', icon: '🏠' },
  { id: 'search', aliases: ['search', 'recherche'], label: 'Recherche', icon: '🔍' },
  { id: 'orders', aliases: ['orders', 'commandes'], label: 'Commandes', icon: '🛍️' },
  { id: 'profile', aliases: ['profile', 'profil'], label: 'Profil', icon: '👤' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav 
      aria-label="Navigation principale"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 shadow-xl select-none pb-[max(0.625rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((tab) => {
          const isActive = tab.aliases.includes(activeTab);

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-[#E70013]/40 ${
                isActive
                  ? 'text-[#E70013] font-extrabold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
            >
              <span 
                className={`text-xl leading-none mb-1 transition-transform ${
                  isActive ? 'drop-shadow-sm scale-110' : 'opacity-80'
                }`}
                aria-hidden="true"
              >
                {tab.icon}
              </span>
              <span className="text-[11px] tracking-tight leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
