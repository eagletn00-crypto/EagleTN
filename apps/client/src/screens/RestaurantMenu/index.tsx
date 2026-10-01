import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, Star, Clock, Banknote, ShoppingBag, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { Partner } from '../../types/partner';
import { OrderItem } from '../../types/order';
import { fetchMenuItemsByPartner } from '../../services/api';
import { supabase } from '../../lib/supabase';

import CategorySelector, { Category } from './components/CategorySelector';
import MenuItemCard from './components/MenuItemCard';
import ProductDetailModal from './components/ProductDetailModal';

export interface MenuItem {
  id: string;
  partner_id: string;
  category_id?: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  description?: string;
  description_fr?: string;
  description_ar?: string;
  price: number;
  current_price?: number;
  image_url?: string;
  current_photo_url?: string;
  img?: string;
  is_available?: boolean;
  is_popular?: boolean;
  is_recommended?: boolean;
  badge?: string;
}

interface RestaurantMenuProps {
  partner: Partner;
  cartItems: OrderItem[];
  onAddToCart: (item: { id: string; title: string; price: number }, quantity?: number) => void;
  onRemoveFromCart?: (itemId: string) => void;
  onBack: () => void;
  onGoToCheckout: () => void;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  partner,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onBack,
  onGoToCheckout,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('incontournables');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function initData() {
      setLoading(true);
      try {
        const { data: dbCategories } = await supabase
          .from('categories')
          .select('id, name_fr, sort_order')
          .order('sort_order', { ascending: true });

        const dynamicCategories: Category[] = [
          { id: 'incontournables', name: 'Incontournables' },
          { id: 'all', name: 'Tous les plats' },
        ];

        if (dbCategories && dbCategories.length > 0) {
          dbCategories.forEach((cat) => {
            dynamicCategories.push({
              id: cat.id,
              name: cat.name_fr || 'Catégorie',
            });
          });
        }

        if (isMounted) setCategories(dynamicCategories);

        const data = await fetchMenuItemsByPartner(partner.id);
        if (isMounted) {
          if (data && Array.isArray(data)) {
            setMenuItems(data as unknown as MenuItem[]);
          } else {
            setMenuItems([]);
          }
        }
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
        if (isMounted) setMenuItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initData();

    return () => {
      isMounted = false;
    };
  }, [partner.id]);

  const getCleanTitle = useCallback((item: MenuItem): string => {
    const rawName = item.name_fr || item.name || '';
    return rawName.replace(/\s*\([^)]*\)/g, '').trim();
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategoryId === 'incontournables') {
        return item.is_popular === true || item.is_recommended === true;
      }
      if (selectedCategoryId === 'all') {
        return true;
      }
      return item.category_id === selectedCategoryId;
    });
  }, [menuItems, selectedCategoryId]);

  const { totalCartCount, totalCartPrice } = useMemo(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const price = cartItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
    return { totalCartCount: count, totalCartPrice: price };
  }, [cartItems]);

  const handleQuickAdd = useCallback(
    (item: MenuItem, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const title = getCleanTitle(item);
      const price = item.current_price ?? item.price;
      onAddToCart({ id: item.id, title, price }, 1);
    },
    [getCleanTitle, onAddToCart]
  );

  const handleQuickRemove = useCallback(
    (itemId: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (onRemoveFromCart) {
        onRemoveFromCart(itemId);
      }
    },
    [onRemoveFromCart]
  );

  const handleModalAddToCart = useCallback(
    (item: MenuItem, quantity: number) => {
      const title = getCleanTitle(item);
      const price = item.current_price ?? item.price;
      onAddToCart({ id: item.id, title, price }, quantity);
    },
    [getCleanTitle, onAddToCart]
  );

  const getItemQuantity = useCallback(
    (itemId: string): number => {
      const found = cartItems.find((ci) => ci.id === itemId || ci.menu_item_id === itemId);
      return found ? found.quantity : 0;
    },
    [cartItems]
  );

  const displayName = useMemo(() => {
    return partner.name?.includes('Royal') ? 'Chez Om Ali (عم علي)' : partner.name || 'Restaurant';
  }, [partner.name]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Plus_Jakarta_Sans','Inter',sans-serif] pb-32 max-w-md mx-auto shadow-2xl border-x border-slate-200/60 antialiased selection:bg-[#059669]/10 relative">
      <div className="relative bg-white border-b border-slate-200/60 pb-3.5">
        <div className="relative h-52 w-full bg-slate-950 overflow-hidden">
          <img
            src={
              partner.cover_url ||
              partner.cover ||
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
            }
            alt={displayName}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          <button
            type="button"
            onClick={onBack}
            aria-label="Retour"
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-xl text-white border border-white/20 shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 hover:bg-slate-900/80"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        <div className="px-5 pt-4 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {displayName}
              </h1>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Cuisine Traditionnelle & Spécialités Tunisiennes
              </p>
            </div>

            <div className="flex items-center gap-1 bg-amber-50/90 border border-amber-200/80 px-2.5 py-1 rounded-xl text-xs font-black text-amber-700 shadow-2xs backdrop-blur-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{partner.rating || 5.0}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#059669] stroke-[2.2]" />
              {partner.delivery_time || '20-30 min'}
            </span>

            <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xs">
              <Banknote className="w-3.5 h-3.5 text-[#059669] stroke-[2.2]" />
              {(partner.delivery_fee ?? 2.5).toFixed(3)} DT
            </span>

            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200/70 text-[#059669] text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-2xs uppercase tracking-wider ml-auto">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.2]" />
              Vérifié
            </span>
          </div>
        </div>
      </div>

      <CategorySelector
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <main className="p-4 space-y-3.5 min-h-[300px]">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="relative w-10 h-10 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-[#059669] border-t-transparent animate-spin" />
            </div>
            <p className="text-xs font-bold text-slate-400 tracking-wide uppercase">
              Chargement de la carte...
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-white rounded-2xl border border-slate-200/70 p-8 shadow-2xs">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
            <p className="text-xs font-extrabold text-slate-500">Aucun article disponible</p>
            <p className="text-[11px] font-medium text-slate-400">
              Essayez de choisir une autre catégorie ci-dessus.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={
                {
                  ...item,
                  name: getCleanTitle(item),
                  price: item.current_price ?? item.price,
                  img: item.current_photo_url || item.image_url || item.img,
                } as any
              }
              quantity={getItemQuantity(item.id)}
              onSelect={(p: any) => setSelectedProduct(p)}
              onAdd={(p: any, e: React.MouseEvent) => handleQuickAdd(p, e)}
              onRemove={(p: any, e: React.MouseEvent) => handleQuickRemove(p.id, e)}
            />
          ))
        )}
      </main>

      <ProductDetailModal
        item={selectedProduct as any}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(item: any, qty: number) => handleModalAddToCart(item, qty)}
      />

      {totalCartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 max-w-md mx-auto z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <button
            type="button"
            onClick={onGoToCheckout}
            className="w-full bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white rounded-2xl p-3.5 shadow-2xl shadow-[#059669]/35 flex items-center justify-between transition-all duration-200 border border-emerald-400/30 group"
          >
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white shadow-inner">
                <ShoppingBag className="w-5 h-5 stroke-[2.3]" />
                <span className="absolute -top-1.5 -right-1.5 bg-white text-[#059669] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalCartCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-emerald-100 uppercase tracking-widest">
                  Panier en cours
                </p>
                <p className="text-xs font-bold text-white truncate max-w-[140px]">
                  {displayName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-white/20 text-white px-3.5 py-2 rounded-xl backdrop-blur-md border border-white/10 tracking-tight">
                {totalCartPrice.toFixed(3)} <span className="text-[10px] font-extrabold">DT</span>
              </span>
              <ChevronRight className="w-5 h-5 text-emerald-100 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
