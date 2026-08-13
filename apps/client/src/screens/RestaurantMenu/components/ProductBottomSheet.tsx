import React, { useState } from 'react';
import { MenuItem } from '../types';

interface ProductBottomSheetProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, options: any) => void;
}

export const ProductBottomSheet: React.FC<ProductBottomSheetProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState(1);
  const [spicyLevel, setSpicyLevel] = useState<'none' | 'medium' | 'hot'>('medium');
  const [extraHarissa, setExtraHarissa] = useState(false);
  const [extraEgg, setExtraEgg] = useState(false);
  const [notes, setNotes] = useState('');

  const calculateTotal = () => {
    let extraPrice = 0;
    if (extraHarissa) extraPrice += 0.5;
    if (extraEgg) extraPrice += 1.0;
    return (item.price + extraPrice) * quantity;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Content Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl max-h-[90vh] overflow-y-auto z-10 shadow-2xl transition-transform transform translate-y-0 animate-in slide-in-from-bottom duration-300 flex flex-col">
        
        {/* Swipe Handle Indicator */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Product Hero Image Header */}
        <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center font-bold text-sm backdrop-blur-md hover:bg-black/80"
          >
            ✕
          </button>
        </div>

        {/* Details & Customizations */}
        <div className="p-5 space-y-5 flex-1">
          {/* Header Title & Pricing */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{item.name}</h2>
                {item.name_ar && <p className="text-sm font-bold text-amber-600 dir-rtl">{item.name_ar}</p>}
              </div>
              <span className="text-lg font-black text-[#E75A24]">{item.price.toFixed(3)} DT</span>
            </div>
            {item.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 1. Spicy Level Selector (Le Piquantomètre) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
              مقياس الحار (Le Piquantomètre) 🌶️
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'موش حار 🚫' },
                { id: 'medium', label: 'موزوز 🌶️' },
                { id: 'hot', label: 'يشعل نار 🔥' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setSpicyLevel(lvl.id as any)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    spicyLevel === lvl.id
                      ? 'border-[#E75A24] bg-[#E75A24]/10 text-[#E75A24]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Extra Options (التكميرة) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
              التكميرة (إضافات)
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">زيادة هريسة عربي (+0.500 DT)</span>
                <input
                  type="checkbox"
                  checked={extraHarissa}
                  onChange={(e) => setExtraHarissa(e.target.checked)}
                  className="rounded text-[#E75A24] focus:ring-[#E75A24] w-4 h-4"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">عظم مروب (+1.000 DT)</span>
                <input
                  type="checkbox"
                  checked={extraEgg}
                  onChange={(e) => setExtraEgg(e.target.checked)}
                  className="rounded text-[#E75A24] focus:ring-[#E75A24] w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* 3. Kitchen Notes */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
              ملاحظات للمطبخ 📝
            </label>
            <input
              type="text"
              placeholder="مثال: بلاش بصل، زيادة قارص..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#E75A24]"
            />
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky bottom-0 flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              -
            </button>
            <span className="px-3 font-black text-sm text-slate-900 dark:text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              +
            </button>
          </div>

          {/* Full Width Submit Button */}
          <button
            onClick={() => {
              onAddToCart(item, { quantity, spicyLevel, extraHarissa, extraEgg, notes });
              onClose();
            }}
            className="flex-1 bg-[#E75A24] hover:bg-[#d44f1c] text-white py-3.5 px-4 rounded-xl font-extrabold text-sm shadow-lg active:scale-98 transition-all flex items-center justify-between"
          >
            <span>أضف للسليّة</span>
            <span>{calculateTotal().toFixed(3)} DT</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductBottomSheet;
