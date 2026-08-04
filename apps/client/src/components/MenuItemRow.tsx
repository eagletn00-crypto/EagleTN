import React from 'react';
import { Plus } from 'lucide-react';

interface MenuItemRowProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: string;
    tag: string;
  };
}

export const MenuItemRow: React.FC<MenuItemRowProps> = ({ item }) => {
  return (
    <div className="bg-white border border-[#4a3728]/5 rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_24px_rgba(74,55,40,0.02)] hover:shadow-[0_8px_32px_rgba(74,55,40,0.04)] transition-all duration-300 group text-left">
      <div className="flex-1 pr-6 flex flex-col justify-between h-full">
        <div className="space-y-1">
          <span className="text-[8px] font-mono font-bold tracking-widest text-[#9e2a2b] uppercase bg-[#9e2a2b]/5 px-2 py-0.5 rounded-md inline-block">
            {item.tag}
          </span>
          <h3 className="text-sm font-black text-[#1c120c] tracking-tight mt-1">
            {item.name}
          </h3>
          <p className="text-[11px] text-[#4a3728]/60 font-medium leading-relaxed line-clamp-2 mt-0.5">
            {item.description}
          </p>
        </div>
        <div className="mt-3">
          <span className="text-xs font-black text-[#1c120c] font-mono tracking-tight bg-[#faf8f5] px-2.5 py-1 rounded-lg border border-[#4a3728]/5">
            {item.price}
          </span>
        </div>
      </div>

      <div className="relative w-24 h-24 bg-[#faf8f5] rounded-xl flex-shrink-0 border border-[#4a3728]/5 flex flex-col items-center justify-center p-2 text-center overflow-visible">
        <span className="text-[9px] font-mono font-black text-[#4a3728]/30 uppercase tracking-widest">Eagle</span>
        <span className="text-[7px] font-mono text-[#4a3728]/20 lowercase mt-0.5">Studio Premium</span>
        <button className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1c120c] text-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(28,18,12,0.2)] hover:bg-[#4a3728] active:scale-90 transition-all z-10 border-2 border-white">
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
