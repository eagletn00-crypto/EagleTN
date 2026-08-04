import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface MenuItemRowProps {
  item: any;
  quantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
}

export const MenuItemRow: React.FC<MenuItemRowProps> = ({ item, quantity = 0, onAdd, onRemove }) => {
  const rawTitle = item.name || item.name_fr || item.title || 'Plat Gourmand';
  const titleFr = rawTitle.replace(/\s*\([^)]*\)/g, '').trim();

  const titleAr = item.name_ar || '';
  const description = item.description || (titleAr ? `Spécialité préparée à la commande (${titleAr}).` : 'Ingrédients frais de haute qualité.');
  const img = item.image_url || item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
  const rawPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '') || '0');

  return (
    <div className="w-full bg-white rounded-2xl p-3 shadow-xs border border-zinc-100 flex items-center gap-3">
      <div className="w-[80px] h-[80px] rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 border border-zinc-50">
        <img
          src={img}
          alt={titleFr}
          className="w-full h-full object-cover block"
        />
      </div>

      <div className="min-w-0 flex-1 flex flex-col justify-between h-[80px] py-0.5">
        <div>
          <h3 className="font-bold text-zinc-900 text-xs sm:text-sm truncate tracking-tight leading-tight">
            {titleFr}
          </h3>
          <p className="text-[11px] text-zinc-400 font-normal leading-snug line-clamp-2 mt-0.5">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-extrabold text-zinc-900 tracking-tight">
              {rawPrice.toFixed(3)}
            </span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              TND
            </span>
          </div>

          <div className="flex-shrink-0">
            {quantity === 0 ? (
              <button
                onClick={onAdd}
                type="button"
                className="bg-[#E33E38] hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 active:scale-95 transition-transform border-none cursor-pointer outline-none"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Ajouter</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-100">
                <button
                  onClick={onRemove}
                  type="button"
                  className="w-6 h-6 rounded-lg bg-white text-[#E33E38] flex items-center justify-center shadow-xs cursor-pointer border-none outline-none active:scale-90 transition-transform"
                >
                  <Minus className="w-3 h-3" strokeWidth={2.5} />
                </button>
                <span className="text-xs font-bold text-zinc-900 min-w-[12px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={onAdd}
                  type="button"
                  className="w-6 h-6 rounded-lg bg-[#E33E38] text-white flex items-center justify-center shadow-xs cursor-pointer border-none outline-none active:scale-90 transition-transform"
                >
                  <Plus className="w-3 h-3" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemRow;
