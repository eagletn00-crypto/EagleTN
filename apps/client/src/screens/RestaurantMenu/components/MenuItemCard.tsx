import React from 'react';

export interface MenuItem {
  id: string;
  name_fr: string;
  description_fr?: string;
  price: number;
  image_url?: string;
  is_popular?: boolean;
}

export interface MenuItemCardProps {
  item: MenuItem;
  viewMode?: 'row' | 'card';
  onSelect: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  viewMode = 'row',
  onSelect,
}) => {
  const formattedPrice = item.price.toFixed(3);

  // 1. خيار العرض الشبكي (Card View)
  if (viewMode === 'card') {
    return (
      <div
        onClick={() => onSelect(item)}
        className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.99] cursor-pointer"
      >
        <div className="relative h-40 w-full overflow-hidden bg-slate-100">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name_fr}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl text-slate-300">
              🍲
            </div>
          )}

          {item.is_popular && (
            <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-amber-700 shadow-sm ring-1 ring-amber-500/20">
              🔥 Populaire
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-3.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              {item.name_fr}
            </h3>
            {item.description_fr && (
              <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                {item.description_fr}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              {formattedPrice} <span className="text-[9px] font-bold text-slate-500">TND</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 hover:bg-emerald-600"
            >
              <span>Ajouter</span>
              <span className="text-sm">+</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. خيار العرض الصفّي (Row View)
  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative flex items-center justify-between gap-3.5 rounded-2xl bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md border border-slate-100/80 active:scale-[0.99] cursor-pointer"
    >
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div>
          {item.is_popular && (
            <span className="mb-1 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20">
              🔥 Populaire
            </span>
          )}

          <h3 className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
            {item.name_fr}
          </h3>

          {item.description_fr && (
            <p className="mt-1 line-clamp-2 text-xs font-normal leading-relaxed text-slate-500">
              {item.description_fr}
            </p>
          )}
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <span className="inline-flex items-baseline rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black tracking-tight text-slate-900">
            {formattedPrice} <span className="ms-1 text-[9px] font-bold text-slate-500">TND</span>
          </span>
        </div>
      </div>

      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name_fr}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300 text-xl">
            🍲
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          aria-label={`Ajouter ${item.name_fr}`}
          className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md transition-transform hover:scale-110 active:scale-95 hover:bg-emerald-600"
        >
          <span className="text-base font-bold leading-none">+</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
