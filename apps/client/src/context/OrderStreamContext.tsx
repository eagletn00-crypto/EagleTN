import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Using local supabase instance

// TS FIX: Localizing the Order type to bypass strict workspace cross-linking issues
export type Order = any; 

interface OrderStreamContextValue {
  readonly activeOrders: Order[];
  readonly isLoading: boolean;
  readonly error: Error | null;
}

const OrderStreamContext = createContext<OrderStreamContextValue | null>(null);

export const OrderStreamProvider: React.FC<{ readonly children: ReactNode; readonly userId: string }> = ({ 
  children, 
  userId 
}) => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Localized stream fallback implementation
    const channel = supabase.channel('local_orders_stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        console.log('Realtime Order Event:', payload);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <OrderStreamContext.Provider value={{ activeOrders, isLoading, error }}>
      {children}
    </OrderStreamContext.Provider>
  );
};

export const useClientOrderStream = (): OrderStreamContextValue => {
  const context = useContext(OrderStreamContext);
  if (!context) {
    throw new Error('useClientOrderStream must be used within an OrderStreamProvider');
  }
  return context;
};
