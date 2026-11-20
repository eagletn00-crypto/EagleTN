import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, Minus } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { createPortal } from 'react-dom';
import SmartImage from './SmartImage';

export interface CustomizationPayload {
  productId: string;
  name_fr: string;
  unitPriceTTC: number;
  quantity: number;
  modifiers: Record<string, string | number>[];
  image_url?: string;
}

interface ProductCustomizationModalProps {
  isOpen: boolean;
  item: any;
  onClose: () => void;
  onConfirm: (payload: CustomizationPayload) => void;
}

const FORMAT_OPTIONS = [
  { id: 'sandwich', label: 'Format Sandwich', price: 0 },
  { id: 'plat', label: 'Format Plat', price: 3.000 }
];

const BEVERAGE_OPTIONS = [
  { id: 'none', label: 'Sans boisson', price: 0 },
  { id: 'coca', label: 'Coca-Cola', price: 2.500 },
  { id: 'boga', label: 'Boga Cidre', price: 2.500 },
  { id: 'water', label: 'Eau Minérale', price: 1.000 }
];

const SUPPLEMENT_OPTIONS = [
  { id: 'harissa', label: 'Harissa maison', price: 0.500 },
  { id: 'cheese', label: 'Fromage fondant', price: 1.500 },
  { id: 'egg', label: 'Œuf supplément', price: 1.000 },
  { id: 'fries', label: 'Frites extra', price: 2.000 }
];

export const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({ isOpen, item, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState(FORMAT_OPTIONS[0]);
  const [selectedBeverage, setSelectedBeverage] = useState(BEVERAGE_OPTIONS[0]);
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedFormat(FORMAT_OPTIONS[0]);
      setSelectedBeverage(BEVERAGE_OPTIONS[0]);
      setSelectedSupplements([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, item]);

  const basePrice = Number(item?.current_price ?? item?.price ?? 0);
  
  const unitPriceTTC = useMemo(() => {
    let total = basePrice + selectedFormat.price + selectedBeverage.price;
    selectedSupplements.forEach(supId => {
      const sup = SUPPLEMENT_OPTIONS.find(s => s.id === supId);
      if (sup) total += sup.price;
    });
    return total;
  }, [basePrice, selectedFormat, selectedBeverage, selectedSupplements]);

  const handleConfirm = async () => {
    try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch(e) {}
    
    const modifiers = [
      { type: 'Format', choice: selectedFormat.label, price: selectedFormat.price },
      { type: 'Boisson', choice: selectedBeverage.label, price: selectedBeverage.price },
      ...selectedSupplements.map(supId => {
        const sup = SUPPLEMENT_OPTIONS.find(s => s.id === supId);
        return { type: 'Supplément', choice: sup?.label || '', price: sup?.price || 0 };
      })
    ].filter(m => m.choice !== 'Sans boisson');

    onConfirm({
      productId: String(item.id),
      name_fr: item.name_fr || item.name || 'Produit',
      unitPriceTTC,
      quantity,
      modifiers,
      image_url: item.image_url || item.current_photo_url || item.img
    });
    onClose();
  };

  const toggleSupplement = async (id: string) => {
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch(e) {}
    setSelectedSupplements(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  if (!isOpen || !item) return null;

  const safeImg = item.image_url || item.current_photo_url || item.img;
  const displayName = item.name_fr || item.item_name_fr || item.name;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-[#FAF9F6] rounded-t-[2rem] z-[9999]0] flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="relative w-full bg-[#FFFFFF] pt-12 pb-5 px-6 flex items-center justify-center border-b border-[#1C1917]/10 rounded-t-[2rem]">
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-[#FAF9F6] rounded-full shadow-sm border border-[#1C1917]/10 flex items-center justify-center text-[#1C1917] outline-none">
            <X className="w-4 h-4" />
          </button>
          {safeImg ? (
            <img src={safeImg} alt={displayName} className="h-40 object-contain drop-shadow-lg" />
          ) : (
            <div className="h-20" />
          )}
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-[22px] font-black text-[#1C1917] leading-tight">{displayName}</h3>
            {item.description && <p className="text-[13px] font-medium text-[#1C1917]/60 mt-2">{item.description}</p>}
          </div>

          {/* Format Section */}
          <section>
            <h4 className="text-[14px] font-bold text-[#1C1917] mb-3 uppercase tracking-wider">Format</h4>
            <div className="flex flex-col gap-2">
              {FORMAT_OPTIONS.map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => { Haptics.impact({ style: ImpactStyle.Light }); setSelectedFormat(opt); }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${selectedFormat.id === opt.id ? 'bg-[#1C1917] text-[#FFFFFF] border-[#1C1917]' : 'bg-[#FFFFFF] text-[#1C1917] border-[#1C1917]/10'}`}
                >
                  <span className="text-[14px] font-bold">{opt.label}</span>
                  {opt.price > 0 && <span className="text-[13px] font-black tabular-nums">+{opt.price.toFixed(3)} DT</span>}
                </button>
              ))}
            </div>
          </section>

          {/* Beverage Section */}
          <section>
            <h4 className="text-[14px] font-bold text-[#1C1917] mb-3 uppercase tracking-wider">Boisson</h4>
            <div className="flex flex-col gap-2">
              {BEVERAGE_OPTIONS.map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => { Haptics.impact({ style: ImpactStyle.Light }); setSelectedBeverage(opt); }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${selectedBeverage.id === opt.id ? 'bg-[#1C1917] text-[#FFFFFF] border-[#1C1917]' : 'bg-[#FFFFFF] text-[#1C1917] border-[#1C1917]/10'}`}
                >
                  <span className="text-[14px] font-bold">{opt.label}</span>
                  {opt.price > 0 && <span className="text-[13px] font-black tabular-nums">+{opt.price.toFixed(3)} DT</span>}
                </button>
              ))}
            </div>
          </section>

          {/* Supplements Section */}
          <section>
            <h4 className="text-[14px] font-bold text-[#1C1917] mb-3 uppercase tracking-wider flex justify-between items-center">
              <span>Suppléments</span>
              <span className="text-[#1C1917]/50 text-[11px] normal-case tracking-normal">Optionnel</span>
            </h4>
            <div className="flex flex-col gap-2">
              {SUPPLEMENT_OPTIONS.map(opt => {
                const isSelected = selectedSupplements.includes(opt.id);
                return (
                  <button 
                    key={opt.id}
                    onClick={() => toggleSupplement(opt.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isSelected ? 'bg-[#FAF9F6] border-[#C59648] ring-1 ring-[#C59648]' : 'bg-[#FFFFFF] border-[#1C1917]/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-[#C59648] border-[#C59648]' : 'bg-transparent border-[#1C1917]/20'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FFFFFF] stroke-[3]" />}
                      </div>
                      <span className={`text-[14px] font-bold ${isSelected ? 'text-[#C59648]' : 'text-[#1C1917]'}`}>{opt.label}</span>
                    </div>
                    <span className={`text-[13px] font-black tabular-nums ${isSelected ? 'text-[#C59648]' : 'text-[#1C1917]/80'}`}>+{opt.price.toFixed(3)} DT</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="p-5 bg-[#FFFFFF] border-t border-[#1C1917]/10 pb-[env(safe-area-inset-bottom,20px)] flex items-center gap-4 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center bg-[#FAF9F6] rounded-xl border border-[#1C1917]/10 h-14 px-1.5 shrink-0">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center rounded-lg text-[#1C1917] bg-[#FFFFFF] shadow-sm active:scale-95 transition-all">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-[#1C1917] text-[16px] font-black min-w-[32px] text-center tabular-nums">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center rounded-lg text-[#1C1917] bg-[#FFFFFF] shadow-sm active:scale-95 transition-all">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleConfirm}
            className="flex-1 h-14 bg-[#1C1917] text-[#FFFFFF] rounded-xl font-bold text-[15px] shadow-lg flex items-center justify-center active:scale-[0.98] transition-all"
          >
            Ajouter • {(unitPriceTTC * quantity).toFixed(3)} DT
          </button>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(
    <AnimatePresence>{isOpen && modalContent}</AnimatePresence>,
    document.body
  );
};

export default ProductCustomizationModal;
