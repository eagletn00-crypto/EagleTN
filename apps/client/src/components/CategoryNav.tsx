import React from 'react';
import { Utensils, Coffee, ShoppingBag, Truck } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface CategoryNavProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ 
  selectedCategoryId, 
  onSelectCategory 
}) => {
  const categories: Category[] = [
    { id: 'all', label: 'Tout Explorer', icon: <Utensils className="w-4 h-4" /> },
    { id: 'restaurant', label: 'Restaurants', icon: <Utensils className="w-4 h-4" /> },
    { id: 'coffee', label: 'Pâtisseries & Cafés', icon: <Coffee className="w-4 h-4" /> },
    { id: 'groceries', label: 'Magasins & Épiceries', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'express', label: 'Eagle Express', icon: <Truck className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-10">
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none mask-image-inline">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-300 active:scale-95 border select-none group ${
                isSelected 
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-[0_10px_25px_rgba(0,0,0,0.12)] transform -translate-y-0.5' 
                  : 'bg-white text-zinc-700 border-zinc-200/60 hover:bg-zinc-50 hover:border-zinc-300'
              }`}
            >
              <div className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                isSelected 
                  ? 'bg-white/10 text-rose-400 scale-110' 
                  : 'bg-transparent text-zinc-500 group-hover:bg-zinc-100/80 group-hover:text-zinc-900 group-hover:rotate-6'
              }`}>
                {cat.icon}
              </div>
              <span className="antialiased">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
