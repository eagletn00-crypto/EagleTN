import React from 'react';

interface CategorySelectorProps {
  categories: any[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-3 max-w-md mx-auto">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
          activeCategoryId === 'all'
            ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]'
            : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 border border-slate-200/60'
        }`}
      >
        Tous les produits
      </button>

      {categories.map((cat) => {
        const isActive = activeCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
              isActive
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]'
                : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 border border-slate-200/60'
            }`}
          >
            {cat.name_fr || cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelector;
