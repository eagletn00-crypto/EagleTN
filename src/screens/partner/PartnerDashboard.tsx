import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// 🚨 THE FIX: تم تحديث المسار ليتطابق مع الهيكلة المعمارية الجديدة
import { supabase } from '@/services/supabaseClient';
import { 
  Activity, Wallet, CheckCircle, XCircle, Clock, 
  Phone, MapPin, AlertTriangle, TrendingUp, DollarSign, 
  VolumeX, ShieldCheck, Volume2, MessageCircle, Info, ChefHat
} from 'lucide-react';

// ==========================================
// STRICT TYPESCRIPT INTERFACES
// ==========================================
interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  min_delivery_time: number;
  delivery_fee: number;
  is_open: boolean;
  restaurant_id: string; 
  logo_url: string;
  banner_url: string;
  cover_url: string;
  store_type: string;
  monthly_subscription_expiry?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  client_id: string;
  partner_id: string;
  livreur_id: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'delivered';
  items: OrderItem[] | any; 
  total_price: number;
  delivery_address: string;
  customer_phone: string;
  customer_name: string;
  driver_lat: number | null;
  driver_lng: number | null;
}

// ==========================================
// CONSTANTS & UTILITIES
// ==========================================
const formatDT = (millimes: number) => (millimes / 1000).toFixed(3) + ' DT';
const PLATFORM_FEE_RATE = 0.10; 
const PARTNER_ID = '1'; 
const SUPPORT_WHATSAPP_NUMBER = "+21650000000";

// ==========================================
// ERROR BOUNDARY SYSTEM
// ==========================================
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 p-8 flex flex-col justify-center font-mono">
          <div className="max-w-2xl mx-auto bg-rose-950/20 border border-rose-900/50 p-8 rounded-[2rem] shadow-2xl">
            <h1 className="text-3xl font-black mb-4 text-rose-500 flex items-center gap-3"><AlertTriangle /> ERREUR RUNTIME INTERCEPTÉE</h1>
            <p className="mb-6 text-sm font-bold text-slate-300">Le protocole de sécurité Eagle.tn a stoppé l'écran blanc.</p>
            <div className="bg-[#030712] p-6 rounded-xl border border-rose-500/30 overflow-auto">
              <code className="text-xs text-rose-300 whitespace-pre-wrap">{this.state.error?.toString()}</code>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// CORE WORKSPACE IMPLEMENTATION
// ==========================================
function PartnerDashboardCore() {
  const [activeTab, setActiveTab] = useState<'direct' | 'wallet'>('direct');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // ==========================================
  // REAL-TIME POSTGRES ENGINE
  // ==========================================
  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 60000); 

    const initializeWorkspace = async () => {
      setIsLoading(true);
      try {
        const { data: restData, error: restErr } = await supabase.from('restaurants').select('*').eq('id', PARTNER_ID).single();
        if (restErr) console.warn("Restaurant Fetch Error:", restErr);
        if (restData) setRestaurant(restData);

        const { data: ordData, error: ordErr } = await supabase.from('orders').select('*').eq('partner_id', PARTNER_ID).order('created_at', { ascending: false });
        if (ordErr) console.warn("Orders Fetch Error:", ordErr);
        if (ordData) {
          setOrders(ordData);
          const firstPending = ordData.find(o => o.status === 'pending');
          if (firstPending) setSelectedOrder(firstPending);
        }
      } catch (error) {
        console.error("Eagle Core Initialization Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWorkspace();

    const channel = supabase.channel('eagle_orders_flux')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders', filter: `partner_id=eq.${PARTNER_ID}` }, payload => {
        const newOrder = payload.new as Order;
        setOrders(prev => [newOrder, ...prev]);
        if (newOrder.status === 'pending') {
          playSafeAudioAlert();
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `partner_id=eq.${PARTNER_ID}` }, payload => {
        const updatedOrder = payload.new as Order;
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setSelectedOrder(prev => prev?.id === updatedOrder.id ? updatedOrder : prev);
        
        if (updatedOrder.status !== 'pending') {
          checkAndStopAudioAlert();
        }
      })
      .subscribe();

    return () => { 
      clearInterval(timeInterval);
      supabase.removeChannel(channel); 
    };
  }, []);

  const playSafeAudioAlert = useCallback(() => {
    setIsRinging(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setAudioBlocked(false);
      }).catch((e) => {
        console.warn("Autoplay block detector triggered.", e);
        setAudioBlocked(true);
      });
    }
  }, []);

  const stopAudioAlert = useCallback(() => {
    setIsRinging(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const checkAndStopAudioAlert = useCallback(() => {
    setOrders(currentOrders => {
      const stillPending = currentOrders.some(o => o.status === 'pending');
      if (!stillPending) {
        stopAudioAlert();
      }
      return currentOrders;
    });
  }, [stopAudioAlert]);

  // ==========================================
  // PSYCHOLOGICAL & FINANCIAL COMPUTATIONS
  // ==========================================
  const greetingData = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { fr: "Bonjour, Chef Am Ali 👨‍🍳", ar: "صباح الخير شيف" };
    if (hour >= 12 && hour < 18) return { fr: "Bon après-midi, Chef Am Ali ☀️", ar: "طاب يومك شيف" };
    return { fr: "Bonsoir, Chef Am Ali 🌙", ar: "مساء الخير شيف" };
  }, [currentTime]);

  const financialMetrics = useMemo(() => {
    const successfulTrades = orders.filter(o => o.status === 'delivered' || o.status === 'accepted');
    const gross = successfulTrades.reduce((sum, o) => sum + (o.total_price || 0), 0);
    const fees = gross * PLATFORM_FEE_RATE;
    const net = gross - fees;
    return { gross, fees, net };
  }, [orders]);

  const subscriptionStatus = useMemo(() => {
    if (!restaurant?.monthly_subscription_expiry) return { days: 30, active: true };
    const expiry = new Date(restaurant.monthly_subscription_expiry);
    const diffTime = expiry.getTime() - currentTime.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { days: Math.max(0, daysLeft), active: daysLeft > 0 };
  }, [restaurant?.monthly_subscription_expiry, currentTime]);

  const pendingOrders = orders.filter(o => o.status === 'pending');

  // ==========================================
  // OPERATIONAL DATABASE WRITE ACTIONS
  // ==========================================
  const toggleRestaurantOperations = async () => {
    if (!restaurant) return;
    const newState = !restaurant.is_open;
    setRestaurant(prev => prev ? { ...prev, is_open: newState } : null);
    try {
      await supabase.from('restaurants').update({ is_open: newState }).eq('id', restaurant.id);
    } catch (error) {
      console.error("Operation Toggle Failed", error);
      setRestaurant(prev => prev ? { ...prev, is_open: !newState } : null);
    }
  };

  const dispatchOrderStatus = async (id: string, status: 'accepted' | 'rejected' | 'delivered') => {
    if (status === 'rejected' && !window.confirm("CONFIRMATION CRIMINELLE : Rejeter cette commande ?")) return;
    
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status } : null);
    
    if (status !== 'pending') {
       setTimeout(checkAndStopAudioAlert, 100); 
    }

    try {
      await supabase.from('orders').update({ status }).eq('id', id);
    } catch (error) {
      console.error(`Failed to update order status`, error);
    }
  };

  const openWhatsAppGateway = (contextOrderId?: string) => {
    const ctx = contextOrderId ? `Urgence Commande ID: ${contextOrderId}` : "Assistance Générale";
    const msg = encodeURIComponent(`[EAGLE.TN - DISPATCH] Bonjour, Partenaire: ${restaurant?.name || 'Chef Am Ali'} (ID: ${PARTNER_ID}).\nContexte: ${ctx}\nRequête de support: `);
    window.open(`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const getSecurePhoneNumber = (order: Order) => {
    if (order.status === 'delivered' || order.status === 'rejected') {
      return order.customer_phone.replace(/.(?=.{4})/g, '*'); 
    }
    return order.customer_phone;
  };

  if (isLoading || !restaurant) {
    return (
      <div className="h-[100dvh] w-full bg-[#030712] flex items-center justify-center flex-col gap-5">
        <div className="w-16 h-16 border-4 border-[#0b1329] border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-emerald-500/50 text-xs font-black uppercase tracking-widest animate-pulse">Initialisation Eagle Core...</p>
      </div>
    );
  }

  const statusOpenLbl = "CUISINE OUVERTE / المطبخ مفتوح";
  const statusClosedLbl = "CUISINE FERMÉE / المطبخ مغلق";

  return (
    <div className="flex h-[100dvh] w-full bg-[#030712] text-slate-100 font-sans overflow-hidden selection:bg-emerald-500 selection:text-slate-950 relative">
      
      <audio ref={audioRef} src="/eagle.mp3" preload="auto" loop />

      {audioBlocked && (
        <div className="absolute inset-0 z-[200] bg-[#030712]/95 backdrop-blur-md flex items-center justify-center p-6">
          <button 
            onClick={playSafeAudioAlert}
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 border border-emerald-400/50 text-white px-8 py-6 rounded-[2rem] flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-pulse transition-transform active:scale-95 max-w-sm w-full text-center"
          >
            <VolumeX size={36} />
            <div>
              <span className="block text-base font-black uppercase tracking-widest mb-1">Flux Audio en Veille</span>
              <span className="block text-xs font-medium text-emerald-200">Cliquez pour initialiser le canal audio sécurisé des commandes</span>
            </div>
          </button>
        </div>
      )}

      <button 
        onClick={() => openWhatsAppGateway(selectedOrder?.id)}
        className="fixed bottom-24 lg:bottom-8 right-6 z-[100] bg-[#0b1329]/90 backdrop-blur-xl border border-slate-800/60 p-4 rounded-full shadow-[0_0_30px_rgba(3,7,18,0.9)] hover:border-emerald-500/40 transition-all duration-300 group"
        title="Contacter le répartiteur Eagle"
      >
        <MessageCircle size={26} className="text-emerald-400 group-hover:scale-110 transition-transform" />
      </button>

      <aside className="hidden lg:flex flex-col w-80 bg-[#0b1329]/50 backdrop-blur-3xl border-r border-slate-800/40 z-50 shrink-0 shadow-2xl">
        <div className="h-32 flex flex-col justify-center px-8 border-b border-slate-800/40 bg-gradient-to-b from-[#030712]/80 to-transparent">
           <h1 className="font-black text-3xl tracking-tighter text-white leading-none">
             <span className="text-emerald-500">EAGLE</span>.TN
           </h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 truncate">Chef Am Ali | Cuisine Connectée</p>
        </div>
        
        <nav className="flex-1 py-8 px-6 flex flex-col gap-3">
          <button onClick={() => setActiveTab('direct')} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ease-in-out relative group ${activeTab === 'direct' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'text-slate-400 hover:bg-[#0b1329]/80 hover:text-slate-200 border border-transparent'}`}>
            <Activity size={22} strokeWidth={activeTab === 'direct' ? 2.5 : 2} />
            <span className="font-bold text-sm tracking-wide">Commandes en Direct</span>
            {pendingOrders.length > 0 && <span className="absolute right-4 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]">{pendingOrders.length}</span>}
          </button>
          
          <button onClick={() => setActiveTab('wallet')} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ease-in-out ${activeTab === 'wallet' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'text-slate-400 hover:bg-[#0b1329]/80 hover:text-slate-200 border border-transparent'}`}>
            <Wallet size={22} strokeWidth={activeTab === 'wallet' ? 2.5 : 2} />
            <span className="font-bold text-sm tracking-wide">Portefeuille Numérique</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800/40 bg-[#030712]/50">
          <div className="flex items-center justify-between bg-[#0b1329]/50 border border-slate-800/40 px-4 py-3 rounded-2xl">
             <div className="flex items-center gap-3">
               <ShieldCheck size={18} className="text-emerald-500" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">INPDP Compliant</span>
             </div>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-transparent relative pb-20 lg:pb-0">
        
        <header className="h-28 lg:h-32 bg-[#0b1329]/30 backdrop-blur-xl border-b border-slate-800/40 flex flex-col lg:flex-row lg:items-center justify-between px-6 lg:px-10 shrink-0 z-40">
          <div className="pt-5 lg:pt-0">
            <h2 className="text-xl lg:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
              {greetingData.fr} <span className="opacity-30 text-base font-normal hidden sm:inline">| {greetingData.ar}</span>
            </h2>
            <div className="flex items-center gap-3 mt-2">
               <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_12px_currentColor] ${restaurant.is_open ? 'bg-emerald-500 text-emerald-500 animate-pulse' : 'bg-rose-500 text-rose-500'}`}></span>
               <p className={`text-[10px] lg:text-xs font-black tracking-widest uppercase ${restaurant.is_open ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {restaurant.is_open ? statusOpenLbl : statusClosedLbl}
               </p>
            </div>
          </div>

          <div className="absolute right-6 top-6 lg:static">
             <button 
                onClick={toggleRestaurantOperations} 
                className={`w-44 h-12 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500 ease-in-out transform active:scale-95 flex items-center justify-center border border-slate-800/40 shadow-2xl overflow-hidden ${
                  restaurant.is_open 
                  ? 'bg-[#030712]/80 text-rose-500 hover:bg-rose-950/40 hover:border-rose-500/50' 
                  : 'bg-[#030712]/80 text-emerald-400 hover:bg-emerald-950/40 hover:border-emerald-500/50'
                }`}
             >
               <span className="relative z-10">{restaurant.is_open ? 'FERMER LA CUISINE' : 'OUVRIR LA CUISINE'}</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar">
          
          {activeTab === 'direct' && (
            <div className="flex flex-col lg:flex-row h-full gap-6 pb-20 lg:pb-0">
              
              <div className="w-full lg:w-[420px] flex flex-col h-[50dvh] lg:h-full bg-[#0b1329]/40 border border-slate-800/40 rounded-[2rem] overflow-hidden shrink-0 backdrop-blur-xl shadow-2xl">
                <div className="p-6 border-b border-slate-800/40 bg-[#030712]/60 flex justify-between items-center backdrop-blur-md">
                  <h3 className="font-black text-sm text-slate-200 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} className="text-emerald-400"/> File des Commandes
                  </h3>
                  {isRinging && (
                    <button onClick={stopAudioAlert} className="text-emerald-400 animate-pulse bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                      MUTER ALERTE
                    </button>
                  )}
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]">{pendingOrders.length}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600">
                      <Clock size={40} className="mb-4 opacity-10" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Aucun flux actif</p>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className={`p-5 rounded-[1.5rem] cursor-pointer border transition-all duration-300 ease-in-out relative overflow-hidden ${
                          selectedOrder?.id === order.id 
                            ? 'border-emerald-500/50 bg-[#0b1329]/80 text-white shadow-[0_0_30px_rgba(16,185,129,0.05)]' 
                            : 'border-slate-800/40 bg-[#030712]/40 hover:border-slate-700/60 text-slate-400 hover:bg-[#0b1329]/60'
                        }`}
                      >
                        {order.status === 'pending' && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>}
                        
                        <div className="flex justify-between items-center mb-3 mt-1">
                           <span className="text-[10px] font-black font-mono tracking-wider opacity-60">#{order.id.split('-')[0]}</span>
                           <span className="text-[10px] font-bold flex items-center gap-1 opacity-60"><Clock size={12}/> {new Date(order.created_at).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                        <h4 className={`font-black text-lg mb-4 tracking-tight ${selectedOrder?.id === order.id ? 'text-emerald-400' : 'text-slate-200'}`}>{order.customer_name}</h4>
                        <div className="flex justify-between items-end">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                            order.status === 'pending' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            order.status === 'accepted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-slate-800/50 text-slate-500 border-slate-700/50'
                          }`}>
                            {order.status === 'pending' ? 'NOUVEAU' : order.status === 'accepted' ? 'EN CUISINE' : order.status}
                          </span>
                          <span className="font-black text-sm text-slate-100">{formatDT(order.total_price)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="w-full lg:flex-1 h-auto min-h-[50dvh] lg:h-full bg-[#0b1329]/40 border border-slate-800/40 rounded-[2rem] overflow-hidden flex flex-col backdrop-blur-xl shadow-2xl relative">
                {selectedOrder ? (
                  <div className="flex flex-col h-full">
                    <div className="p-6 lg:p-10 border-b border-slate-800/40 bg-[#030712]/60 flex flex-col lg:flex-row justify-between lg:items-start gap-6 backdrop-blur-md">
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tighter drop-shadow-md">{selectedOrder.customer_name}</h2>
                        <div className="flex flex-wrap gap-3">
                          <a href={`tel:${selectedOrder.customer_phone}`} className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-[#0b1329]/80 px-4 py-2.5 rounded-xl border border-slate-800/60 hover:bg-[#030712] transition-colors cursor-pointer shadow-sm group">
                            <Phone size={14} className="text-emerald-500 group-hover:animate-bounce"/> {getSecurePhoneNumber(selectedOrder)}
                          </a>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-[#0b1329]/80 px-4 py-2.5 rounded-xl border border-slate-800/60 shadow-sm">
                            <MapPin size={14} className="text-emerald-500"/> {selectedOrder.delivery_address || 'Retrait Comptoir'}
                          </div>
                        </div>
                        <p className="mt-4 text-[9px] font-bold text-slate-500/50 max-w-sm leading-relaxed">
                          <Info size={10} className="inline mr-1 text-slate-400"/> Loi n° 2004-63 (Tunisie) : Masquage de sécurité PII appliqué sur l'historique archivé.
                        </p>
                      </div>
                      <div className="text-left lg:text-right bg-[#030712]/80 p-5 rounded-[1.5rem] border border-slate-800/40 shadow-inner shrink-0">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Commande</p>
                        <p className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.15)] tracking-tight">{formatDT(selectedOrder.total_price)}</p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/20 to-transparent pointer-events-none h-10"></div>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">Détails des Articles</h3>
                      <div className="space-y-4">
                        {Array.isArray(selectedOrder.items) ? selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[#030712]/40 p-5 rounded-2xl border border-slate-800/40 hover:border-slate-700/50 transition-colors shadow-sm">
                            <div className="flex items-center gap-5">
                              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-sm px-3.5 py-1.5 rounded-lg shadow-inner">{item.quantity}x</span>
                              <span className="font-bold text-base text-slate-200 tracking-wide">{item.name}</span>
                            </div>
                            <span className="font-black text-sm text-slate-400">{formatDT(item.price * item.quantity)}</span>
                          </div>
                        )) : (
                           <div className="bg-[#030712]/40 p-6 rounded-2xl border border-slate-800/40">
                             <pre className="text-sm font-bold text-slate-300 whitespace-pre-wrap font-sans">{JSON.stringify(selectedOrder.items, null, 2)}</pre>
                           </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 border-t border-slate-800/40 bg-[#030712]/80 backdrop-blur-2xl shrink-0">
                      {selectedOrder.status === 'pending' ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col lg:flex-row gap-4">
                            <button onClick={() => dispatchOrderStatus(selectedOrder.id, 'rejected')} className="w-full lg:w-1/3 py-5 rounded-[1.5rem] border border-rose-900/50 bg-rose-950/20 text-rose-500 font-black text-[11px] uppercase tracking-widest hover:bg-rose-900/40 hover:border-rose-500/40 transition-all duration-300 flex justify-center items-center gap-2 active:scale-95">
                              <XCircle size={18} /> Rejeter
                            </button>
                            <button onClick={() => dispatchOrderStatus(selectedOrder.id, 'accepted')} className="w-full lg:w-2/3 py-5 rounded-[1.5rem] bg-emerald-600 text-slate-100 font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all duration-300 flex justify-center items-center gap-2 active:scale-95">
                              <CheckCircle size={18} /> Accepter & Lancer Préparation
                            </button>
                          </div>
                          <p className="text-center text-[9px] font-bold text-slate-500/40 mt-1">
                            Art. 92 Code des Obligations et des Contrats tunisien : Le prestataire logistique (Eagle.tn) décline toute responsabilité quant à la conformité hygiénique des plats exécutés.
                          </p>
                        </div>
                      ) : (
                         <div className="flex items-center justify-between bg-[#0b1329]/60 border border-slate-800/40 p-5 rounded-[1.5rem]">
                            <div className="flex items-center gap-3 text-slate-300">
                              <span className="text-[10px] font-black uppercase tracking-widest">État: {selectedOrder.status}</span>
                            </div>
                            {selectedOrder.status === 'accepted' && (
                              <button onClick={() => dispatchOrderStatus(selectedOrder.id, 'delivered')} className="text-[10px] font-black uppercase tracking-widest text-slate-950 bg-emerald-500 px-5 py-3 rounded-xl hover:bg-emerald-400 transition-colors active:scale-95 shadow-lg">
                                Valider Remise
                              </button>
                            )}
                         </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                    <Activity size={80} className="mb-6 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aucune commande sélectionnée</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="max-w-6xl mx-auto space-y-10 pb-20 lg:pb-0 animate-fade-in">
              <div className="bg-[#0b1329]/60 backdrop-blur-2xl border border-slate-800/40 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b border-slate-800/40 pb-8">
                  <div className="flex items-center gap-5">
                    <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20"><Wallet size={32} className="text-emerald-500" /></div>
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tight mb-1">Portefeuille Numérique</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registre Comptable SaaS</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#030712]/80 border border-slate-800/60 p-4 rounded-2xl flex items-center justify-between gap-6 w-full lg:w-auto">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Licence Mensuelle</span>
                      <span className="text-sm font-black text-white">{subscriptionStatus.days} Jours Actifs</span>
                    </div>
                    <button className="bg-slate-800 text-slate-300 hover:bg-emerald-500 hover:text-slate-950 border border-slate-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95">
                      RENOUVELER
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  <div className="bg-[#030712]/60 rounded-[2rem] p-8 border border-slate-800/40 shadow-inner relative overflow-hidden">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp size={16}/> Chiffre d'Affaires Brut</p>
                    <p className="text-4xl font-black text-white tracking-tighter">{formatDT(financialMetrics.gross)}</p>
                  </div>
                  
                  <div className="bg-[#030712]/60 rounded-[2rem] p-8 border border-rose-900/20 relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-600/30"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-rose-500"/> Commission Eagle (10%)</p>
                    <p className="text-4xl font-black text-rose-500/80 tracking-tighter">- {formatDT(financialMetrics.fees)}</p>
                  </div>
                  
                  <div className="bg-emerald-950/10 rounded-[2rem] p-8 border border-emerald-900/30 relative overflow-hidden shadow-inner">
                     <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
                     <p className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest mb-4 flex items-center gap-2"><DollarSign size={16}/> Revenu Net Estimé</p>
                     <p className="text-4xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.15)]">{formatDT(financialMetrics.net)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 w-full bg-[#030712]/90 backdrop-blur-2xl border-t border-slate-800/60 flex justify-around items-center px-4 py-3 pb-8 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button onClick={() => setActiveTab('direct')} className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${activeTab === 'direct' ? 'text-emerald-500 scale-110 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-slate-500'}`}>
          <Activity size={24} strokeWidth={activeTab === 'direct' ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Radar</span>
          {pendingOrders.length > 0 && <span className="absolute -top-1 -right-2 bg-emerald-500 text-slate-950 w-4 h-4 text-[9px] font-black flex items-center justify-center rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]">{pendingOrders.length}</span>}
        </button>

        <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'wallet' ? 'text-emerald-500 scale-110 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-slate-500'}`}>
          <Wallet size={24} strokeWidth={activeTab === 'wallet' ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Portefeuille</span>
        </button>
      </nav>

    </div>
  );
}

export default function PartnerDashboard() {
  return (
    <ErrorBoundary>
      <PartnerDashboardCore />
    </ErrorBoundary>
  );
}
