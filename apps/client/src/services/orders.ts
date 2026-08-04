import { supabase } from '../lib/supabase';

// جلب تفاصيل الطلب والتتبع المباشر من قاعدة البيانات الحقيقية
export async function getLiveOrderDetails(orderId: string) {
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total_amount,
      payment_method,
      recipient_name,
      recipient_phone,
      delivery_address_name,
      delivery_lat,
      delivery_lng,
      change_required_for,
      cgu_accepted,
      inpdp_accepted,
      driver_id,
      profiles:driver_id (
        id,
        full_name,
        phone,
        avatar_url
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return order;
}

// الاشتراك في التحديثات الحية لحظة بلحظة (Supabase Realtime Subscription)
export function subscribeToOrderStatus(orderId: string, onStatusUpdate: (newStatus: string) => void) {
  const channel = supabase
    .channel(`order-status-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        if (payload.new && payload.new.status) {
          onStatusUpdate(payload.new.status);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
