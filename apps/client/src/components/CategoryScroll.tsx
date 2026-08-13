import React from 'react';
import { Category } from '../types/schema';

interface CategoryScrollProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryScroll: React.FC<CategoryScrollProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-2">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
              isSelected ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {category.name_fr}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryScroll;
