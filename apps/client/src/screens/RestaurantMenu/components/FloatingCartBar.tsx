import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

interface FloatingCartBarProps {
  onCheckout: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ onCheckout }) => {
  const { totalCount, totalPrice } = useCart();

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 max-w-md mx-auto px-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white rounded-2xl p-3 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3 pl-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900">
              {totalCount}
            </span>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Mon Panier</div>
            <div className="text-sm font-black text-emerald-400 font-mono">
              {totalPrice.toFixed(3)} DT
            </div>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/30"
        >
          <span>Commander</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

export default FloatingCartBar;
