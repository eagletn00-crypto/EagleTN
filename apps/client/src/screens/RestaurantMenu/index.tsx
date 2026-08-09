import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { MenuItemCard, MenuItem } from './components/MenuItemCard';
import { useCartStore } from '../../store/useCartStore';

interface Partner {
  id: string;
  name: string;
  category?: string;
  banner_url?: string;
}

export const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, getTotalItems, getSubtotal } = useCartStore();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurantData = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        let partnerData = null;

        if (id) {
          const { data, error } = await supabase
            .from('partners')
            .select('id, name, category, banner_url')
            .eq('id', id)
            .maybeSingle();

          if (error) throw error;
          partnerData = data;
        }

        // إذا لم يتم العثور على المطعم بـ ID، نجلب أول مطعم متاح من القائمة
        if (!partnerData) {
          const { data, error } = await supabase
            .from('partners')
            .select('id, name, category, banner_url')
            .limit(1)
            .maybeSingle();

          if (error) throw error;
          partnerData = data;
        }

        if (!partnerData) {
          if (isMounted) {
            setErrorMsg('Aucun restaurant trouvé.');
            setLoading(false);
          }
          return;
        }

        if (isMounted) setPartner(partnerData);

        // جلب الأطباق الخاصة بالمطعم
        const { data: itemsData, error: itemsErr } = await supabase
          .from('menu_items')
          .select('*')
          .eq('partner_id', partnerData.id);

        if (itemsErr) throw itemsErr;

        // معالجة البيانات لضمان عدم وجود أخطاء في الـ Render
        const formattedItems: MenuItem[] = (itemsData || []).map((item: any) => ({
          id: item.id,
          name_fr: item.name_fr || item.name || 'Plat sans nom',
          description_fr: item.description_fr || item.description || '',
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price || '0'),
          image_url: item.image_url || '',
          is_popular: Boolean(item.is_popular)
        }));

        if (isMounted) setMenuItems(formattedItems);
      } catch (err: any) {
        console.error('Error in RestaurantMenu:', err);
        if (isMounted) setErrorMsg(err?.message || 'Erreur lors du chargement du menu.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRestaurantData();

    return () => {
      isMounted = false;
    };
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
      <div className="min-h-screen bg-[#FDFBF7] max-w-md mx-auto flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 mt-3">Chargement du menu...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] max-w-md mx-auto p-4 flex flex-col items-center justify-center text-center">
        <p className="text-sm font-bold text-red-500 mb-4">{errorMsg}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-slate-900 text-white font-black text-xs px-5 py-2.5 rounded-xl"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] max-w-md mx-auto pb-28 font-sans text-slate-900">
      {/* Header Banner */}
      <div className="relative h-48 bg-slate-900 overflow-hidden">
        {partner?.banner_url ? (
          <img src={partner.banner_url} alt={partner.name} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-center text-amber-500 font-black">
            Eagle TN
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 p-2 bg-slate-900/60 backdrop-blur-md text-white rounded-xl hover:bg-slate-900 transition-all z-10"
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
