import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItemData } from './ItemDetailModal';

interface MenuItemCardProps {
  item: MenuItemData;
  onSelect: (item: MenuItemData) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative w-full bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-4 overflow-hidden select-none"
    >
      {/* التفاصيل والأسماء (العربية والفرنسية) */}
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-sm font-black text-slate-900 tracking-tight truncate group-hover:text-emerald-700 transition-colors">
          {item.nameAr}
        </h3>
        
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
          {item.nameFr}
        </p>

        {(item.descriptionAr || item.descriptionFr) && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-0.5">
            {item.descriptionAr || item.descriptionFr}
          </p>
        )}

        {/* السعر الأنيق بالدينار التونسي */}
        <div className="pt-2 flex items-center gap-1.5">
          <span className="text-sm font-black text-slate-950">
            {item.price.toFixed(3)}
          </span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
            DT
          </span>
        </div>
      </div>

      {/* حاوي الصورة المعزز بزر الإضافة الطافي */}
      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-inner">
        <img
          src={item.imgUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
          alt={item.nameFr}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* زر الزائد (+) الزجاجي الأنيق على الصورة */}
        <div className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-md group-hover:bg-emerald-600 group-hover:border-emerald-400 transition-all">
          <Plus className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
