import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './screens/LandingPage';
import ClientHome from './screens/ClientHome';
import RestaurantMenu from './screens/RestaurantMenu';
import OrderTracking from './screens/OrderTracking';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/client-home',
    element: <ClientHome />,
  },
  {
    path: '/restaurant-menu/:restaurantId',
    element: <RestaurantMenu />,
  },
  {
    path: '/order-tracking/:orderId',
    element: <OrderTracking />,
  },
]);
