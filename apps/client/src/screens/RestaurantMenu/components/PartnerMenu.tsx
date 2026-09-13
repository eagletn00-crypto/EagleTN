import React from 'react';
import { MenuItem } from '../../../types';
import { useCartStore } from '../../../store/useCartStore';

interface PartnerMenuProps {
  items?: MenuItem[];
  partnerId?: string;
}

export const PartnerMenu: React.FC<PartnerMenuProps> = ({ items = [], partnerId }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="space-y-3 p-4">
      <h2 className="text-xs font-black uppercase text-slate-400">Menu / القائمة</h2>
      {items.length === 0 ? (
        <p className="text-xs text-slate-500">Aucun article disponible</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">{item.name}</h3>
              <p className="text-[10px] text-slate-400">{item.ArabicName || item.name}</p>
              <p className="text-xs font-black text-amber-600 mt-1">{item.price.toFixed(3)} DT</p>
            </div>
            <button
              onClick={() => addToCart(item)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
            >
              + Ajouter
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default PartnerMenu;
