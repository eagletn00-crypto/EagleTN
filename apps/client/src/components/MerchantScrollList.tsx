import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface MerchantCategory {
  readonly id: string;
  readonly name: string;
  readonly localLabel: string;
  readonly merchantCount: number;
  readonly coverImageUrl: string;
}

export interface MerchantScrollListProps {
  readonly categories: readonly MerchantCategory[];
  readonly activeCategoryId: string;
  readonly onCategorySelect: (id: string) => void;
}

interface MerchantCardItemProps {
  readonly category: MerchantCategory;
  readonly isActive: boolean;
  readonly onSelect: (id: string) => void;
}

const MerchantCardItem: React.FC<MerchantCardItemProps> = memo(({
  category,
  isActive,
  onSelect
}) => {
  const handleClick = useCallback(() => {
    onSelect(category.id);
  }, [onSelect, category.id]);

  return (
    <div className="flex-shrink-0 snap-start transform-gpu py-3">
      <motion.button
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        className={`group relative flex flex-col w-[140px] h-[190px] rounded-[1.75rem] overflow-hidden isolate cursor-pointer outline-none transition-colors duration-300 select-none
          ${isActive
            ? 'shadow-[var(--shadow-float)] border-[2.5px] border-[var(--color-primary-base)]'
            : 'shadow-[var(--shadow-ambient)] border border-stone-200/60 hover:shadow-[var(--shadow-elevated)]'
          }`}
      >
        {/* Visual Media Layer */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-[var(--color-surface-sunken)]">
          <img
            src={category.coverImageUrl}
            alt={category.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
          />
        </div>

        {/* Cinematic Scrim (Protects text legibility over any image) */}
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-stone-950/90 via-stone-900/30 to-transparent pointer-events-none z-10" />

        {/* Top Metrics Telemetry */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-sm transition-all duration-300 group-hover:bg-white/30">
            <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] ${isActive ? 'bg-[var(--color-primary-base)]' : 'bg-white'}`} />
            <span className="text-[10px] font-black tracking-[0.15em] text-white leading-none tabular-nums mt-[1px]">
              {category.merchantCount}
            </span>
          </div>
        </div>

        {/* Bottom Contextual Taxonomy */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 flex flex-col items-start pointer-events-none transform transition-transform duration-400 ease-out group-hover:-translate-y-1">
          <span className="text-sm font-black tracking-tight uppercase text-white truncate w-full text-left leading-tight drop-shadow-md">
            {category.name}
          </span>
          <span className="text-[9px] font-black text-white/90 truncate w-full text-left tracking-[0.15em] mt-1 drop-shadow-sm uppercase">
            {category.localLabel}
          </span>
        </div>
      </motion.button>
    </div>
  );
});

MerchantCardItem.displayName = 'MerchantCardItem';

export const MerchantScrollList: React.FC<MerchantScrollListProps> = memo(({
  categories,
  activeCategoryId,
  onCategorySelect
}) => {
  return (
    <div className="w-full relative transform-gpu">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex w-full overflow-x-auto scroll-smooth snap-x snap-mandatory overscroll-x-contain [-webkit-overflow-scrolling:touch] pl-4 pr-8 gap-3.5 pb-4 pt-1 transform-gpu [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_90%,transparent_100%)]"
      >
        {categories.map((category) => (
          <MerchantCardItem
            key={category.id}
            category={category}
            isActive={activeCategoryId === category.id}
            onSelect={onCategorySelect}
          />
        ))}
      </div>
    </div>
  );
});

MerchantScrollList.displayName = 'MerchantScrollList';
export default MerchantScrollList;
