import React, { memo } from 'react';

export const RestaurantCardSkeleton: React.FC = memo(() => {
  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-200/70 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-[16/9] bg-neutral-200/60 relative p-3 flex justify-between items-start">
        <div className="w-16 h-6 bg-neutral-300/80 rounded-lg" />
        <div className="w-8 h-8 bg-neutral-300/80 rounded-xl" />
      </div>

      <div className="p-3.5 flex flex-col gap-2.5 bg-white">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="h-5 bg-neutral-200 rounded-md w-1/2" />
          <div className="h-6 bg-neutral-100 border border-neutral-200/60 rounded-lg w-[70px] shrink-0" />
        </div>
        <div className="h-3.5 bg-neutral-100 rounded-md w-full" />
      </div>
    </div>
  );
});

RestaurantCardSkeleton.displayName = 'RestaurantCardSkeleton';
export default RestaurantCardSkeleton;
