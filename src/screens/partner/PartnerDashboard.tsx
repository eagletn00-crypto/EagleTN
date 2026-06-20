import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// 🚨 THE FIX: التصحيح الجذري للمسار النسبي لتفادي انهيار Vite
import { supabase } from '../../services/supabaseClient'; 
import { 
  Activity, Wallet, CheckCircle, XCircle, Clock, 
  Phone, MapPin, AlertTriangle, TrendingUp, DollarSign, 
  VolumeX, ShieldCheck, Volume2, MessageCircle, Info, ChefHat 
} from 'lucide-react';

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

const formatDT = (millimes: number) => (millimes / 1000).toFixed(3) + ' DT';
const PLATFORM_FEE_RATE = 0.10;
const PARTNER_ID = '1';
const SUPPORT_WHATSAPP_NUMBER = "+21650000000";

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
              {greetingData.fr}
            </h2>
            <div className="text-xs lg:text-sm font-bold text-slate-400 mt-2 flex items-center gap-2">
              <Clock size={14} className="text-emerald-500/70" />
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-6 mt-4 lg:mt-0">
             <button
               onClick={toggleRestaurantOperations}
               className={`relative overflow-hidden group flex items-center justify-between px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-black text-xs lg:text-sm uppercase tracking-widest transition-all duration-500 ${restaurant.is_open ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-r from-rose-950 to-[#0b1329] text-rose-500 border border-rose-900/50 hover:bg-rose-900/20'}`}
             >
               <span className="relative z-10 mr-4">{restaurant.is_open ? statusOpenLbl : statusClosedLbl}</span>
               <div className={`w-3 h-3 rounded-full relative z-10 ${restaurant.is_open ? 'bg-slate-950' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]'}`}></div>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 hide-scrollbar">
          {activeTab === 'wallet' ? (
             <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-[#0b1329]/60 backdrop-blur-md border border-slate-800/50 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-emerald-500/30 transition-colors">
                   <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <TrendingUp size={28} className="text-emerald-500" />
                   </div>
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Chiffre d'Affaires</span>
                   <span className="text-4xl font-black text-white tracking-tighter">{formatDT(financialMetrics.gross)}</span>
                 </div>

                 <div className="bg-[#0b1329]/60 backdrop-blur-md border border-slate-800/50 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-rose-500/30 transition-colors">
                   <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <DollarSign size={28} className="text-rose-500" />
                   </div>
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Frais Plateforme (10%)</span>
                   <span className="text-3xl font-black text-rose-400 tracking-tighter">-{formatDT(financialMetrics.fees)}</span>
                 </div>

                 <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-emerald-400/20 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
                   <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm relative z-10">
                     <Wallet size={28} className="text-emerald-100" />
                   </div>
                   <span className="text-sm font-bold text-emerald-100/70 uppercase tracking-widest mb-2 relative z-10">Revenu Net Garanti</span>
                   <span className="text-5xl font-black text-white tracking-tighter relative z-10">{formatDT(financialMetrics.net)}</span>
                 </div>
               </div>

               <div className="bg-[#0b1329]/40 backdrop-blur-md border border-slate-800/40 rounded-[2rem] p-8 mt-10">
                 <h3 className="text-lg font-black tracking-widest uppercase text-slate-300 mb-8 flex items-center gap-3"><Info className="text-emerald-500" /> État de l'Abonnement</h3>
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                   <div>
                     <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xl mb-4">
                       Votre partenariat avec Eagle.tn est actif. Le renouvellement de votre pack Premium (Visibilité Maximale + Support Prioritaire) est prévu prochainement.
                     </p>
                     <div className="flex items-center gap-3">
                       <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                         {subscriptionStatus.active ? 'Actif' : 'Expiré'}
                       </span>
                     </div>
                   </div>
                   <div className="flex flex-col items-center md:items-end">
                     <span className="text-6xl font-black text-white tracking-tighter">{subscriptionStatus.days}</span>
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Jours Restants</span>
                   </div>
                 </div>
               </div>
             </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 h-full animate-in fade-in duration-700">
               <div className="w-full lg:w-1/3 flex flex-col bg-[#0b1329]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2rem] overflow-hidden">
                 <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-[#030712]/40">
                   <h3 className="font-black text-lg tracking-widest uppercase text-white flex items-center gap-3">
                     <Activity className="text-emerald-500" /> Flux
                   </h3>
                   <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                     {orders.length} TOTAL
                   </span>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
                   {orders.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 opacity-50">
                       <ChefHat size={48} strokeWidth={1} />
                       <p className="text-sm font-bold uppercase tracking-widest text-center">Aucune commande pour le moment</p>
                     </div>
                   ) : (
                     orders.map(order => (
                       <button
                         key={order.id}
                         onClick={() => setSelectedOrder(order)}
                         className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border ${
                           selectedOrder?.id === order.id
                             ? 'bg-[#030712] border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.05)]'
                             : 'bg-[#0b1329]/50 border-slate-800/40 hover:bg-[#0b1329] hover:border-slate-700'
                         } ${order.status === 'pending' ? 'relative overflow-hidden' : ''}`}
                       >
                         {order.status === 'pending' && (
                           <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-pulse"></div>
                         )}
                         <div className="flex justify-between items-start mb-3">
                           <span className="font-black text-lg tracking-tight text-white">#{order.id.slice(0, 6).toUpperCase()}</span>
                           <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                             order.status === 'pending' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                             order.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                             order.status === 'delivered' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                             'bg-red-950/50 text-red-500 border border-red-900/50'
                           }`}>
                             {order.status}
                           </span>
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-slate-400">{new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                           <span className="font-black text-emerald-400">{formatDT(order.total_price)}</span>
                         </div>
                       </button>
                     ))
                   )}
                 </div>
               </div>

               <div className="w-full lg:w-2/3 flex flex-col bg-[#0b1329]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2rem] overflow-hidden">
                 {selectedOrder ? (
                   <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-500">
                     <div className="p-8 lg:p-10 border-b border-slate-800/50 bg-gradient-to-b from-[#030712]/80 to-transparent flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
                       <div>
                         <span className="inline-block px-3 py-1 bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-slate-700">Détails de la Commande</span>
                         <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white">
                           #{selectedOrder.id.slice(0, 6).toUpperCase()}
                         </h2>
                         <div className="flex items-center gap-6 mt-6">
                           <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                             <Phone size={16} className="text-emerald-500" /> {getSecurePhoneNumber(selectedOrder)}
                           </div>
                           <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                             <MapPin size={16} className="text-rose-500" /> {selectedOrder.delivery_address}
                           </div>
                         </div>
                       </div>
                       <div className="text-left lg:text-right">
                         <span className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Montant Total</span>
                         <span className="text-5xl font-black text-emerald-400 tracking-tighter">{formatDT(selectedOrder.total_price)}</span>
                       </div>
                     </div>

                     <div className="flex-1 overflow-y-auto p-8 lg:p-10 hide-scrollbar bg-[#030712]/20">
                       <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><ChefHat size={16} /> Contenu de la Commande</h4>
                       <div className="space-y-4">
                         {(selectedOrder.items || []).map((item: any, idx: number) => (
                           <div key={idx} className="flex justify-between items-center bg-[#0b1329]/80 border border-slate-800/50 p-6 rounded-2xl hover:border-emerald-500/30 transition-colors">
                             <div className="flex items-center gap-6">
                               <div className="w-12 h-12 bg-[#030712] border border-slate-800 rounded-xl flex items-center justify-center font-black text-lg text-emerald-500 shadow-inner">
                                 {item.quantity}x
                               </div>
                               <span className="font-bold text-lg text-slate-200 tracking-wide">{item.name}</span>
                             </div>
                             <span className="font-black text-slate-400">{formatDT(item.price * item.quantity)}</span>
                           </div>
                         ))}
                       </div>
                     </div>

                     {selectedOrder.status === 'pending' && (
                       <div className="p-6 lg:p-8 border-t border-slate-800/50 bg-[#030712]/80 shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                         <button
                           onClick={() => dispatchOrderStatus(selectedOrder.id, 'accepted')}
                           className="flex items-center justify-center gap-3 bg-emerald-500 text-slate-950 font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                         >
                           <CheckCircle size={22} /> Accepter & Préparer
                         </button>
                         <button
                           onClick={() => dispatchOrderStatus(selectedOrder.id, 'rejected')}
                           className="flex items-center justify-center gap-3 bg-transparent border-2 border-rose-900/50 text-rose-500 font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-rose-950/30 hover:border-rose-500/50 transition-all"
                         >
                           <XCircle size={22} /> Rejeter
                         </button>
                       </div>
                     )}
                     
                     {selectedOrder.status === 'accepted' && (
                       <div className="p-6 lg:p-8 border-t border-slate-800/50 bg-[#030712]/80 shrink-0 flex justify-center">
                         <div className="flex items-center gap-4 text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-8 py-5 rounded-2xl w-full justify-center shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                           <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                           <span>En cours de préparation - En attente du Livreur Eagle</span>
                         </div>
                       </div>
                     )}
                   </div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-500/50 space-y-6">
                     <div className="w-32 h-32 rounded-full bg-[#0b1329] border-2 border-slate-800/50 flex items-center justify-center">
                       <ChefHat size={48} className="opacity-50" />
                     </div>
                     <p className="text-sm font-bold uppercase tracking-widest max-w-xs text-center leading-relaxed">Sélectionnez une commande dans le flux pour afficher les détails</p>
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>
      </main>
      
      <div className="lg:hidden fixed bottom-0 w-full bg-[#0b1329]/95 backdrop-blur-3xl border-t border-slate-800/60 flex justify-around p-4 z-50 pb-safe">
        <button onClick={() => setActiveTab('direct')} className={`flex flex-col items-center gap-1.5 transition-colors relative ${activeTab === 'direct' ? 'text-emerald-500' : 'text-slate-500'}`}>
          <div className="relative">
            <Activity size={24} strokeWidth={activeTab === 'direct' ? 2.5 : 2} />
            {pendingOrders.length > 0 && <span className="absolute -top-2 -right-2 w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>}
            {pendingOrders.length > 0 && <span className="absolute -top-2 -right-2 w-3 h-3 bg-rose-500 rounded-full"></span>}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Commandes</span>
        </button>
        <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'wallet' ? 'text-emerald-500' : 'text-slate-500'}`}>
          <Wallet size={24} strokeWidth={activeTab === 'wallet' ? 2.5 : 2} />
          <span className="text-[10px] font-black uppercase tracking-widest">Portefeuille</span>
        </button>
      </div>
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
