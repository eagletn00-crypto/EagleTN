import { supabase } from '../lib/supabase';
import { CartItem } from '../types';

export interface CreateOrderPayload {
  partnerId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  customerPhone?: string;
  notes?: string;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload) {
    try {
      // 1. إنشاء سجل الطلب الأساسي
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          partner_id: payload.partnerId,
          total_amount: payload.totalAmount,
          status: 'pending',
          delivery_address: payload.deliveryAddress,
          delivery_phone: payload.customerPhone || '',
          notes: payload.notes || '',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. إدراج عناصر الطلب المرفقة
      if (payload.items && payload.items.length > 0) {
        const orderItemsPayload = payload.items.map((item) => ({
          order_id: order.id,
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsPayload);

        if (itemsError) console.error('Error inserting order items:', itemsError);
      }

      return { success: true, orderId: order.id };
    } catch (error: any) {
      console.error('Order creation error:', error);
      return { success: false, error: error.message || 'فشل في إنشاء الطلب' };
    }
  }
};
