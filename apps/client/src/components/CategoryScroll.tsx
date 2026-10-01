import React from 'react';

export interface Category {
  id: string;
  label: string;
  image: string;
}

export interface CategoryScrollProps {
  activeCategory?: string;
  onSelectCategory?: (id: string) => void;
}

const CATEGORIES: Category[] = [
  {
    id: 'restaurants',
    label: 'RESTAURANTS',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'patisserie',
    label: 'PÂTISSERIE',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'mode',
    label: 'MODE & SHOPPING',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cosmetique',
    label: 'COSMÉTIQUE',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'fleurs',
    label: 'FLEURS & CADEAUX',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'boutiques',
    label: 'BOUTIQUES',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=80',
  },
];

export const CategoryScroll: React.FC<CategoryScrollProps> = ({
  activeCategory = 'restaurants',
  onSelectCategory,
}) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
          EXPLORER L'ÉCOSYSTÈME
        </h2>
        <span className="text-[10px] font-bold text-slate-400">
          6 Catégories
        </span>
      </div>
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-0.5">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              type="button"
              className={`flex-none w-28 p-2 rounded-2xl flex flex-col items-center justify-between gap-2 border transition-all duration-200 ${
                isActive
                  ? 'bg-white border-[#E70013] shadow-md ring-2 ring-[#E70013]/10 scale-102'
                  : 'bg-white/90 border-slate-200/80 hover:bg-white shadow-2xs'
              }`}
            >
              <div className="w-full h-16 rounded-xl overflow-hidden bg-slate-100 relative">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] font-black text-slate-800 text-center line-clamp-2 uppercase leading-tight">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryScroll;
