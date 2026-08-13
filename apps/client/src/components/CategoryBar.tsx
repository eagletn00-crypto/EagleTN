import React from 'react';

interface Category {
  id: string;
  nameFr: string;
}

interface CategoryBarProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategory,
  onSelect,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-4 bg-slate-50 border-b border-slate-200/60 sticky top-0 z-20 backdrop-blur-md bg-slate-50/90">
      <div className="flex items-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-slate-950 text-white shadow-md shadow-slate-950/10'
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.nameFr}
            </button>
          );
        })}
      </div>
    </div>
  );
};
