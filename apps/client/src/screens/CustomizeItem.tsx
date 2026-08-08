import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore, CartOption } from '../store/useCartStore';

export interface CustomizeItemProps {
  item?: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    partnerId?: string;
  };
  onClose?: () => void;
}

export function CustomizeItem({ item: propItem, onClose }: CustomizeItemProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions] = useState<CartOption[]>([]);

  // استخدام البيانات الممررة عبر الـ props أو البيانات المعتمدة على الـ URL
  const itemData = propItem || {
    id: id || '1',
    name: 'وجبة تجريبية',
    price: 15.000,
    partnerId: 'p1',
  };

  const handleAddToCart = () => {
    const result = addItem(
      { id: itemData.id, name: itemData.name, price: itemData.price },
      quantity,
      selectedOptions,
      itemData.partnerId
    );

    if (!result.success) {
      alert(result.message || 'لا يمكن دمج مطاعم مختلفة في نفس السلة');
      return;
    }

    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-[#FBF9F4] font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={handleClose} className="text-xl font-bold">←</button>
          <h1 className="text-2xl font-black">{itemData.name}</h1>
        </div>
        <span className="font-mono font-bold text-amber-900">{itemData.price.toFixed(3)} DT</span>
      </div>

      {itemData.description && (
        <p className="text-slate-500 text-sm mb-6">{itemData.description}</p>
      )}

      <div className="flex items-center justify-between my-6 bg-white p-4 rounded-2xl shadow-sm">
        <span className="font-bold text-slate-700">الكمية</span>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 bg-slate-100 rounded-full font-bold"
          >
            -
          </button>
          <span className="font-bold text-slate-900">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 bg-slate-100 rounded-full font-bold"
          >
            +
          </button>
        </div>
      </div>

      <button 
        onClick={handleAddToCart}
        className="w-full bg-[#4A2810] text-white py-4 rounded-full font-bold shadow-md active:scale-98 transition-transform"
      >
        إضافة للسلة • {((itemData.price) * quantity).toFixed(3)} DT
      </button>
    </div>
  );
}

export default CustomizeItem;
