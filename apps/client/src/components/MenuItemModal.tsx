import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Flame, AlertCircle, ChefHat } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
// 🦅 استدعاء البيانات السيادية والسلة
import { MenuItem } from '@eagletn/types';
import { useCartStore } from '../store/useCartStore';
import SmartImage from './SmartImage';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ isOpen, onClose, item }) => {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const { addItem } = useCartStore(); // 🛒 استدعاء السلة الحقيقية

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setInstructions('');
    }
  }, [isOpen, item]);

  if (!item) return null;

  const handleQuantityChange = async (type: 'increase' | 'decrease') => {
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    try { await Haptics.impact({ style: ImpactStyle.Heavy }); } catch (e) {}
    
    // 🛒 ضخ البيانات بقوة في السلة
    addItem({
      item_id: item.id,
      merchantId: item.partner_id,
      options: [],
      name: item.name_fr,
      price: item.price,
      quantity,
      image_url: item.image_url,
});
    
    onClose();
  };

  const totalPrice = (item.price * quantity).toFixed(3);
  const isGrilled = item.name_fr?.toLowerCase().includes('grill') || item.name_ar?.includes('مشوي');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-end bg-[#1C1917]/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="relative w-full max-h-[90vh] bg-[#FAF8F5] rounded-t-[32px] overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
          >
            {/* 16:9 CINEMATIC HERO IMAGE */}
            <div className="relative h-[260px] shrink-0 bg-gray-100">
              <SmartImage 
                src={item.image_url || ''} 
                alt={item.name_fr} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-black/40 pointer-events-none" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#1C1917] active:scale-90 transition-transform shadow-md border border-white/20"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-[130px] -mt-8 relative z-10">
              <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100/80 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-4">
                    <h2 className="text-[22px] font-black text-[#1C1917] leading-tight flex items-center gap-2">
                      {item.name_fr}
                      {isGrilled && (
                        <motion.span animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                          <Flame className="w-5 h-5 text-[#C1121F] fill-[#C1121F]" />
                        </motion.span>
                      )}
                    </h2>
                    {item.name_ar && (
                      <h3 dir="auto" className="text-[17px] font-bold text-gray-500 mt-1.5 leading-snug truncate">
                        {item.name_ar}
                      </h3>
                    )}
                  </div>
                </div>

                {item.description && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-[13px] text-gray-500 font-bold leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {item.is_popular && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-lg">
                      🔥 Top Vente
                    </span>
                  )}
                  {item.is_spicy && (
                    <span className="px-2.5 py-1 bg-red-50 border border-red-200 text-[#C1121F] text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1">
                      🌶️ Piquant (حار)
                    </span>
                  )}
                </div>
              </div>

              {/* SPECIAL INSTRUCTIONS (Bilingual) */}
              <div className="mb-4 bg-white p-4 rounded-[24px] shadow-sm border border-gray-100/80">
                <h4 className="text-[15px] font-black text-[#1C1917] uppercase tracking-tight mb-2 pl-1">
                  Notes / ملاحظات
                </h4>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ex: Sans oignons, bien cuit... (بدون بصل، محمر جيدا...)"
                  className="w-full h-24 bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 text-[14px] font-bold text-[#1C1917] placeholder-gray-400 focus:outline-none focus:border-[#C1121F] focus:ring-1 focus:ring-[#C1121F] transition-all resize-none shadow-inner"
                  maxLength={150}
                />
              </div>

              <div className="flex items-start gap-3 bg-red-50/50 p-4 rounded-[20px] border border-red-100">
                <AlertCircle className="w-5 h-5 text-[#C1121F] shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
                  <strong className="text-[#C1121F]">Allergies ?</strong> Veuillez l'indiquer dans les notes ci-dessus.
                  <br/><span className="text-[10px] text-gray-500 mt-1 block">الرجاء الإشارة إلى أي حساسية غذائية في حقل الملاحظات.</span>
                </p>
              </div>
            </div>

            {/* FLOATING ACTION BAR (Trend i-1 Engine) */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 p-4 pb-[env(safe-area-inset-bottom,24px)] flex items-center gap-3 z-20">
              
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-full h-[54px] w-[130px] px-1.5 shrink-0 shadow-sm">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform outline-none ${quantity <= 1 ? 'opacity-30' : 'bg-white shadow-sm text-[#1C1917]'}`}
                >
                  <Minus className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <span className="text-[17px] font-black text-[#1C1917] w-8 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1C1917] active:scale-90 transition-transform outline-none border border-gray-100"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 h-[54px] bg-[#1C1917] hover:bg-black text-white rounded-full flex items-center justify-between px-5 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(0,0,0,0.2)] outline-none border border-white/10"
              >
                <div className="flex flex-col items-start">
                  <span className="font-black text-[14px] uppercase tracking-wider leading-none">Ajouter</span>
                  <span className="font-bold text-[9px] text-gray-400 mt-1">أضف إلى السلة</span>
                </div>
                <span className="font-black text-[16px] bg-white/10 px-3 py-1 rounded-full border border-white/5">{totalPrice} DT</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MenuItemModal;
