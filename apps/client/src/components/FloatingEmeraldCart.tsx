import React from 'react';

export interface FloatingEmeraldCartProps {
  itemCount: number;
  total?: number;
  totalAmount?: number;
  onCheckout: () => void;
}

export const FloatingEmeraldCart: React.FC<FloatingEmeraldCartProps> = ({
  itemCount,
  total = 0,
  totalAmount = 0,
  onCheckout,
}) => {
  const displayTotal = total || totalAmount || 0;

  if (itemCount <= 0) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto">
      <button
        onClick={onCheckout}
        className="w-full bg-[#10B981] hover:bg-[#059669] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between transition-all transform active:scale-95"
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="bg-white/20 text-white font-bold text-xs px-2.5 py-1 rounded-full">
            {itemCount}
          </span>
          <span className="font-bold text-sm">عرض السلة</span>
        </div>
        <span className="text-base font-black text-[#fdfbf7] font-mono tracking-tight">
          {displayTotal.toFixed(3)} DT
        </span>
      </button>
    </div>
  );
};

export default FloatingEmeraldCart;
