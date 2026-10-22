import React from 'react';
import { Home, Search, Bike, User } from 'lucide-react';
import { TabType } from '../store/useAppStore';

export interface BottomNavigationProps {
  activeTab?: TabType | string;
  onTabChange?: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'home',
  onTabChange
}) => {
  const tabs: { id: TabType; label: string; Icon: React.ElementType }[] = [
    { id: 'home', label: 'Accueil', Icon: Home },
    { id: 'search', label: 'Recherche', Icon: Search },
    { id: 'orders', label: 'Livraison', Icon: Bike },
    { id: 'profile', label: 'Profil', Icon: User },
  ];

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 flex items-center justify-around bg-white/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/30 rounded-[2rem] py-2 px-1 select-none">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange && onTabChange(id)}
            aria-label={label}
            className={`flex flex-col items-center justify-center w-[72px] h-14 transition-all duration-300 ${
              isActive
                ? 'bg-[#E9EBEF] shadow-[2px_2px_5px_#c8cacb,-2px_-2px_5px_#ffffff] rounded-2xl active:shadow-[inset_2px_2px_5px_#c8cacb,inset_-2px_-2px_5px_#ffffff]'
                : 'text-stone-400 hover:text-stone-600 active:scale-95 bg-transparent'
            }`}
          >
            <div className="relative flex flex-col items-center">
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-stone-900 stroke-[2.5]' : 'stroke-[2.2]'}`} />
              {isActive && id === 'home' && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#D97706] border border-[#E9EBEF] shadow-sm" />
              )}
              <span className={`text-[10px] mt-1.5 tracking-tight transition-colors ${isActive ? 'font-black text-stone-900' : 'font-extrabold'}`}>
                {label}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
