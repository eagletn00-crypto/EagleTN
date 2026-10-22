import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { usePartners } from '../hooks/usePartners';

import ClientHeader from '../components/ClientHeader';
import SearchBar from '../components/SearchBar';
import CategoryScroll from '../components/CategoryScroll';
import RestaurantCard from '../components/RestaurantCard';
import LegalFooter from '../components/LegalFooter';
import MerchantCardSkeleton from '../components/MerchantCardSkeleton';

const CATEGORY_ITEMS = [
  { id: '1', title: 'RESTAURANTS', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300' },
  { id: '2', title: 'PÂTISSERIE', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300' },
  { id: '3', title: 'MODE & SHOPPING', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=300' },
  { id: '4', title: 'COSMÉTIQUE', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=300' },
  { id: '5', title: 'BOUTIQUE', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300' },
];

export interface ClientHomeProps {
  cartCount?: number;
  onSelectPartner?: (partner: any) => void;
  onNavigateCart?: () => void;
}

export const ClientHome: React.FC<ClientHomeProps> = ({ onSelectPartner }) => {
  const [showPromo, setShowPromo] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { activeTab, setCurrentScreen, selectPartnerWithIsolation } = useAppStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'search') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [activeTab]);

  const {
    data: partnersData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = usePartners({ categoryId: selectedCategory });

  const partners = partnersData?.pages.flatMap((page) => page.data) || [];

  const handlePartnerSelect = (partner: any) => {
    if (onSelectPartner) {
      onSelectPartner(partner);
    } else {
      selectPartnerWithIsolation(partner);
      setCurrentScreen('RESTAURANT_MENU');
    }
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory((prev) => (prev === catId ? null : catId));
  };

  return (
    <div className="min-h-screen bg-[#E9EBEF] font-sans text-stone-900 pb-32 relative selection:bg-emerald-500/20 antialiased overflow-x-hidden">
      
      <ClientHeader />

      <main className="px-4 space-y-6 mt-1">
        
        <SearchBar inputRef={searchInputRef} />

        <div className="space-y-3">
          <h2 className="text-[12px] font-black tracking-widest text-stone-800 uppercase pl-1 font-sans">
            Explorer l'écosystème
          </h2>
          <div className="flex overflow-x-auto gap-3.5 pb-2 -mx-4 px-4 scrollbar-none snap-x">
            {CATEGORY_ITEMS.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`snap-start shrink-0 w-[108px] h-[155px] rounded-[2rem] p-2.5 flex flex-col items-center justify-between transition-all duration-200 border border-white/80 ${
                    isSelected
                      ? 'bg-[#E9EBEF] shadow-[inset_3px_3px_6px_#c8cacb,inset_-3px_-3px_6px_#ffffff] scale-[0.98]'
                      : 'bg-[#E9EBEF] shadow-[5px_5px_12px_#c8cacb,-5px_-5px_12px_#ffffff] active:scale-95'
                  }`}
                >
                  <div className="w-full h-24 rounded-[1.4rem] overflow-hidden bg-white/50 shadow-inner flex items-center justify-center p-1">
                    <img src={cat.img} alt={cat.title} className="w-full h-full object-cover rounded-xl" loading="lazy" />
                  </div>
                  <span className="text-[10px] font-black text-stone-800 uppercase tracking-tight text-center leading-tight mb-1">
                    {cat.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {showPromo && (
          <div className="relative bg-[#E9EBEF] rounded-[2rem] p-5 border border-white/80 shadow-[6px_6px_14px_#c8cacb,-6px_-6px_14px_#ffffff] overflow-hidden">
            <button
              onClick={() => setShowPromo(false)}
              aria-label="Fermer"
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#E9EBEF] flex items-center justify-center text-stone-400 hover:text-stone-700 shadow-[2px_2px_5px_#c8cacb,-2px_-2px_5px_#ffffff]"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <div className="pr-6 space-y-1">
              <h3 className="text-sm font-black text-stone-900 tracking-tight leading-snug">
                Eagle TN - Votre destination gourmande.
              </h3>
              <p className="text-xs font-semibold text-stone-500">
                La qualité supérieure, le goût local.
              </p>
              <p className="text-sm font-extrabold text-[#D97706] pt-1.5 flex items-center gap-1.5">
                <span>بنة عالمية وتوصيل في رمشة عين</span>
                <span className="text-base">🛵</span>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between pl-1">
            <h2 className="text-[12px] font-black tracking-widest text-stone-800 uppercase font-sans">
              Nos Partenaires
            </h2>
            <span className="bg-[#D1FAE5] text-[#065F46] font-extrabold text-[10px] px-3 py-1 rounded-full shadow-sm tracking-wide">
              {isLoading ? '...' : `${partners.length} disponibles`}
            </span>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => <MerchantCardSkeleton key={`skeleton-${idx}`} />)
            ) : partners.length > 0 ? (
              partners.map((partner) => (
                <RestaurantCard
                  key={partner.id}
                  name={partner.name}
                  image={partner.imageUrl || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1000'}
                  rating={partner.rating || 4.9}
                  reviewCount={partner.reviewsCount || 142}
                  deliveryTime={partner.deliveryTime || '20-30 min'}
                  deliveryFee={partner.deliveryFee || '2.000 DT'}
                  isOpen={partner.isOpen ?? true}
                  onClick={() => handlePartnerSelect(partner)}
                />
              ))
            ) : (
              <div className="py-12 bg-[#E9EBEF] rounded-[2rem] shadow-[inset_3px_3px_6px_#c8cacb,inset_-3px_-3px_6px_#ffffff] text-center border border-white/60">
                <span className="text-3xl block mb-2">🍽️</span>
                <p className="text-xs font-extrabold text-stone-600">Aucun partenaire disponible</p>
              </div>
            )}
          </div>

          {hasNextPage && (
            <div className="pt-2 pb-2 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center justify-center gap-2 bg-[#E9EBEF] border border-white/80 shadow-[4px_4px_10px_#c8cacb,-4px_-4px_10px_#ffffff] active:shadow-[inset_2px_2px_5px_#c8cacb,inset_-2px_-2px_5px_#ffffff] px-6 py-3 rounded-full transition-all text-xs font-black uppercase text-stone-700 tracking-wider disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" /><span>Chargement...</span></>
                ) : (
                  <><span>Voir plus</span><ChevronDown className="w-3.5 h-3.5 text-stone-500" /></>
                )}
              </button>
            </div>
          )}
        </div>

        <LegalFooter />
      </main>
    </div>
  );
};

export default ClientHome;
