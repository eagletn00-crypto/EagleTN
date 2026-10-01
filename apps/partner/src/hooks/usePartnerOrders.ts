import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface OrderLocation {
  lat: number;
  lng: number;
}

export interface PartnerOrder {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  customer_name: string;
  delivery_address: string;
  restaurant_location?: OrderLocation;
  customer_location?: OrderLocation;
  driver_location?: OrderLocation;
  driver_name?: string;
  driver_phone?: string;
}

export const usePartnerOrders = () => {
  const [orders, setOrders] = useState<PartnerOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deviceCoords, setDeviceCoords] = useState<OrderLocation | null>(null);

  const partnerId = '00000000-0000-0000-0000-000000000001';

  // 1. التحديد الآلي لموقع الجهاز ميدانياً (GPS Automatic)
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDeviceCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.warn('GPS Warning:', err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // 2. جلب الطلبات مع بيانات السائق وإحداثيات GPS
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data: fetchedOrders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else if (fetchedOrders) {
        const mappedOrders: PartnerOrder[] = fetchedOrders.map((o: any) => {
          const latVal = Number(o.latitude) || deviceCoords?.lat || 36.8065;
          const lngVal = Number(o.longitude) || deviceCoords?.lng || 10.1815;

          return {
            id: o.id,
            created_at: o.created_at,
            status: o.status,
            total_amount: Number(o.total_amount || 0),
            customer_name: o.customer_name || 'Client EAGLE TN',
            delivery_address: o.delivery_address || 'Localisation Automatique GPS',
            restaurant_location: deviceCoords || { lat: 36.8065, lng: 10.1815 },
            customer_location: { lat: latVal, lng: lngVal },
            driver_location: o.driver_latitude && o.driver_longitude ? {
              lat: Number(o.driver_latitude),
              lng: Number(o.driver_longitude),
            } : undefined,
            driver_name: o.driver_name || undefined,
            driver_phone: o.driver_phone || undefined,
          };
        });
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }, [deviceCoords]);

  // 3. الاستماع المباشر للتغييرات (Realtime Listener)
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('partner-orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  // 4. تحديث حالة الطلب
  const updateOrderStatus = async (orderId: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) console.error('Status update error:', error);
  };

  // 5. إنشاء طلب تجريبي جديد حقيقي في Supabase عند الضغط على زر + Test Order
  const createTestOrder = async () => {
    const testAmount = parseFloat((Math.random() * 30 + 15).toFixed(3));
    const newOrder = {
      partner_id: partnerId,
      status: 'pending',
      total_amount: testAmount,
      customer_name: 'Client EAGLE TN GPS',
      delivery_address: 'Localisation Automatique GPS',
      latitude: 36.8120 + (Math.random() - 0.5) * 0.01,
      longitude: 10.1870 + (Math.random() - 0.5) * 0.01,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('orders').insert([newOrder]);
    if (error) {
      console.error('Error creating test order:', error);
    } else {
      fetchOrders();
    }
  };

  return {
    orders,
    loading,
    acceptOrder: (id: string) => updateOrderStatus(id, 'in_preparation'),
    markAsReady: (id: string) => updateOrderStatus(id, 'ready_for_pickup'),
    rejectOrder: (id: string) => updateOrderStatus(id, 'cancelled'),
    createTestOrder,
    refreshOrders: fetchOrders,
  };
};
