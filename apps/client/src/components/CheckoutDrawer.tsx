import React from 'react';

export interface CheckoutDrawerProps {
  isOpen?: boolean;
  total?: number;
  totalAmount?: number;
  onClose: () => void;
  onSubmit?: (info: any) => void;
  onConfirm?: (info: any) => void;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen = true,
  total = 0,
  totalAmount = 0,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const finalTotal = total || totalAmount || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end flex-col">
      <div className="bg-[#000F2E] border-t border-white/10 rounded-t-3xl p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">إتمام الطلب</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <p className="text-sm text-gray-300 mb-6">المبلغ الإجمالي: <span className="font-mono font-bold text-[#D4AF37]">{finalTotal.toFixed(3)} DT</span></p>
        <button
          onClick={() => onSubmit && onSubmit({})}
          className="w-full bg-[#D4AF37] text-black font-bold py-3.5 rounded-xl hover:bg-[#b8952b] transition-all"
        >
          تأكيد الطلب
        </button>
      </div>
    </div>
  );
};

export default CheckoutDrawer;
