import { supabase } from '../lib/supabase';

export interface OrderPayload {
  clientId?: string;
  client_id?: string;
  partnerId?: string;
  partner_id?: string;
  totalAmount?: number;
  total_amount?: number;
  deliveryFee?: number;
  delivery_fee?: number;
  deliveryAddress?: string;
  delivery_address?: string;
  paymentMethod?: 'CASH' | 'WALLET' | 'cash' | 'wallet';
  payment_method?: 'CASH' | 'WALLET' | 'cash' | 'wallet';
  items: Array<{
    menu_item_id: string;
    quantity: number;
    unit_price: number;
  }>;
}

export async function createOrderRPC(payload: OrderPayload) {
  const p_client_id = payload.clientId || payload.client_id;
  const p_partner_id = payload.partnerId || payload.partner_id;
  const p_total_amount = payload.totalAmount ?? payload.total_amount ?? 0;
  const p_delivery_fee = payload.deliveryFee ?? payload.delivery_fee ?? 0;
  const p_delivery_address = payload.deliveryAddress || payload.delivery_address || '';
  const rawPayment = (payload.paymentMethod || payload.payment_method || 'CASH').toUpperCase();
  const p_payment_method = rawPayment === 'CASH' ? 'CASH' : 'WALLET';

  const { data, error } = await supabase.rpc('create_order_rpc', {
    p_client_id,
    p_partner_id,
    p_total_amount,
    p_delivery_fee,
    p_delivery_address,
    p_payment_method,
    p_items: payload.items,
  });

  if (error) {
    console.error('Failed to create atomic order:', error);
    throw error;
  }

  return data;
}

export const orderService = {
  createOrder: createOrderRPC,
  createOrderRPC,
  getOrderById: async (orderId: string) => {
    const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (error) throw error;
    return data;
  }
};
