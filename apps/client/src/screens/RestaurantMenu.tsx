import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, Clock, Bike, Plus, Info, Search, ShoppingBag } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { usePartnerMenu } from '../hooks/usePartnerMenu';
import MenuItemModal from '../components/MenuItemModal';
// 🦅 الربط السيادي المركزي للبيانات والسلة
import { useCartStore } from '../store/useCartStore';
import { Restaurant, MenuItem } from '@eagletn/types';
import SmartImage from '../components/SmartImage';

const RestaurantMenu = () => {
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePartnerMenu(slugOrId);
  
  // 🛒 الربط الحي مع السلة
  const { items: cartItems } = useCartStore();
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const triggerHaptic = async (style = ImpactStyle.Light) => {
    try { await Haptics.impact({ style }); } catch(e) {}
  };

  const categories = useMemo(() => {
    if (!data?.menuItems) return ['Tous'];
    const cats = new Set(data.menuItems.map((item: MenuItem) => item.category));
    return ['Tous', ...Array.from(cats)];
  }, [data?.menuItems]);

  const filteredItems = useMemo(() => {
    if (!data?.menuItems) return [];
    if (activeCategory === 'Tous') return data.menuItems;
    return data.menuItems.filter((item: MenuItem) => item.category === activeCategory);
  }, [data?.menuItems, activeCategory]);

  const handleOpenItem = async (item: MenuItem) => {
    await triggerHaptic();
    setSelectedItem(item);
  };

  const handleGoBack = async () => {
    await triggerHaptic();
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[#FAF8F5] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-[3px] border-gray-200 border-t-[#C1121F] rounded-full animate-spin mb-4" />
        <p className="text-[#1C1917] font-black animate-pulse uppercase tracking-widest text-[11px]">Synchronisation...</p>
      </div>
    );
  }

  if (error || !data?.partner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#FAF8F5] px-4 text-center">
        <div className="w-20 h-20 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full flex items-center justify-center mb-6">
          <Info className="w-8 h-8 text-[#C1121F]" />
        </div>
        <h2 className="text-[22px] font-black text-[#1C1917] mb-2 uppercase tracking-tight">Boutique introuvable</h2>
        <p className="text-gray-500 font-bold text-[14px] mb-8">Ce partenaire est actuellement fermé ou introuvable.</p>
        <button onClick={handleGoBack} className="bg-[#1C1917] text-white px-8 py-3.5 rounded-full font-black text-[14px] uppercase tracking-wide active:scale-95 transition-transform shadow-lg">
          Retour
        </button>
      </div>
    );
  }

  const { partner } = data;
  const coverImg = partner.cover_url || partner.image_url;

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] font-sans pb-32">
      
      {/* 🦅 TIER 1: THE SOVEREIGN HEADER & COVER */}
      <div className="relative h-[260px] w-full bg-gray-100">
        <SmartImage 
          src={coverImg || ''} 
          alt={partner.name_fr} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/95 via-[#1C1917]/20 to-black/30" />

        {/* Top Nav Buttons */}
        <div className="absolute top-[env(safe-area-inset-top,16px)] left-0 right-0 px-4 pt-2 flex justify-between items-center z-10">
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={handleGoBack} 
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md border border-white/20 outline-none"
          >
            <ChevronLeft className="w-5 h-5 text-[#1C1917]" strokeWidth={2.5} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md border border-white/20 outline-none"
          >
            <Search className="w-4.5 h-4.5 text-[#1C1917]" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Floating Info Card */}
        <div className="absolute -bottom-5 left-4 right-4 bg-white rounded-3xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100/50">
          <div className="flex justify-between items-start mb-2.5">
            <div className="flex flex-col min-w-0 pr-2">
              <h1 className="text-[20px] font-black text-[#1C1917] leading-tight uppercase tracking-tight truncate">{partner.name_fr}</h1>
              {partner.name_ar && <p dir="auto" className="text-[14px] font-bold text-gray-400 mt-0.5 truncate">{partner.name_ar}</p>}
            </div>
            {Number(partner.rating) > 0 && (
              <div className="bg-gray-50 px-2 py-1.5 rounded-xl flex items-center gap-1 border border-gray-200 shrink-0">
                <Star className="w-3.5 h-3.5 text-[#C1121F] fill-[#C1121F]" />
                <span className="font-black text-[#1C1917] text-[12px]">{Number(partner.rating).toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 shrink-0">
              <Clock className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
              <span className="text-[12px] font-bold text-[#1C1917] mt-0.5">{partner.delivery_time || '20-30 min'}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0" />
            <div className="flex items-center gap-1.5 truncate">
              <Bike className={`w-4 h-4 shrink-0 ${partner.delivery_fee === 0 ? 'text-emerald-500' : 'text-gray-400'}`} strokeWidth={2.5} />
              <span className={`text-[12px] font-bold mt-0.5 truncate ${partner.delivery_fee === 0 ? 'text-emerald-600' : 'text-[#1C1917]'}`}>
                {partner.delivery_fee === 0 ? 'Livraison offerte' : `${partner.delivery_fee?.toFixed(3)} DT`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🦅 TIER 2: SMART CATEGORY TABS */}
      <div className="sticky top-0 bg-[#FAF8F5]/90 backdrop-blur-xl z-20 pt-10 pb-3 px-4 mt-1 border-b border-gray-200/50 shadow-sm">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={async () => { await triggerHaptic(); setActiveCategory(cat || ''); }}
                className={`shrink-0 px-4 py-2 rounded-full font-bold text-[13px] transition-all duration-300 outline-none ${
                  isActive 
                    ? 'bg-[#1C1917] text-white shadow-md' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 🦅 TIER 3: TREND I-1 MENU ITEMS */}
      <div className="px-4 mt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item: MenuItem, index: number) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="bg-white rounded-3xl p-3 flex gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 outline-none overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex-1 py-1 pl-1 flex flex-col pointer-events-none min-w-0">
                <h3 className="text-[16px] font-black text-[#1C1917] leading-tight mb-1 truncate">{item.name_fr}</h3>
                {item.name_ar && <p dir="auto" className="text-[13px] font-bold text-gray-400 mb-1.5 truncate">{item.name_ar}</p>}
                
                {item.description && (
                  <p className="text-[12px] font-medium text-gray-400 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>
                )}
                
                <div className="mt-auto">
                  <span className="text-[15px] font-black text-[#1C1917] bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                    {(item.price || 0).toFixed(3)} DT
                  </span>
                </div>
              </div>

              <div className="relative w-[110px] h-[110px] shrink-0 pointer-events-none rounded-[20px] overflow-hidden bg-gray-50">
                <SmartImage src={item.image_url || ''} alt={item.name_fr} className="w-full h-full object-cover" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#C1121F] rounded-tl-[16px] flex items-center justify-center shadow-md">
                  <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 🦅 THE SMART MODAL */}
      <MenuItemModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </div>
  );
};

export default RestaurantMenu;
