import { supabase } from '../lib/supabase';

export async function fetchOrderStatus(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error:', error);
    return null;
  }
  return data?.status;
}
