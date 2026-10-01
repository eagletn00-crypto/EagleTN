import React, { useMemo } from 'react';
import { Plus, Minus, Flame, Snowflake, Star } from 'lucide-react';

export interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    name_ar?: string;
    description?: string;
    price: number;
    img?: string;
    badge?: string;
    is_spicy?: boolean;
    is_cold?: boolean;
    is_popular?: boolean;
  };
  quantity?: number;
  onSelect: (item: any) => void;
  onAdd: (item: any, e: React.MouseEvent) => void;
  onRemove: (item: any, e: React.MouseEvent) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = React.memo(({
  item,
  quantity = 0,
  onSelect,
  onAdd,
  onRemove,
}) => {
  const badgeInfo = useMemo(() => {
    if (item.badge) {
      return {
        text: item.badge,
        bg: 'bg-emerald-50/90 text-[#059669] border-emerald-200/80',
        icon: null,
      };
    }

    const titleLower = `${item.name} ${item.description || ''}`.toLowerCase();

    if (
      titleLower.includes('ojja') ||
      titleLower.includes('harissa') ||
      titleLower.includes('spicy') ||
      item.is_spicy
    ) {
      return {
        text: 'Épicé',
        bg: 'bg-rose-50/90 text-rose-600 border-rose-200/80',
        icon: <Flame className="w-3 h-3 text-rose-500 stroke-[2.5]" />,
      };
    }
    if (
      titleLower.includes('boga') ||
      titleLower.includes('coca') ||
      titleLower.includes('jus') ||
      titleLower.includes('froid') ||
      titleLower.includes('glace') ||
      item.is_cold
    ) {
      return {
        text: 'Glacé',
        bg: 'bg-sky-50/90 text-sky-600 border-sky-200/80',
        icon: <Snowflake className="w-3 h-3 text-sky-500 stroke-[2.5]" />,
      };
    }
    if (
      item.is_popular ||
      titleLower.includes('casse-croûte') ||
      titleLower.includes('escalope') ||
      titleLower.includes('spécial')
    ) {
      return {
        text: 'Spécialité',
        bg: 'bg-amber-50/90 text-amber-700 border-amber-200/80',
        icon: <Star className="w-3 h-3 fill-amber-400 text-amber-400 stroke-[2.5]" />,
      };
    }
    return null;
  }, [item]);

  const formattedPrice = useMemo(() => {
    return (item.price || 0).toFixed(3);
  }, [item.price]);

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md border border-slate-200/70 transition-all duration-300 cursor-pointer flex items-center justify-between gap-3.5 active:scale-[0.99] select-none"
    >
      <div className="flex-1 min-w-0 pr-0.5 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-[#059669] transition-colors duration-200">
            {item.name}
          </h3>

          {badgeInfo && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border backdrop-blur-xs tracking-wide uppercase ${badgeInfo.bg}`}
            >
              {badgeInfo.icon}
              {badgeInfo.text}
            </span>
          )}
        </div>

        <p className="text-[11px] font-medium text-slate-500/90 line-clamp-2 leading-relaxed">
          {item.description || 'Préparation artisanale aux ingrédients frais et épices tunisiennes.'}
        </p>

        <div className="pt-1 flex items-baseline gap-1">
          <span className="text-base font-black text-[#059669] tracking-tight">
            {formattedPrice}
          </span>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            DT
          </span>
        </div>
      </div>

      <div className="relative flex-shrink-0">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner group-hover:border-emerald-500/30 transition-colors">
          <img
            src={
              item.img ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
            }
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Stepper Positionné Proprement */}
        <div className="absolute -bottom-2 -right-1 z-10">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={(e) => onAdd(item, e)}
              aria-label="Ajouter au panier"
              className="w-9 h-9 rounded-full bg-[#059669] hover:bg-[#047857] text-white shadow-lg shadow-[#059669]/30 flex items-center justify-center active:scale-90 transition-all duration-200 border-2 border-white"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-[#059669] text-white px-2 py-1 rounded-full shadow-lg shadow-[#059669]/35 border-2 border-white animate-in zoom-in-95 duration-200"
            >
              <button
                type="button"
                onClick={(e) => onRemove(item, e)}
                aria-label="Diminuer la quantité"
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 flex items-center justify-center transition-all"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              
              <span className="text-xs font-black min-w-[14px] text-center tracking-tight">
                {quantity}
              </span>

              <button
                type="button"
                onClick={(e) => onAdd(item, e)}
                aria-label="Augmenter la quantité"
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 flex items-center justify-center transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MenuItemCard.displayName = 'MenuItemCard';

export default MenuItemCard;
