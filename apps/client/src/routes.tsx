import React, { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import ClientHome from './screens/ClientHome';
import RestaurantMenu from './screens/RestaurantMenu/index';
import Checkout from './screens/Checkout';
import OrderTracking from './screens/OrderTracking/index';
import ProfileScreen from './screens/ProfileScreen';
import SupportModal from './screens/SupportModal';
import BottomNavigation, { TabType } from './components/BottomNavigation';
import ErrorBoundary from './components/ErrorBoundary';
import { Partner } from './types/partner';
import { Order, OrderItem } from './types/order';
import { fetchPartners, createRemoteOrder } from './services/api';

export type ScreenType =
  | 'SPLASH'
  | 'HOME'
  | 'RESTAURANT_MENU'
  | 'CHECKOUT'
  | 'ORDER_TRACKING'
  | 'PROFILE';

export const AppRoutes: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('SPLASH');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);

  const defaultPartner: Partner = {
    id: 'partner-om-ali',
    name: 'Chez Om Ali',
    legal_name: 'Chez Om Ali SARL',
    tax_id: '1234567/A/M/000',
    rating: 5.0,
    delivery_fee: 2.500,
    estimated_time: '15-25 min',
    is_active: true,
    latitude: 36.8065,
    longitude: 10.1815,
    created_at: new Date().toISOString()
  };

  useEffect(() => {
    fetchPartners().then((data) => {
      if (data && data.length > 0) {
        setPartners(data);
      }
    });
  }, []);

  const handleSplashFinish = () => {
    setCurrentScreen('HOME');
  };

  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setCartItems([]);
    setCurrentScreen('RESTAURANT_MENU');
  };

  const handleAddToCart = (item: { id: string; title: string; price: number }) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.menu_item_id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.menu_item_id === item.id
            ? { ...i, quantity: i.quantity + 1, total_price: (i.quantity + 1) * (i.unit_price || 0) }
            : i
        );
      }
      return [
        ...prevItems,
        {
          menu_item_id: item.id,
          name: item.title,
          quantity: 1,
          unit_price: item.price,
          total_price: item.price,
        },
      ];
    });
  };

  const handleGoToCheckout = () => {
    setCurrentScreen('CHECKOUT');
  };

  const handleConfirmOrder = async (orderData: {
    address: string;
    phone: string;
    notes: string;
    pin: string;
    totalAmount: number;
  }) => {
    const activePartner = selectedPartner || partners[0] || defaultPartner;

    const newOrder: Order = {
      id: `EAGLE-${Math.floor(100000 + Math.random() * 900000)}`,
      customer_id: 'cust-2026-field',
      partner_id: activePartner.id,
      items: cartItems.length > 0 ? cartItems : [{ menu_item_id: 'm1', name: 'Plat Eagle', quantity: 1, unit_price: 18.5, total_price: 18.5 }],
      subtotal: cartItems.reduce((acc, i) => acc + i.total_price, 0) || 18.5,
      delivery_fee: activePartner.delivery_fee,
      tax_amount: 0,
      total_amount: orderData.totalAmount || 21.000,
      payment_method: 'COD',
      payment_status: 'PENDING',
      status: 'pending',
      delivery_address: orderData.address || 'Avenue Habib Bourguiba, Tunis',
      delivery_lat: activePartner.latitude,
      delivery_lng: activePartner.longitude,
      verification_pin: orderData.pin || '1234',
      qr_code_data: `EAGLE-TN-${orderData.pin || '1234'}`,
      created_at: new Date().toISOString()
    };

    try {
      await createRemoteOrder({
        partner_id: activePartner.id,
        items: newOrder.items,
        total_amount: newOrder.total_amount,
        delivery_fee: activePartner.delivery_fee,
        delivery_address: newOrder.delivery_address,
        verification_pin: newOrder.verification_pin,
      });
    } catch (err) {
      console.warn('Sauvegarde Supabase ignorée, bascule sur la commande locale:', err);
    }

    setCurrentOrder(newOrder);
    setCartItems([]);
    setCurrentScreen('ORDER_TRACKING');
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'HOME') setCurrentScreen('HOME');
    if (tab === 'PROFILE') setCurrentScreen('PROFILE');
    if (tab === 'ORDERS') {
      setCurrentScreen('ORDER_TRACKING');
    }
  };

  const ClientHomeComp = ClientHome as React.ComponentType<any>;
  const RestaurantMenuComp = RestaurantMenu as React.ComponentType<any>;
  const CheckoutComp = Checkout as React.ComponentType<any>;
  const OrderTrackingComp = OrderTracking as React.ComponentType<any>;
  const ProfileComp = ProfileScreen as React.ComponentType<any>;

  const showBottomNav = ['HOME', 'PROFILE'].includes(currentScreen) || currentScreen === 'ORDER_TRACKING';

  const getActiveTab = (): TabType => {
    if (currentScreen === 'PROFILE') return 'PROFILE';
    if (currentScreen === 'ORDER_TRACKING') return 'ORDERS';
    return 'HOME';
  };

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-white font-sans antialiased text-slate-800 pb-16">
        {currentScreen === 'SPLASH' && (
          <SplashScreen onFinish={handleSplashFinish} />
        )}

        {currentScreen === 'HOME' && (
          <ClientHomeComp
            partners={partners}
            onSelectPartner={(p: Partner) => handleSelectPartner(p || defaultPartner)}
            onNavigate={(screen: string) => {
              if (screen === 'ORDER_TRACKING') setCurrentScreen('ORDER_TRACKING');
              if (screen === 'PROFILE') setCurrentScreen('PROFILE');
            }}
          />
        )}

        {currentScreen === 'RESTAURANT_MENU' && (
          <RestaurantMenuComp
            partner={selectedPartner || defaultPartner}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentScreen('HOME')}
            onGoToCheckout={handleGoToCheckout}
          />
        )}

        {currentScreen === 'CHECKOUT' && (
          <CheckoutComp
            partner={selectedPartner || defaultPartner}
            cartItems={cartItems}
            customerAddress="Avenue Habib Bourguiba, Tunis"
            customerPhone="+216 98 000 000"
            onConfirmOrder={handleConfirmOrder}
            onBack={() => setCurrentScreen('RESTAURANT_MENU')}
          />
        )}

        {currentScreen === 'ORDER_TRACKING' && (
          <OrderTrackingComp
            order={currentOrder}
            onBackToHome={() => setCurrentScreen('HOME')}
            onOpenSupport={() => setIsSupportOpen(true)}
          />
        )}

        {currentScreen === 'PROFILE' && (
          <ProfileComp
            onBack={() => setCurrentScreen('HOME')}
            onNavigateOrders={() => setCurrentScreen('ORDER_TRACKING')}
          />
        )}

        {isSupportOpen && (
          <SupportModal onClose={() => setIsSupportOpen(false)} />
        )}

        {showBottomNav && (
          <BottomNavigation
            activeTab={getActiveTab()}
            onTabChange={handleTabChange}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AppRoutes;
