import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { createPortal } from 'react-dom';
import { useCartStore } from '../store/useCartStore';

export const FloatingSmartCart: React.FC = () => {
  const navigate = useNavigate();
  // Safe cast to access our upgraded state
  const { items } = useCartStore() as any;

  const totalQuantity = useMemo(() => {
    return (items || []).reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
  }, [items]);

  const totalAmount = useMemo(() => {
    return (items || []).reduce((sum: number, item: any) => sum + ((item.unitPriceTTC || 0) * (item.quantity || 1)), 0);
  }, [items]);

  const FREE_DELIVERY_THRESHOLD = 30.000;
  const progressPercent = Math.min(100, (totalAmount / FREE_DELIVERY_THRESHOLD) * 100);
  const isFreeDelivery = totalAmount >= FREE_DELIVERY_THRESHOLD;

  const handleCheckout = async () => {
    try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch (e) {}
    navigate('/checkout');
  };

  if (totalQuantity === 0) return null;

  const cartContent = (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-[74px] inset-x-4 z-[90] flex flex-col gap-2 pointer-events-none"
    >
      {/* Gold Free Delivery Progress Bar */}
      <div className="w-full bg-[#1C1917] rounded-xl p-2.5 shadow-lg border border-[#1C1917]/20 pointer-events-auto">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#FAF9F6] mb-2 px-1">
          {isFreeDelivery ? (
            <span className="text-[#C59648]">Livraison Offerte 🎉</span>
          ) : (
            <span>Plus que {(FREE_DELIVERY_THRESHOLD - totalAmount).toFixed(3)} DT pour livraison gratuite</span>
          )}
        </div>
        <div className="w-full h-1.5 bg-[#FAF9F6]/20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#C59648]" 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </div>

      {/* Main Cart Button */}
      <motion.button 
        whileTap={{ scale: 0.98 }}
        onClick={handleCheckout}
        className="w-full h-14 bg-[#FAF9F6] rounded-2xl shadow-xl border border-[#1C1917]/10 flex items-center justify-between px-4 outline-none cursor-pointer pointer-events-auto active:bg-[#F5F5F0] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1C1917] text-[#FAF9F6] flex items-center justify-center shadow-sm">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[#1C1917] text-[13px] font-black uppercase tracking-wider leading-none">
              Panier
            </span>
            <span className="text-[#1C1917]/60 text-[11px] font-bold mt-1 leading-none">
              {totalQuantity} article{totalQuantity > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#1C1917]/5 rounded-xl py-1.5 pl-3 pr-2">
          <span className="text-[#1C1917] text-[15px] font-black tabular-nums tracking-tight">
            {totalAmount.toFixed(3)} DT
          </span>
          <ArrowRight className="w-4 h-4 text-[#C59648] stroke-[3]" />
        </div>
      </motion.button>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>{cartContent}</AnimatePresence>,
    document.body
  );
};

export default FloatingSmartCart;
