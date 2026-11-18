import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import SmartImage from './SmartImage';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80';

export interface MenuItemRowProps {
  item: any;
  isFeatured?: boolean;
  onClick: (item: any) => void;
}

export const MenuItemRow: React.FC<MenuItemRowProps> = memo(({ item, isFeatured, onClick }) => {
  // 1:1 Media & Language Contract
  const safeImg = item.image_url || item.current_photo_url || item.img || DEFAULT_IMAGE;
  const displayName = item.name_fr || item.item_name_fr || item.name || 'Produit sans nom';
  const activePrice = Number(item.current_price ?? item.price ?? 0);
  const description = item.desc_fr || item.description || item.notes || '';

  const handleTap = async () => {
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
    onClick(item);
  };

  if (isFeatured) {
    return (
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={handleTap}
        className="w-full bg-[#FAF9F6] border border-[#1C1917]/10 rounded-[1.25rem] overflow-hidden shadow-sm flex flex-col outline-none cursor-pointer"
      >
        <div className="w-full h-40 relative isolate bg-[#1C1917]/5">
          <SmartImage src={safeImg} alt={displayName} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-[#C59648] text-[#FFFFFF] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
            En Vedette
          </div>
        </div>
        <div className="p-4 flex flex-col gap-1.5">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-[16px] font-black text-[#1C1917] leading-tight flex-1">{displayName}</h3>
            <span className="text-[15px] font-black text-[#1C1917] tabular-nums shrink-0">
              {activePrice.toFixed(3)} DT
            </span>
          </div>
          {description && (
            <p className="text-[13px] font-medium text-[#1C1917]/60 line-clamp-2 leading-snug">
              {description}
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  // Compact Row UI
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={handleTap}
      className="w-full bg-[#FAF9F6] border border-[#1C1917]/10 rounded-[1.25rem] p-3 flex gap-3 shadow-sm outline-none cursor-pointer"
    >
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <h4 className="text-[15px] font-bold text-[#1C1917] leading-snug truncate">{displayName}</h4>
        {description && (
          <p className="text-[12px] font-medium text-[#1C1917]/60 mt-1 line-clamp-2 leading-tight">
            {description}
          </p>
        )}
        <span className="text-[14px] font-black text-[#1C1917] mt-2 tabular-nums">
          {activePrice.toFixed(3)} DT
        </span>
      </div>

      <div className="flex flex-col justify-between items-end shrink-0">
        <div className="w-[84px] h-[84px] rounded-xl overflow-hidden bg-[#1C1917]/5 border border-[#1C1917]/5 isolate">
          <SmartImage src={safeImg} alt={displayName} className="w-full h-full object-cover" />
        </div>
        <div className="mt-2 w-[84px] h-8 bg-[#1C1917] text-[#FFFFFF] rounded-xl flex items-center justify-center shadow-sm">
          <Plus className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
});

MenuItemRow.displayName = 'MenuItemRow';
export default MenuItemRow;
