import React, { useState } from 'react';
import { Search, SlidersHorizontal, Zap, Star, Bike, Clock } from 'lucide-react';

interface SearchBarProps {
  onSearchChange?: (query: string) => void;
  onFilterSelect?: (filterId: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  onFilterSelect,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterChips = [
    { id: 'express', label: 'Rapide (-20 min)', icon: Zap },
    { id: 'top_rated', label: 'Top Noté', icon: Star },
    { id: 'free_delivery', label: 'Livraison 0 DT', icon: Bike },
    { id: 'open_now', label: 'Ouvert', icon: Clock },
  ];

  const handleFilterClick = (id: string) => {
    const nextFilter = activeFilter === id ? 'all' : id;
    setActiveFilter(nextFilter);
    if (onFilterSelect) onFilterSelect(nextFilter);
  };

  return (
    <div className="w-full space-y-3.5 my-3 select-none">
      {/* Search Input Container */}
      <div className="relative flex items-center group">
        <Search className="absolute left-4 w-4 h-4 text-slate-400 stroke-[2.2] group-focus-within:text-slate-900 transition-colors pointer-events-none" />
        <input
          type="text"
          placeholder="Chercher un restaurant, pâtisserie, boutique..."
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full h-12 pl-11 pr-11 bg-slate-50/80 border border-slate-200/60 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400/90 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] font-['Plus_Jakarta_Sans']"
        />
        <button
          type="button"
          aria-label="Filtres avancés"
          className="absolute right-3.5 p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Ultra Clean Filter Chips Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5 scroll-smooth">
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          const Icon = chip.icon;

          return (
            <button
              key={chip.id}
              onClick={() => handleFilterClick(chip.id)}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200 active:scale-95 font-['Plus_Jakarta_Sans'] ${
                isActive
                  ? 'bg-slate-950 text-white shadow-md shadow-slate-950/10 ring-1 ring-slate-900'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100/80 hover:text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 stroke-[2.2] ${
                isActive ? 'text-amber-400' : 'text-slate-400'
              }`} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBar;
