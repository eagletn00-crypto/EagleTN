import 'react-native-url-polyfill/auto';   
import React, { useEffect } from 'react';
import AppRoutes from '@/routes';
import { useSecurityStore } from '@/context/useSecurityStore';

export default function App() {
  const setNetworkStatus = useSecurityStore((state) => state.setNetworkStatus);
  const initializeTenant = useSecurityStore((state) => state.initializeTenant);

  useEffect(() => {
    initializeTenant(window.location.href);

    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setNetworkStatus, initializeTenant]);

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100 antialiased selection:bg-amber-500 selection:text-black">
      <AppRoutes />
    </div>
  );
}
