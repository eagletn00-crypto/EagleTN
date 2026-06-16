import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  Activity, ChefHat, Store, CheckCircle, XCircle, Clock, 
  Phone, MapPin, AlertTriangle, Menu as MenuIcon,
  Wallet, TrendingUp, DollarSign, MessageCircle, Info, Volume2, VolumeX, ShieldCheck
} from 'lucide-react';

// ==========================================
// STRICT TYPESCRIPT INTERFACES
// ==========================================
interface Restaurant {
  id: string;
  name: string;
  store_type: 'restaurant' | 'boutique' | 'pharmacy' | string;
  is_open: boolean;
  logo_url: string;
  banner_url: string;
  cover_url: string;
  monthly_subscription_expiry: string;
  restaurant_id: string;
}

interface Product {
  id: string;
  restaurant_id: string;
  name_ar: string;
  name_fr: string;
  description: string;
  price: number;
  is_promo: boolean;
  promo_price: number;
  image_url: string;
  category: string;
  in_stock: boolean;
  is_available: boolean;
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
  status: 'pending' | 'accepted' | 'rejected' | 'delivered';
  items: OrderItem[];
  total_price: number;
  delivery_address: string;
  customer_phone: string;
  customer_name: string;
  partner_id: string;
}

// ==========================================
// UTILITY FUNCTIONS & CONSTANTS
// ==========================================
const formatDT = (amount: number) => (amount / 1000).toFixed(3) + ' DT';
const PLATFORM_FEE_RATE = 0.10;
const SUPPORT_WHATSAPP_NUMBER = "21650000000"; // Provisioned corporate support line

// Cinematic Color Tokens (Tailwind classes used directly, defined here for reference)
// Master Canvas: bg-[#030712]
// Glassmorphic Cards: bg-[#0b1329]/50 backdrop-blur-xl
// Borders: border-slate-800/40

// ==========================================
// MASTER WORKSPACE COMPONENT
// ==========================================
export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu'>('orders');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingCell, setEditingCell] = useState<{ id: string, field: keyof Product } | null>(null);
  
  // Systems State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const PARTNER_ID = '1'; // In production, this maps via Auth context

  // ==========================================
  // REAL-TIME ENGINE & INITIALIZATION
  // ==========================================
  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 60000); // 1-minute tick

    const initializeWorkspace = async () => {
      setIsLoading(true);
      try {
        // Fetch Core Meta
        const { data: restData } = await supabase.from('restaurants').select('*').eq('id', PARTNER_ID).single();
        if (restData) setRestaurant(restData);

        // Fetch Inventory
        const { data: prodData } = await supabase.from('products').select('*').eq('restaurant_id', PARTNER_ID);
        if (prodData) setProducts(prodData);

        // Fetch Active Order Flux
        const { data: ordData } = await supabase.from('orders').select('*').eq('partner_id', PARTNER_ID).order('created_at', { ascending: false });
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

    // Supabase Realtime Channel Configuration
    const channel = supabase.channel('eagle_operations_flux')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders', filter: `partner_id=eq.${PARTNER_ID}` }, payload => {
        const newOrder = payload.new as Order;
        setOrders(prev => [newOrder, ...prev]);
        
        // Trigger Cinematic Alert System
        if (newOrder.status === 'pending') {
          playSafeAudioAlert();
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `partner_id=eq.${PARTNER_ID}` }, payload => {
        const updatedOrder = payload.new as Order;
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setSelectedOrder(prev => prev?.id === updatedOrder.id ? updatedOrder : prev);
      })
      .subscribe();

    return () => { 
      clearInterval(timeInterval);
      supabase.removeChannel(channel); 
    };
  }, []);

  // Safe Audio Playback handler (bypassing strict browser autoplay policies dynamically)
  const playSafeAudioAlert = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setAudioBlocked(false);
      }).catch((e) => {
        console.warn("Autoplay blocked by browser. Awaiting user interaction.", e);
        setAudioBlocked(true);
      });
    }
  }, []);

  // ==========================================
  // DYNAMIC COMPUTATIONS & BUSINESS LOGIC
  // ==========================================
  const greetingData = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { fr: "Bonjour", ar: "صباح الخير" };
    if (hour >= 12 && hour < 18) return { fr: "Bon après-midi", ar: "طاب يومك" };
    return { fr: "Bonsoir", ar: "مساء الخير" };
  }, [currentTime]);

  const financialMetrics = useMemo(() => {
    const delivered = orders.filter(o => o.status === 'delivered');
    const gross = delivered.reduce((sum, o) => sum + o.total_price, 0);
    const fees = gross * PLATFORM_FEE_RATE;
    const net = gross - fees;
    return { gross, fees, net };
  }, [orders]);

  const subscriptionStatus = useMemo(() => {
    if (!restaurant?.monthly_subscription_expiry) return { days: 0, active: false };
    const expiry = new Date(restaurant.monthly_subscription_expiry);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { days: Math.max(0, daysLeft), active: daysLeft > 0 };
  }, [restaurant?.monthly_subscription_expiry, currentTime]);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeKitchenOrders = orders.filter(o => o.status === 'accepted');

  // ==========================================
  // ACTION DISPATCHERS
  // ==========================================
  const toggleRestaurantOperations = async () => {
    if (!restaurant) return;
    const newState = !restaurant.is_open;
    setRestaurant(prev => prev ? { ...prev, is_open: newState } : null);
    try {
      await supabase.from('restaurants').update({ is_open: newState }).eq('id', restaurant.id);
    } catch (error) {
      console.error("Operation Toggle Failed", error);
      // Revert optimistic update on failure
      setRestaurant(prev => prev ? { ...prev, is_open: !newState } : null);
    }
  };

  const dispatchOrderStatus = async (id: string, status: 'accepted' | 'rejected' | 'delivered') => {
    if (status === 'rejected' && !window.confirm("CONFIRMATION REQUISE: Rejeter cette commande ? Le client sera remboursé automatiquement.")) return;
    
    // Optimistic UI Flow
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status } : null);
    
    try {
      await supabase.from('orders').update({ status }).eq('id', id);
    } catch (error) {
      console.error(`Failed to update order ${id} to ${status}`, error);
    }
  };

  const handleInlineProductMutation = async (id: string, field: keyof Product, value: any) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    setEditingCell(null);
    try {
      await supabase.from('products').update({ [field]: value }).eq('id', id);
    } catch (error) {
      console.error("Product Mutation Failed", error);
    }
  };

  const openWhatsAppGateway = (contextOrderId?: string) => {
    const ctx = contextOrderId ? `Urgence Commande ID: ${contextOrderId}` : "Assistance Générale";
    const msg = encodeURIComponent(`[EAGLE SUPPORT] Bonjour, ici Chef Am Ali (Partner ID: ${PARTNER_ID}).\nContexte: ${ctx}\nDemande: `);
    window.open(`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  // ==========================================
  // RENDER ENGINE
  // ==========================================
  if (isLoading || !restaurant) {
    return (
      <div className="h-[100dvh] w-full bg-[#030712] flex items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 border-4 border-[#0b1329] border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-amber-500/50 text-xs font-black uppercase tracking-widest animate-pulse">Initialisation Système</p>
      </div>
    );
  }

  const isCulinary = restaurant.store_type === 'restaurant';
  const statusOpenLbl = isCulinary ? "CUISINE OUVERTE" : "BOUTIQUE OUVERTE";
  const statusClosedLbl = isCulinary ? "CUISINE FERMÉE" : "BOUTIQUE FERMÉE";

  return (
    <div className="flex h-[100dvh] w-full bg-[#030712] text-slate-100 font-sans overflow-hidden selection:bg-amber-500 selection:text-slate-950 relative">
      
      <audio ref={audioRef} src="/eagle.mp3" preload="auto" />

      {/* Floating Audio Unblocker (Browsers require user gesture) */}
      {audioBlocked && (
        <button 
          onClick={playSafeAudioAlert}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-rose-600/90 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(225,29,72,0.4)] animate-bounce border border-rose-400/50"
        >
          <VolumeX size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Activer Son d'Alerte</span>
        </button>
      )}

      {/* ========================================== */}
      {/* DESKTOP SIDEBAR / MASTER NAVIGATION */}
      {/* ========================================== */}
      <aside className="hidden lg:flex flex-col w-80 bg-[#0b1329]/50 backdrop-blur-3xl border-r border-slate-800/40 z-50 shrink-0 shadow-2xl">
        <div className="h-32 flex flex-col justify-center px-8 border-b border-slate-800/40 bg-gradient-to-b from-[#030712]/80 to-transparent">
           <h1 className="font-black text-3xl tracking-tighter text-white leading-none flex items-center gap-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
             <span className="text-amber-500">EAGLE</span>.TN
           </h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{restaurant.name} | PORTAIL PRO</p>
        </div>
        
        <nav className="flex-1 py-8 px-6 flex flex-col gap-3">
          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ease-in-out relative group ${activeTab === 'orders' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'text-slate-400 hover:bg-[#0b1329] hover:text-slate-200 border border-transparent'}`}>
            <Activity size={22} strokeWidth={activeTab === 'orders' ? 2.5 : 2} />
            <span className="font-bold text-sm tracking-wide">Centre de Commandement</span>
            {pendingOrders.length > 0 && <span className="absolute right-4 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]">{pendingOrders.length}</span>}
          </button>
          
          <button onClick={() => setActiveTab('menu')} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ease-in-out ${activeTab === 'menu' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'text-slate-400 hover:bg-[#0b1329] hover:text-slate-200 border border-transparent'}`}>
            <ChefHat size={22} strokeWidth={activeTab === 'menu' ? 2.5 : 2} />
            <span className="font-bold text-sm tracking-wide">Éditeur de Menu Spatial</span>
          </button>

          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ease-in-out ${activeTab === 'dashboard' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'text-slate-400 hover:bg-[#0b1329] hover:text-slate-200 border border-transparent'}`}>
            <Wallet size={22} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
            <span className="font-bold text-sm tracking-wide">Portefeuille & Identité</span>
          </button>
        </nav>

        {/* Support Gateway */}
        <div className="p-6 border-t border-slate-800/40 bg-[#030712]/50">
          <button onClick={() => openWhatsAppGateway()} className="w-full bg-[#0b1329] border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 p-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest group shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <MessageCircle size={18} className="group-hover:scale-110 transition-transform"/> Support SOS
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* MAIN VIEWPORT */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[url('/eagle-bg.png')] bg-cover bg-center bg-no-repeat relative bg-blend-overlay" style={{ backgroundColor: 'rgba(3, 7, 18, 0.95)' }}>
        
        {/* DYNAMIC TOPBAR GREETING */}
        <header className="h-28 lg:h-32 bg-[#030712]/80 backdrop-blur-2xl border-b border-slate-800/40 flex flex-col lg:flex-row lg:items-center justify-between px-6 lg:px-10 shrink-0 z-40">
          <div className="pt-5 lg:pt-0">
            <h2 className="text-xl lg:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
              {greeting.fr}, Chef {restaurant.name.split(' ')[0] || ''} <span className="opacity-30 text-base font-normal hidden sm:inline">| {greeting.ar} شيف</span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
               <span className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${restaurant.is_open ? 'bg-emerald-500 text-emerald-500 animate-pulse' : 'bg-rose-500 text-rose-500'}`}></span>
               <p className={`text-[10px] lg:text-xs font-black tracking-widest uppercase ${restaurant.is_open ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {restaurant.is_open ? statusOpenLbl : statusClosedLbl}
               </p>
            </div>
          </div>

          {/* Liquid Master Toggle */}
          <div className="absolute right-6 top-6 lg:static">
             <button 
                onClick={toggleRestaurantOperations} 
                className={`w-36 h-12 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-700 ease-in-out transform active:scale-95 flex items-center justify-center border-2 shadow-2xl overflow-hidden relative group ${
                  restaurant.is_open 
                  ? 'bg-rose-950/40 border-rose-900/50 text-rose-500 hover:bg-rose-900/40 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(225,29,72,0.2)]' 
                  : 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/40 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                }`}
             >
               <span className="relative z-10">{restaurant.is_open ? 'METTRE HORS LIGNE' : 'OUVRIR SERVICE'}</span>
             </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 lg:p-8">
          
          {/* ========================================== */}
          {/* TAB 1: LIVE COMMAND CENTER (ORDERS) */}
          {/* ========================================== */}
          {activeTab === 'orders' && (
            <div className="flex flex-col lg:flex-row h-full gap-6 animate-fade-in">
              
              {/* Order Stream Column */}
              <div className="w-full lg:w-[420px] flex flex-col h-[45dvh] lg:h-full bg-[#0b1329]/50 border border-slate-800/40 rounded-[2rem] overflow-hidden shrink-0 backdrop-blur-xl shadow-2xl">
                <div className="p-6 border-b border-slate-800/40 bg-[#030712]/40 flex justify-between items-center backdrop-blur-md">
                  <h3 className="font-black text-sm text-slate-200 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} className="text-emerald-400"/> Flux Radar
                  </h3>
                  <div className="flex items-center gap-2">
                    {activeKitchenOrders.length > 0 && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black px-2 py-0.5 rounded-full">{activeKitchenOrders.length} Cuisson</span>}
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]">{pendingOrders.length}</span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600">
                      <Clock size={40} className="mb-4 opacity-10" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Radar en veille</p>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className={`p-5 rounded-[1.5rem] cursor-pointer border transition-all duration-500 ease-in-out relative overflow-hidden ${
                          selectedOrder?.id === order.id 
                            ? 'border-amber-500/50 bg-[#0b1329] text-white shadow-[0_0_30px_rgba(245,158,11,0.05)]' 
                            : 'border-slate-800/40 bg-[#030712]/60 hover:border-slate-700/60 text-slate-400 hover:bg-[#0b1329]/80'
                        }`}
                      >
                        {/* Status Pulse Bar */}
                        {order.status === 'pending' && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse"></div>}
                        {order.status === 'accepted' && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>}

                        <div className="flex justify-between items-center mb-3 mt-1">
                           <span className="text-[10px] font-black font-mono tracking-wider opacity-60">#{order.id.split('-')[0]}</span>
                           <span className="text-[10px] font-bold flex items-center gap-1 opacity-60"><Clock size={12}/> {new Date(order.created_at).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                        <h4 className={`font-black text-lg mb-4 tracking-tight ${selectedOrder?.id === order.id ? 'text-amber-400' : 'text-slate-200'}`}>{order.customer_name}</h4>
                        <div className="flex justify-between items-end">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                            order.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            order.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            order.status === 'delivered' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
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

              {/* Order Inspector View */}
              <div className="w-full lg:flex-1 h-auto min-h-[50dvh] lg:h-full bg-[#0b1329]/50 border border-slate-800/40 rounded-[2rem] overflow-hidden flex flex-col backdrop-blur-xl shadow-2xl">
                {selectedOrder ? (
                  <div className="flex flex-col h-full animate-fade-in">
                    {/* Header */}
                    <div className="p-8 lg:p-10 border-b border-slate-800/40 bg-[#030712]/40 flex flex-col lg:flex-row justify-between lg:items-start gap-6 backdrop-blur-md">
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-5 tracking-tighter drop-shadow-md">{selectedOrder.customer_name}</h2>
                        <div className="flex flex-wrap gap-3">
                          <a href={`tel:${selectedOrder.customer_phone}`} className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-[#0b1329] px-4 py-2.5 rounded-xl border border-slate-800/60 hover:bg-[#030712] transition-colors cursor-pointer shadow-sm group">
                            <Phone size={14} className="text-amber-500 group-hover:animate-bounce"/> {selectedOrder.customer_phone}
                          </a>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-[#0b1329] px-4 py-2.5 rounded-xl border border-slate-800/60 shadow-sm">
                            <MapPin size={14} className="text-amber-500"/> {selectedOrder.delivery_address || 'Retrait Comptoir'}
                          </div>
                        </div>
                      </div>
                      <div className="text-left lg:text-right bg-[#030712]/80 p-5 rounded-[1.5rem] border border-slate-800/40 shadow-inner">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Montant à Encaisser</p>
                        <p className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.15)] tracking-tight">{formatDT(selectedOrder.total_price)}</p>
                      </div>
                    </div>

                    {/* Items Array */}
                    <div className="flex-1 overflow-y-auto p-8 lg:p-10 no-scrollbar relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/10 to-transparent pointer-events-none h-10"></div>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><ChefHat size={14}/> Bordereau d'Exécution</h3>
                      <div className="space-y-4">
                        {Array.isArray(selectedOrder.items) ? selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[#030712]/60 p-5 rounded-2xl border border-slate-800/40 hover:border-slate-700/50 transition-colors shadow-sm">
                            <div className="flex items-center gap-5">
                              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 font-black text-sm px-3.5 py-1.5 rounded-lg shadow-inner">{item.quantity}x</span>
                              <span className="font-bold text-base text-slate-200 tracking-wide">{item.name}</span>
                            </div>
                            <span className="font-black text-sm text-slate-400">{formatDT(item.price * item.quantity)}</span>
                          </div>
                        )) : (
                           <div className="bg-[#030712]/60 p-6 rounded-2xl border border-slate-800/40">
                             <pre className="text-sm font-bold text-slate-300 whitespace-pre-wrap font-sans">{selectedOrder.items as unknown as string}</pre>
                           </div>
                        )}
                      </div>
                    </div>

                    {/* Action Engine Workspace */}
                    <div className="p-6 border-t border-slate-800/40 bg-[#030712]/80 backdrop-blur-2xl shrink-0">
                      {selectedOrder.status === 'pending' ? (
                        <div className="flex flex-col lg:flex-row gap-4">
                          <button onClick={() => dispatchOrderStatus(selectedOrder.id, 'rejected')} className="w-full lg:w-1/3 py-5 rounded-[1.5rem] border border-rose-900/50 bg-rose-950/20 text-rose-500 font-black text-[11px] uppercase tracking-widest hover:bg-rose-900/40 hover:border-rose-500/40 transition-all duration-300 flex justify-center items-center gap-2 active:scale-95">
                            <XCircle size={18} /> Rejeter
                          </button>
                          <button onClick={() => dispatchOrderStatus(selectedOrder.id, 'accepted')} className="w-full lg:w-2/3 py-5 rounded-[1.5rem] bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-widest hover:bg-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 flex justify-center items-center gap-2 active:scale-95">
                            <CheckCircle size={18} /> Accepter & Lancer Préparation
                          </button>
                        </div>
                      ) : (
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                              <span className="text-[10px] font-black uppercase tracking-widest">En Cuisine (Accepté)</span>
                            </div>
                            <button onClick={() => openWhatsAppGateway(selectedOrder.id)} className="bg-[#0b1329] border border-slate-800/60 text-slate-300 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
                               <AlertTriangle size={14} className="text-amber-500"/> SOS Commande
                            </button>
                         </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                    <Activity size={80} className="mb-6 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Zone d'inspection radar vide</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: MENU CUSTOMIZER (INLINE EDIT ENGINE) */}
          {/* ========================================== */}
          {activeTab === 'menu' && (
            <div className="max-w-7xl mx-auto animate-fade-in pb-20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Menu Customizer</h2>
                  <p className="text-[10px] font-black text-amber-500/80 mt-2 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle size={12}/> Moteur Édition Inline Actif (Sauvegarde Automatique)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-[#0b1329]/40 border border-slate-800/40 rounded-[2rem] p-4 flex flex-col group hover:border-slate-700/60 transition-all backdrop-blur-xl shadow-lg relative overflow-hidden">
                    
                    {/* Visual Asset Block */}
                    <div className="relative h-48 bg-[#030712] rounded-[1.5rem] overflow-hidden mb-5 border border-slate-800/50 shadow-inner">
                      <img src={product.image_url || '/favicon.svg'} alt={product.name_fr} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                      {product.is_promo && <span className="absolute top-3 right-3 bg-rose-600 text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg shadow-xl tracking-widest">Promo Actif</span>}
                    </div>

                    <div className="flex-1 space-y-5 px-2">
                      {/* Interactive Name FR */}
                      <div onDoubleClick={() => setEditingCell({ id: product.id, field: 'name_fr' })}>
                        {editingCell?.id === product.id && editingCell?.field === 'name_fr' ? (
                          <input 
                            autoFocus
                            defaultValue={product.name_fr}
                            onBlur={(e) => handleInlineProductMutation(product.id, 'name_fr', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleInlineProductMutation(product.id, 'name_fr', e.currentTarget.value)}
                            className="w-full bg-[#030712] border border-amber-500/50 text-white font-black text-sm rounded-xl px-4 py-2.5 outline-none shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all"
                          />
                        ) : (
                          <h4 className="font-black text-base text-slate-200 cursor-text hover:text-amber-400 transition-colors line-clamp-1 tracking-wide" title="Double-click to edit">{product.name_fr || 'Nom non défini'}</h4>
                        )}
                      </div>

                      {/* Interactive Price */}
                      <div onDoubleClick={() => setEditingCell({ id: product.id, field: 'price' })} className="flex justify-between items-end border-b border-slate-800/50 pb-5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prix (DT)</span>
                        {editingCell?.id === product.id && editingCell?.field === 'price' ? (
                          <input 
                            type="number"
                            autoFocus
                            defaultValue={product.price}
                            onBlur={(e) => handleInlineProductMutation(product.id, 'price', parseFloat(e.target.value))}
                            onKeyDown={(e) => e.key === 'Enter' && handleInlineProductMutation(product.id, 'price', parseFloat(e.currentTarget.value))}
                            className="w-28 bg-[#030712] border border-amber-500/50 text-amber-500 font-black text-base rounded-xl px-3 py-2 outline-none text-right shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                          />
                        ) : (
                          <span className="font-black text-xl text-emerald-400 cursor-text hover:text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.1)]">{formatDT(product.price)}</span>
                        )}
                      </div>

                      {/* Fluid Toggles */}
                      <div className="space-y-2 pt-1">
                        <ToggleSwitch label="En Stock" enabled={product.in_stock} onChange={() => handleInlineProductMutation(product.id, 'in_stock', !product.in_stock)} />
                        <ToggleSwitch label="Visible Client" enabled={product.is_available} onChange={() => handleInlineProductMutation(product.id, 'is_available', !product.is_available)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: DIGITAL WALLET & IDENTITY WORKSPACE */}
          {/* ========================================== */}
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
              
              {/* SAAS DIGITAL WALLET */}
              <div className="bg-[#0b1329]/60 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl">
                <div className="flex items-center justify-between mb-10 border-b border-slate-800/40 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20"><Wallet size={28} className="text-amber-500" /></div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Portefeuille Numérique</h2>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hidden sm:block">Actif</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {/* Gross */}
                  <div className="bg-[#030712]/60 rounded-[2rem] p-8 border border-slate-800/60 shadow-inner">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><TrendingUp size={16}/> Volume d'Affaires Brut</p>
                    <p className="text-4xl font-black text-white tracking-tighter">{formatDT(financialMetrics.gross)}</p>
                  </div>
                  
                  {/* Fees */}
                  <div className="bg-rose-950/20 rounded-[2rem] p-8 border border-rose-900/30 relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-600/50 shadow-[0_0_15px_rgba(225,29,72,0.5)]"></div>
                    <p className="text-[10px] font-black text-rose-400/80 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle size={16}/> Frais Plateforme Eagle (10%)</p>
                    <p className="text-4xl font-black text-rose-500 tracking-tighter">- {formatDT(financialMetrics.fees)}</p>
                  </div>
                  
                  {/* Net */}
                  <div className="bg-emerald-950/20 rounded-[2rem] p-8 border border-emerald-900/40 relative overflow-hidden shadow-inner">
                     <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
                     <p className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest mb-3 flex items-center gap-2"><DollarSign size={16}/> Revenu Net Encaissé</p>
                     <p className="text-4xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.15)]">{formatDT(financialMetrics.net)}</p>
                  </div>
                </div>

                {/* SaaS Subscription Tracker */}
                <div className="mt-10 bg-[#030712]/80 border border-slate-800/60 rounded-[2rem] p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
                  <div className="w-full sm:w-1/2">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={16} className="text-amber-500"/> Licence SaaS Eagle</h4>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{subscriptionStatus.days} Jours Restants</span>
                    </div>
                    <div className="w-full bg-[#0b1329] h-2.5 rounded-full overflow-hidden border border-slate-800/60">
                      {/* Simple progress bar calculation (max 30 days visualization) */}
                      <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${Math.min(100, (subscriptionStatus.days / 30) * 100)}%` }}></div>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto bg-amber-500 text-slate-950 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-95 shrink-0">
                    Renouveler Licence
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ========================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (GLASSMORPHIC) */}
      {/* ========================================== */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-[#030712]/80 backdrop-blur-2xl border-t border-slate-800/60 flex justify-around items-center px-4 py-3 pb-safe z-50">
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${activeTab === 'orders' ? 'text-amber-500 scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'text-slate-500'}`}>
          <Activity size={24} strokeWidth={activeTab === 'orders' ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Radar</span>
          {pendingOrders.length > 0 && <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 w-4 h-4 text-[9px] font-black flex items-center justify-center rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]">{pendingOrders.length}</span>}
        </button>
        
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'menu' ? 'text-amber-500 scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'text-slate-500'}`}>
          <ChefHat size={24} strokeWidth={activeTab === 'menu' ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
        </button>

        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'dashboard' ? 'text-amber-500 scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'text-slate-500'}`}>
          <Wallet size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Portefeuille</span>
        </button>
      </nav>

    </div>
  );
}
