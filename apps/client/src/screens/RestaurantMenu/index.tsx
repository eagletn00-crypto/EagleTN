import React, { useEffect, useState } from 'react';
import { RestaurantHeader } from './components/RestaurantHeader';
import { MenuItemCard } from './components/MenuItemCard';
import { FloatingCartBar } from './components/FloatingCartBar';
import { Partner } from '../../types/partner';
import { fetchPartnerWithMenuByUuid } from '../../services/api';
import { useCart } from '../../context/CartContext';

export interface RestaurantMenuProps {
  partner: Partner;
  onBack: () => void;
  onGoToCheckout: () => void;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  partner: initialPartner,
  onBack,
  onGoToCheckout,
}) => {
  const { addToCart } = useCart();
  const [partner, setPartner] = useState<Partner>(initialPartner);
  const [realMenuItems, setRealMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    if (initialPartner && initialPartner.id) {
      setLoading(true);
      fetchPartnerWithMenuByUuid(initialPartner.id).then(({ partner: remotePartner, menuItems }) => {
        if (isMounted) {
          if (remotePartner) {
            setPartner(remotePartner);
          }
          setRealMenuItems(menuItems);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [initialPartner]);

  return (
    <div className="min-h-screen bg-slate-50 dir-ltr pb-28 selection:bg-emerald-500 selection:text-white">
      {/* Header Premium */}
      <RestaurantHeader
        name={partner?.name || 'Chez Om Ali'}
        nameAr=""
        rating={partner?.rating || 5.0}
        deliveryTime={partner?.estimated_time || '15-25 min'}
        deliveryFee={`${(partner?.delivery_fee || 2.5).toFixed(3)} DT`}
        coverImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000"
        onBack={onBack}
      />

      {/* Dynamic Content Container */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>🔥</span> Carte & Menu Spécialités
          </h2>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
            Supabase Live Sync
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 bg-white/60 animate-pulse rounded-2xl border border-slate-100 p-4 flex justify-between items-center">
                <div className="space-y-2 flex-1 pr-4">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : realMenuItems.length > 0 ? (
          <div className="space-y-3">
            {realMenuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                title={item.name || item.title || 'Spécialité Eagle'}
                titleAr=""
                price={typeof item.price === 'number' ? item.price.toFixed(3) : item.price}
                prepTime={item.prep_time || '15 min'}
                image={item.image_url || item.image || 'https://images.unsplash.com/photo-1541518763669-27fef04b14e8?w=500'}
                onAdd={() =>
                  addToCart({
                    id: item.id,
                    title: item.name || item.title,
                    price: typeof item.price === 'number' ? item.price : parseFloat(item.price),
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <MenuItemCard
              title="Couscous Agneau Traditionnel"
              price="18.500"
              prepTime="20 min"
              image="https://images.unsplash.com/photo-1541518763669-27fef04b14e8?w=500"
              onAdd={() =>
                addToCart({
                  id: 'item-1',
                  title: 'Couscous Agneau Traditionnel',
                  price: 18.500,
                })
              }
            />
            <MenuItemCard
              title="Plat Tunisien Gargoulette"
              price="14.000"
              prepTime="15 min"
              image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
              onAdd={() =>
                addToCart({
                  id: 'item-2',
                  title: 'Plat Tunisien Gargoulette',
                  price: 14.000,
                })
              }
            />
          </div>
        )}
      </div>

      {/* Floating Cart Bar Direct Binding */}
      <FloatingCartBar onCheckout={onGoToCheckout} />
    </div>
  );
};

export default RestaurantMenu;
