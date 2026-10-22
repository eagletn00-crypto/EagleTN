import React, { memo } from 'react';

export const MerchantCardSkeleton: React.FC = memo(() => (
  <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] select-none pointer-events-none">
    {/* Cover Image Skeleton */}
    <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
      {/* Subdued background pulse */}
      <div className="absolute inset-0 bg-slate-200/50 animate-pulse" />

      {/* Top Badges Skeletons */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
        <div className="h-7 w-28 bg-white/40 backdrop-blur-md rounded-[16px] animate-pulse" />
        <div className="h-7 w-12 bg-white/40 backdrop-blur-md rounded-[16px] animate-pulse" />
      </div>

      {/* Bottom Badges Skeletons */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="h-8 w-24 bg-white/40 backdrop-blur-md rounded-[16px] animate-pulse" />
        <div className="h-8 w-16 bg-white/40 backdrop-blur-md rounded-[16px] animate-pulse" />
      </div>
    </div>

    {/* Content Body Skeleton */}
    <div className="p-5 flex items-center justify-between gap-4 bg-white/40">
      <div className="min-w-0 flex-1 space-y-3">
        <div className="h-4 bg-slate-200/70 rounded-full w-2/3 animate-pulse" />
        <div className="h-3 bg-slate-200/50 rounded-full w-1/2 animate-pulse" />
      </div>
      <div className="w-10 h-10 rounded-[18px] bg-slate-200/60 shrink-0 animate-pulse" />
    </div>
  </div>
));

MerchantCardSkeleton.displayName = 'MerchantCardSkeleton';

export default MerchantCardSkeleton;
