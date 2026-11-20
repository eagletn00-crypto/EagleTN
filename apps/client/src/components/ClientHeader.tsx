import React, { memo, useState, useEffect } from 'react';
import { ShoppingBag, Search, SlidersHorizontal, Navigation2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useCartStore } from '../store/useCartStore';
import { useSearchStore } from '../store/useSearchStore';
import { AddressModal } from './AddressModal';

export const ClientHeader: React.FC = memo(() => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  
  const cartItemsCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const placeholders = ["Un couscous royal...", "Une pâtisserie fine...", "Plat, restaurant ou boutique..."];
  const [phIndex, setPhIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhIndex(prev => (prev + 1) % placeholders.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const triggerHaptic = async (style = ImpactStyle.Light) => {
    try { await Haptics.impact({ style }); } catch (e) {}
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5] pb-3 font-sans select-none w-full border-b border-gray-200/50 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="pt-[env(safe-area-inset-top,12px)] px-4 flex flex-col gap-3">
          
          {/* TIER 1: Structural Compression */}
          <div className="flex items-center justify-between h-12 mt-1 gap-2">
            
            {/* Branding & Live Status */}
            <div className="flex items-center gap-1.5 shrink-0 cursor-pointer outline-none" onClick={() => { triggerHaptic(); navigate('/'); }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-sm">
                <path d="M12 1.5L2 7.5L5.5 11.5L12 22L18.5 11.5L22 7.5L12 1.5Z" fill="#1C1917"/>
                <path d="M12 6L8.5 9L12 12.5L15.5 9L12 6Z" fill="#FAF8F5"/>
                <path d="M12 14.5L9.5 11L5 12.5L12 19.5V14.5Z" fill="#C1121F"/>
                <path d="M12 14.5L14.5 11L19 12.5L12 19.5V14.5Z" fill="#C1121F"/>
              </svg>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1">
                  <span className="font-black text-[18px] text-[#C1121F] tracking-tight uppercase leading-none mt-0.5">EAGLE TN</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="16" height="11" className="rounded-[2px] shadow-sm shrink-0">
                    <rect width="1200" height="800" fill="#C1121F"/>
                    <circle cx="600" cy="400" r="200" fill="#fff"/>
                    <circle cx="580" cy="400" r="150" fill="#C1121F"/>
                    <circle cx="620" cy="400" r="120" fill="#fff"/>
                    <polygon points="650,330 670,380 720,380 680,410 700,460 650,430 600,460 620,410 580,380 630,380" fill="#C1121F"/>
                  </svg>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none">En ligne</span>
                </div>
              </div>
            </div>

            {/* Dynamic Localisation Pill */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => { triggerHaptic(); setIsAddressModalOpen(true); }}
              className="flex-1 min-w-0 mx-1 bg-white/60 border border-gray-200/60 rounded-full h-9 flex items-center justify-center px-2.5 gap-1.5 hover:bg-white transition-colors shadow-[0_1px_4px_rgba(0,0,0,0.02)] outline-none"
            >
              <Navigation2 className="w-3.5 h-3.5 text-[#C1121F] shrink-0" strokeWidth={2.5}/>
              <span className="text-[11px] font-bold text-[#1C1917] truncate animate-pulse">Localisation automatique...</span>
            </motion.button>

            {/* Pro Cart Component */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => { triggerHaptic(ImpactStyle.Medium); navigate('/checkout'); }}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 shrink-0 outline-none transition-all hover:shadow-md"
            >
              <ShoppingBag className="w-5 h-5 text-[#1C1917]" strokeWidth={2} />
              {cartItemsCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#C1121F] text-white text-[10px] font-black rounded-full flex items-center justify-center tabular-nums shadow-sm border-2 border-[#FAF8F5]"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* TIER 2: Search Engine */}
          <div className="relative w-full h-11 shadow-sm rounded-xl group">
            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-11 pr-12 bg-white rounded-xl text-[14px] font-semibold text-[#1C1917] transition-all outline-none border border-gray-200 focus:border-[#C1121F] focus:ring-2 focus:ring-[#C1121F]/10 relative z-40"
            />
            
            {!searchQuery && (
              <div className="absolute left-[44px] top-0 bottom-0 flex items-center pointer-events-none overflow-hidden right-[48px] z-40">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-[13px] font-medium text-gray-400 truncate"
                  >
                    {placeholders[phIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}

            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-[#C1121F] transition-colors z-40" strokeWidth={2.5} /> 
            
            <button
              onClick={() => triggerHaptic()}
              className="absolute right-1 top-1 bottom-1 w-[36px] bg-[#FAF8F5] rounded-lg flex items-center justify-center text-gray-600 hover:text-[#C1121F] transition-colors border border-gray-100 outline-none z-40"
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      <AddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} />
    </>
  );
});

ClientHeader.displayName = 'ClientHeader';
export default ClientHeader;
