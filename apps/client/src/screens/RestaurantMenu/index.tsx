import React, { useState } from 'react';
import { useRestaurantData } from './hooks/useRestaurantData';
import RestaurantHeader from './components/RestaurantHeader';
import CategorySelector from './components/CategorySelector';
import MenuItemCard from './components/MenuItemCard';
import SlideOverCartSheet from './components/SlideOverCartSheet';
import ProductDetailModal from './components/ProductDetailModal';
import OrderTracking from '../OrderTracking';

export const RestaurantMenu = () => {
  const { restaurant, categories, menuItems, isLoading } = useRestaurantData();
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const handleAdd = (id: string, qty = 1) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + qty }));
  };

  const handleRemove = (id: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id]--;
      else delete updated[id];
      return updated;
    });
  };

  const filteredItems = activeCategoryId === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category_id === activeCategoryId);

  const cartItemsList = Object.entries(cart).map(([id, quantity]) => {
    const item = menuItems.find((m) => m.id === id);
    return {
      id,
      name: item?.name_fr || item?.name || 'Produit',
      price: item?.price || 0,
      quantity,
    };
  });

  const cartTotalCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubTotal = cartItemsList.reduce((acc, i) => acc + i.price * i.quantity, 0);

  // عند نجاح الطلب يتم تفريغ السلة وفتح شاشة التتبع
  const handleOrderSuccess = (orderId: string) => {
    setCart({});
    setIsCartOpen(false);
    setActiveOrderId(orderId);
  };

  if (activeOrderId) {
    return (
      <OrderTracking
        orderId={activeOrderId}
        onBackToHome={() => setActiveOrderId(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-zinc-400 font-bold text-sm">
        Chargement de la carte...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-zinc-900 overflow-x-hidden relative">
      <RestaurantHeader restaurant={restaurant} />

      <CategorySelector
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />

      <main className={`p-4 ${cartTotalCount > 0 ? 'pb-36' : 'pb-12'}`}>
        <div className="grid grid-cols-2 gap-3.5">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              count={cart[item.id] || 0}
              onAdd={() => handleAdd(item.id)}
              onRemove={() => handleRemove(item.id)}
              onOpenDetails={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </main>

      {cartTotalCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-emerald-600 shadow-xl shadow-emerald-900/20 text-white rounded-full py-3.5 px-5 flex items-center justify-between active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 font-black text-xs px-2.5 py-1 rounded-full">
                {cartTotalCount}
              </span>
              <span className="font-bold text-sm">Voir le panier</span>
            </div>
            <span className="font-black text-sm">{(cartSubTotal + 2.500 + 0.500).toFixed(3)} DT</span>
          </button>
        </div>
      )}

      <ProductDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={(qty) => selectedItem && handleAdd(selectedItem.id, qty)}
      />

      <SlideOverCartSheet
        isOpen={isCartOpen}
        cartItems={cartItemsList}
        partnerId={restaurant?.id}
        deliveryFee={restaurant?.delivery_fee || 2.500}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default RestaurantMenu;
