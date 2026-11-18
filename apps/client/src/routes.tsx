import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Session } from "@supabase/supabase-js";
import { supabase } from './lib/supabase';

// Core Layout & Security
import ClientLayout from './components/layout/ClientLayout';
import SplashScreen from './screens/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AuthScreen from './screens/AuthScreen';
import { OrderStreamProvider } from './context/OrderStreamContext';

// Dynamic Code Splitting
const ClientHome = lazy(() => import('./screens/ClientHome'));
const RestaurantMenu = lazy(() => import('./screens/RestaurantMenu'));
const Checkout = lazy(() => import('./screens/Checkout'));
const OrderTracking = lazy(() => import('./screens/OrderTracking'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const ExploreScreen = lazy(() => import('./screens/ExploreScreen'));
const OrdersScreen = lazy(() => import('./screens/OrdersScreen'));

// Premium Micro-interactions
const pageVariants: Variants = {
  initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.2, ease: "easeIn" } }
};

const AnimatedRouteWrapper: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full h-full">
    {children}
  </motion.div>
);

const PageSkeleton = () => (
  <div className="w-full h-[100dvh] flex items-center justify-center bg-[var(--color-surface-base)]">
    <div className="w-8 h-8 rounded-full border-2 border-[#E7E5E4] border-t-[var(--color-primary-base)] animate-spin shadow-sm" />
  </div>
);

// Semantic Navigation Tree
const RouterContent: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Authentication Route */}
        <Route path="/auth" element={<AuthScreen />} />

        {/* Core Platform (Contains Bottom Navigation) */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Suspense fallback={<PageSkeleton />}><AnimatedRouteWrapper><ClientHome /></AnimatedRouteWrapper></Suspense>} />
          <Route path="explore" element={<Suspense fallback={<PageSkeleton />}><AnimatedRouteWrapper><ExploreScreen /></AnimatedRouteWrapper></Suspense>} />
          <Route path="restaurant/:slugOrId" element={<Suspense fallback={<PageSkeleton />}><AnimatedRouteWrapper><RestaurantMenu /></AnimatedRouteWrapper></Suspense>} />
          
          {/* Protected Main Routes */}
          <Route path="orders" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><AnimatedRouteWrapper><OrdersScreen /></AnimatedRouteWrapper></Suspense></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><AnimatedRouteWrapper><ProfileScreen /></AnimatedRouteWrapper></Suspense></ProtectedRoute>} />
        </Route>

        {/* FULL SCREEN ISOLATED FUNNELS (No Bottom Navigation) */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}><AnimatedRouteWrapper><Checkout /></AnimatedRouteWrapper></Suspense>
          </ProtectedRoute>
        } />
        <Route path="/order/track/:order_id" element={
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}><AnimatedRouteWrapper><OrderTracking /></AnimatedRouteWrapper></Suspense>
          </ProtectedRoute>
        } />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

// Master App Bootstrapper
export const AppRoutes: React.FC = () => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
      
      // Delay splash screen slightly after auth resolves for smooth transition
      setTimeout(() => setIsAuthChecking(false), 800); 
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUserId(session?.user?.id || null);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  return (
    <BrowserRouter>
      <OrderStreamProvider userId={userId as string}>
        <RouterContent />
        <AnimatePresence>
          {isAuthChecking && (
            <motion.div
              key="splash-overlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[99999] pointer-events-none"
            >
              <div className="w-full h-full pointer-events-auto">
                <SplashScreen isLoading={isAuthChecking} onReady={() => {}} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </OrderStreamProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
