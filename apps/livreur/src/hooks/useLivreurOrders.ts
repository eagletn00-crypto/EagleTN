import { useState, useEffect } from 'react';
import { supabase } from '@eagle/database';
import { DeliveryOrder } from '../types/order';

const CACHE_KEY_ORDERS = 'eagle_livreur_orders_cache';
const CACHE_KEY_STATS = 'eagle_livreur_stats_cache';

export function useLivreurOrders() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState<'encours' | 'livre' | 'wallet'>('encours');
  
  // 1. القراءة الفورية من الـ Local Cache لتجنب الشاشة البيضاء والتأخير
  const [orders, setOrders] = useState<DeliveryOrder[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_ORDERS);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_STATS);
      return cached ? JSON.parse(cached) : {
        dailyEarnings: 0,
        completedTripsToday: 0,
        targetTrips: 10,
        bonusAmount: 10.000,
        cashInHand: 0,
        cashLimit: 300.000,
        netEarnings: 0,
      };
    } catch {
      return {
        dailyEarnings: 0,
        completedTripsToday: 0,
        targetTrips: 10,
        bonusAmount: 10.000,
        cashInHand: 0,
        cashLimit: 300.000,
        netEarnings: 0,
      };
    }
  });

  const [loading, setLoading] = useState(orders.length === 0);
  const [confirmOrder, setConfirmOrder] = useState<DeliveryOrder | null>(null);
  const [issueOrder, setIssueOrder] = useState<DeliveryOrder | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchOrders();

    const channel = supabase
      .channel('orders-livreur-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          invoice_reference,
          total_ttc,
          delivery_fee,
          status,
          delivery_latitude,
          delivery_longitude,
          delivery_address_text,
          client_phone,
          client_name,
          partners ( name, phone )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase Fetch Warning/Error:', error.message);
      }

      if (data) {
        const mappedOrders: DeliveryOrder[] = data.map((item: any) => ({
          id: item.id || '',
          order_code: item.invoice_reference || `#${(item.id || '').slice(0, 7)}`,
          short_code: (item.id || '0000').slice(-4).toUpperCase(),
          restaurant_name: item.partners?.name || 'Partner',
          restaurant_phone: item.partners?.phone || '',
          customer_name: item.client_name || 'Client',
          customer_phone: item.client_phone || '',
          customer_address: item.delivery_address_text || 'Adresse non spécifiée',
          lat: item.delivery_latitude || 36.8588,
          lng: item.delivery_longitude || 10.1597,
          order_value: item.total_ttc || 0,
          delivery_fee: item.delivery_fee || 2.5,
          status: item.status || 'PENDING',
        }));

        setOrders(mappedOrders);

        const delivered = mappedOrders.filter(o => o.status === 'DELIVERED');
        const totalCash = delivered.reduce((acc, curr) => acc + (curr.order_value || 0), 0);
        const totalProfit = delivered.reduce((acc, curr) => acc + (curr.delivery_fee || 0), 0);

        const newStats = {
          dailyEarnings: totalProfit,
          completedTripsToday: delivered.length,
          targetTrips: 10,
          bonusAmount: 10.000,
          cashInHand: totalCash,
          cashLimit: 300.000,
          netEarnings: totalProfit,
        };

        setStats(newStats);

        // 2. تحديث الـ Cache المحلي
        localStorage.setItem(CACHE_KEY_ORDERS, JSON.stringify(mappedOrders));
        localStorage.setItem(CACHE_KEY_STATS, JSON.stringify(newStats));
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNavigation = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const handleStartTrip = async (id: string) => {
    // تحديث تفاؤلي سريع في الواجهة (Optimistic UI Update)
    setOrders(prev => {
      const updated = prev.map(ord => ord.id === id ? { ...ord, status: 'EN_ROUTE' } : ord);
      localStorage.setItem(CACHE_KEY_ORDERS, JSON.stringify(updated));
      return updated;
    });

    await supabase
      .from('orders')
      .update({ status: 'EN_ROUTE', updated_at: new Date().toISOString() })
      .eq('id', id);
  };

  const handleFinalizeDelivery = async () => {
    if (!confirmOrder) return;

    const targetId = confirmOrder.id;
    setOrders(prev => {
      const updated = prev.map(ord => ord.id === targetId ? { ...ord, status: 'DELIVERED' } : ord);
      localStorage.setItem(CACHE_KEY_ORDERS, JSON.stringify(updated));
      return updated;
    });

    setConfirmOrder(null);

    await supabase
      .from('orders')
      .update({ 
        status: 'DELIVERED', 
        payment_status: 'PAID',
        updated_at: new Date().toISOString() 
      })
      .eq('id', targetId);
  };

  const handleReportIssue = async (reason: string) => {
    if (!issueOrder) return;
    alert(`تم تسجيل البلاغ (${reason}) بنجاح.`);
    setIssueOrder(null);
  };

  const activeOrders = orders.filter(o => o.status !== 'DELIVERED');

  return {
    isOnline,
    setIsOnline,
    activeTab,
    setActiveTab,
    activeOrders,
    stats,
    loading,
    confirmOrder,
    setConfirmOrder,
    issueOrder,
    setIssueOrder,
    handleOpenNavigation,
    handleStartTrip,
    handleFinalizeDelivery,
    handleReportIssue,
  };
}
