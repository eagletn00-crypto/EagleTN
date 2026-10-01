import React from 'react';

export interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-[#059669] text-white shadow-md shadow-[#059669]/20 border border-[#059669]'
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/70 border border-slate-200/50'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
