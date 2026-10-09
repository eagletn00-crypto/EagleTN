import React, { useState } from 'react';
import ClientHeader from '../components/ClientHeader';
import CategoryScroll from '../components/CategoryScroll';
import RestaurantCard from '../components/RestaurantCard';
import ClientFooter from '../components/ClientFooter';

export interface ClientHomeProps {
  cartCount?: number;
  onNavigateCart?: () => void;
  onSelectPartner?: (partner: { id: string; name: string }) => void;
  onNavigateRestaurant?: (id: string) => void;
}

// مصفوفة الشركاء والمطاعم المتاحة مع بيانات مطعم عم علي الحقيقية
const PARTNERS_DATA = [
  {
    id: 'partner-am-ali',
    name: 'Chez Am Ali - عم علي',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    tag: '👑 ROI DU HERGMA',
    rating: 4.9,
    reviewCount: 142,
    deliveryTime: '20-30 min',
    deliveryFee: '2.000 DT',
    isOpen: true,
    category: 'restaurants',
  },
];

export const ClientHome: React.FC<ClientHomeProps> = ({
  cartCount = 0,
  onNavigateCart,
  onSelectPartner,
  onNavigateRestaurant,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('restaurants');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showBanner, setShowBanner] = useState<boolean>(true);

  const handlePartnerClick = (id: string, name: string) => {
    onSelectPartner?.({ id, name });
    onNavigateRestaurant?.(id);
  };

  // تصفية المطاعم بناءً على البحث
  const filteredPartners = PARTNERS_DATA.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 max-w-md mx-auto relative shadow-2xl flex flex-col justify-between font-['Plus_Jakarta_Sans']">
      <div>
        {/* Client Header */}
        <ClientHeader
          cartCount={cartCount}
          onNavigateCart={onNavigateCart}
        />

        {/* Main Workspace */}
        <main className="px-4 space-y-4 pt-3">
          
          {/* Ultra-Clean Search Bar */}
          <div className="relative w-full group">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors pointer-events-none text-sm"
              aria-hidden="true"
            >
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher un restaurant, pâtisserie, boutique..."
              className="w-full h-12 pl-11 pr-10 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-bold transition-all"
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            )}
          </div>

          {/* Ecosystem Category Horizontal Scroll */}
          <CategoryScroll
            activeCategory={activeCategory}
            onSelectCategory={(id: string) => setActiveCategory(id)}
          />

          {/* Premium Commercial Banner */}
          {showBanner && (
            <div className="relative w-full bg-white rounded-[24px] p-4 border border-slate-200/70 shadow-xs space-y-2 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-50 text-slate-400 hover:text-slate-700 flex items-center justify-center text-[10px] font-bold border border-slate-100 transition-all"
                aria-label="Fermer le bandeau"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-lg">🦅</span>
                <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
                  Eagle TN - Votre destination gourmande
                </h3>
              </div>
              
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                La qualité supérieure, le goût local.
              </p>
              
              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-amber-600 font-extrabold" dir="rtl">
                  بنة عالمية وتوصيل في رمشة عين 🛵
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                  EXPRESS
                </span>
              </div>
            </div>
          )}

          {/* Partners Header Section */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                NOS PARTENAIRES
              </h2>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200/60 shadow-2xs">
              {filteredPartners.length} disponible{filteredPartners.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Dynamic Restaurant Cards List */}
          <div className="space-y-3.5">
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <RestaurantCard
                  key={partner.id}
                  name={partner.name}
                  image={partner.image}
                  tag={partner.tag}
                  rating={partner.rating}
                  reviewCount={partner.reviewCount}
                  deliveryTime={partner.deliveryTime}
                  deliveryFee={partner.deliveryFee}
                  isOpen={partner.isOpen}
                  onClick={() => handlePartnerClick(partner.id, partner.name)}
                />
              ))
            ) : (
              <div className="bg-white rounded-[24px] border border-slate-200/70 p-8 text-center space-y-2 shadow-xs">
                <span className="text-2xl">🔍</span>
                <p className="text-xs font-bold text-slate-800">Aucun partenaire trouvé</p>
                <p className="text-[10px] text-slate-400 font-medium">Essayez de modifier votre recherche</p>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Global Navigation Footer */}
      <ClientFooter />
    </div>
  );
};

export default ClientHome;
