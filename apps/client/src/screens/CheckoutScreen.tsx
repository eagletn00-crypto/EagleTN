import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';

export function CheckoutScreen({ onBack }: { onBack?: () => void }) {
  const { items, getSubtotal, clearCart, updateQuantity, removeItem } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = 2.500;
  const total = subtotal + deliveryFee;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4" dir="ltr">
      <h2 className="text-xl font-bold">Valider la commande</h2>
      
      <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-bold text-sm">{item.name_fr || item.name}</p>
              <p className="text-xs text-slate-400 font-mono">{(item.totalUnitPrice || item.price)} DT × {item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold">{((item.totalUnitPrice || item.price) * item.quantity).toFixed(3)} DT</span>
              <button onClick={() => removeItem(item.id)} className="text-red-500 text-xs font-bold">Supprimer</button>
            </div>
          </div>
        ))}

        <div className="pt-2 flex justify-between font-black text-base">
          <span>Total</span>
          <span className="font-mono text-emerald-600">{total.toFixed(3)} DT</span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutScreen;
