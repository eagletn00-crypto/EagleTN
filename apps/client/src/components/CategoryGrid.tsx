import React from 'react';
import { Category } from '../types/schema';

interface CategoryGridProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory
}) => {
  return (
    <div className="grid grid-cols-4 gap-3 p-2">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
              isSelected ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs font-black text-center truncate w-full">
              {category.name_fr}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
