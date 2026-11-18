import React, { memo } from 'react';

export interface Category {
  id: string;
  name: string;
  image_url?: string | null;
  icon?: string | null;
}

export interface CategoryScrollProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

// 2026 Tier-1 Appetizing Visuals: Zero generic cafe interiors
const CATEGORY_VISUALS: Record<string, string> = {
  restaurants: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  gourmet: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
  tunisien: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80',
  patisseries: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
  pâtisseries: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
  courses: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
};

export const CategoryScroll: React.FC<CategoryScrollProps> = memo(({
  categories,
  selectedCategoryId,
  onSelectCategory
}) => {
  const visibleCategories = categories.filter(
    (c) => c.id !== 'all' && c.name.toLowerCase() !== 'tout'
  );

  return (
    <div 
      className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none [-webkit-overflow-scrolling:touch] gap-2.5 px-4 scroll-pl-4 py-1 w-full"
      dir="auto"
    >
      {visibleCategories.map((category) => {
        const isActive = selectedCategoryId === category.id;
        const normalizedKey = category.name.toLowerCase().trim();
        const safeImg = category.image_url || category.icon || CATEGORY_VISUALS[normalizedKey] || CATEGORY_VISUALS.restaurants;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(isActive ? null : category.id)}
            className={`
              relative flex flex-col items-center justify-between shrink-0 snap-start outline-none cursor-pointer
              w-[88px] h-[96px] p-2 rounded-xl transition-all duration-150 active:scale-[0.96]
              ${isActive 
                ? 'bg-white border-2 border-[#8A652D] shadow-[0_2px_12px_rgba(163,120,54,0.18)] text-[#8A652D]' 
                : 'bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-[#111827] hover:border-neutral-300'
              }
            `}
            role="tab"
            aria-selected={isActive}
            aria-label={`Catégorie ${category.name}`}
          >
            {/* Visual Food Tile */}
            <div className="w-full h-[75%] rounded-lg overflow-hidden bg-neutral-50 flex items-center justify-center">
              <img 
                src={safeImg} 
                alt={category.name} 
                className="w-full h-full object-cover rounded-md"
                loading="lazy" 
              />
            </div>

            {/* Title Label */}
            <div className="w-full h-[25%] flex items-center justify-center">
              <span className={`text-[12px] font-bold tracking-tight truncate text-center ${
                isActive ? 'text-[#8A652D]' : 'text-[#111827]'
              }`}>
                {category.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
});

CategoryScroll.displayName = 'CategoryScroll';
export default CategoryScroll;
