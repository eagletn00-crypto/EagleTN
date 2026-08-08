import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutGrid, List, UtensilsCrossed } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../store/useCartStore';
import { PartnerProfileCard } from './components/PartnerProfileCard';
import { MenuItemCard, MenuItem } from './components/MenuItemCard';
import { SlideOverCartSheet } from './components/SlideOverCartSheet';

export const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, addItem, getSubtotal } = useCartStore();

  const [partner, setPartner] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'row' | 'card'>('row');

  useEffect(() => {
    async function fetchRealSupabaseData() {
      if (!id) return;
      setLoading(true);

      try {
        // 1. جلب بيانات الشريك/المطعم الحقيقية
        const { data: partnerData, error: partnerErr } = await supabase
          .from('partners')
          .select('*')
          .eq('id', id)
          .single();

        if (partnerErr) {
          console.error('Error fetching partner:', partnerErr);
        } else {
          setPartner(partnerData);
        }

        // 2. جلب الأطباق الحقيقية التابعة لهذا المطعم
        const { data: itemsData, error: itemsErr } = await supabase
          .from('menu_items')
          .select('*')
          .eq('partner_id', id);

        if (itemsErr) {
          console.error('Error fetching menu_items:', itemsErr);
        } else if (itemsData) {
          setMenuItems(
            itemsData.map((item) => ({
              id: item.id,
              name_fr: item.name_fr || item.name || 'Plat Sans Nom',
              description_fr: item.description_fr || item.description || '',
              price: Number(item.price) || 0,
              image_url: item.image_url,
              is_popular: item.is_popular || false
            }))
          );
        }
      } catch (e) {
        console.error('Unexpected Supabase fetch error:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchRealSupabaseData();
  }, [id]);

  const handleSelectItem = (item: MenuItem) => {
    addItem({
      id: item.id,
      partnerId: id!,
      name: item.name_fr,
      name_fr: item.name_fr,
      price: item.price
    });
  };

  const subtotal = getSubtotal();
  const deliveryFee = partner?.delivery_fee ? Number(partner.delivery_fee) : 2.0;
  const grandTotal = subtotal + (subtotal > 0 ? deliveryFee : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-400">Chargement du menu...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32 max-w-md mx-auto relative font-sans antialiased">
      {/* Partner Banner & Details */}
      <PartnerProfileCard partner={partner} onBack={() => navigate(-1)} />

      {/* Header with View Switcher */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          La Carte & Plats populaires
        </h2>

        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('row')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'row'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List size={15} />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'card'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* Menu Items List or Empty State */}
      {menuItems.length === 0 ? (
        <div className="my-12 px-4 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-3">
            <UtensilsCrossed size={28} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Aucun plat disponible</h3>
          <p className="text-xs text-slate-400 mt-1">Ce restaurant n'a pas encore ajouté de plats à son menu.</p>
        </div>
      ) : (
        <div className={`px-4 pb-4 ${viewMode === 'card' ? 'grid grid-cols-1 gap-4' : 'space-y-3'}`}>
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              onSelect={handleSelectItem}
            />
          ))}
        </div>
      )}

      {/* INPDP & MF Compliance Badge */}
      <div className="pt-8 pb-4 text-center space-y-1 px-4">
        <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
          <ShieldCheck size={13} className="text-emerald-600/80" />
          <span>Facturation conforme au modèle INPDP & MF Tunisie</span>
        </div>
        <p className="text-[9px] text-slate-400/80 font-medium">
          Tarifs affichés en Dinars Tunisiens (TND) • TVA Incluse
        </p>
      </div>

      {/* Floating Cart Button */}
      {items.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xl z-40">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
            <span className="text-sm font-bold">{subtotal.toFixed(3)} DT</span>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all"
          >
            Voir le Panier
          </button>
        </div>
      )}

      {/* SlideOver Cart Sheet */}
      <SlideOverCartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={items.map(i => ({ id: i.id, name: i.name_fr || i.name, price: i.price, quantity: i.quantity }))}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        grandTotal={grandTotal}
        onCheckout={() => {
          setIsCartOpen(false);
          navigate('/checkout');
        }}
      />
    </div>
  );
};

export default RestaurantMenu;
