import React from 'react';
import { useRestaurantStore } from '../store/useRestaurantStore';

interface StaticCategoryNode {
  id: string;
  name: string;
  badge: string;
  svgPath: React.ReactNode;
}

const EXTENDED_CATEGORIES: StaticCategoryNode[] = [
  {
    id: 'cat-tunisien',
    name: 'Traditionnel',
    badge: 'FAST',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
  },
  {
    id: 'cat-pizza',
    name: 'Pizzas',
    badge: '-40%',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2H3m16 4v12a2 2 0 01-2 2H5a2 2 0 01-2-2V11m16 0H3" />
  },
  {
    id: 'cat-burger',
    name: 'Burgers',
    badge: 'PROMO',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  },
  {
    id: 'cat-dessert',
    name: 'Sucré',
    badge: 'GOLD',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m4 3h3m-3 0H9m3 3h2m-2 0h-2m2 3h1m-1 0H11" />
  }
];

export default function CategoryGrid() {
  const { activeCategoryFilter, setActiveCategory } = useRestaurantStore();

  return (
    <div className="space-y-3">
      <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
        Explorer l'Écosystème
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {EXTENDED_CATEGORIES.map((cat) => {
          const isSelected = activeCategoryFilter === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(isSelected ? null : cat.id)}
              className={`relative bg-white/70 backdrop-blur-md border rounded-[20px] p-3 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-300 ${
                isSelected 
                  ? 'border-eagle-red ring-2 ring-red-600/10 bg-white' 
                  : 'border-white/20 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <span className="absolute -top-1.5 right-1 bg-eagle-red text-white text-[7px] font-black px-1.5 py-0.5 rounded-md tracking-wider shadow-sm animate-pulse border border-white/50">
                {cat.badge}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors mb-1.5 ${
                isSelected ? 'text-eagle-red' : 'text-slate-700'
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {cat.svgPath}
                </svg>
              </div>
              <span className="text-[9px] font-black uppercase tracking-tight text-slate-900">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
