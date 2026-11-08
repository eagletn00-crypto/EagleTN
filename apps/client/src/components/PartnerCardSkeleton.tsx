import React, { memo } from 'react';

interface SkeletonProps {
  readonly count?: number;
}

export const PartnerCardSkeleton: React.FC<SkeletonProps> = memo(({ count = 1 }) => {
  return (
    <div className="flex flex-col gap-4 w-full" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="w-full bg-white border border-[#F1ECE4]/80 rounded-[24px] p-2.5 flex gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.02)] transform-gpu"
        >
          {/* Image Placeholder (Cinematic Alabaster Pulse) */}
          <div className="w-[100px] h-[100px] rounded-[18px] bg-slate-100/70 animate-pulse shrink-0 border border-slate-50/50" />

          {/* Content Skeleton */}
          <div className="flex flex-col justify-center flex-1 gap-3.5 py-1.5 pr-2">
            {/* Title Line */}
            <div className="w-2/3 h-5 rounded-md bg-slate-100/80 animate-pulse" />
            
            {/* Subtitle / Meta Line (Lighter to simulate visual hierarchy) */}
            <div className="w-1/2 h-3.5 rounded-md bg-slate-50 animate-pulse" />

            {/* Badges / Bottom Row (Simulating rating and delivery time pills) */}
            <div className="flex items-center gap-2 mt-auto pt-1">
              <div className="w-16 h-6 rounded-full bg-[#F9F6F0] animate-pulse" />
              <div className="w-12 h-6 rounded-full bg-slate-50 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

PartnerCardSkeleton.displayName = 'PartnerCardSkeleton';
export default PartnerCardSkeleton;
