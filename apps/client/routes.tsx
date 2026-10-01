import React, { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import ClientHome from './screens/ClientHome';
import RestaurantMenu from './screens/RestaurantMenu/index';
import Checkout from './screens/Checkout';
import OrderTracking from './screens/OrderTracking';
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
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);

  const defaultPartner: Partner = {
    id: 'partner-om-ali',
    name: 'Chez Am Ali',
    name_ar: 'مطعم عم علي',
    legal_name: 'Chez Am Ali SARL',
    tax_id: '1234567/A/M/000',
    rating: 5.0,
    delivery_fee: 2.000,
    estimated_time: '20-30 min',
    delivery_time: '20-30 min',
    distance: '1.2 km',
    address: 'Tunis',
    cover_url: null,
    logo_url: null,
    logo: null,
    cover: null,
    type: 'restaurant',
    phone: null,
    specialties: ['ROI DU HERGMA', 'Plats'],
    is_active: true,
    opening_hours: '11:00 - 22:00',
    latitude: 36.8065,
    longitude: 10.1815,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  useEffect(() => {
    let isMounted = true;
    fetchPartners().then((data) => {
      if (!isMounted) return;
      if (data && data.length > 0) {
        setPartners(data as unknown as Partner[]);
      } else {
        setPartners([defaultPartner]);
      }
    }).catch(() => {
      if (isMounted) setPartners([defaultPartner]);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSplashFinish = () => {
    setCurrentScreen('HOME');
  };

  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
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
    const resolvedDeliveryFee = activePartner.delivery_fee ?? 2.000;

    const newOrder: Order = {
      id: `EAGLE-${Math.floor(100000 + Math.random() * 900000)}`,
      customer_id: 'cust-2026-field',
      partner_id: activePartner.id,
      items: cartItems.length > 0 ? cartItems : [{ menu_item_id: 'm1', name: 'Plat Eagle', quantity: 1, unit_price: 18.5, total_price: 18.5 }],
      subtotal: cartItems.reduce((acc, i) => acc + (i.total_price || 0), 0) || 18.5,
      delivery_fee: resolvedDeliveryFee,
      tax_amount: 0,
      total_amount: orderData.totalAmount || 20.500,
      payment_method: 'COD',
      payment_status: 'PENDING',
      status: 'pending',
      delivery_address: orderData.address || 'Avenue Habib Bourguiba, Tunis',
      delivery_lat: activePartner.latitude ?? 36.8065,
      delivery_lng: activePartner.longitude ?? 10.1815,
      verification_pin: orderData.pin || '1234',
      qr_code_data: `EAGLE-TN-${orderData.pin || '1234'}`,
      created_at: new Date().toISOString(),
    };

    try {
      await createRemoteOrder({
        partner_id: activePartner.id,
        items: newOrder.items,
        total_amount: newOrder.total_amount,
        delivery_fee: resolvedDeliveryFee,
        delivery_address: newOrder.delivery_address,
        verification_pin: newOrder.verification_pin,
      });
    } catch (err) {
      console.warn('Sauvegarde Supabase ignorée:', err);
    }

    setCurrentOrder(newOrder);
    setCartItems([]);
    setActiveTab('orders');
    setCurrentScreen('ORDER_TRACKING');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'home' || tab === 'accueil' || tab === 'search' || tab === 'recherche') {
      setCurrentScreen('HOME');
    } else if (tab === 'profile' || tab === 'profil') {
      setCurrentScreen('PROFILE');
    } else if (tab === 'orders' || tab === 'commandes') {
      setCurrentScreen('ORDER_TRACKING');
    }
  };

  const showBottomNav = ['HOME', 'PROFILE', 'ORDER_TRACKING'].includes(currentScreen);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-[#EAEAEA] font-sans antialiased text-slate-800 pb-16 selection:bg-[#E70013] selection:text-white">
        {currentScreen === 'SPLASH' && (
          <SplashScreen onFinish={handleSplashFinish} />
        )}

        {currentScreen === 'HOME' && (
          <ClientHome
            cartCount={totalCartCount}
            onSelectPartner={(p: Partner) => handleSelectPartner(p || defaultPartner)}
            onNavigateCart={() => setCurrentScreen('CHECKOUT')}
          />
        )}

        {currentScreen === 'RESTAURANT_MENU' && (
          <RestaurantMenu
            partner={selectedPartner || defaultPartner}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentScreen('HOME')}
            onGoToCheckout={handleGoToCheckout}
          />
        )}

        {currentScreen === 'CHECKOUT' && (
          <Checkout
            partner={selectedPartner || defaultPartner}
            cartItems={cartItems}
            customerAddress="Avenue Habib Bourguiba, Tunis"
            customerPhone="+216 98 000 000"
            onConfirmOrder={handleConfirmOrder}
            onBack={() => setCurrentScreen('RESTAURANT_MENU')}
          />
        )}

        {currentScreen === 'ORDER_TRACKING' && (
          <OrderTracking
            order={currentOrder}
            onBackToHome={() => {
              setActiveTab('home');
              setCurrentScreen('HOME');
            }}
            onOpenSupport={() => setIsSupportOpen(false)}
          />
        )}

        {currentScreen === 'PROFILE' && (
          <ProfileScreen
            onBack={() => {
              setActiveTab('home');
              setCurrentScreen('HOME');
            }}
            onNavigateOrders={() => {
              setActiveTab('orders');
              setCurrentScreen('ORDER_TRACKING');
            }}
          />
        )}

        {isSupportOpen && (
          <SupportModal onClose={() => setIsSupportOpen(false)} />
        )}

        {showBottomNav && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AppRoutes;
