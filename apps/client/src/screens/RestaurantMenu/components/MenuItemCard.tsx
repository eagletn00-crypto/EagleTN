import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface MenuItemProps {
  title: string;
  titleAr?: string;
  price: string;
  image?: string;
  prepTime?: string;
  onAdd: () => void;
}

export const MenuItemCard: React.FC<MenuItemProps> = ({
  title,
  price,
  image,
  prepTime = '15 min',
  onAdd,
}) => {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between p-3.5 mb-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 gap-3"
    >
      {/* Information Container */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug truncate">
          {title}
        </h3>
        
        <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{prepTime}</span>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="text-base font-black text-emerald-600">{price}</span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">DT</span>
        </div>
      </div>

      {/* Image & Action Button */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
        <img 
          src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'} 
          alt={title}
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300';
          }}
        />
        <button
          onClick={onAdd}
          className="absolute bottom-1.5 right-1.5 w-7 h-7 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-90 transition-transform"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </motion.div>
  );
};
