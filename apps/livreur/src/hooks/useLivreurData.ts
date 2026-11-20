import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export interface LivreurOrder {
  readonly id: string;
  readonly status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
  readonly total_amount: number;
  readonly delivery_fee: number;
  readonly address_spec?: string;
  readonly pickup_name?: string;
  readonly customer_phone?: string;
  readonly customer_note?: string;
  readonly created_at?: string;
}

export interface DriverWallet {
  current_cash_balance: number;
  total_earnings: number;
  max_cash_threshold: number;
  is_frozen: boolean;
}

export interface DriverProfile {
  full_name: string;
  phone: string;
}

export function useLivreurData(driverId: string) {
  const [orders, setOrders] = useState<LivreurOrder[]>([]);
  const [wallet, setWallet] = useState<DriverWallet>({
    current_cash_balance: 0,
    total_earnings: 0,
    max_cash_threshold: 200,
    is_frozen: false,
  });
  const [profile, setProfile] = useState<DriverProfile>({
    full_name: 'Coursier Eagle',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!driverId) return;

    const fetchAll = async () => {
      try {
        const [ordersRes, walletRes, profileRes] = await Promise.all([
          supabase
            .from('orders')
            .select('*')
            .eq('driver_id', driverId)
            .order('created_at', { ascending: false }),
          supabase
            .from('wallets')
            .select('current_cash_balance, total_earnings, max_cash_threshold, is_frozen')
            .eq('profile_id', driverId)
            .maybeSingle(),
          supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', driverId)
            .maybeSingle(),
        ]);

        if (!ordersRes.error && ordersRes.data) {
          setOrders(ordersRes.data as LivreurOrder[]);
        }
        if (!walletRes.error && walletRes.data) {
          const w = walletRes.data as Record<string, any>;
          setWallet({
            current_cash_balance: Number(w.current_cash_balance ?? 0),
            total_earnings: Number(w.total_earnings ?? 0),
            max_cash_threshold: Number(w.max_cash_threshold ?? 200),
            is_frozen: Boolean(w.is_frozen),
          });
        }
        if (!profileRes.error && profileRes.data) {
          const p = profileRes.data as Record<string, any>;
          setProfile({
            full_name: p.full_name || 'Coursier Eagle',
            phone: p.phone || '',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();

    const channel = supabase
      .channel(`livreur_${driverId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `driver_id=eq.${driverId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new as LivreurOrder, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((o) => (o.id === (payload.new as LivreurOrder).id ? (payload.new as LivreurOrder) : o))
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== (payload.old as LivreurOrder).id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'wallets', filter: `profile_id=eq.${driverId}` },
        (payload) => {
          const w = payload.new as Record<string, any>;
          setWallet({
            current_cash_balance: Number(w.current_cash_balance ?? 0),
            total_earnings: Number(w.total_earnings ?? 0),
            max_cash_threshold: Number(w.max_cash_threshold ?? 200),
            is_frozen: Boolean(w.is_frozen),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId]);

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled'),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === 'delivered'),
    [orders]
  );

  const todayEarnings = useMemo(() => {
    const fromOrders = completedOrders.reduce((sum, o) => sum + Number(o.delivery_fee || 0), 0);
    return Math.max(fromOrders, wallet.total_earnings);
  }, [completedOrders, wallet.total_earnings]);

  const updateOrderStatus = async (
    orderId: string,
    nextStatus: 'accepted' | 'picked_up' | 'delivered' | 'cancelled'
  ) => {
    setActionLoading(orderId);
    try {
      await supabase
        .from('orders')
        .update({ status: nextStatus } as never)
        .eq('id', orderId);
    } finally {
      setActionLoading(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    activeOrders,
    completedOrders,
    priorityOrder: activeOrders[0] || null,
    wallet,
    profile,
    todayEarnings,
    isLoading,
    actionLoading,
    updateOrderStatus,
    signOut,
  };
}
