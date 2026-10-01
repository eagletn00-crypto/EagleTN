import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, Banknote, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Partner } from '../../types/partner';
import { OrderItem } from '../../types/order';
import { fetchMenuItemsByPartner } from '../../services/api';
import { MenuItem } from './types';

import CategorySelector, { Category } from './components/CategorySelector';
import MenuItemCard from './components/MenuItemCard';
import ProductDetailModal from './components/ProductDetailModal';

interface RestaurantMenuProps {
  partner: Partner;
  cartItems: OrderItem[];
  onAddToCart: (item: { id: string; title: string; price: number }, quantity?: number) => void;
  onBack: () => void;
  onGoToCheckout: () => void;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  partner,
  cartItems,
  onAddToCart,
  onBack,
  onGoToCheckout,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      try {
        const items = await fetchMenuItemsByPartner(partner.id);
        if (items && items.length > 0) {
          setMenuItems(items as MenuItem[]);
        } else {
          setMenuItems([
            { id: 'm1', partner_id: partner.id, name: 'Plat Tunisien', name_fr: 'Plat Tunisien', name_ar: 'صحن تونسي', price: 6.000, category_id: 'plats', is_available: true },
            { id: 'm2', partner_id: partner.id, name: 'Eau Minérale 1.5L', name_fr: 'Eau Minérale 1.5L', name_ar: 'ماء كبير', price: 1.500, category_id: 'boissons', is_available: true },
            { id: 'm3', partner_id: partner.id, name: 'Casse-Croûte Merguez', name_fr: 'Casse-Croûte Merguez', name_ar: 'كسكروت مرقاز', price: 6.000, category_id: 'sandwichs', is_available: true },
            { id: 'm4', partner_id: partner.id, name: 'Lablabi Spécial', name_fr: 'Lablabi Spécial', name_ar: 'صحفة لبلابي عادية', price: 5.000, category_id: 'plats', is_available: true },
          ]);
        }
      } catch {
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, [partner.id]);

  const categories: Category[] = [
    { id: 'all', name: 'Tous', nameAr: 'الكل' },
    { id: 'plats', name: 'Plats', nameAr: 'أطباق' },
    { id: 'sandwichs', name: 'Sandwichs', nameAr: 'سندويشات' },
    { id: 'boissons', name: 'Boissons', nameAr: 'مشروبات' },
  ];

  const filteredItems = selectedCategoryId === 'all'
    ? menuItems
    : menuItems.filter((item) => {
        const catId = (item.category_id || '').toLowerCase();
        const catName = (item.category || '').toLowerCase();
        const searchCat = selectedCategoryId.toLowerCase();
        return catId === searchCat || catId.includes(searchCat) || catName.includes(searchCat);
      });

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + (item.total_price || 0), 0);

  const getItemPrice = (item: MenuItem): number => {
    return item.current_price !== undefined && item.current_price !== null
      ? item.current_price
      : item.price;
  };

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart({ id: item.id, title: item.name_fr || item.name, price: getItemPrice(item) }, 1);
  };

  const handleModalAddToCart = (item: MenuItem, quantity: number) => {
    onAddToCart({ id: item.id, title: item.name_fr || item.name, price: getItemPrice(item) }, quantity);
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA] font-sans pb-28 max-w-md mx-auto shadow-2xl border-x border-slate-200/80 antialiased selection:bg-[#E70013]/20">
      
      {/* Cover Header Image Frame */}
      <div className="relative h-60 w-full bg-slate-900 overflow-hidden">
        <img
          src={partner.cover_url || partner.cover || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'}
          alt={partner.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Back Navigation Action */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Retour"
          className="absolute top-4 left-4 w-9 h-9 rounded-2xl bg-white/80 backdrop-blur-md text-slate-800 shadow-md hover:bg-white flex items-center justify-center transition-all active:scale-90"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Floating Partner Banner Details */}
        <div className="absolute bottom-4 left-4 right-4 space-y-1.5 text-white">
          <div className="flex items-center gap-2">
            <span className="bg-[#E70013] text-white text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3" />
              Partenaire Vérifié
            </span>
            <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-black text-amber-400 border border-white/10">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{partner.rating || 5.0}</span>
            </div>
          </div>

          <h1 className="text-xl font-black text-white tracking-tight leading-snug">
            {partner.name}
          </h1>

          <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#E70013]" />
              {partner.delivery_time || '20-30 min'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
              {(partner.delivery_fee ?? 2.500).toFixed(3)} DT Livraison
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Category Bar Component */}
      <CategorySelector
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Menu Item Cards Feed */}
      <main className="p-4 space-y-3">
        {loading ? (
          <div className="py-16 text-center text-xs font-black text-slate-400 animate-pulse">
            Chargement de la carte...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs font-extrabold text-slate-500">
            Aucun article trouvé dans cette catégorie.
          </div>
        ) : (
          filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onSelect={(p) => setSelectedProduct(p)}
              onQuickAdd={(p, e) => handleQuickAdd(p, e)}
            />
          ))
        )}
      </main>

      {/* Detail Modal Component */}
      {selectedProduct && (
        <ProductDetailModal
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(item, qty) => handleModalAddToCart(item, qty)}
        />
      )}

      {/* Floating Red Brand Cart CTA (#E70013) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-5 left-0 right-0 px-4 max-w-md mx-auto z-40">
          <button
            type="button"
            onClick={onGoToCheckout}
            className="w-full bg-[#E70013] hover:bg-[#c80010] text-white rounded-2xl p-3.5 shadow-xl shadow-[#E70013]/30 flex items-center justify-between active:scale-[0.98] transition-all border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                <span className="absolute -top-1 -right-1 bg-white text-[#E70013] text-[10px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                  Panier en cours
                </p>
                <p className="text-xs font-black text-white truncate max-w-[150px]">
                  {partner.name}
                </p>
              </div>
            </div>

            <span className="text-xs font-black bg-white/20 text-white px-3 py-1.5 rounded-xl backdrop-blur-md">
              {totalCartPrice.toFixed(3)} DT
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
