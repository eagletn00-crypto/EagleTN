import React from 'react';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import { Partner } from '../../../types';

export interface RestaurantHeaderProps {
  partner?: Partner | null;
  onBack?: () => void;
  onOpenCart?: () => void;
}

export function RestaurantHeader({ partner, onBack }: RestaurantHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200/60">
        <ArrowLeft size={18} />
      </button>
      <h1 className="text-sm font-black text-slate-900 truncate max-w-[200px]">
        {partner?.name_fr || partner?.name || 'Menu'}
      </h1>
      <div className="w-9 h-9" />
    </div>
  );
}

export default RestaurantHeader;
