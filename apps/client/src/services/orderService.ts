import { supabase } from '../lib/supabaseClient';
import { MenuItem, Partner, CreateOrderPayload } from '../types/supabase';

// جلب الشركاء / المطاعم
export const fetchPartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from('partners')
    .select('*');

  if (error) throw error;
  return data || [];
};

// جلب قائمة الطعام لمطعم معين
export const fetchMenuItems = async (partnerId: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('partner_id', partnerId)
    .eq('is_available', true);

  if (error) throw error;
  return data || [];
};

// إنشاء طلب حقيقي وتأكيده في قاعدة البيانات
export const createOrder = async (payload: CreateOrderPayload) => {
  const { items, ...orderData } = payload;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map(item => ({
    order_id: order.id,
    item_name: item.item_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
    options: item.options || {}
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
};

// التتبع اللحظي لحالة الطلب عبر WebSockets
export const subscribeToOrderStatus = (orderId: string, onUpdate: (status: string) => void) => {
  return supabase
    .channel(`order-status-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      },
      (payload) => {
        if (payload.new && payload.new.status) {
          onUpdate(payload.new.status);
        }
      }
    )
    .subscribe();
};
