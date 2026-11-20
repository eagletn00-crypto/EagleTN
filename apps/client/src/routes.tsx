import React, { Component, ErrorInfo, ReactNode, Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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

interface RouteErrorBoundaryState {
  hasError: boolean;
}

class RouteErrorBoundary extends Component<{ readonly children: ReactNode }, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Route rendering error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-[20px] font-black text-[#1C1917] uppercase mb-2">Connexion interrompue</h2>
          <p className="text-[14px] font-bold text-gray-500 mb-6">
            Impossible de charger cet écran. Vérifiez votre connexion et réessayez.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-[#C1121F] text-white px-7 py-3.5 rounded-full font-black text-[13px] uppercase tracking-wider shadow-md"
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } },
};

const AnimatedRouteWrapper: React.FC<{ readonly children: ReactNode }> = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full h-full">
    {children}
  </motion.div>
);

const PageSkeleton = () => (
  <div className="w-full h-[100dvh] flex items-center justify-center bg-[var(--color-surface-base)]">
    <div className="w-8 h-8 rounded-full border-2 border-[#E7E5E4] border-t-[var(--color-primary-base)] animate-spin shadow-sm" />
  </div>
);

const RouterContent: React.FC = () => {
  const location = useLocation();
  return (
    <RouteErrorBoundary>
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

          {/* FULL SCREEN ISOLATED FUNNELS (COD Checkout & Live Driver Tracking) */}
          <Route path="/checkout" element={
            <Suspense fallback={<PageSkeleton />}><AnimatedRouteWrapper><Checkout /></AnimatedRouteWrapper></Suspense>
          } />
          <Route path="/order/track/:order_id" element={
            <Suspense fallback={<PageSkeleton />}><AnimatedRouteWrapper><OrderTracking /></AnimatedRouteWrapper></Suspense>
          } />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </RouteErrorBoundary>
  );
};

export const AppRoutes: React.FC = () => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let splashTimer: ReturnType<typeof setTimeout> | undefined;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUserId(session?.user?.id ?? null);
        }
      } finally {
        if (mounted) {
          splashTimer = setTimeout(() => setIsAuthChecking(false), 600);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUserId(session?.user?.id ?? null);
      }
    });

    return () => {
      mounted = false;
      if (splashTimer) clearTimeout(splashTimer);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <OrderStreamProvider userId={userId}>
        <RouterContent />
        <AnimatePresence>
          {isAuthChecking && (
            <motion.div
              key="splash-overlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
