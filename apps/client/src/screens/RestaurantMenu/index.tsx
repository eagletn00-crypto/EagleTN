import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutGrid, List } from 'lucide-react';
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
    async function loadData() {
      if (!id) return;
      setLoading(true);

      try {
        const { data: partnerData } = await supabase
          .from('partners')
          .select('*')
          .eq('id', id)
          .single();

        if (partnerData) {
          setPartner(partnerData);
        } else {
          setPartner({
            id,
            name: 'مطعم ' + id.slice(0, 5),
            category: 'Plats Populaires • Spécialités Tunisiennes',
            rating: 4.8,
            reviews_count: 50,
            delivery_time: '20-30 min',
            delivery_fee: '2.000 DT',
            banner_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
            is_royal: true
          });
        }

        const { data: itemsData } = await supabase
          .from('menu_items')
          .select('*')
          .eq('partner_id', id);

        if (itemsData && itemsData.length > 0) {
          setMenuItems(
            itemsData.map((item) => ({
              id: item.id,
              name_fr: item.name_fr || item.name,
              description_fr: item.description_fr || item.description,
              price: Number(item.price),
              image_url: item.image_url,
              is_popular: item.is_popular
            }))
          );
        } else {
          setMenuItems([
            {
              id: 'item-1',
              name_fr: 'Hergma Traditionnelle Royale',
              description_fr: 'Servie chaude avec pain artisanal, huile d\'olive du Sahel et harissa arbi.',
              price: 12.5,
              image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
              is_popular: true
            },
            {
              id: 'item-2',
              name_fr: 'Plat Ojja Merguez',
              description_fr: 'Œufs frais, tomates braisées, piments et merguez artisanales.',
              price: 9.8,
              image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600'
            }
          ]);
        }
      } catch (e) {
        console.error('Error fetching partner menu:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSelectItem = (item: MenuItem) => {
    addItem({
      id: item.id,
      partnerId: id!,
      name: item.name_fr || 'Plat',
      name_fr: item.name_fr || 'Plat',
      price: item.price
    });
  };

  const subtotal = getSubtotal();
  const deliveryFee = 2.0;
  const grandTotal = subtotal + (subtotal > 0 ? deliveryFee : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32 max-w-md mx-auto relative font-sans antialiased">
      {/* Partner Cover & Details */}
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

      {/* Menu Items List */}
      <div className={`px-4 pb-4 ${viewMode === 'card' ? 'grid grid-cols-1 gap-4' : 'space-y-3'}`}>
        {menuItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            viewMode={viewMode}
            onSelect={handleSelectItem}
          />
        ))}

        {/* INPDP Compliance Footer */}
        <div className="pt-8 pb-4 text-center space-y-1 col-span-full">
          <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
            <ShieldCheck size={13} className="text-emerald-600/80" />
            <span>Facturation conforme au modèle INPDP & MF Tunisie</span>
          </div>
          <p className="text-[9px] text-slate-400/80 font-medium">
            Tarifs affichés en Dinars Tunisiens (TND) • TVA Incluse
          </p>
        </div>
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
