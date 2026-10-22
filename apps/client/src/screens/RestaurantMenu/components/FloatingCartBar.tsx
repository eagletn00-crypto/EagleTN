import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

interface FloatingCartBarProps {
  onGoToCheckout: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ onGoToCheckout }) => {
  const cartItems = useAppStore((s) => s.cartItems);

  if (!cartItems || cartItems.length === 0) return null;

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto animate-in slide-in-from-bottom duration-300">
      <button
        type="button"
        onClick={onGoToCheckout}
        className="w-full bg-white/85 backdrop-blur-2xl p-4 rounded-[2rem] shadow-[0_8px_30px_rgba(5,150,105,0.15)] flex items-center justify-between border border-white/60 transition-all active:scale-95 cursor-pointer overflow-hidden relative"
      >
        {/* تأثير إضاءة خفيف في الخلفية */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-amber-500/5" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100">
              <ShoppingBag className="w-6 h-6" />
            </div>
            {/* شارة العدد فوق الأيقونة */}
            <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {totalCount}
            </div>
          </div>
          <div className="text-left">
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-0.5">
              Total à payer
            </p>
            <p className="text-sm text-stone-800 font-black tracking-tight">
              {totalPrice.toFixed(3)} <span className="text-xs text-stone-500 font-bold">DT</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-5 py-3 rounded-2xl text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/30 relative z-10">
          <span>Panier</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};

export default FloatingCartBar;
