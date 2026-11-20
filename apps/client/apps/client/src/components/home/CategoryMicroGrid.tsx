import React, { memo } from 'react';
import { motion } from 'framer-motion';

// TODO: These types will eventually be generated from Supabase
export interface Category {
  id: string;
  slug: string;
  label: string;
  image_url: string;
}

interface CategoryMicroGridProps {
  categories: Category[];
  activeCategory?: string;
  onCategorySelect: (slug: string) => void;
}

const CategoryMicroGrid: React.FC<CategoryMicroGridProps> = memo(({ 
  categories, 
  activeCategory, 
  onCategorySelect 
}) => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[13px] font-black tracking-widest text-stone-900 uppercase">
          Explorer
        </h2>
      </div>
      
      {/* 
        Micro-Grid Layout:
        - 4 columns on small screens, ensuring compact display.
        - Uses grid instead of horizontal scroll for immediate visibility.
      */}
      <div className="grid grid-cols-4 gap-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onCategorySelect(isActive ? '' : cat.slug)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                flex flex-col items-center justify-center gap-2 p-2 
                rounded-2xl transition-all outline-none border 
                ${isActive 
                  ? 'bg-white border-[#A37836] shadow-[0_4px_12px_rgba(163,120,54,0.15)]' 
                  : 'bg-transparent border-transparent hover:bg-white/50'
                }
              `}
            >
              <div className="w-[48px] h-[48px] rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border border-stone-100">
                <img
                  src={cat.image_url}
                  alt={cat.label}
                  loading="lazy"
                  className="w-7 h-7 object-contain drop-shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <span 
                className={`
                  text-[9px] font-black tracking-widest uppercase text-center w-full truncate
                  ${isActive ? 'text-[#A37836]' : 'text-stone-700'}
                `}
              >
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
});

export default CategoryMicroGrid;
