import React, { useState } from 'react';
import { ArrowLeft, Heart, Star, Clock, Search, AlertCircle, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useRestaurantMenu } from './hooks/useRestaurantMenu';
import { useRestaurantData } from './hooks/useRestaurantData';
import { MenuItemCard } from './components/MenuItemCard';
import { CategorySelector } from './components/CategorySelector';
import { CustomizerModal } from './components/CustomizerModal';
import { SlideOverCartSheet } from './components/SlideOverCartSheet';
import { SuccessModalSheet } from './components/SuccessModalSheet';
import { OrderTrackingScreen } from '../OrderTrackingScreen';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { MenuItem } from './types';

interface RestaurantMenuProps {
  partnerId?: string;
  onBack?: () => void;
}

export function RestaurantMenuContent({ partnerId, onBack }: RestaurantMenuProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<MenuItem | null>(null);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');

  const { partner, loading: partnerLoading } = useRestaurantData(partnerId);
  const {
    menuItems,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    loading: menuLoading,
    error
  } = useRestaurantMenu(partnerId);

  const { items, getSubtotal, clearCart } = useCartStore();
  const totalCartCount = items.length;
  const totalCartPrice = getSubtotal();

  const coverImage = partner?.cover_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80';
  const partnerName = partner?.name || 'Restaurant';
  const rating = partner?.rating || 4.9;
  const isLoading = partnerLoading || menuLoading;

  const handleOrderSuccess = (orderId: string) => {
    setCurrentOrderId(orderId);
    setIsCartSheetOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleGoToTracking = () => {
    clearCart();
    setIsSuccessModalOpen(false);
    setIsTrackingActive(true);
  };

  if (isTrackingActive) {
    return (
      <ErrorBoundary fallbackRoute={() => setIsTrackingActive(false)}>
        <OrderTrackingScreen
          orderId={currentOrderId || 'demo-order-id'}
          onBackToHome={() => setIsTrackingActive(false)}
        />
      </ErrorBoundary>
    );
  }

  const heroItems = menuItems.filter(item => item.is_popular);
  const regularItems = menuItems.filter(item => !item.is_popular || searchQuery);

  return (
    <div className="bg-slate-50 min-h-screen pb-32 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* HEADER HERO BANNER */}
      <div className="relative w-full h-56 bg-slate-900">
        <img
          src={coverImage}
          alt={partnerName}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
          >
            <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-black tracking-tight">{partnerName}</h1>
            <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
              OUVERT
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-white/80">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span>{rating}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-slate-300" />
              <span>11:00 - 23:00</span>
            </div>
            <span>•</span>
            <span>🛵 15-25 min</span>
          </div>
        </div>
      </div>

      {/* STICKY SEARCH & CATEGORIES */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80 px-4 pt-3 pb-1">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="relative w-full">
            <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-emerald-600' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Rechercher un plat, boisson..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-sm"
            />
          </div>
          <CategorySelector
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>
      </div>

      {/* CONTENT & MENU GRID */}
      <div className="max-w-xl mx-auto px-4 pt-4 space-y-6">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-24 bg-white rounded-2xl border border-slate-100 p-3 flex gap-3 items-center">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                </div>
                <div className="w-20 h-20 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-red-100 p-6">
            <AlertCircle size={32} className="text-red-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 mb-1">Erreur de chargement</h3>
            <p className="text-xs text-slate-500 mb-4">{error}</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-6">
            <ShoppingBag size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">Aucun plat disponible</p>
          </div>
        ) : (
          <>
            {!searchQuery && heroItems.length > 0 && selectedCategoryId === 'all' && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 pl-1">Plats en Vedette 🔥</h2>
                <div className="grid grid-cols-1 gap-3">
                  {heroItems.map((item) => (
                    <div key={item.id} onClick={() => setSelectedItemForCustomization(item)} className="cursor-pointer">
                      <MenuItemCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {!searchQuery && heroItems.length > 0 && selectedCategoryId === 'all' && (
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 pl-1 pt-2">Menu Complete 📜</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {regularItems.map((item) => (
                  <div key={item.id} onClick={() => setSelectedItemForCustomization(item)} className="cursor-pointer">
                    <MenuItemCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* CUSTOMIZER MODAL */}
      <CustomizerModal
        item={selectedItemForCustomization as any}
        onClose={() => setSelectedItemForCustomization(null)}
      />

      {/* SLIDE-OVER CART REVIEW SHEET */}
      <SlideOverCartSheet
        isOpen={isCartSheetOpen}
        onClose={() => setIsCartSheetOpen(false)}
        onSuccess={handleOrderSuccess}
      />

      {/* SUCCESS MODAL SHEET */}
      <SuccessModalSheet
        orderId={currentOrderId}
        isOpen={isSuccessModalOpen}
        onNavigateToTracking={handleGoToTracking}
      />

      {/* FLOATING CART BAR */}
      {totalCartCount > 0 && !isCartSheetOpen && !isSuccessModalOpen && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-md z-40 animate-slide-up">
          <button
            onClick={() => setIsCartSheetOpen(true)}
            className="w-full bg-emerald-600/90 backdrop-blur-md border border-emerald-400/30 text-white rounded-full p-3 px-5 flex items-center justify-between shadow-xl shadow-emerald-950/20 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white text-emerald-900 text-xs font-black w-7 h-7 rounded-full flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
              <span className="text-xs font-bold text-white/90">Voir panier</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-white">
                {totalCartPrice.toFixed(3)} <span className="text-[10px] text-emerald-200">DT</span>
              </span>
              <ChevronRight size={18} className="text-emerald-200" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export function RestaurantMenu(props: RestaurantMenuProps) {
  return (
    <ErrorBoundary fallbackRoute={props.onBack}>
      <RestaurantMenuContent {...props} />
    </ErrorBoundary>
  );
}

export default RestaurantMenu;
