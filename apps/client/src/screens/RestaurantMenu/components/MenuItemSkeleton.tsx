import React from 'react';

export const MenuItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-sm animate-pulse border-none">
      <div className="w-full aspect-square bg-stone-200 dark:bg-stone-800" />
      <div className="p-3.5 space-y-3">
        <div className="space-y-1.5">
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-3/4" />
          <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-md w-1/2" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-md w-1/3" />
          <div className="w-8 h-8 bg-stone-200 dark:bg-stone-800 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default MenuItemSkeleton;
