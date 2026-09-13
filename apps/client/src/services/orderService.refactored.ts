import { OrderItem } from '../types';

export const processOrderItems = (items: OrderItem[]) => {
  return items.map((item: OrderItem) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));
};
