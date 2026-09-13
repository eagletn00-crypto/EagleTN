import { OrderItem } from '../types';

export interface OrderValidationInput {
  p_items: OrderItem[];
  [key: string]: any;
}

export const validateOrderData = (input: OrderValidationInput) => {
  if (!input || !Array.isArray(input.p_items)) {
    return { isValid: false, message: 'Invalid items array' };
  }

  input.p_items.forEach((item: OrderItem, index: number) => {
    if (!item.id || item.quantity <= 0) {
      console.warn(`Invalid item at index ${index}`, item);
    }
  });

  return { isValid: true };
};
