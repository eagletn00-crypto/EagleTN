import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useCategories } from '../hooks/useCategories';
// 🦅 استدعاء مكون الصور الذكي
import SmartImage from './SmartImage';

export interface BentoGridCategoriesProps {
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const BentoGridCategories: React.FC<BentoGridCategoriesProps> = memo(({ selectedCategoryId, onSelectCategory }) => {
  const { data: categories, isLoading } = useCategories();

  const handleSelect = useCallback(async (id: string | null) => {
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
    onSelectCategory(id);
  }, [onSelectCategory]);

  if (isLoading || !categories || categories.length === 0) return null;

  return (
    <section className="w-full mt-3 mb-2" aria-label="Explorez par univers">
      {/* 🦅 عنوان سيادي مزدوج اللغة */}
      <div className="flex items-end justify-between px-4 mb-4">
        <h2 className="text-[19px] font-black tracking-tight text-[#1C1917] uppercase">
          Univers <span className="text-[#C1121F] text-[14px] ml-1 opacity-90 normal-case">(التصنيفات)</span>
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 scroll-pl-4 no-scrollbar snap-x pb-4">
        {categories.map((cat) => {
          const isActive = selectedCategoryId === cat.name;

          return (
            <motion.button
              whileTap={{ scale: 0.94 }}
              key={cat.id}
              onClick={() => handleSelect(isActive ? null : cat.name)}
              // هندسة الحواف والظلال (Micro-Shadows & Borders)
              className={`group relative w-[140px] h-[160px] shrink-0 rounded-[24px] overflow-hidden snap-start text-left bg-gray-50 outline-none cursor-pointer transition-all duration-400
                ${isActive 
                  ? 'border-2 border-[#C1121F] shadow-[0_8px_24px_-6px_rgba(193,18,31,0.25)]' 
                  : 'border border-white/60 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.12)]'
                }`}
            >
              <SmartImage 
                src={cat.coverImageUrl || ''} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" 
              />
              
              {/* التدرج اللوني للاحترافية (Cinematic Gradient) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/95 via-[#1C1917]/25 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col gap-0.5">
                <h3 className="text-white text-[15px] font-black tracking-tight leading-snug drop-shadow-md">
                  {cat.localLabel || cat.name}
                </h3>
                {cat.merchantCount !== undefined && (
                  <p className="text-white/80 text-[11px] font-bold truncate leading-tight drop-shadow-sm flex items-center gap-1">
                    <span>{cat.merchantCount} enseignes</span>
                    <span className="w-1 h-1 bg-white/50 rounded-full" />
                    <span>متجر</span>
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
});

BentoGridCategories.displayName = 'BentoGridCategories';
export default BentoGridCategories;
