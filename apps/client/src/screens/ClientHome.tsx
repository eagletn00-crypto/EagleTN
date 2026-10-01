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

  return (
    <div className="min-h-screen bg-[#EAEAEA] text-slate-900 pb-24 max-w-md mx-auto relative shadow-2xl flex flex-col justify-between">
      <div>
        {/* Header with Eagle Logo & Dynamic Cart Count */}
        <ClientHeader
          cartCount={cartCount}
          onNavigateCart={onNavigateCart}
        />

        {/* Main Content Area */}
        <main className="px-4 space-y-3.5 pt-3">
          {/* Search Bar */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher un restaurant, pâtisserie, boutique..."
              className="w-full py-2.5 pl-9 pr-9 bg-white/90 border border-slate-300/70 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#E70013]/30 shadow-xs transition-shadow"
            />
            <span 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"
              aria-hidden="true"
            >
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Scroll with Ecosystem categories */}
          <CategoryScroll
            activeCategory={activeCategory}
            onSelectCategory={(id: string) => setActiveCategory(id)}
          />

          {/* Banner Promo with Eagle identity */}
          {showBanner && (
            <div className="relative w-full bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-xs space-y-2">
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 text-xs p-1"
                aria-label="Fermer le bandeau"
              >
                ✕
              </button>
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">🦅</span>
                <h3 className="text-xs font-black text-slate-900 tracking-tight">
                  Eagle TN - Votre destination gourmande.
                </h3>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">
                La qualité supérieure, le goût local.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[#E70013] font-black text-xs">
                <span aria-hidden="true">🛵</span>
                <span className="text-[#D97706] font-extrabold" dir="rtl">
                  بنة عالمية وتوصيل في رمشة عين
                </span>
              </div>
            </div>
          )}

          {/* Partners Section Title */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              NOS PARTENAIRES
            </h2>
            <span className="px-2.5 py-0.5 bg-emerald-100/80 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-200">
              2 disponibles
            </span>
          </div>

          {/* Restaurant Card */}
          <RestaurantCard
            name="ROYAL HERGMA & GRILLADES"
            image="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
            tag="ROI DU HERGMA"
            rating={4.9}
            reviewCount={142}
            deliveryTime="20-30 min"
            deliveryFee="2.000 DT"
            isOpen={true}
            onClick={() => handlePartnerClick('partner-royal-hergma', 'ROYAL HERGMA & GRILLADES')}
          />
        </main>
      </div>

      {/* Global Navigation Footer */}
      <ClientFooter />
    </div>
  );
};

export default ClientHome;
