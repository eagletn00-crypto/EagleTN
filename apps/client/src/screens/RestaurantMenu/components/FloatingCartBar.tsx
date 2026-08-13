import React, { useEffect } from 'react';

interface FloatingCartBarProps {
  totalItems: number;
  totalPrice: number;
  onCheckout: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  totalItems,
  totalPrice,
  onCheckout
}) => {
  if (totalItems === 0) return null;

  // Trigger Light Haptic Feedback on Cart Appears
  useEffect(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([20, 50, 20]);
      } catch (e) {}
    }
  }, [totalItems === 1]);

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-4 max-w-lg mx-auto pointer-events-none">
      <div 
        onClick={onCheckout}
        className="pointer-events-auto bg-[#E23E1A] text-white rounded-full p-2.5 px-5 shadow-2xl shadow-rose-600/40 flex items-center justify-between cursor-pointer active:scale-95 transition-all duration-300 animate-in slide-in-from-bottom-8 duration-300"
      >
        {/* Left: Total Items Capsule */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white text-[#E23E1A] font-black text-xs flex items-center justify-center shadow-sm">
            {totalItems}
          </div>
          <span className="text-xs font-bold text-white/90">طبق في السلة</span>
        </div>

        {/* Center: Action Text */}
        <div className="text-sm font-extrabold tracking-wide text-white">
          عرض السلة 🛒
        </div>

        {/* Right: Total Price */}
        <div className="text-base font-black text-white tracking-tight">
          {totalPrice.toFixed(3)} <span className="text-xs font-bold text-white/80">DT</span>
        </div>
      </div>
    </div>
  );
};

export default FloatingCartBar;
