import React, { memo, useCallback } from 'react';

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
    <div className="flex-shrink-0 snap-start transform-gpu py-2">
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={handleClick}
        className={`group relative flex flex-col w-[140px] h-[180px] rounded-[24px] overflow-hidden isolate cursor-pointer outline-none transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-none [-webkit-tap-highlight-color:transparent] transform-gpu
          ${isActive 
            ? 'scale-[1.02] shadow-[0_12px_28px_rgba(231,0,19,0.12)] border border-[#E70013]' 
            : 'scale-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] active:scale-[0.97]'
          }`}
      >
        {/* Visual Media Layer */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-[#F9F6F0]">
          <img
            src={category.coverImageUrl}
            alt={category.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
          />
        </div>

        {/* Hyper-Refined Bottom Scrim (Limits darkness to bottom 40% only) */}
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10 transition-opacity duration-300" />

        {/* Top Metrics Telemetry (Alabaster Glassmorphism) */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/25 backdrop-blur-md border border-white/40 shadow-sm transition-all duration-300 group-hover:bg-white/35">
            <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(231,0,19,0.8)] ${isActive ? 'bg-[#E70013] animate-none' : 'bg-white animate-pulse'}`} />
            <span className="text-[10px] font-black tracking-widest text-white leading-none mt-[1px] tabular-nums">
              {category.merchantCount}
            </span>
          </div>
        </div>

        {/* Bottom Contextual Taxonomy */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-3.5 flex flex-col items-start pointer-events-none transform transition-transform duration-400 ease-out group-hover:-translate-y-1">
          <span className="text-[14px] font-black tracking-wide uppercase text-white truncate w-full text-left leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {category.name}
          </span>
          <span className="text-[11px] font-bold text-white/90 truncate w-full text-left tracking-wide mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {category.localLabel}
          </span>
        </div>
      </button>
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
        className="flex w-full overflow-x-auto scroll-smooth snap-x snap-mandatory overscroll-x-contain [-webkit-overflow-scrolling:touch] scrollbar-none pl-4 pr-8 gap-3.5 pb-4 pt-1 transform-gpu [mask-image:linear-gradient(to_right,black_88%,transparent_100%)]"
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
