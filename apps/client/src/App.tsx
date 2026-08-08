import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientHome from './screens/ClientHome';
import { RestaurantMenu } from './screens/RestaurantMenu';
import Checkout from './screens/Checkout';
import OrderTracking from './screens/OrderTracking';
import { ProfileScreen } from './screens/ProfileScreen';
import BottomNavigation from './components/BottomNavigation';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FBF9F4] text-slate-900 pb-20">
        <Routes>
          <Route path="/" element={<ClientHome />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
