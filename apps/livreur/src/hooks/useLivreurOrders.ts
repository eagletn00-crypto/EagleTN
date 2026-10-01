import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RawOrderFromSupabase, MappedLivreurOrder } from '../types/order';

export const useLivreurOrders = () => {
  const [orders, setOrders] = useState<MappedLivreurOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const mapOrder = (order: RawOrderFromSupabase): MappedLivreurOrder => {
    const shortCode = order.id.slice(0, 8);
    const dropLat = order.delivery_lat ?? 36.8188;
    const dropLng = order.delivery_lng ?? 10.1658;

    return {
      id: order.id,
      order_code: `CMD-${shortCode}`,
      short_code: shortCode,
      partnerId: order.partner_id,
      restaurantName: 'Chez Om Ali',
      restaurant_name: 'Chez Om Ali',
      restaurant_phone: '+216 71 000 000',
      clientName: order.client_name || 'Client',
      customer_name: order.client_name || 'Client',
      clientPhone: order.client_phone || '20000000',
      customer_phone: order.client_phone || '20000000',
      deliveryAddress: order.delivery_address || 'Tunis',
      customer_address: order.delivery_address || 'Tunis',
      delivery_address: order.delivery_address || 'Tunis',
      totalAmount: order.total_amount || 0,
      total_amount: order.total_amount || 0,
      order_value: order.total_amount || 0,
      deliveryFee: order.delivery_fee || 3.5,
      delivery_fee: order.delivery_fee || 3.5,
      status: order.status,
      verificationCode: order.verification_code || '0000',
      pickupCoords: {
        lat: order.pickup_lat ?? 36.8065,
        lng: order.pickup_lng ?? 10.1815,
      },
      dropoffCoords: {
        lat: dropLat,
        lng: dropLng,
      },
      lat: dropLat,
      lng: dropLng,
      createdAt: order.created_at,
      created_at: order.created_at,
    };
  };

  const fetchLivreurOrders = async () => {
    try {
      setLoading(true);
      // جلب الطلبات وجعل الفلترة في الكود تجنباً لأخطاء Enum في Postgres
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('[useLivreurOrders] Error fetching orders:', error);
        return;
      }

      if (data) {
        // فلترة الطلبات المتاحة للفارس (الطلبات غير المنتهية/الملغاة)
        const activeData = (data as RawOrderFromSupabase[]).filter(
          (o) => o.status !== 'delivered' && o.status !== 'cancelled'
        );
        const mappedData = activeData.map(mapOrder);
        setOrders(mappedData);
      }
    } catch (err) {
      console.error('[useLivreurOrders] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    // تحديث الحالة محلياً في الواجهة فوراً
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'accepted' } : o))
    );
  };

  const deliverOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'delivered',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (!error) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        console.error('Error delivering order:', error);
      }
    } catch (err) {
      console.error('Error delivering order:', err);
    }
  };

  useEffect(() => {
    fetchLivreurOrders();

    const channel = supabase
      .channel('livreur_orders_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchLivreurOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    orders,
    loading,
    acceptOrder,
    deliverOrder,
    refetch: fetchLivreurOrders,
  };
};
