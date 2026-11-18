import React, { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, Search, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useCartStore } from '../store/useCartStore';

const NAV_ITEMS = [
  { id: '/', labelFr: 'Accueil', labelAr: 'الرئيسية', Icon: Compass },
  { id: '/explore', labelFr: 'Recherche', labelAr: 'بحث', Icon: Search },
  { id: '/checkout', labelFr: 'Panier', labelAr: 'السلة', Icon: ShoppingBag },
  { id: '/profile', labelFr: 'Profil', labelAr: 'حسابي', Icon: User },
];

export const BottomNavigation: React.FC = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCartStore();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleNav = async (path: string) => {
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch(e) {}

    if (path === '/explore' && location.pathname === '/') {
      const searchInput = document.getElementById('hero-search-input');
      if (searchInput) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        searchInput.focus();
        return;
      }
    }
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex flex-col pointer-events-none">
      
      {/* THE SMART FLOATING CART (Glassmorphic Pill) */}
      <AnimatePresence>
        {cartItemsCount > 0 && location.pathname !== '/checkout' && (
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-full px-4 mb-4 pointer-events-auto"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNav('/checkout')}
              className="w-full h-14 bg-[#1C1917]/95 backdrop-blur-xl text-white rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/10 flex items-center justify-between px-4 outline-none overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#C1121F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-full bg-[#C1121F] text-white flex items-center justify-center text-[13px] font-black tabular-nums shadow-sm border border-white/20">
                  {cartItemsCount}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[13px] font-black uppercase tracking-wider leading-none">Voir le panier</span>
                  <span className="text-[10px] font-bold text-gray-300 mt-0.5">عرض السلة وإتمام الطلب</span>
                </div>
              </div>
              <span className="text-[15px] font-black tabular-nums text-white relative z-10 bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
                {cartTotal.toFixed(3)} DT
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ULTRA-PREMIUM BOTTOM NAV BAR */}
      <div className="w-full bg-white/90 backdrop-blur-2xl border-t border-gray-200/80 pb-[env(safe-area-inset-bottom)] pointer-events-auto shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-around h-[68px] px-2 relative">
          {NAV_ITEMS.map(({ id, labelFr, labelAr, Icon }) => {
            const isActive = location.pathname === id || (id !== '/' && location.pathname.startsWith(id));

            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleNav(id)}
                className="relative flex flex-col items-center justify-center w-full h-full outline-none cursor-pointer group"
              >
                {/* Active Indicator (Top Line) */}
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-indicator" 
                    className="absolute top-0 w-[24px] h-[3px] bg-[#C1121F] rounded-b-full shadow-[0_2px_8px_rgba(193,18,31,0.5)]" 
                  />
                )}
                
                <div className="relative mt-1">
                  <Icon 
                    className={`w-[22px] h-[22px] transition-all duration-300 ${isActive ? 'text-[#C1121F] drop-shadow-sm' : 'text-gray-400 group-hover:text-gray-600'}`} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                </div>
                
                {/* Micro-Typography (Bilingual) */}
                <div className="flex flex-col items-center mt-1">
                  <span className={`text-[10px] font-black tracking-wide leading-none transition-colors ${isActive ? 'text-[#1C1917]' : 'text-gray-500'}`}>
                    {labelFr}
                  </span>
                  <span className={`text-[8px] font-bold leading-none mt-0.5 transition-colors ${isActive ? 'text-[#C1121F]' : 'text-gray-400'}`}>
                    {labelAr}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

BottomNavigation.displayName = 'BottomNavigation';
export default BottomNavigation;
