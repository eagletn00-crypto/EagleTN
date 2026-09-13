import { OrderItem } from '../types';

export const enhancedOrderService = {
  formatItems: (items: OrderItem[]) => {
    return items.map((item: OrderItem) => ({
      p_id: item.id,
      p_qty: item.quantity,
      p_price: item.price
    }));
  }
};
