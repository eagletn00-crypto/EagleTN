import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { supabase } from '../../services/supabaseClient'; 
import { 
  Activity, Wallet, CheckCircle, XCircle, Clock, 
  Phone, MapPin, AlertTriangle, TrendingUp, DollarSign, 
  VolumeX, ShieldCheck, MessageCircle, Info, ChefHat 
} from 'lucide-react';

// ==========================================
// STRICT TYPESCRIPT INTERFACES (ALIGNED WITH DB SCHEMA)
// ==========================================
interface PartnerProfile {
  id: string;
  name: string;
  location: any;
  billing_type: string;
  commission_rate: number;
  wallet_balance: number;
  is_active: boolean;
  is_open: boolean;
  category: string;
  logo_url: string;
  cover_url: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  client_id: string;
  partner_id: string;
  current_driver_id: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'delivered' | string;
  total_amount: number;
  delivery_fee: number;
  created_at: string;
  // حقول إضافية افتراضية للواجهة
  customer_phone?: string;
  delivery_address?: string;
  items?: OrderItem[] | any;
}

// ==========================================
// CONSTANTS & UTILITIES
// ==========================================
const formatDT = (millimes: number) => (millimes / 1000).toFixed(3) + ' DT';
const PARTNER_ID = '1'; // يجب تغييره لاحقاً ليقرأ من الجلسة النشطة
const SUPPORT_WHATSAPP_NUMBER = "+21650000000";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 p-8 flex flex-col justify-center font-mono">
          <div className="max-w-2xl mx-auto bg-rose-950/20 border border-rose-900/50 p-8 rounded-[2rem] shadow-2xl">
            <h1 className="text-3xl font-black mb-4 text-rose-500 flex items-center gap-3"><AlertTriangle /> ERREUR SYSTEME</h1>
            <p className="mb-6 text-sm font-bold text-slate-300">Eagle.tn Crash Prevented.</p>
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
  const [partnerData, setPartnerData] = useState<PartnerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 60000);

    const initializeWorkspace = async () => {
      setIsLoading(true);
      try {
        // الاستدعاء المصحح للجدول الحقيقي 'partners'
        const { data: pData, error: pErr } = await supabase.from('partners').select('*').eq('id', PARTNER_ID).single();
        if (pErr) console.warn("Partner Fetch Error:", pErr);
        if (pData) setPartnerData(pData);

        // الاستدعاء المصحح للجدول الحقيقي 'orders'
        const { data: ordData, error: ordErr } = await supabase.from('orders').select('*').eq('partner_id', PARTNER_ID).order('created_at', { ascending: false });
        if (ordErr) console.warn("Orders Fetch Error:", ordErr);
        
        if (ordData) {
          setOrders(ordData);
          const firstPending = ordData.find(o => o.status === 'pending');
          if (firstPending) setSelectedOrder(firstPending);
        }
      } catch (error) {
        console.error("Eagle Core Sync Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWorkspace();

    const channel = supabase.channel('eagle_orders_flux')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders', filter: `partner_id=eq.${PARTNER_ID}` }, payload => {
        const newOrder = payload.new as Order;
        setOrders(prev => [newOrder, ...prev]);
        if (newOrder.status === 'pending') playSafeAudioAlert();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `partner_id=eq.${PARTNER_ID}` }, payload => {
        const updatedOrder = payload.new as Order;
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setSelectedOrder(prev => prev?.id === updatedOrder.id ? updatedOrder : prev);
        if (updatedOrder.status !== 'pending') checkAndStopAudioAlert();
      })
      .subscribe();

    return () => {
      clearInterval(timeInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const playSafeAudioAlert = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setAudioBlocked(false)).catch(() => setAudioBlocked(true));
    }
  }, []);

  const stopAudioAlert = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const checkAndStopAudioAlert = useCallback(() => {
    setOrders(currentOrders => {
      if (!currentOrders.some(o => o.status === 'pending')) stopAudioAlert();
      return currentOrders;
    });
  }, [stopAudioAlert]);

  const greetingData = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { fr: `Bonjour, ${partnerData?.name || 'Partenaire'} 👨‍🍳` };
    if (hour >= 12 && hour < 18) return { fr: `Bon après-midi, ${partnerData?.name || 'Partenaire'} ☀️` };
    return { fr: `Bonsoir, ${partnerData?.name || 'Partenaire'} 🌙` };
  }, [currentTime, partnerData]);

  const financialMetrics = useMemo(() => {
    const success = orders.filter(o => o.status === 'delivered' || o.status === 'accepted');
    const gross = success.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const rate = partnerData?.commission_rate || PLATFORM_FEE_RATE;
    const fees = gross * rate;
    return { gross, fees, net: gross - fees };
  }, [orders, partnerData]);

  const toggleOperations = async () => {
    if (!partnerData) return;
    const newState = !partnerData.is_open;
    setPartnerData(prev => prev ? { ...prev, is_open: newState } : null);
    try {
      await supabase.from('partners').update({ is_open: newState }).eq('id', partnerData.id);
    } catch (error) {
      setPartnerData(prev => prev ? { ...prev, is_open: !newState } : null);
    }
  };

  const dispatchStatus = async (id: string, status: string) => {
    if (status === 'rejected' && !window.confirm("CONFIRMATION : Rejeter cette commande ?")) return;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status } : null);
    if (status !== 'pending') setTimeout(checkAndStopAudioAlert, 100);
    try { await supabase.from('orders').update({ status }).eq('id', id); } catch (e) {}
  };

  if (isLoading || !partnerData) {
    return (
      <div className="h-[100dvh] w-full bg-[#030712] flex items-center justify-center flex-col gap-5">
        <div className="w-16 h-16 border-4 border-[#0b1329] border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-emerald-500/50 text-xs font-black uppercase tracking-widest animate-pulse">Synchronisation Eagle Core...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full bg-[#030712] text-slate-100 font-sans overflow-hidden">
      <audio ref={audioRef} src="/eagle.mp3" preload="auto" loop />
      
      {audioBlocked && (
        <div className="absolute inset-0 z-[200] bg-[#030712]/95 backdrop-blur-md flex items-center justify-center p-6">
          <button onClick={playSafeAudioAlert} className="bg-emerald-600 text-white px-8 py-6 rounded-3xl font-black uppercase">
            Initialiser Audio
          </button>
        </div>
      )}

      <aside className="hidden lg:flex flex-col w-80 bg-[#0b1329]/50 border-r border-slate-800/40 z-50">
        <div className="h-32 flex flex-col justify-center px-8 border-b border-slate-800/40">
           <h1 className="font-black text-3xl text-white"><span className="text-emerald-500">EAGLE</span>.TN</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase mt-2">{partnerData.category || 'Partenaire'} Hub</p>
        </div>
        <nav className="flex-1 py-8 px-6 flex flex-col gap-3">
          <button onClick={() => setActiveTab('direct')} className={`flex items-center gap-4 p-4 rounded-xl font-bold ${activeTab === 'direct' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-400'}`}>
            <Activity size={22} /> Flux en Direct
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`flex items-center gap-4 p-4 rounded-xl font-bold ${activeTab === 'wallet' ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-400'}`}>
            <Wallet size={22} /> Portefeuille
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-28 lg:h-32 bg-[#0b1329]/30 border-b border-slate-800/40 flex items-center justify-between px-6 lg:px-10">
          <div>
            <h2 className="text-xl lg:text-3xl font-black text-white">{greetingData.fr}</h2>
            <div className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2"><Clock size={14} /> {currentTime.toLocaleTimeString('fr-FR')}</div>
          </div>
          <button onClick={toggleOperations} className={`px-6 py-3 rounded-xl font-black text-xs uppercase ${partnerData.is_open ? 'bg-emerald-500 text-slate-950' : 'bg-rose-950 text-rose-500 border border-rose-900'}`}>
            {partnerData.is_open ? "SYSTEME ACTIF" : "SYSTEME EN PAUSE"}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 hide-scrollbar">
          {activeTab === 'wallet' ? (
             <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-[#0b1329] border border-slate-800 p-8 rounded-3xl text-center">
                   <span className="text-sm font-bold text-slate-400 uppercase">Chiffre d'Affaires</span>
                   <p className="text-3xl font-black text-white mt-2">{formatDT(financialMetrics.gross)}</p>
                 </div>
                 <div className="bg-[#0b1329] border border-slate-800 p-8 rounded-3xl text-center">
                   <span className="text-sm font-bold text-slate-400 uppercase">Commission ({(partnerData.commission_rate || PLATFORM_FEE_RATE)*100}%)</span>
                   <p className="text-3xl font-black text-rose-400 mt-2">-{formatDT(financialMetrics.fees)}</p>
                 </div>
                 <div className="bg-emerald-900/50 border border-emerald-500/30 p-8 rounded-3xl text-center">
                   <span className="text-sm font-bold text-emerald-200 uppercase">Net Réalisé</span>
                   <p className="text-4xl font-black text-emerald-400 mt-2">{formatDT(financialMetrics.net)}</p>
                 </div>
             </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 h-full">
               <div className="w-full lg:w-1/3 bg-[#0b1329]/40 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
                 <div className="p-6 bg-[#030712]/40 border-b border-slate-800 font-black text-lg text-white">Flux ({orders.length})</div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
                   {orders.map(order => (
                     <button key={order.id} onClick={() => setSelectedOrder(order)} className={`w-full text-left p-5 rounded-2xl border ${selectedOrder?.id === order.id ? 'bg-[#030712] border-emerald-500' : 'bg-[#0b1329]/50 border-slate-800'}`}>
                       <div className="flex justify-between items-start mb-2">
                         <span className="font-black text-white">#{order.id.slice(0, 6).toUpperCase()}</span>
                         <span className="text-[10px] px-2 py-1 bg-slate-800 rounded font-black uppercase text-slate-300">{order.status}</span>
                       </div>
                       <span className="font-black text-emerald-400">{formatDT(order.total_amount)}</span>
                     </button>
                   ))}
                 </div>
               </div>
               
               <div className="w-full lg:w-2/3 bg-[#0b1329]/40 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
                 {selectedOrder ? (
                   <div className="flex flex-col h-full">
                     <div className="p-8 border-b border-slate-800">
                       <h2 className="text-4xl font-black text-white">#{selectedOrder.id.slice(0, 6).toUpperCase()}</h2>
                       <p className="text-5xl font-black text-emerald-400 mt-4">{formatDT(selectedOrder.total_amount)}</p>
                     </div>
                     <div className="flex-1 overflow-y-auto p-8 bg-[#030712]/20">
                         {/* Here we map order items if populated */}
                         <p className="text-slate-500 font-bold uppercase text-sm">Détails de commande seront synchronisés avec order_items</p>
                     </div>
                     {selectedOrder.status === 'pending' && (
                       <div className="p-6 border-t border-slate-800 grid grid-cols-2 gap-4">
                         <button onClick={() => dispatchStatus(selectedOrder.id, 'accepted')} className="bg-emerald-500 text-slate-950 font-black py-4 rounded-xl uppercase">Accepter</button>
                         <button onClick={() => dispatchStatus(selectedOrder.id, 'rejected')} className="border-2 border-rose-900 text-rose-500 font-black py-4 rounded-xl uppercase">Rejeter</button>
                       </div>
                     )}
                   </div>
                 ) : (
                   <div className="flex-1 flex items-center justify-center text-slate-500 font-bold uppercase">Sélectionnez une commande</div>
                 )}
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PartnerDashboard() { return <ErrorBoundary><PartnerDashboardCore /></ErrorBoundary>; }
