import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { OrderStreamProvider } from './context/OrderStreamContext';

// Core Layout & Initial Blocking Screens
import ClientLayout from './components/layout/ClientLayout';
import SplashScreen from './screens/SplashScreen';

// -----------------------------------------------------------------------------
// DYNAMIC CODE SPLITTING (Lazy Loaded for Native Suspense Resolution)
// -----------------------------------------------------------------------------
const ClientHome = lazy(() => import('./screens/ClientHome'));
const RestaurantMenu = lazy(() => import('./screens/RestaurantMenu'));
const Checkout = lazy(() => import('./screens/Checkout'));
const OrderTracking = lazy(() => import('./screens/OrderTracking'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));

// -----------------------------------------------------------------------------
// PREMIUM MICRO-INTERACTIONS (Framer Motion Orchestration)
// -----------------------------------------------------------------------------
const pageVariants: Variants = {
  initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: "easeOut" } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: "easeIn" } 
  }
};

const AnimatedRouteWrapper: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
    {children}
  </motion.div>
);

// High-End Ivory Skeleton Fallback for Suspense Boundaries
const PageSkeleton = () => (
  <div className="w-full h-[100dvh] flex items-center justify-center bg-[#FDFBF7]">
    <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-[#E71F27] animate-spin shadow-sm" />
  </div>
);

// -----------------------------------------------------------------------------
// ALWAYS-OPEN SEMANTIC NAVIGATION TREE (Zero Blocking States)
// -----------------------------------------------------------------------------
const RouterContent: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Master Ivory Shell Wrapper */}
        <Route path="/" element={<ClientLayout />}>
          
          {/* Index Route */}
          <Route 
            index 
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AnimatedRouteWrapper><ClientHome /></AnimatedRouteWrapper>
              </Suspense>
            } 
          />
          
          {/* Menu Route */}
          <Route 
            path="restaurant/:slug" 
            element={
              <Suspense fallback={<PageSkeleton />}>
                {/* @ts-expect-error - Bypassing legacy static prop types to enforce useParams usage internally */}
                <AnimatedRouteWrapper><RestaurantMenu /></AnimatedRouteWrapper>
              </Suspense>
            } 
          />
          
          <Route 
            path="checkout" 
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AnimatedRouteWrapper><Checkout /></AnimatedRouteWrapper>
              </Suspense>
            } 
          />
          
          {/* Tracking Route */}
          <Route 
            path="order/track/:order_id" 
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AnimatedRouteWrapper><OrderTracking /></AnimatedRouteWrapper>
              </Suspense>
            } 
          />
          
          <Route 
            path="profile" 
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AnimatedRouteWrapper><ProfileScreen /></AnimatedRouteWrapper>
              </Suspense>
            } 
          />

        </Route>
      </Routes>
    </AnimatePresence>
  );
};

// -----------------------------------------------------------------------------
// MASTER APP BOOTSTRAPPER (Deadlock Eradicated)
// -----------------------------------------------------------------------------
export const AppRoutes: React.FC = () => {
  // Localized Splash state to decouple from global store strictness
  const [showSplash, setShowSplash] = useState(true);
  const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000'; 

  // Native Mount Timeout (2000ms strict unmount window)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <OrderStreamProvider userId={MOCK_USER_ID}>
        
        {/* 
          CRITICAL FIX: The RouterContent is ALWAYS mounted. 
          The Splash Screen acts strictly as an absolute overlay, preventing route-resolution deadlocks.
        */}
        <RouterContent />

        {/* Cinematic Splash Overlay Unmount Sequence */}
        <AnimatePresence>
          {showSplash && (
            <motion.div 
              key="splash-overlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[99999] pointer-events-none"
            >
              {/* Force pointer events auto locally so the splash logic can run if needed */}
              <div className="w-full h-full pointer-events-auto">
                <SplashScreen isLoading={showSplash} onReady={() => setShowSplash(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </OrderStreamProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
