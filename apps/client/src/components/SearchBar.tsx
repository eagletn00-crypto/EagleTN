import React, { useState } from 'react';
import { Search, SlidersHorizontal, Zap, Percent, Bike, Utensils, X, Check } from 'lucide-react';

export interface SearchFilterState {
  query: string;
  category: string;
  sortBy: 'popular' | 'rating' | 'speed' | 'price';
  freeDeliveryOnly: boolean;
}

interface SearchBarProps {
  onSearchChange?: (query: string) => void;
  onFilterSelect?: (categoryId: string) => void;
  onFilterChange?: (filters: SearchFilterState) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  onFilterSelect,
  onFilterChange,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // إعدادات الفلترة المتقدمة
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'speed' | 'price'>('popular');
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);

  const categories = [
    { id: 'all', label: 'Tous', icon: Utensils },
    { id: 'express', label: 'Express (-20 min)', icon: Zap },
    { id: 'promo', label: 'Promos & Offres', icon: Percent },
    { id: 'free_delivery', label: 'Livraison Gratuit', icon: Bike },
  ];

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearchChange) onSearchChange(val);
    triggerFilterChange(val, activeCategory, sortBy, freeDeliveryOnly);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    if (onSearchChange) onSearchChange('');
    triggerFilterChange('', activeCategory, sortBy, freeDeliveryOnly);
  };

  const handleCategoryClick = (id: string) => {
    const nextCat = activeCategory === id ? 'all' : id;
    setActiveCategory(nextCat);
    if (onFilterSelect) onFilterSelect(nextCat);
    triggerFilterChange(searchValue, nextCat, sortBy, freeDeliveryOnly);
  };

  const triggerFilterChange = (
    query: string,
    category: string,
    sort: 'popular' | 'rating' | 'speed' | 'price',
    freeDelivery: boolean
  ) => {
    if (onFilterChange) {
      onFilterChange({
        query,
        category,
        sortBy: sort,
        freeDeliveryOnly: freeDelivery,
      });
    }
  };

  const applyAdvancedFilters = () => {
    triggerFilterChange(searchValue, activeCategory, sortBy, freeDeliveryOnly);
    setIsFilterDrawerOpen(false);
  };

  return (
    <div className="w-full space-y-3 my-2 select-none font-['Plus_Jakarta_Sans']">
      
      {/* Search Input Box */}
      <div className="relative flex items-center group">
        <Search className="absolute left-4 w-4 h-4 text-slate-400 stroke-[2.2] group-focus-within:text-slate-900 transition-colors pointer-events-none" />
        
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchInput}
          placeholder="Rechercher un plat, restaurant, commerce..."
          className="w-full h-12 pl-11 pr-20 bg-slate-50/90 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-xs"
        />

        <div className="absolute right-3 flex items-center gap-1">
          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-200/50 rounded-lg transition-all"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            aria-label="Filtres avancés"
            className={`p-2 rounded-xl transition-all ${
              freeDeliveryOnly || sortBy !== 'popular'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-[11px] font-extrabold whitespace-nowrap transition-all active:scale-95 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 border border-slate-900'
                  : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 stroke-[2.2] ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Modal Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 space-y-6 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Filtres de Recherche</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Affinez vos résultats</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Tri par critère */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Trier par
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'popular', label: '🔥 Populaire' },
                  { id: 'rating', label: '⭐ Mieux notés' },
                  { id: 'speed', label: '⚡ Plus rapide' },
                  { id: 'price', label: '💰 Économique' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSortBy(item.id as any)}
                    className={`p-3 rounded-xl text-xs font-bold text-left transition-all border ${
                      sortBy === item.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200/70 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Livraison Gratuite */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Livraison 0 DT uniquement</h4>
                <p className="text-[10px] text-slate-400 font-medium">Afficher uniquement les offres sans frais de livraison</p>
              </div>
              <button
                type="button"
                onClick={() => setFreeDeliveryOnly(!freeDeliveryOnly)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  freeDeliveryOnly ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform flex items-center justify-center text-[10px] ${
                    freeDeliveryOnly ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {freeDeliveryOnly && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                </div>
              </button>
            </div>

            {/* CTA Appliquer */}
            <button
              type="button"
              onClick={applyAdvancedFilters}
              className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs py-4 rounded-xl shadow-lg shadow-slate-900/10 active:scale-[0.99] transition-all"
            >
              Appliquer les Filtres
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default SearchBar;
