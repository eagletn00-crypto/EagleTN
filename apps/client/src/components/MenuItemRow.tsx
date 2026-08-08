import React from 'react';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_popular?: boolean;
  category?: string;
}

export type ViewMode = 'row' | 'card';

interface MenuItemRowProps {
  item: MenuItem;
  viewMode?: ViewMode; // خيار تحديد نمط العرض: row أو card
  onAddToCart: (item: MenuItem) => void;
  onSelectItem?: (item: MenuItem) => void;
}

export const MenuItemRow: React.FC<MenuItemRowProps> = ({
  item,
  viewMode = 'row',
  onAddToCart,
  onSelectItem,
}) => {
  const formattedPrice = new Intl.NumberFormat('fr-TN', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(item.price);

  // 1. خيار العرض الكبيـر (Featured Card View)
  if (viewMode === 'card') {
    return (
      <div
        onClick={() => onSelectItem && onSelectItem(item)}
        className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.99] cursor-pointer"
      >
        {/* الصورة البارزة الكبيرة */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl text-slate-300">
              🍲
            </div>
          )}

          {/* شارة الأكثر طلباً */}
          {item.is_popular && (
            <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-amber-700 shadow-sm ring-1 ring-amber-500/20">
              🔥 Populaire
            </span>
          )}
        </div>

        {/* تفاصيل الطبق */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              {item.name}
            </h3>
            {item.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                {item.description}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-baseline rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-black text-slate-900">
              {formattedPrice} <span className="ms-1 text-[10px] font-bold text-slate-500">TND</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95 hover:bg-emerald-600"
            >
              <span>Ajouter</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. خيار العرض الأفقي المضغوط (Compact Row View)
  return (
    <div
      onClick={() => onSelectItem && onSelectItem(item)}
      className="group relative flex items-center justify-between gap-4 rounded-2xl bg-white p-3.5 shadow-sm transition-all duration-300 hover:shadow-md border border-slate-100/80 active:scale-[0.99] cursor-pointer"
    >
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div>
          {item.is_popular && (
            <span className="mb-1 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20">
              🔥 Populaire
            </span>
          )}

          <h3 className="text-base font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
            {item.name}
          </h3>

          {item.description && (
            <p className="mt-1 line-clamp-2 text-xs font-normal leading-relaxed text-slate-500">
              {item.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-baseline rounded-xl bg-slate-100/80 px-2.5 py-1 text-xs font-black tracking-tight text-slate-900">
            {formattedPrice} <span className="ms-1 text-[10px] font-bold text-slate-500">TND</span>
          </span>
        </div>
      </div>

      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            🍲
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          aria-label={`Ajouter ${item.name} au panier`}
          className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 hover:bg-emerald-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MenuItemRow;
