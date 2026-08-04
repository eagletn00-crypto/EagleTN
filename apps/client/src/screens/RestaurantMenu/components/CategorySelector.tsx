import React from 'react';

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategorySelector({ categories, selectedCategoryId, onSelectCategory }: CategorySelectorProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 snap-x">
      {categories.map((cat) => {
        const active = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`snap-start py-2 px-4 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
              active
                ? 'bg-emerald-600 text-white shadow-sm scale-105'
                : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
            }`}
          >
            <span>{cat.name}</span>
            {cat.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${active ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                {cat.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CategorySelector;
