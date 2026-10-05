import React, { useEffect, useCallback } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import SplashScreen from './screens/SplashScreen';
import ClientHome from './screens/ClientHome';
import RestaurantMenu from './screens/RestaurantMenu/index';
import Checkout from './screens/Checkout';
import OrderTracking from './screens/OrderTracking';
import ProfileScreen from './screens/ProfileScreen';
import SupportModal from './screens/SupportModal';
import BottomNavigation from './components/BottomNavigation';
import ErrorBoundary from './components/ErrorBoundary';
import { useAppStore, ScreenType, TabType } from './store/useAppStore';
import { fetchPartners } from './services/api';
import { supabase } from './lib/supabase';
import { Partner } from './types/partner';
import { Order } from './types/order';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 8, scale: 0.99 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -6, 
    scale: 0.99, 
    transition: { duration: 0.15, ease: [0.7, 0, 0.84, 0] } 
  },
};

export const AppRoutes: React.FC = () => {
  const currentScreen = useAppStore((s) => s.currentScreen);
  const activeTab = useAppStore((s) => s.activeTab);
  const selectedPartner = useAppStore((s) => s.selectedPartner);
  const cartItems = useAppStore((s) => s.cartItems);
  const currentOrder = useAppStore((s) => s.currentOrder);
  const customerAddress = useAppStore((s) => s.customerAddress);
  const isSupportOpen = useAppStore((s) => s.isSupportOpen);

  const setCurrentScreen = useAppStore((s) => s.setCurrentScreen);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const setPartners = useAppStore((s) => s.setPartners);
  const setSelectedPartner = useAppStore((s) => s.setSelectedPartner);
  const setIsSupportOpen = useAppStore((s) => s.setIsSupportOpen);
  const addToCart = useAppStore((s) => s.addToCart);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const clearCart = useAppStore((s) => s.clearCart);
  const selectPartnerWithIsolation = useAppStore((s) => s.selectPartnerWithIsolation);
  const setCurrentOrder = useAppStore((s) => s.setCurrentOrder);

  useEffect(() => {
    let isMounted = true;
    fetchPartners()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setPartners(data as unknown as Partner[]);
        }
      })
      .catch((err) => console.error('[EAGLE TN Engine] Remote fetch failed:', err));

    return () => {
      isMounted = false;
    };
  }, [setPartners]);

  const handleSplashFinish = useCallback(() => {
    if (currentOrder && ['pending', 'accepted', 'delivering'].includes(currentOrder.status)) {
      setActiveTab('orders');
      setCurrentScreen('ORDER_TRACKING');
    } else {
      setCurrentScreen('HOME');
    }
  }, [currentOrder, setActiveTab, setCurrentScreen]);

  const handlePartnerSelect = useCallback(
    (partner: Partner) => {
      const success = selectPartnerWithIsolation(partner);
      if (!success) {
        const confirmSwitch = window.confirm(
          'Votre panier contient des articles d\'un autre établissement. Voulez-vous le réinitialiser ?'
        );
        if (confirmSwitch) {
          clearCart();
          setSelectedPartner(partner);
          setCurrentScreen('RESTAURANT_MENU');
        }
      }
    },
    [selectPartnerWithIsolation, clearCart, setSelectedPartner, setCurrentScreen]
  );

  const handleConfirmOrder = async (orderData: {
    address: string;
    phone: string;
    notes: string;
    pin: string;
    totalAmount: number;
  }) => {
    if (!selectedPartner) return;

    // استخراج بيانات المستخدم المسجل إن وجد
    const { data: { user } } = await supabase.auth.getUser();

    const deliveryFee = Number((selectedPartner.delivery_fee ?? 2.5).toFixed(3));
    const subtotal = Number(cartItems.reduce((acc, i) => acc + (i.total_price || (i.price * i.quantity) || 0), 0).toFixed(3));
    const finalAddress = orderData.address || customerAddress || 'Tunis, Tunisie';
    const pin = orderData.pin || Math.floor(1000 + Math.random() * 9000).toString();

    const orderPayload: Record<string, any> = {
      partner_id: selectedPartner.id,
      user_id: user?.id || null,
      status: 'pending',
      subtotal_ht: subtotal,
      delivery_fee: deliveryFee,
      total_amount: Number((subtotal + deliveryFee).toFixed(3)),
      grand_total: Number((subtotal + deliveryFee).toFixed(3)),
      payment_method: 'COD',
      delivery_address: finalAddress,
      delivery_lat: selectedPartner.latitude ?? 36.8065,
      delivery_lng: selectedPartner.longitude ?? 10.1815,
      delivery_latitude: selectedPartner.latitude ?? 36.8065,
      delivery_longitude: selectedPartner.longitude ?? 10.1815,
      verification_code: pin,
      client_name: user?.user_metadata?.full_name || 'Client EAGLE TN',
      client_phone: orderData.phone || user?.user_metadata?.phone || '21600000000',
      client_notes: orderData.notes || '',
    };

    try {
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (orderError) {
        console.error('❌ Supabase Order Insert Error:', orderError);
        alert(`خطأ Supabase: ${orderError.message}`);
        return;
      }

      if (cartItems.length > 0 && newOrder) {
        const orderItemsPayload = cartItems.map((item) => ({
          order_id: newOrder.id,
          menu_item_id: item.menu_item_id || item.id,
          item_name: item.name || 'Article',
          quantity: item.quantity,
          unit_price: item.unit_price || item.price,
          total_price: item.total_price || (item.quantity * item.price),
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsPayload);

        if (itemsError) {
          console.warn('⚠️ Order created, but failed to insert order_items:', itemsError.message);
        }
      }

      const createdOrder: Order = {
        ...(newOrder as unknown as Order),
        items: cartItems,
      };

      setCurrentOrder(createdOrder);
      clearCart();
      setActiveTab('orders');
      setCurrentScreen('ORDER_TRACKING');
    } catch (err: any) {
      console.error('❌ Network or Unknown Error:', err);
      alert(`خطأ غير متوقع: ${err?.message || err}`);
    }
  };

  const handleTabChange = useCallback(
    (tab: TabType) => {
      setActiveTab(tab);
      const tabMap: Record<string, ScreenType> = {
        home: 'HOME',
        accueil: 'HOME',
        search: 'HOME',
        recherche: 'HOME',
        profile: 'PROFILE',
        profil: 'PROFILE',
        orders: 'ORDER_TRACKING',
        commandes: 'ORDER_TRACKING',
      };
      if (tabMap[tab]) {
        setCurrentScreen(tabMap[tab]);
      }
    },
    [setActiveTab, setCurrentScreen]
  );

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const showBottomNav = ['HOME', 'PROFILE', 'ORDER_TRACKING'].includes(currentScreen);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-[#FAFAFA] font-sans antialiased text-slate-900 pb-16 selection:bg-[#059669] selection:text-white relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentScreen === 'SPLASH' && (
            <motion.div key="splash" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <SplashScreen onFinish={handleSplashFinish} />
            </motion.div>
          )}

          {currentScreen === 'HOME' && (
            <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ClientHome
                cartCount={totalCartCount}
                onSelectPartner={handlePartnerSelect}
                onNavigateCart={() => selectedPartner && cartItems.length > 0 && setCurrentScreen('CHECKOUT')}
              />
            </motion.div>
          )}

          {currentScreen === 'RESTAURANT_MENU' && selectedPartner && (
            <motion.div key="menu" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <RestaurantMenu
                partner={selectedPartner}
                cartItems={cartItems}
                onAddToCart={(item, qty = 1) => addToCart({ id: item.id, menu_item_id: item.id, name: item.title, price: item.price, quantity: qty, unit_price: item.price, total_price: item.price * qty })}
                onRemoveFromCart={removeFromCart}
                onBack={() => setCurrentScreen('HOME')}
                onGoToCheckout={() => setCurrentScreen('CHECKOUT')}
              />
            </motion.div>
          )}

          {currentScreen === 'CHECKOUT' && selectedPartner && (
            <motion.div key="checkout" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Checkout
                partner={selectedPartner}
                cartItems={cartItems}
                customerAddress={customerAddress}
                customerPhone=""
                onConfirmOrder={handleConfirmOrder}
                onBack={() => setCurrentScreen('RESTAURANT_MENU')}
              />
            </motion.div>
          )}

          {currentScreen === 'ORDER_TRACKING' && (
            <motion.div key="tracking" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <OrderTracking
                order={currentOrder}
                onBackToHome={() => handleTabChange('home')}
                onOpenSupport={() => setIsSupportOpen(true)}
              />
            </motion.div>
          )}

          {currentScreen === 'PROFILE' && (
            <motion.div key="profile" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ProfileScreen
                onBack={() => handleTabChange('home')}
                onNavigateOrders={() => handleTabChange('orders')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isSupportOpen && <SupportModal onClose={() => setIsSupportOpen(false)} />}

        {showBottomNav && <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />}
      </div>
    </ErrorBoundary>
  );
};

export default AppRoutes;
