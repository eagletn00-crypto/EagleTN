import React from 'react';

export type TabType = 'commandes' | 'finance' | 'journal' | 'profil';

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeOrdersCount?: number;
}

export const BottomNav: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  activeOrdersCount = 0,
}) => {
  const tabs = [
    { id: 'commandes' as TabType, label: 'Commandes', icon: '🛵', badge: activeOrdersCount },
    { id: 'finance' as TabType, label: 'Finance', icon: '💰' },
    { id: 'journal' as TabType, label: 'Journal', icon: '📋' },
    { id: 'profil' as TabType, label: 'Profil', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around items-center py-2 z-50 shadow-xl px-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all relative active:scale-95 ${
              isActive ? 'text-emerald-600 font-black' : 'text-gray-400 font-bold hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <span className="text-xl">{tab.icon}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1 -right-2.5 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border-2 border-white shadow-xs">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-black' : 'font-semibold'}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
