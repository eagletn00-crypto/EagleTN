import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
export interface ExtraOption {
  id: string;
  name_ar: string;
  price: number;
  is_free?: boolean;
}

export interface DrinkOption {
  id: string;
  name_ar: string;
  price: number;
  type: 'canette' | 'bottle' | 'juice';
}

export interface MenuItemData {
  id: string;
  name_ar: string;
  description_ar: string;
  price: number;
  image_url: string;
  prep_time_min?: number;
  weight_grams?: number;
  spicy_level?: number;
  available_drinks?: DrinkOption[];
  available_extras?: ExtraOption[];
}

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItemData | null;
  onAddToCart: (configuredItem: {
    item: MenuItemData;
    quantity: number;
    selectedDrink: DrinkOption | null;
    selectedExtras: ExtraOption[];
    totalPrice: number;
  }) => void;
}

// --- Inline Micro SVG Icons (Zero Network Overhead) ---
const CanetteIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2" width="10" height="20" rx="3" />
    <path d="M9 2v2h6V2" />
    <path d="M7 8h10" />
    <circle cx="12" cy="14" r="2" />
  </svg>
);

const BottleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2h4v3h-4z" />
    <path d="M10 5l-1.5 4v11a2 2 0 002 2h3a2 2 0 002-2V9L14 5" />
    <line x1="8.5" y1="13" x2="15.5" y2="13" />
  </svg>
);

const ChiliIcon = () => (
  <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c1.1 0 2 .9 2 2 0 2.5-1.8 4.7-4 6.1V19c0 1.7-1.3 3-3 3s-3-1.3-3-3v-4.2C1.8 12.4 0 10.2 0 7.7 0 4.6 2.5 2 5.6 2c.8 0 1.6.2 2.4.6C9.1 3 10.5 2 12 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-emerald-400 inline-block ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  item,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedDrink, setSelectedDrink] = useState<DrinkOption | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);

  const totalPrice = useMemo(() => {
    const extrasTotal = selectedExtras.reduce((sum, ex) => sum + (ex.price || 0), 0);
    const drinkTotal = selectedDrink ? selectedDrink.price : 0;
    return (item.price + extrasTotal + drinkTotal) * quantity;
  }, [item.price, selectedExtras, selectedDrink, quantity]);

  const toggleExtra = (extra: ExtraOption) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleConfirm = () => {
    onAddToCart({
      item,
      quantity,
      selectedDrink,
      selectedExtras,
      totalPrice,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center dir-rtl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col z-10 shadow-2xl text-slate-100"
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-20 p-2 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-white transition"
            >
              ✕
            </button>

            <div className="overflow-y-auto flex-1 pb-24">
              <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-125"
                  style={{ backgroundImage: `url(${item.image_url})` }}
                />
                <img
                  src={item.image_url}
                  alt={item.name_ar}
                  className="relative z-10 max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:scale-105"
                  loading="eager"
                />
                <div className="absolute bottom-3 right-3 z-10 bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-[10px] text-emerald-400 px-2.5 py-1 rounded-full flex items-center">
                  <ShieldCheckIcon />
                  <span>صورة حقيقية 100% • حقوق محفوظة</span>
                </div>
              </div>

              <div className="p-5 border-b border-slate-800/80">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-white tracking-wide">{item.name_ar}</h2>
                  <span className="text-xl font-black text-emerald-400 tracking-tight">
                    {item.price.toFixed(3)} <span className="text-xs font-normal text-slate-400">د.ت</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 my-3 text-xs text-slate-400">
                  {item.prep_time_min && (
                    <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md">
                      <ClockIcon /> {item.prep_time_min} دقيقة
                    </span>
                  )}
                  {item.weight_grams && (
                    <span className="bg-slate-800/80 px-2.5 py-1 rounded-md">
                      ⚖️ {item.weight_grams} غرام تقريباً
                    </span>
                  )}
                  {item.spicy_level !== undefined && item.spicy_level > 0 && (
                    <span className="flex items-center gap-1 bg-red-950/40 border border-red-800/40 text-red-400 px-2.5 py-1 rounded-md">
                      <ChiliIcon /> درجة الحرارة: {item.spicy_level}/3
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                  {item.description_ar || "مكونات طازجة محددة بعناية ومجهزة على الطلب لضمان أعلى جودة ونكهة أصيلة."}
                </p>
              </div>

              {item.available_drinks && item.available_drinks.length > 0 && (
                <div className="p-5 border-b border-slate-800/80">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    🥤 المشروب (اختياري)
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {item.available_drinks.map((drink) => {
                      const isSelected = selectedDrink?.id === drink.id;
                      return (
                        <button
                          key={drink.id}
                          onClick={() => setSelectedDrink(isSelected ? null : drink)}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all text-sm ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                              : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {drink.type === 'bottle' ? <BottleIcon /> : <CanetteIcon />}
                            <span className="font-medium">{drink.name_ar}</span>
                          </div>
                          <span className="text-xs font-semibold">
                            +{drink.price.toFixed(3)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {item.available_extras && item.available_extras.length > 0 && (
                <div className="p-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    🧀 الإضافات والصلصات (Suppléments)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.available_extras.map((extra) => {
                      const isSelected = selectedExtras.some((e) => e.id === extra.id);
                      return (
                        <button
                          key={extra.id}
                          onClick={() => toggleExtra(extra)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span>{extra.name_ar}</span>
                          <span className={`px-1.5 py-0.5 rounded ${extra.is_free ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                            {extra.is_free ? 'مجاني' : `+${extra.price.toFixed(3)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 p-4 flex items-center justify-between gap-4 z-20">
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-800 rounded-lg transition"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-800 rounded-lg transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleConfirm}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-5 rounded-xl flex items-center justify-between shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
              >
                <span className="text-sm">إضافة إلى السلة</span>
                <span className="text-base tracking-tight font-black">
                  {totalPrice.toFixed(3)} <span className="text-xs font-normal">د.ت</span>
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomizerModal;
