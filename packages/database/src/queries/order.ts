import { supabase } from '../supabase';

export type OrderItem = {
  menu_item_id: number;
  name: string;
  quantity: number;
  unit_price_tnd: number;
  total_price_tnd: number;
};

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export type Order = {
  id: number;
  restaurant_id: number;
  customer_id: number;
  status: OrderStatus;
  total_tnd: number;
  delivery_address: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
};

export async function createOrder(order: {
  restaurant_id: number;
  customer_id: number;
  delivery_address: string;
  items: Array<{
    menu_item_id: number;
    quantity: number;
    unit_price_tnd: number;
  }>;
}): Promise<Order> {
  const orderTotal = order.items.reduce(
    (sum, item) => sum + item.unit_price_tnd * item.quantity,
    0
  );

  const { data, error } = await supabase
    .from<Order>('orders')
    .insert([
      {
        restaurant_id: order.restaurant_id,
        customer_id: order.customer_id,
        status: 'pending',
        total_tnd: orderTotal,
        delivery_address: order.delivery_address,
        items: order.items.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price_tnd: item.unit_price_tnd,
          total_price_tnd: item.unit_price_tnd * item.quantity,
        })),
      },
    ])
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return data;
}

export async function getOrderStatus(orderId: number): Promise<OrderStatus> {
  const { data, error } = await supabase
    .from<Order>('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch order status for ${orderId}: ${error.message}`);
  }

  return data.status;
}

export async function getOrdersByRestaurant(restaurantId: number): Promise<Order[]> {
  const { data, error } = await supabase
    .from<Order>('orders')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch orders for restaurant ${restaurantId}: ${error.message}`);
  }

  return data ?? [];
}

export async function getPendingOrdersByRestaurant(restaurantId: number): Promise<Order[]> {
  const { data, error } = await supabase
    .from<Order>('orders')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch pending orders for restaurant ${restaurantId}: ${error.message}`);
  }

  return data ?? [];
}

export async function updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  const { data, error } = await supabase
    .from<Order>('orders')
    .update({ status })
    .eq('id', orderId)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update status for order ${orderId}: ${error.message}`);
  }

  return data;
}
