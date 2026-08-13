import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface CartFloatingBarProps {
  itemCount: number;
  totalAmount: number;
  onViewOrder: () => void;
}

export const CartFloatingBar: React.FC<CartFloatingBarProps> = ({
  itemCount,
  totalAmount,
  onViewOrder,
}) => {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-5 inset-x-4 z-40 max-w-lg mx-auto animate-in slide-in-from-bottom duration-300">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3.5 rounded-2xl shadow-xl shadow-emerald-600/25 border border-emerald-500/30 flex items-center justify-between">
        
        {/* يسار الشريط: الأيقونة والكمية والمبلغ */}
        <div className="flex items-center gap-3">
          <div className="relative bg-white/15 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 bg-slate-950 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {itemCount}
            </span>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">
              Votre Commande
            </p>
            <p className="text-base font-black tracking-tight">
              {totalAmount.toFixed(3)} <span className="text-xs font-normal">DT</span>
            </p>
          </div>
        </div>

        {/* يمين الشريط: زر الانتقال للطلب */}
        <button
          onClick={onViewOrder}
          className="bg-white text-emerald-950 px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 hover:bg-emerald-50 active:scale-95 transition-all shadow-md"
        >
          <span>Voir commande</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
