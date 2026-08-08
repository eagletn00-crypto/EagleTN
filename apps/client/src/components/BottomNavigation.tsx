import React from 'react';

export interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab = 'accueil', 
  onTabChange 
}) => {
  const tabs = [
    {
      id: 'accueil',
      label: 'Accueil',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'recherche',
      label: 'Recherche',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: 'livraison',
      label: 'Livraison',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'profil',
      label: 'Profil',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-t border-slate-200/50 py-2 px-6 shadow-[0_-2px_15px_rgba(0,0,0,0.03)] will-change-transform">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange && onTabChange(tab.id)}
              className={`relative flex flex-col items-center gap-0.5 transition-all duration-200 ${
                isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <div className="p-0.5">
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight font-['Plus_Jakarta_Sans']">
                {tab.label}
              </span>

              {/* Magnetic Active Indicator Bar */}
              {isActive && (
                <span className="absolute -top-2 w-6 h-0.5 bg-slate-900 rounded-full transition-all duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
