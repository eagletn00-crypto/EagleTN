import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface CartFloatingBarProps {
  itemCount: number;
  totalPrice: number;
  onOpenCart: () => void;
}

export function CartFloatingBar({ itemCount, totalPrice, onOpenCart }: CartFloatingBarProps) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 z-40 animate-slide-up">
      <button
        onClick={onOpenCart}
        className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center font-bold text-xs">
            {itemCount}
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-red-100 font-medium uppercase tracking-wider">سلة الطلبات</span>
            <span className="text-sm font-black tracking-tight">{totalPrice.toFixed(3)} DT</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-xl">
          <span>عرض الفاتورة والطلب</span>
          <ArrowRight size={16} />
        </div>
      </button>
    </div>
  );
}
