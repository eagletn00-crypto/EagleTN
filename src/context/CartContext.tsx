import { createContext, useContext, useState } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: any) {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any) => setCart([...cart, item]);
  const clearCart = () => setCart([]);
  const getCartTotal = () => cart.reduce((sum, item) => sum + Number(item.price), 0);
  const getCartCount = () => cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
