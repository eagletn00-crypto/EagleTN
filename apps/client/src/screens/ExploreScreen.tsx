import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Flame, Compass, ArrowRight } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// 🦅 ربط المركز السيادي والمخازن
import { Restaurant } from '@eagletn/types';
import { usePartners } from '../hooks/usePartners';
import { useCategories } from '../hooks/useCategories';
import RestaurantCard from '../components/RestaurantCard';
import SmartImage from '../components/SmartImage';

const TRENDING_SEARCHES = ['Pizza', 'Burger', 'Sushi', 'Tacos', 'Pâtisserie'];

export const ExploreScreen: React.FC = () => {
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // استدعاء البيانات الحقيقية
  const { data: partnersData } = usePartners({});
  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];

  // التأكد من صعود الصفحة للأعلى عند الفتح
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const triggerHaptic = async (style = ImpactStyle.Light) => {
    try { await Haptics.impact({ style }); } catch(e) {}
  };

  const handleClear = async () => {
    await triggerHaptic();
    setLocalQuery('');
    inputRef.current?.focus();
  };

  const handleQuickSearch = async (term: string) => {
    await triggerHaptic(ImpactStyle.Medium);
    setLocalQuery(term);
  };

  // محرك البحث السيادي (تصفية حية)
  const searchResults = useMemo(() => {
    if (!localQuery.trim()) return [];
    
    let partners: Restaurant[] = [];
    if (Array.isArray(partnersData)) {
      partners = partnersData as Restaurant[];
    } else if (partnersData && typeof partnersData === 'object' && 'pages' in partnersData) {
      partners = (partnersData as any).pages?.flatMap((p: any) => p.data || []) || [];
    }

    const q = localQuery.toLowerCase();
    return partners.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.name_fr?.toLowerCase().includes(q) ||
      p.name_ar?.includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }, [partnersData, localQuery]);

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] font-sans pb-[120px] selection:bg-[#C1121F]/20">
      
      {/* 🦅 THE SMART SEARCH HEADER */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-gray-200/50 pt-[env(safe-area-inset-top,16px)] pb-3 px-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h1 className="text-[20px] font-black text-[#1C1917] uppercase tracking-tight mb-3">
          Recherche <span className="text-[#C1121F] text-[14px] ml-1">(بحث)</span>
        </h1>
        
        <div className="relative w-full h-12 shadow-sm rounded-[16px] group">
          <input
            id="hero-search-input"
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Plat, restaurant ou catégorie..."
            className="w-full h-full pl-11 pr-12 bg-white rounded-[16px] text-[14px] font-bold text-[#1C1917] transition-all outline-none border border-gray-200 focus:border-[#C1121F] focus:ring-2 focus:ring-[#C1121F]/10 placeholder-gray-400"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#C1121F] transition-colors" strokeWidth={2.5} />
          
          <AnimatePresence>
            {localQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-[#1C1917] transition-colors outline-none"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="p-4">
        {/* 🦅 DISCOVERY MODE (When search is empty) */}
        {!localQuery.trim() ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Trending Keywords */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-[#C1121F] fill-[#C1121F]/20" strokeWidth={2} />
                <h2 className="text-[15px] font-black text-[#1C1917] uppercase tracking-wide">Populaire en ce moment</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {TRENDING_SEARCHES.map((term) => (
                  <motion.button
                    key={term}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickSearch(term)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-[12px] text-[13px] font-bold text-[#1C1917] shadow-sm hover:border-[#C1121F]/30 hover:shadow-md transition-all outline-none"
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Univers / Categories List */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Compass className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
                <h2 className="text-[15px] font-black text-[#1C1917] uppercase tracking-wide">Explorer par Univers</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categories.slice(0, 8).map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleQuickSearch(cat.name)}
                    className="relative h-20 rounded-[16px] overflow-hidden bg-gray-50 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] group outline-none text-left"
                  >
                    <SmartImage src={cat.coverImageUrl || ''} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 to-[#1C1917]/10" />
                    <span className="absolute bottom-2.5 left-3 text-white text-[13px] font-black tracking-wide drop-shadow-md">
                      {cat.localLabel || cat.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </section>

          </motion.div>
        ) : (
          
          /* 🦅 SEARCH RESULTS MODE */
          <div className="space-y-4">
            <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest px-1">
              Résultats pour "{localQuery}"
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="flex flex-col gap-5">
                {searchResults.map(p => (
                  <RestaurantCard 
                    key={p.id} 
                    restaurant={p} 
                    onClick={async () => { await triggerHaptic(); navigate(`/restaurant/${p.slug ? p.slug : p.id}`); }} 
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center mb-5">
                  <Search className="w-8 h-8 text-gray-300" strokeWidth={2} />
                </div>
                <h3 className="text-[18px] font-black text-[#1C1917] uppercase">Aucun résultat</h3>
                <p className="text-[13px] font-bold text-gray-500 mt-2 max-w-[250px] leading-relaxed font-arabic">
                  لم نتمكن من العثور على ما تبحث عنه. جرب كلمات مفتاحية أخرى.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExploreScreen;
