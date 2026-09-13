import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OrderItem } from '../types/order';

interface CartContextType {
  cartItems: OrderItem[];
  addToCart: (item: { id: string; title: string; price: number }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  const addToCart = (item: { id: string; title: string; price: number }) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.menu_item_id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.menu_item_id === item.id
            ? { ...i, quantity: i.quantity + 1, total_price: (i.quantity + 1) * (i.unit_price || 0) }
            : i
        );
      }
      return [
        ...prevItems,
        {
          menu_item_id: item.id,
          name: item.title,
          quantity: 1,
          unit_price: item.price,
          total_price: item.price,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.menu_item_id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.total_price, 0);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
