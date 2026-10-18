import React from 'react';
import { MenuItem } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';

interface PartnerMenuProps {
  items?: MenuItem[];
  partnerId?: string;
}

export const PartnerMenu: React.FC<PartnerMenuProps> = ({ items = [], partnerId }) => {
  const addToCart = useAppStore((state) => state.addToCart);

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold tracking-wide uppercase text-slate-800">
          Notre Carte
        </h2>
        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {items.length} articles
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <span className="text-2xl mb-3 opacity-50">🍽️</span>
          <p className="text-xs font-medium text-slate-500">Aucun article disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="group flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100/80 shadow-sm shadow-slate-100/40 hover:shadow-md hover:border-slate-200 transition-all duration-200"
            >
              <div className="flex-1 pr-4">
                <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                  {item.name}
                </h3>
                {item.ArabicName && (
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    {item.ArabicName}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">
                    {item.price.toFixed(3)} <span className="text-[10px] font-bold text-slate-500">DT</span>
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => addToCart(item)}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-slate-800 active:scale-95 shadow-md shadow-slate-900/20 transition-all"
                aria-label="Ajouter au panier"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerMenu;
