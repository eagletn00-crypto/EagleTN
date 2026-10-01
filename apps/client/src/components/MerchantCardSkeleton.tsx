import React from 'react';

export const MerchantCardSkeleton: React.FC = () => (
  <div className="flex flex-col gap-3 px-5 mb-8 animate-shimmer">
    <div className="aspect-[16/9] w-full bg-gray-200/70 rounded-[28px] relative overflow-hidden">
      <div className="absolute bottom-4 left-4 w-11 h-11 rounded-full bg-gray-300 border-2 border-white" />
    </div>
    <div className="flex justify-between items-center px-1">
      <div className="space-y-1.5 w-1/2">
        <div className="h-4 bg-gray-200/80 rounded-md w-3/4" />
        <div className="h-3 bg-gray-100 rounded-md w-1/2" />
      </div>
      <div className="h-3 bg-gray-200/60 rounded-md w-16" />
    </div>
  </div>
);

export default MerchantCardSkeleton;
