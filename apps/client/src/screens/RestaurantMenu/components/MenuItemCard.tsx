import React from 'react';

interface MenuItemCardProps {
  item: {
    id: string;
    name?: string;
    name_fr?: string;
    description?: string;
    description_fr?: string;
    price: number;
    img?: string;
    image_url?: string;
    badge?: string;
    is_popular?: boolean;
    is_spicy?: boolean;
  };
  count: number;
  onAdd: () => void;
  onRemove: () => void;
  onOpenDetails: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  count,
  onAdd,
  onRemove,
  onOpenDetails,
}) => {
  const displayName = item.name_fr || item.name || 'Produit';
  const displayDescription = item.description_fr || item.description || 'Ingrédients frais préparés selon la recette.';
  const imageSrc = item.img || item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80';

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(12); } catch (e) {}
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    onAdd();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    onRemove();
  };

  return (
    <div
      onClick={onOpenDetails}
      className="group relative bg-white rounded-2xl border border-zinc-100/60 shadow-sm shadow-zinc-200/50 flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md active:scale-[0.99] w-full h-full"
    >
      <div className="relative w-full h-36 overflow-hidden bg-zinc-100">
        <img
          src={imageSrc}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80';
          }}
        />

        {(item.is_popular || item.badge) && (
          <div className="absolute top-2 left-2 backdrop-blur-md bg-amber-500/20 text-amber-800 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10">
            {item.badge || 'POPULAIRE'}
          </div>
        )}
      </div>

      <div className="p-3 space-y-1 flex flex-col justify-between flex-1">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-zinc-950 line-clamp-2 min-h-[2rem] leading-snug">
            {displayName}
          </h3>
          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
            {displayDescription}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-black text-zinc-900">
              {Number(item.price).toFixed(3)}
            </span>
            <span className="text-[9px] font-bold text-zinc-400">DT</span>
          </div>

          {/* 2. زر الإضافة بالأخضر الزمردي المحفز سيكولوجياً */}
          <div className="w-[84px] h-8 flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
            {count === 0 ? (
              <button
                onClick={handleAdd}
                className="w-8 h-8 rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-900/20 transition-all duration-200 flex items-center justify-center active:scale-90 hover:bg-emerald-500"
              >
                <span className="text-base font-bold leading-none">+</span>
              </button>
            ) : (
              <div className="w-full h-full flex items-center justify-between bg-zinc-900 text-white rounded-full p-1 shadow-md">
                <button
                  onClick={handleRemove}
                  className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs active:scale-90"
                >
                  -
                </button>
                <span className="text-xs font-bold min-w-[14px] text-center">
                  {count}
                </span>
                <button
                  onClick={handleAdd}
                  className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs active:scale-90"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
