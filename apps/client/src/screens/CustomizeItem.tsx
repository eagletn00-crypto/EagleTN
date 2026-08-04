import React, { useState } from 'react';
import { useCartStore, CartOption } from '../store/useCartStore';

interface CustomizeItemProps {
  item: {
    id: string;
    name: string;
    name_fr?: string;
    name_ar?: string;
    price: number;
    partner_id?: string;
  };
  onClose: () => void;
  forceClear?: boolean;
}

export function CustomizeItem({ item, onClose, forceClear = false }: CustomizeItemProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CartOption[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    const payload = {
      id: item.id,
      name: item.name,
      name_fr: item.name_fr,
      name_ar: item.name_ar,
      price: item.price,
      partner_id: item.partner_id,
    };

    const result = addItem(payload, quantity, selectedOptions);
    if (!result.success && !forceClear) {
      alert(result.message || 'لا يمكن دمج مطاعم مختلفة في نفس السلة');
      return;
    }
    onClose();
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-2">{item.name_fr || item.name}</h3>
      <p className="text-sm text-slate-500 mb-4">{item.price} DT</p>
      
      <div className="flex items-center justify-between mb-4">
        <span>الكمية:</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 bg-slate-100 rounded-lg">-</button>
          <span className="font-bold">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 bg-slate-100 rounded-lg">+</button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl shadow-md hover:bg-emerald-400 transition-all"
      >
        إضافة إلى السلة
      </button>
    </div>
  );
}

export default CustomizeItem;
