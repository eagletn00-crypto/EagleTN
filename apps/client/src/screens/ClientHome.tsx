import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronRight, Star, Clock, MapPin, ChevronDown } from 'lucide-react';
import { usePartners } from '../hooks/usePartners';

// STRICT ARCHITECTURE: Sub-components completely decoupled and imported from designated feature directories
import MerchantCardSkeleton from '../components/MerchantCardSkeleton';

// -----------------------------------------------------------------------------
// STRICT TYPE DEFINITIONS
// -----------------------------------------------------------------------------
export interface Category {
  readonly id: string;
  readonly slug: string;
  readonly label: string;
  readonly image_url: string;
}

export interface Partner {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly type: string;
  readonly cover_url: string;
  readonly logo_url: string;
  readonly delivery_time: string;
  readonly rating: number;
  readonly min_order: number;
  readonly tags: readonly string[];
  readonly status: 'active' | 'busy' | 'closed';
  readonly opening_time: string;
  readonly closing_time: string;
}

// -----------------------------------------------------------------------------
// CORE 6 PREMIUM CATEGORIES (Operational Segments)
// -----------------------------------------------------------------------------
const CATEGORIES: readonly Category[] = [
  { id: '1', slug: 'restaurant', label: 'RESTAURANT', image_url: '/categories/restaurant.png' },
  { id: '2', slug: 'patisserie', label: 'PÂTISSERIE', image_url: '/categories/patisserie.png' },
  { id: '3', slug: 'shopping', label: 'SHOPPING', image_url: '/categories/shopping.png' },
  { id: '4', slug: 'cosmetique', label: 'COSMÉTIQUE', image_url: '/categories/cosmetique.png' },
  { id: '5', slug: 'fleurs', label: 'FLEURS', image_url: '/categories/fleurs.png' },
  { id: '6', slug: 'boutique', label: 'BOUTIQUE', image_url: '/categories/boutique.png' },
];

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------
const ClientHome: React.FC = memo(() => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  
  // Dynamic Live Network Pipeline
  const { partners = [], isLoading = false } = usePartners({ categoryId: activeCategory } as any) as unknown as { partners: Partner[], isLoading: boolean };

  const isPartnerOpen = useCallback((openingTime: string, closingTime: string, status: string) => {
    if (status !== 'active') return false;
    if (!openingTime || !closingTime) return true;
    
    const now = new Date();
    const currentTime = now.getHours() + now.getMinutes() / 60;

    const [openH, openM] = openingTime.split(':').map(Number);
    const [closeH, closeM] = closingTime.split(':').map(Number);
    const open = openH + (openM || 0) / 60;
    const close = closeH + (closeM || 0) / 60;

    if (close < open) {
       return currentTime >= open || currentTime <= close; 
    }
    return currentTime >= open && currentTime <= close;
  }, []);

  const handlePartnerClick = useCallback((slug: string) => {
    navigate(`/restaurant/${slug}`);
  }, [navigate]);

  return (
    <div className="w-full min-h-[100dvh] bg-[#FAF9F6] flex flex-col transform-gpu">
      
      {/* Ivory Header / Location Meta */}
      <div className="w-full flex items-center justify-center pt-3 pb-4">
        <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors outline-none">
          <MapPin className="w-3.5 h-3.5 text-[#A37836]" strokeWidth={2} />
          <span className="text-[11px] font-black text-stone-800 tracking-wider uppercase">Tunis, Tunisie</span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" strokeWidth={2} />
        </button>
      </div>

      <main className="flex-1 w-full px-5 pb-32 flex flex-col gap-8">
        
        {/* Ivory/Matte Gold Bilingual Typography */}
        <section className="flex flex-col gap-1.5 select-none">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight leading-tight flex flex-col">
            <span className="font-sans text-[24px]">L'excellence à votre porte.</span>
            <span dir="rtl" className="font-sans text-[#A37836] text-[19px] mt-1.5 opacity-95 drop-shadow-sm">
              بنة عالمية وتوصيل في رمشة عين ✨
            </span>
          </h1>
        </section>
        
        {/* Search Architecture - Clean Boundaries */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4.5 h-4.5 text-stone-400 group-focus-within:text-[#A37836] transition-colors duration-300" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              placeholder="Rechercher une adresse, un plat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[52px] pl-11 pr-4 rounded-[1.5rem] bg-white border border-stone-100 shadow-[0_8px_24px_rgba(0,0,0,0.02)] transition-all duration-300 focus:outline-none focus:border-stone-200 focus:shadow-[0_12px_32px_rgba(0,0,0,0.04)] text-sm font-medium text-stone-800 placeholder-stone-400 outline-none"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="flex items-center justify-center w-[52px] h-[52px] rounded-[1.5rem] bg-white border border-stone-100 shadow-[0_8px_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.04)] text-stone-700 hover:text-[#A37836] shrink-0 outline-none"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" strokeWidth={1.5} />
          </motion.button>
        </div>

        {/* 6 Premium Operational Segments (Glassmorphic & Spring Interactive) */}
        <section className="flex flex-col gap-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 -mx-5 px-5 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? undefined : cat.slug)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`snap-start shrink-0 flex flex-col items-center justify-center gap-3 w-[100px] h-[120px] rounded-[2rem] bg-white/90 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.02)] border transition-all outline-none ${isActive ? 'border-[#A37836] shadow-[0_12px_32px_rgba(163,120,54,0.15)]' : 'border-stone-100 hover:border-stone-200'}`}
                >
                  <div className="w-[52px] h-[52px] rounded-full bg-[#FAF9F6] flex items-center justify-center overflow-hidden">
                     <img 
                       src={cat.image_url} 
                       alt={cat.label} 
                       loading="lazy"
                       className="w-8 h-8 object-contain drop-shadow-sm" 
                       onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                     />
                  </div>
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isActive ? 'text-[#A37836]' : 'text-stone-800'}`}>
                    {cat.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* Elite Partner Network Feed */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-black tracking-widest text-stone-900 uppercase">
              Sélection d'Élite
            </h2>
            <button className="text-[10px] font-bold text-stone-400 hover:text-stone-800 transition-colors uppercase tracking-wider flex items-center gap-0.5 outline-none">
              Découvrir <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                  <MerchantCardSkeleton />
                  <MerchantCardSkeleton />
                  <MerchantCardSkeleton />
                </motion.div>
              ) : (
                <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                  {partners.map((partner) => {
                    const isOpen = isPartnerOpen(partner.opening_time, partner.closing_time, partner.status);

                    return (
                      <motion.div 
                        key={partner.id}
                        onClick={() => handlePartnerClick(partner.slug)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="w-full bg-white rounded-[2.5rem] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.015)] border border-stone-100 transition-all duration-400 outline-none cursor-pointer group flex flex-col gap-4"
                      >
                        <div className="w-full h-[180px] rounded-[2rem] overflow-hidden relative border border-stone-50 isolate bg-stone-100">
                          <img 
                            src={partner.cover_url} 
                            alt={partner.name}
                            loading="lazy" 
                            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isOpen ? 'opacity-100 group-hover:scale-105' : 'opacity-85 grayscale-[15%]'}`} 
                          />
                          
                          <div className="absolute top-4 left-4 z-20 backdrop-blur-md bg-white/70 text-stone-900 tracking-wider text-[10px] uppercase font-black px-3 py-1 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/50">
                            {partner.type.split(' ')[0]}
                          </div>

                          <div className="absolute top-4 right-4 z-20 backdrop-blur-md bg-white/70 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/50">
                            <Star className="w-3 h-3 text-[#A37836] fill-[#A37836]" strokeWidth={1} />
                            <span className="text-[11px] font-black text-stone-900 tracking-tight">{partner.rating}</span>
                          </div>

                          {!isOpen && (
                            <div className="absolute bottom-0 inset-x-0 z-30 p-2">
                              <div className="w-full bg-white/95 backdrop-blur-xl p-3.5 rounded-[1.5rem] border border-white shadow-sm flex flex-col items-center justify-center text-center">
                                <span className="text-[11px] font-black text-stone-900 uppercase tracking-widest mb-0.5">Fermé actuellement</span>
                                <span className="text-[10px] font-semibold text-stone-500">Ouvre à {partner.opening_time?.slice(0, 5)} - Planifiez votre commande</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col px-3 pb-2 gap-2">
                           <div className="flex items-center justify-between">
                             <h3 className="text-[17px] font-black text-stone-900 tracking-tight transition-colors duration-300 group-hover:text-[#A37836]">
                               {partner.name}
                             </h3>
                           </div>
                           
                           <div className="flex items-center gap-3 text-stone-500">
                             <div className="flex items-center gap-1.5">
                               <Clock className="w-3.5 h-3.5 text-stone-400" strokeWidth={2} />
                               <span className="text-[12px] font-semibold tracking-wide">{partner.delivery_time}</span>
                             </div>
                             <span className="w-1 h-1 rounded-full bg-stone-300" />
                             <div className="flex items-center gap-1.5 text-stone-400">
                               <span className="text-[11px] font-bold tracking-widest uppercase truncate max-w-[120px]">
                                 {partner.tags?.join(' • ')}
                               </span>
                             </div>
                           </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>
    </div>
  );
});

ClientHome.displayName = 'ClientHome';
export default ClientHome;
