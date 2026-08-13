import { supabase } from '../lib/supabase';
import { Order, OrderStatus, CartItem, DeliveryAddress } from '../types';

export interface CreateOrderPayload {
  partner_id: string;
  client_id: string;
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  address: string;
  delivery_address: DeliveryAddress;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const orderData = {
      partner_id: payload.partner_id,
      client_id: payload.client_id,
      subtotal: payload.subtotal,
      delivery_fee: payload.delivery_fee,
      total_amount: payload.total_amount,
      address: payload.address,
      delivery_address: payload.delivery_address,
      delivery_latitude: payload.delivery_address.latitude || null,
      delivery_longitude: payload.delivery_address.longitude || null,
      status: 'PENDING'
    };

    const { data, error } = await (supabase.from('orders') as any)
      .insert([orderData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Order;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const { data, error } = await (supabase.from('orders') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Order;
  }
};
