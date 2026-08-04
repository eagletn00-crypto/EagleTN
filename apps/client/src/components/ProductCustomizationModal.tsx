import React, { useState } from 'react';
import { X, Plus, Minus, ShieldCheck } from 'lucide-react';

interface ProductCustomizationModalProps {
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

export default function ProductCustomizationModal({ isOpen, product, onClose, onConfirm }: ProductCustomizationModalProps) {
  const [servingType, setServingType] = useState<'Plat' | 'Sandwich'>('Plat');
  const [selectedBeverage, setSelectedBeverage] = useState<string>('Sans Boisson');
  const [supplements, setSupplements] = useState<string[]>([]);
  const [chefNotes, setChefNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen) return null;

  const handleToggleSupplement = (id: string) => {
    setSupplements(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const calculateAddonsPrice = () => {
    let extra = 0;
    if (selectedBeverage === 'Coca-Cola') extra += 1.300;
    if (supplements.includes('Frites')) extra += 1.500;
    if (supplements.includes('Fromage')) extra += 1.000;
    if (supplements.includes('Harissa')) extra += 0.500;
    return extra;
  };

  const finalUnitPrice = product.price + calculateAddonsPrice();
  const totalSummaryPrice = finalUnitPrice * quantity;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-[32px] p-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up border-t border-slate-100">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-emerald-600 text-[9px] font-black tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Recette Fraîche & Certifiée</span>
          </div>
          <button onClick={onClose} className="p-1.5 bg-slate-50 border border-slate-200/50 rounded-full hover:bg-slate-100">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {product.image_url && (
          <div className="mt-4 rounded-2xl overflow-hidden h-36 relative border border-slate-100 shadow-2xs">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{product.name}</h3>
          <p className="text-xs font-black text-eagle-red">{product.price.toFixed(3)} DT</p>
        </div>

        <div className="mt-5 space-y-5">
          {/* Section 1: Type Selection */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">(Format) نوع التقديم .1</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Sandwich', 'Plat'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setServingType(t)}
                  className={`py-2.5 rounded-xl font-bold text-xs border text-center transition-all ${
                    servingType === t 
                      ? 'bg-eagle-red border-eagle-red text-white shadow-xs' 
                      : 'bg-slate-50 border-slate-200/60 text-slate-700'
                  }`}
                >
                  {t === 'Plat' ? '(Plat) صحن' : '(Sandwich) ساندويش'}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Beverages */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">(Boissons) المشروبات المصاحبة .2</label>
            <div className="space-y-2">
              {[
                { id: 'Sans Boisson', label: 'بدون مشروب', extra: 0 },
                { id: 'Coca-Cola', label: 'كوكا كولا (+1.300 DT)', extra: 1.300 },
                { id: 'Eau Minérale', label: 'ماء معدني (+1.000 DT)', extra: 1.000 }
              ].map(bev => (
                <div
                  key={bev.id}
                  onClick={() => setSelectedBeverage(bev.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                    selectedBeverage === bev.id 
                      ? 'bg-eagle-dark border-eagle-dark text-white' 
                      : 'bg-slate-50 border-slate-200/50 text-slate-800'
                  }`}
                >
                  <span>{bev.label}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedBeverage === bev.id ? 'border-white bg-eagle-red' : 'border-slate-300 bg-white'}`}>
                    {selectedBeverage === bev.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Supplements */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">(Supplements) الإضافات الإضافية .3</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Harissa', label: 'صلصة هريسة', price: '+0.500 DT' },
                { id: 'Fromage', label: 'جبن فوندو', price: '+1.000 DT' },
                { id: 'Frites', label: 'بطاطا مقلية', price: '+1.500 DT' }
              ].map(sup => {
                const hasIt = supplements.includes(sup.id);
                return (
                  <div
                    key={sup.id}
                    onClick={() => handleToggleSupplement(sup.id)}
                    className={`p-2 rounded-xl border text-center cursor-pointer select-none transition-all ${
                      hasIt ? 'border-eagle-red bg-red-50/50' : 'border-slate-200/60 bg-slate-50'
                    }`}
                  >
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight">{sup.label}</p>
                    <p className="text-[8px] font-bold text-slate-500 mt-0.5">{sup.price}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">توجيهات الشيف الخاصة</label>
            <input
              type="text"
              placeholder="Ex: Moins de sel, sauce à part..."
              value={chefNotes}
              onChange={(e) => setChefNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:bg-white focus:border-slate-300 text-slate-900"
            />
          </div>
        </div>

        {/* Counter and Final Insertion CTA Action Block */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center border border-slate-200/80 rounded-xl bg-slate-50 p-1">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-2 hover:bg-white rounded-lg transition-colors border-none bg-transparent cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <span className="px-3 text-xs font-black text-slate-900 font-mono">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="p-2 hover:bg-white rounded-lg transition-colors border-none bg-transparent cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>

          <button
            onClick={() => {
              onConfirm({
                type: servingType,
                beverage: selectedBeverage,
                supplements,
                notes: chefNotes,
                quantity
              });
              onClose();
            }}
            className="flex-1 bg-eagle-red hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl border-none shadow-md transition-all active:scale-98 cursor-pointer"
          >
            إضافة للسلة ({totalSummaryPrice.toFixed(3)} DT)
          </button>
        </div>

      </div>
    </div>
  );
}
