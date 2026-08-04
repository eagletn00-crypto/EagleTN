import React from 'react';
import { useCartStore } from '../store/useCartStore';

export const HeaderBadge: React.FC = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());

  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
      {totalItems}
    </span>
  );
};

export default HeaderBadge;
