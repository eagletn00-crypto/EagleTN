import React from 'react';
import SplashScreen from './screens/SplashScreen';
import ClientHome from './screens/ClientHome';
import RestaurantMenu from './screens/RestaurantMenu';
import CartAndCheckoutSheet from './screens/CartAndCheckoutSheet';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import ProfilScreen from './screens/ProfilScreen';

export interface AppRouterProps {
  currentScreen?: string;
  selectedPartnerId?: string;
  selectedOrderId?: string;
  onNavigate?: (screen: string, params?: any) => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({
  currentScreen = 'splash',
  selectedPartnerId,
  selectedOrderId = 'demo-order-id',
  onNavigate = () => {}
}) => {
  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onFinish={() => onNavigate('home')} />;
      
    case 'home':
      return (
        <ClientHome
          onSelectPartner={(partnerId: string) => onNavigate('restaurant_menu', { partnerId })}
        />
      );

    case 'restaurant_menu':
      return (
        <RestaurantMenu
          partnerId={selectedPartnerId}
          onBack={() => onNavigate('home')}
        />
      );

    case 'checkout':
      return (
        <CartAndCheckoutSheet
          isOpen={true}
          onClose={() => onNavigate('restaurant_menu')}
          onConfirmOrder={() => onNavigate('tracking', { orderId: 'demo-order-id' })}
          onExploreRestaurants={() => onNavigate('home')}
        />
      );

    case 'tracking':
      return (
        <OrderTrackingScreen
          orderId={selectedOrderId}
          onBackToHome={() => onNavigate('home')}
        />
      );

    case 'profile':
      return (
        <ProfilScreen
          onBack={() => onNavigate('home')}
          onComplete={() => onNavigate('home')}
        />
      );

    default:
      return <SplashScreen onFinish={() => onNavigate('home')} />;
  }
};

export default AppRouter;
