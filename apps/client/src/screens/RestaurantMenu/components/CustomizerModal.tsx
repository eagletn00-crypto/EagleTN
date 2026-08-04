import React, { useState } from 'react';
import { MenuItem } from '../../../types';

export interface CustomizerModalProps {
  item: MenuItem | null;
  isOpen?: boolean;
  onClose: () => void;
  onAddToCart?: (item: MenuItem, quantity: number, options?: any[]) => void;
}

export function CustomizerModal({ item, isOpen = true, onClose, onAddToCart }: CustomizerModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!item || !isOpen) return null;

  const handleConfirm = () => {
    if (onAddToCart) {
      onAddToCart(item, quantity, []);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
        <h3 className="text-base font-black text-slate-900">{item.name_fr || item.name}</h3>
        <p className="text-xs text-slate-500">{item.description}</p>
        
        <div className="flex items-center justify-between py-2 border-y border-slate-100">
          <span className="text-xs font-bold text-slate-700">Quantité</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg bg-slate-100 font-bold">-</button>
            <span className="font-mono font-bold text-sm">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg bg-slate-100 font-bold">+</button>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Annuler</button>
          <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-md">Ajouter ({((item.price || 0) * quantity).toFixed(3)} DT)</button>
        </div>
      </div>
    </div>
  );
}

export default CustomizerModal;
