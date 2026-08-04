import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const imageUrl = item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-3 flex items-center justify-between gap-3 shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer">
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-bold text-slate-900 truncate mb-1">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black text-emerald-600 font-mono">
            {typeof item.price === 'number' ? item.price.toFixed(3) : item.price}
          </span>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
            DT
          </span>
        </div>
      </div>

      <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <button className="absolute bottom-1 right-1 w-7 h-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-md active:scale-90 transition-transform">
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
