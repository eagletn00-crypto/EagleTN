import React from 'react';
import { Category } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="sticky top-0 z-30 bg-[#faf8f5]/90 backdrop-blur-md border-b border-zinc-200/50 py-3 px-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          const displayName = cat.name_fr || cat.name || cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/20 scale-105'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200/80 hover:bg-zinc-50'
              }`}
            >
              {displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
