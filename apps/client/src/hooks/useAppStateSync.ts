import { useEffect } from 'react';

export const useAppStateSync = (onSyncRequired: () => Promise<void> | void) => {
  useEffect(() => {
    // معالجة العودة من خلفية النظام (Background to Foreground)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[EAGLE TN Engine] Focus restauré. Synchronisation forcée des données...');
        onSyncRequired();
      }
    };

    // معالجة عودة الاتصال بالشبكة (Offline to Online)
    const handleOnline = () => {
      console.log('[EAGLE TN Engine] Connexion rétablie. Synchronisation forcée...');
      onSyncRequired();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [onSyncRequired]);
};
