import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Clock, Bike } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { supabase } from '../lib/supabase';
import { useCategories } from '../hooks/useCategories';
import { usePartners } from '../hooks/usePartners';
import { useSearchStore } from '../store/useSearchStore';
import RestaurantCard from '../components/RestaurantCard';
import SmartImage from '../components/SmartImage';
import { LegalFooter } from '../components/LegalFooter';
import { LegalModal } from '../components/LegalModal';
// 🦅 الاستيراد من المركز السيادي للبيانات (Zero Type Duplication)
import { Restaurant } from '@eagletn/types';

export const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showLegal, setShowLegal] = useState(false);
  const { searchQuery } = useSearchStore();
  const { data: categoriesData } = useCategories();
  const { data: partnersData } = usePartners({});

  const categories = categoriesData || [];
  const QUICK_FILTERS = ['Ouvert (مفتوح)', '- 30 min (سريع)', 'Livraison offerte (مجاني)', '4.5+ (ممتاز)'];

  // Smart Filtering (To be migrated to backend in the future)
  const allPartners = useMemo(() => {
    let partners: Restaurant[] = [];
    if (Array.isArray(partnersData)) {
      partners = partnersData as Restaurant[];
    } else if (partnersData && typeof partnersData === 'object' && 'pages' in partnersData) {
      partners = (partnersData as any).pages?.flatMap((p: any) => p.data || []) || [];
    }

    partners = partners.filter(p => p.cover_url || p.image_url);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      partners = partners.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.name_fr?.toLowerCase().includes(q) ||
        p.name_ar?.includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    if (activeFilter) {
      if (activeFilter.includes('Ouvert')) partners = partners.filter(p => p.is_open);
      else if (activeFilter.includes('30 min')) partners = partners.filter(p => {
        const match = String(p.delivery_time || '').match(/\d+/g);
        return match ? Math.max(...match.map(Number)) <= 30 : false;
      });
      else if (activeFilter.includes('offerte')) partners = partners.filter(p => p.delivery_fee === 0);
      else if (activeFilter.includes('4.5+')) partners = partners.filter(p => Number(p.rating || 0) >= 4.5);
      else partners = partners.filter(p => p.category === activeFilter);
    }
    return partners;
  }, [partnersData, searchQuery, activeFilter]);

  const featuredPartners = useMemo(() => allPartners.filter(p => p.is_featured), [allPartners]);
  const nearbyPartners = useMemo(() => allPartners.filter(p => !p.is_featured), [allPartners]);

  const triggerHaptic = async (style = ImpactStyle.Light) => {
    try { await Haptics.impact({ style }); } catch(e) {}
  };

  const toggleFilter = async (filter: string) => {
    await triggerHaptic();
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  // Trend i-1 Micro-Interactions
  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#FAF8F5] font-sans selection:bg-[#C1121F]/20">
      <motion.main
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="flex flex-col pb-32 pt-4"
      >
        
        {/* TIER 1: Ultra-Premium Bento Grid (Glassmorphism & Shadows) */}
        {categories.length > 0 && (
          <motion.section variants={sectionVariants} className="mb-6 w-full">
            <h2 className="text-[19px] font-black tracking-tight text-[#1C1917] mb-4 px-4 uppercase font-bold text-[#C1121F]">
              Univers <span className="text-[#1C1917] text-[14px] ml-1 opacity-60 normal-case">(التصنيفات)</span>
            </h2>
            <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-3 snap-x snap-mandatory">
              {categories.slice(0, 5).map((cat, index) => (
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  key={cat.id}
                  onClick={() => toggleFilter(cat.name)}
                  // Dynamic Bento Sizing (First item is slightly larger for visual interest)
                  className={`snap-center shrink-0 overflow-hidden relative group outline-none rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_8px_25px_-5px_rgba(193,18,31,0.2)] border border-white/50 bg-white
                    ${index === 0 ? 'w-[160px] h-[170px]' : 'w-[130px] h-[170px]'}`}
                >
                  <SmartImage
                    src={cat.coverImageUrl || ''}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-active:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                  {/* Carthage Red Gradient Overlay for Brand Identity */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/90 via-[#1C1917]/30 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[15px] font-black text-white leading-tight drop-shadow-md">
                      {cat.localLabel || cat.name}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {/* TIER 2: Intelligent Pill Filters (Bilingual) */}
        <motion.div variants={sectionVariants} className="flex overflow-x-auto gap-2.5 px-4 no-scrollbar mb-8 pb-2">
          {QUICK_FILTERS.map((label) => {
            const isActive = activeFilter === label;
            // Split French and Arabic for better typography
            const [fr, ar] = label.split(' (');
            const cleanAr = ar ? ar.replace(')', '') : '';
            
            return (
              <motion.button
                key={label}
                whileTap={{ scale: 0.94 }}
                onClick={() => toggleFilter(label)}
                className={`shrink-0 h-[36px] px-4 rounded-full border text-[13px] font-bold shadow-sm transition-all outline-none cursor-pointer flex items-center justify-center gap-1.5 ${
                  isActive 
                    ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-[#C1121F]/20' 
                    : 'bg-white border-gray-200 text-[#1C1917] hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span>{fr}</span>
                {cleanAr && <span className={`text-[11px] font-medium ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{cleanAr}</span>}
              </motion.button>
            );
          })}
        </motion.div>

        {/* TIER 3: Featured Restaurants (À la une / الأبرز) */}
        {featuredPartners.length > 0 && (
          <motion.section variants={sectionVariants} className="px-4 space-y-5 mb-10">
            <div className="flex items-end justify-between border-b border-gray-200/60 pb-2">
              <div className="flex flex-col">
                <h2 className="text-[20px] font-black tracking-tight text-[#1C1917] uppercase">À la une</h2>
                <span className="text-[13px] font-bold text-[#C1121F] -mt-1">الأبرز والأكثر طلباً</span>
              </div>
              <span className="text-[13px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-100">{featuredPartners.length}</span>
            </div>
            
            <div className="flex flex-col gap-6">
              {featuredPartners.map(p => (
                // RestaurantCard must also be updated to accept the new centralized Type and display bilingual names
                <RestaurantCard key={p.id} restaurant={p} onClick={() => { triggerHaptic(); navigate(`/restaurant/${p.slug ? p.slug : p.id}`); }} />
              ))}
            </div>
          </motion.section>
        )}

        {/* TIER 4: Nearby (À proximité / بالقرب منك) */}
        {nearbyPartners.length > 0 && (
          <motion.section variants={sectionVariants} className="px-4 space-y-5">
            <div className="flex items-end justify-between border-b border-gray-200/60 pb-2">
              <div className="flex flex-col">
                <h2 className="text-[20px] font-black tracking-tight text-[#1C1917] uppercase">À proximité</h2>
                <span className="text-[13px] font-bold text-[#C1121F] -mt-1">اكتشف ما حولك</span>
              </div>
              <span className="text-[13px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-100">{nearbyPartners.length}</span>
            </div>
            
            <div className="flex flex-col gap-6">
              {nearbyPartners.map(p => (
                <RestaurantCard key={p.id} restaurant={p} onClick={() => { triggerHaptic(); navigate(`/restaurant/${p.slug ? p.slug : p.id}`); }} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty State Redesign */}
        <AnimatePresence>
          {allPartners.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 px-4 text-center"
            >
              <div className="w-20 h-20 bg-white rounded-full border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center mb-5">
                <Search className="w-8 h-8 text-[#C1121F]" strokeWidth={2} />
              </div>
              <h3 className="text-[18px] font-black text-[#1C1917] uppercase">Aucun résultat</h3>
              <p className="text-[14px] font-bold text-gray-500 mt-2 max-w-[250px] leading-relaxed">
                لا توجد نتائج مطابقة للبحث.<br/>يرجى تعديل الفلاتر والمحاولة مجدداً.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={sectionVariants}>
          <LegalFooter onOpenLegal={() => setShowLegal(true)} />
        </motion.div>
        
        <LegalModal isOpen={showLegal} onClose={() => setShowLegal(false)} />
      </motion.main>
    </div>
  );
};

export default ClientHome;
