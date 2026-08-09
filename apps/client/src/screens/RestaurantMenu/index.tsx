import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { MenuItemCard, MenuItem } from './components/MenuItemCard';
import { useCartStore } from '../../store/useCartStore';

interface Partner {
  id: string;
  name: string;
  category?: string;
  rating?: number;
  banner_url?: string;
  delivery_fee?: number;
  delivery_time?: string;
}

export const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, addItem, getTotalItems, getSubtotal } = useCartStore();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      setLoading(true);
      try {
        // 1. جلب المطعم (إذا لم يوجد ID نجلب أول مطعم مثل عم علي)
        let partnerQuery = supabase.from('partners').select('*');
        if (id) {
          partnerQuery = partnerQuery.eq('id', id);
        }
        
        const { data: partnerData, error: partnerErr } = await partnerQuery.limit(1).single();
        if (partnerErr) throw partnerErr;

        setPartner(partnerData);

        // 2. جلب الأطباق التابعة لهذا المطعم
        const { data: itemsData, error: itemsErr } = await supabase
          .from('menu_items')
          .select('*')
          .eq('partner_id', partnerData.id);

        if (itemsErr) throw itemsErr;
        setMenuItems(itemsData || []);
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const handleSelectItem = (item: MenuItem, options?: any) => {
    addItem({
      id: item.id,
      name: item.name_fr,
      name_fr: item.name_fr,
      price: item.price,
      quantity: options?.quantity || 1,
      image_url: item.image_url,
      partnerId: partner?.id
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] max-w-md mx-auto pb-28 font-sans text-slate-900">
      {/* Header Banner */}
      <div className="relative h-48 bg-slate-900 overflow-hidden">
        {partner?.banner_url && (
          <img src={partner.banner_url} alt={partner.name} className="w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 p-2 bg-slate-900/60 backdrop-blur-md text-white rounded-xl hover:bg-slate-900 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
            {partner?.category || 'Cuisine Tunisienne'}
          </span>
          <h1 className="text-xl font-black text-white mt-1">{partner?.name || 'Restaurant'}</h1>
        </div>
      </div>

      {/* Menu List */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between py-1">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">La Carte & Spécialités</h2>
          <span className="text-xs font-bold text-slate-500">{menuItems.length} plats</span>
        </div>

        {menuItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
            <p className="text-sm font-bold text-slate-700">Aucun plat disponible pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                viewMode="row"
                onSelect={handleSelectItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4 z-40">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between hover:bg-slate-800 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-amber-500 text-slate-950 font-black rounded-lg flex items-center justify-center text-xs">
                {getTotalItems()}
              </div>
              <span className="text-xs font-black">Voir le panier</span>
            </div>
            <span className="text-xs font-black text-amber-400">{getSubtotal().toFixed(3)} DT</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
