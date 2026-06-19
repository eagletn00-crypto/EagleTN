import React, { useState, useEffect } from 'react';
import { 
  Store, 
  ShoppingBag, 
  Clock, 
  Truck, 
  CheckCircle, 
  TrendingUp, 
  Wallet as WalletIcon,
  AlertCircle,
  ChevronRight,
  Package,
  Activity
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Replace with your actual env variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- TYPES & INTERFACES ---
type StoreCategory = 'restaurant' | 'pharmacy' | 'grocery';
type OrderStatus = 'new' | 'preparing' | 'delivering' | 'delivered';

interface StoreData {
  id: string;
  name: string;
  category: StoreCategory;
  is_active: boolean;
}

interface Wallet {
  id: string;
  store_id: string;
  balance: number;
  total_earned: number;
  commission_paid: number;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string; // Joined from products table
}

interface Order {
  id: string;
  store_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}

interface PartnerDashboardProps {
  storeId: string;
}

// --- MAIN COMPONENT ---
export default function PartnerDashboard({ storeId }: PartnerDashboardProps) {
  // State Management
  const [store, setStore] = useState<StoreData | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<OrderStatus>('new');

  // --- DATA FETCHING & REALTIME SUBSCRIPTION ---
  useEffect(() => {
    fetchDashboardData();

    // Real-time subscription for Order updates
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders',
        filter: `store_id=eq.${storeId}` 
      }, (payload) => {
        handleRealtimeOrderUpdate(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [storeId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch Store
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();
      if (storeError) throw storeError;
      setStore(storeData);

      // Fetch Wallet
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('store_id', storeId)
        .single();
      if (walletError) throw walletError;
      setWallet(walletData);

      // Fetch Active Orders (Excluding delivered to keep dashboard clean)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id, quantity, price, product_id,
            products (name)
          )
        `)
        .eq('store_id', storeId)
        .neq('status', 'delivered')
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;

      // Map joined items correctly
      const formattedOrders: Order[] = ordersData.map((order: any) => ({
        ...order,
        items: order.order_items.map((item: any) => ({
          id: item.id,
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          product_name: item.products?.name || 'Article inconnu'
        }))
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeOrderUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setOrders((prevOrders) => {
      if (eventType === 'INSERT') {
        return [{ ...newRecord, items: [] } as Order, ...prevOrders];
      }
      if (eventType === 'UPDATE') {
        if (newRecord.status === 'delivered') {
          return prevOrders.filter(o => o.id !== newRecord.id);
        }
        return prevOrders.map(o => o.id === newRecord.id ? { ...o, ...newRecord } : o);
      }
      if (eventType === 'DELETE') {
        return prevOrders.filter(o => o.id !== oldRecord.id);
      }
      return prevOrders;
    });
  };

  // --- BUSINESS LOGIC ---
  const updateOrderStatus = async (order: Order, newStatus: OrderStatus) => {
    try {
      // 1. Update Order Status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);
      
      if (orderError) throw orderError;

      // 2. Financial Calculation if Delivered (10% Commission Model)
      if (newStatus === 'delivered' && wallet) {
        const eagleCommissionRate = 0.10;
        const storeShareRate = 0.90;
        
        const commissionAmount = order.total_amount * eagleCommissionRate;
        const storeAmount = order.total_amount * storeShareRate;

        const { error: walletError } = await supabase
          .from('wallets')
          .update({
            balance: wallet.balance + storeAmount,
            total_earned: wallet.total_earned + storeAmount,
            commission_paid: wallet.commission_paid + commissionAmount
          })
          .eq('id', wallet.id);

        if (walletError) throw walletError;
        
        // Update local wallet state
        setWallet({
          ...wallet,
          balance: wallet.balance + storeAmount,
          total_earned: wallet.total_earned + storeAmount,
          commission_paid: wallet.commission_paid + commissionAmount
        });
      }

      // Local State Optimistic UI Update handled by Realtime listener, 
      // but we can force it here for instant feedback
      if (newStatus !== 'delivered') {
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
      } else {
        setOrders(prev => prev.filter(o => o.id !== order.id));
      }

    } catch (error) {
      console.error('Error updating order:', error);
      alert('Erreur lors de la mise à jour de la commande.');
    }
  };

  // --- DYNAMIC THEMING ---
  const getTheme = (category?: StoreCategory) => {
    switch (category) {
      case 'restaurant': return { gradient: 'from-orange-500 to-red-600', badge: 'bg-orange-100 text-orange-800', border: 'border-orange-200' };
      case 'pharmacy': return { gradient: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-200' };
      case 'grocery': return { gradient: 'from-blue-500 to-indigo-600', badge: 'bg-blue-100 text-blue-800', border: 'border-blue-200' };
      default: return { gradient: 'from-gray-700 to-gray-900', badge: 'bg-gray-100 text-gray-800', border: 'border-gray-200' };
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Activity className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!store || !wallet) return null;

  const theme = getTheme(store.category);
  const filteredOrders = orders.filter(o => o.status === activeTab);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      
      {/* --- HEADER --- */}
      <header className={`relative w-full overflow-hidden bg-gradient-to-r ${theme.gradient} px-6 py-10 shadow-lg sm:px-10`}>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="relative z-10 mx-auto max-w-7xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-md">
              <Store className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Marhba, {store.name}</h1>
              <p className="mt-1 text-sm font-medium text-white/80 capitalize">
                Tableau de bord {store.category === 'restaurant' ? 'Restaurant' : store.category === 'pharmacy' ? 'Pharmacie' : 'Épicerie'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 rounded-2xl bg-white/10 p-4 backdrop-blur-md sm:flex-row sm:gap-6 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2"><WalletIcon className="h-5 w-5 text-white" /></div>
              <div>
                <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Solde (TND)</p>
                <p className="text-2xl font-bold text-white">{wallet.balance.toFixed(2)} DT</p>
              </div>
            </div>
            <div className="hidden h-12 w-px bg-white/20 sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2"><TrendingUp className="h-5 w-5 text-white" /></div>
              <div>
                <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Gains Totaux</p>
                <p className="text-lg font-bold text-white">{wallet.total_earned.toFixed(2)} DT</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="mb-8 flex space-x-1 rounded-xl bg-slate-200/50 p-1 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${
              activeTab === 'new' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <AlertCircle className="h-5 w-5" />
            Nouvelles ({orders.filter(o => o.status === 'new').length})
          </button>
          <button
            onClick={() => setActiveTab('preparing')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${
              activeTab === 'preparing' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <Clock className="h-5 w-5" />
            En Préparation ({orders.filter(o => o.status === 'preparing').length})
          </button>
          <button
            onClick={() => setActiveTab('delivering')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${
              activeTab === 'delivering' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <Truck className="h-5 w-5" />
            En Route ({orders.filter(o => o.status === 'delivering').length})
          </button>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <Package className="mb-4 h-16 w-16 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-900">Aucune commande pour le moment</h3>
            <p className="mt-1 text-slate-500">Dès qu'un client passe commande, elle apparaîtra ici.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className={`flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md ${theme.border} hover:ring-2`}
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="mb-2 text-sm font-semibold text-slate-900">Articles à préparer :</p>
                    <ul className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <li key={idx} className="flex items-start justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`flex h-6 w-6 items-center justify-center rounded-md ${theme.badge} font-bold`}>
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-slate-700">{item.product_name}</span>
                          </div>
                          <span className="font-semibold text-slate-900">{(item.price * item.quantity).toFixed(2)} DT</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">Total Client</span>
                    <span className="text-xl font-black text-slate-900">{order.total_amount.toFixed(2)} DT</span>
                  </div>
                  
                  {/* Action Buttons based on Status */}
                  {order.status === 'new' && (
                    <button
                      onClick={() => updateOrderStatus(order, 'preparing')}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 font-bold text-white transition-all hover:bg-slate-800 focus:ring-4 focus:ring-slate-200"
                    >
                      Accepter & Préparer
                      <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order, 'delivering')}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 font-bold text-white transition-all hover:bg-amber-600 focus:ring-4 focus:ring-amber-200"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Prêt pour le Livreur
                    </button>
                  )}
                  {order.status === 'delivering' && (
                    <button
                      onClick={() => updateOrderStatus(order, 'delivered')}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 font-bold text-white transition-all hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-200"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Marquer comme Livrée
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
