import { useState, useEffect } from 'react';

interface OrderStatusUpdate {
  orderId: string;
  status: string;
  timestamp: number;
}

export const useOfflineOrder = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingUpdates, setPendingUpdates] = useState<OrderStatusUpdate[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // استرجاع التحديثات المعلقة من التخزين المحلي
    const saved = localStorage.getItem('eagle_pending_orders');
    if (saved) {
      setPendingUpdates(JSON.parse(saved));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueStatusUpdate = (orderId: string, status: string) => {
    const update: OrderStatusUpdate = { orderId, status, timestamp: Date.now() };
    const updatedQueue = [...pendingUpdates, update];
    setPendingUpdates(updatedQueue);
    localStorage.setItem('eagle_pending_orders', JSON.stringify(updatedQueue));
  };

  const clearQueue = () => {
    setPendingUpdates([]);
    localStorage.removeItem('eagle_pending_orders');
  };

  return { isOnline, pendingUpdates, queueStatusUpdate, clearQueue };
};
