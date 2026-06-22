import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassButton } from '@eagle-tn/ui';
import { useCartStore } from '../stores/useCartStore';
import { getRestaurantMenu, createOrder } from '@eagle-tn/database';
import type { MenuItem, TndAmount } from '@eagle-tn/database';

export default function RestaurantMenu() {
  const navigate = useNavigate();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { items: cartItems, addItem, removeItem, clearCart, getTotal, getItemCount } = useCartStore();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCartNotif, setShowCartNotif] = useState(false);

  const restaurantIdNum = restaurantId ? parseInt(restaurantId, 10) : 1;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      return;
    }

    setCheckoutLoading(true);
    setError(null);

    try {
      const createdOrder = await createOrder({
        restaurant_id: restaurantIdNum,
        customer_id: 1,
        delivery_address: 'Chez Am Ali, Tunis',
        items: cartItems.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price_tnd: item.priceTnd,
        })),
      });

      clearCart();
      navigate(`/order-tracking/${createdOrder.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de la commande';
      setError(message);
      console.error('Order creation error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Load menu from Supabase
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        const data = await getRestaurantMenu(restaurantIdNum);
        setMenuItems(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement du menu';
        setError(message);
        console.error('Menu load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, [restaurantIdNum]);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      priceTnd: item.price_tnd,
      description: item.description,
    });
    setShowCartNotif(true);
    setTimeout(() => setShowCartNotif(false), 2000);
  };

  const handleRemoveFromCart = (itemId: number) => {
    removeItem(itemId);
  };

  const totalTnd: TndAmount = getTotal();
  const itemCount = getItemCount();
  const totalFormatted = totalTnd.toFixed(3); // Format TND avec 3 décimales

  if (loading) {
    return (
      <div className="min-h-screen bg-ultra-dark-950 text-gray-100 flex items-center justify-center">
        <GlassCard className="max-w-md">
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 mx-auto"
            />
            <p className="text-zinc-400">Chargement du menu...</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ultra-dark-950 text-gray-100">
      {/* Header Premium */}
      <header className="sticky top-0 z-50 bg-zinc-900/70 backdrop-blur-md border-b border-white/10 shadow-glass">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/client-home"
              className="flex items-center gap-2 text-xl font-bold hover:text-amber-500 transition-colors duration-300"
            >
              ← العودة
            </Link>
            <h1 className="text-2xl font-bold flex-1 text-center">قائمة المطعم</h1>
            <div className="text-sm text-zinc-400">ID: {restaurantId}</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold mb-2 text-white"
            >
              الأطباق المتاحة
            </motion.h2>
            <p className="text-zinc-400 mb-6">اختر من القائمة الشهية لدينا</p>

            {menuItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">لا توجد أطباق متاحة حالياً</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence>
                  {menuItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleAddToCart(item)}
                      className="cursor-pointer group"
                    >
                      <GlassCard className="h-full flex flex-col justify-between hover:shadow-glass-lg hover:border-amber-500/60 transition-all duration-300">
                        <div>
                          <div className="flex items-center justify-between mb-3 group-hover:text-amber-400 transition-colors">
                            <h3 className="font-bold text-lg flex-1">{item.name}</h3>
                            <motion.span
                              className="text-amber-ultra-500 font-black text-lg bg-ultra-dark-950 px-3 py-1 rounded-full shadow-amber-glow"
                              whileHover={{ scale: 1.1 }}
                            >
                              {item.price_tnd.toFixed(3)} TND
                            </motion.span>
                          </div>
                          <p className="text-zinc-400 text-sm mb-4">{item.description}</p>
                          <p className="text-xs text-zinc-500 mb-4">📂 {item.category}</p>
                        </div>

                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                          <GlassButton variant="solid" className="w-full text-center">
                            🛒 Ajouter ({item.price_tnd.toFixed(3)} TND)
                          </GlassButton>
                        </motion.div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Sticky Premium Cart */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <GlassCard className="border-amber-ultra-500/20 hover:border-amber-ultra-500/50 transition-all duration-300">
                <div className="space-y-6">
                  {/* Cart Header */}
                  <div>
                    <h3 className="text-xl font-bold mb-1">🛒 Votre Panier</h3>
                    <p className="text-amber-ultra-500 text-sm font-semibold">
                      {itemCount} article{itemCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Cart Items */}
                  {cartItems.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-zinc-400 text-center py-8"
                    >
                      <p className="text-sm">Votre panier est vide</p>
                      <p className="text-xs text-zinc-500 mt-2">Sélectionnez un plat pour commencer</p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        <AnimatePresence>
                          {cartItems.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex items-center justify-between p-3 bg-ultra-dark-900/50 border border-white/5 rounded-lg hover:border-white/10 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{item.name}</p>
                                <p className="text-xs text-zinc-400">
                                  {item.quantity} × {item.priceTnd.toFixed(3)} TND
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="ml-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded px-2 py-1 transition-colors text-sm font-bold"
                              >
                                ✕
                              </motion.button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Total Section */}
                      <div className="border-t border-white/10 pt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white">Sous-total:</span>
                          <motion.span
                            key={totalFormatted}
                            initial={{ scale: 1.1, color: '#f59e0b' }}
                            animate={{ scale: 1, color: '#f59e0b' }}
                            className="text-amber-ultra-500 font-black text-lg"
                          >
                            {totalFormatted} TND
                          </motion.span>
                        </div>

                        {/* Checkout Button */}
                        <motion.div
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                            <GlassButton
                            variant="solid"
                            className="w-full justify-center font-bold"
                            disabled={cartItems.length === 0 || checkoutLoading}
                            onClick={handleCheckout}
                          >
                            {checkoutLoading ? 'Préparation en cours...' : '✓ Confirmer la Commande'}
                          </GlassButton>
                        </motion.div>
                      </div>
                    </>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Cart Notification Toast */}
      <AnimatePresence>
        {showCartNotif && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 bg-amber-ultra-500 text-zinc-950 px-6 py-3 rounded-lg font-semibold shadow-lg shadow-amber-500/30 z-40"
          >
            ✓ Ajouté au panier!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

