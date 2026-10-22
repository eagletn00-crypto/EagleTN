import React, { useState, useEffect, useMemo, memo } from 'react';
import {
  X,
  Plus,
  Minus,
  ShieldCheck,
  Check,
  ChefHat,
  Sparkles,
  ShoppingBag,
  Wine,
  MessageSquarePlus,
} from 'lucide-react';

export interface ProductCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
  onConfirm: (customData: {
    type: 'Plat' | 'Sandwich';
    beverage: string;
    supplements: string[];
    notes: string;
    quantity: number;
  }) => void;
}

const BEVERAGES = [
  { id: 'Sans Boisson', label: 'بدون مشروب (Sans boisson)', price: 0.0 },
  { id: 'Coca-Cola', label: 'كوكا كولا (Coca-Cola)', price: 1.3 },
  { id: 'Eau Minérale', label: 'ماء معدني (Eau minérale)', price: 1.0 },
];

const SUPPLEMENTS = [
  { id: 'Harissa', label: 'صلصة هريسة', price: 0.5 },
  { id: 'Fromage', label: 'جبن فوندو', price: 1.0 },
  { id: 'Frites', label: 'بطاطا مقلية', price: 1.5 },
];

export const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = memo(({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  const [servingType, setServingType] = useState<'Plat' | 'Sandwich'>('Plat');
  const [selectedBeverage, setSelectedBeverage] = useState<string>('Sans Boisson');
  const [supplements, setSupplements] = useState<string[]>([]);
  const [chefNotes, setChefNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Lock body scroll and register ESC key on modal open
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleToggleSupplement = (id: string) => {
    setSupplements((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const calculatedAddonsPrice = useMemo(() => {
    let extra = 0;
    const beverageObj = BEVERAGES.find((b) => b.id === selectedBeverage);
    if (beverageObj) extra += beverageObj.price;

    supplements.forEach((supId) => {
      const supObj = SUPPLEMENTS.find((s) => s.id === supId);
      if (supObj) extra += supObj.price;
    });

    return extra;
  }, [selectedBeverage, supplements]);

  const finalUnitPrice = (product?.price || 0) + calculatedAddonsPrice;
  const totalSummaryPrice = finalUnitPrice * quantity;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl max-h-[88vh] overflow-y-auto border-t sm:border border-slate-100/80 space-y-5 animate-in slide-in-from-bottom duration-300 font-sans no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Indicator Bar */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto -mt-2 mb-1 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>Recette Fraîche & Certifiée EAGLE TN</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Product Card Details */}
        <div className="flex gap-3.5 items-center bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70 shadow-xs">
          {product.image_url ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 bg-white">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <ChefHat className="w-8 h-8" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
              {product.name}
            </h3>
            <p className="text-xs font-black text-emerald-600 mt-1">
              {(product.price || 0).toFixed(3)} DT
            </p>
          </div>
        </div>

        {/* Section 1: Presentation Type */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
            1. Format de présentation / نوع التقديم
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {(['Sandwich', 'Plat'] as const).map((t) => {
              const isSelected = servingType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setServingType(t)}
                  className={`py-3.5 px-3 rounded-2xl font-extrabold text-xs text-center transition-all duration-200 cursor-pointer active:scale-95 border ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10'
                      : 'bg-slate-50/80 border-slate-200/70 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t === 'Plat' ? 'صحن (Plat)' : 'ساندويش (Sandwich)'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Beverages */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Wine className="w-3 h-3 text-slate-400" />
            <span>2. Boissons accompagnantes / المشروبات المصاحبة</span>
          </label>
          <div className="space-y-2">
            {BEVERAGES.map((bev) => {
              const isSelected = selectedBeverage === bev.id;
              return (
                <div
                  key={bev.id}
                  onClick={() => setSelectedBeverage(bev.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer text-xs font-bold transition-all duration-200 active:scale-[0.99] ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500/80 text-emerald-950 shadow-xs ring-1 ring-emerald-500/20'
                      : 'bg-slate-50/80 border-slate-200/70 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{bev.label}</span>
                    {bev.price > 0 && (
                      <span className="text-[10px] text-emerald-600 font-extrabold">
                        (+{bev.price.toFixed(3)} DT)
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" aria-hidden="true" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Supplements */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-slate-400" />
            <span>3. Suppléments / الإضافات</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SUPPLEMENTS.map((sup) => {
              const hasIt = supplements.includes(sup.id);
              return (
                <div
                  key={sup.id}
                  onClick={() => handleToggleSupplement(sup.id)}
                  className={`p-3 rounded-2xl border text-center cursor-pointer select-none transition-all duration-200 active:scale-95 ${
                    hasIt
                      ? 'border-emerald-500 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500/20'
                      : 'border-slate-200/70 bg-slate-50/80 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-[11px] font-black text-slate-900 tracking-tight">
                    {sup.label}
                  </p>
                  <p className="text-[10px] font-extrabold text-emerald-600 mt-0.5">
                    +{sup.price.toFixed(3)} DT
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Special Notes */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MessageSquarePlus className="w-3 h-3 text-slate-400" />
            <span>Instructions spéciales / توجيهات خاصة</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Sans oignon, sauce à part..."
            value={chefNotes}
            onChange={(e) => setChefNotes(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 text-xs font-bold focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Counter & Action Footer Block */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center border border-slate-200/80 rounded-2xl bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 hover:bg-white rounded-xl transition-all cursor-pointer active:scale-95 text-slate-600 hover:text-slate-900"
              aria-label="Diminuer la quantité"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-black text-slate-900 font-mono">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 hover:bg-white rounded-xl transition-all cursor-pointer active:scale-95 text-slate-600 hover:text-slate-900"
              aria-label="Augmenter la quantité"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onConfirm({
                type: servingType,
                beverage: selectedBeverage,
                supplements,
                notes: chefNotes,
                quantity,
              });
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider py-4 px-4 rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ajouter ({totalSummaryPrice.toFixed(3)} DT)</span>
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCustomizationModal.displayName = 'ProductCustomizationModal';

export default ProductCustomizationModal;
