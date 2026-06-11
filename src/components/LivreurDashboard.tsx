import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { MapPin, Navigation, MessageCircle, Lock, Wallet, CheckCircle, XCircle, Clock, PlayCircle, PauseCircle, Store, LifeBuoy, FileText, ShieldAlert, Activity, Star } from 'lucide-react';

interface LivreurDashboardProps {
  onLogout: () => void;
}

export default function LivreurDashboard({ onLogout }: LivreurDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'route' | 'wallet' | 'history'>('route');
  const [driverStatus, setDriverStatus] = useState<'online' | 'pause'>('online');
  
  // PIN Modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Driver Profile
  const driverProfile = {
    name: "Ahmed Ben Ali",
    id: "EAGLE-902",
    rating: 4.9
  };

  useEffect(() => {
    fetchDriverEcosystem();
    
    const channel = supabase
      .channel('livreur_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        fetchDriverEcosystem();
        if (payload.eventType === 'UPDATE' && payload.new.status === 'prete') {
          playNotificationSound();
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchDriverEcosystem = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['prete', 'route', 'delivered', 'refused'])
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    } catch (e) {
      console.error("Erreur logistique");
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
      audio.volume = 1.0;
      audio.play();
    } catch(e){}
  };

  const acceptOrder = async (orderId: string) => {
    const { error } = await supabase.from('orders').update({ status: 'route' }).eq('id', orderId);
    if (!error) fetchDriverEcosystem();
  };

  const refuseOrder = async (orderId: string) => {
    const { error } = await supabase.from('orders').update({ status: 'refused' }).eq('id', orderId);
    if (!error) fetchDriverEcosystem();
  };

  const handleOpenPinModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setPinInput('');
    setPinError(false);
    setShowPinModal(true);
  };

  const verifyAndCloseOrder = async () => {
    if (!selectedOrderId || !pinInput) return;
    
    try {
      const { data: orderData } = await supabase.from('orders').select('pin_code').eq('id', selectedOrderId).single();
      
      if (orderData && orderData.pin_code === pinInput) {
        const { error } = await supabase.from('orders').update({ status: 'delivered' }).eq('id', selectedOrderId);
        if (!error) {
          setShowPinModal(false);
          fetchDriverEcosystem();
        }
      } else {
        setPinError(true);
        setPinInput('');
      }
    } catch (e) {
      setPinError(true);
    }
  };

  // Safe Math calculations to prevent White Screen Crash
  const activeOrders = orders.filter(o => o.status === 'prete' || o.status === 'route');
  const historyOrders = orders.filter(o => o.status === 'delivered' || o.status === 'refused');
  const deliveredTodayCount = orders.filter(o => o.status === 'delivered').length;
  const todaysEarnings = deliveredTodayCount * 2.500; 

  const extractNoteAndAddress = (fullAddress: string) => {
    if (!fullAddress) return { address: 'Adresse non spécifiée', note: null };
    const parts = fullAddress.split('| Note:');
    return {
      address: parts[0].trim(),
      note: parts.length > 1 ? parts[1].trim() : null
    };
  };

  return (
    <div className="h-screen w-screen bg-[#0B0F19] text-slate-100 font-sans overflow-x-hidden overflow-y-auto max-w-md mx-auto relative pb-24 border-x border-slate-800">
      
      {/* 🦅 HEADER EAGLE RIDER PRO */}
      <div className="bg-[#121824] p-6 rounded-b-[2.5rem] shadow-2xl border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl bg-opacity-95">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              🦅
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tight uppercase">Eagle.Rider Pro</h1>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">{driverProfile.name}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setDriverStatus(driverStatus === 'online' ? 'pause' : 'online')} 
            className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg ${driverStatus === 'online' ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20' : 'bg-amber-500 text-slate-950 shadow-amber-500/20'}`}
          >
            {driverStatus === 'online' ? <PlayCircle size={14} className="animate-pulse"/> : <PauseCircle size={14}/>}
            {driverStatus === 'online' ? 'Disponible' : 'En Pause'}
          </button>
        </div>

        {/* 📑 TAB NAVIGATION */}
        <div className="flex gap-2 p-1.5 bg-[#0A0E17] rounded-2xl border border-white/5 shadow-inner">
          <button onClick={() => setActiveTab('route')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'route' ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-slate-400 hover:text-white'}`}>
            Missions
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'wallet' ? 'bg-[#1C2438] text-white border border-white/10 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
            Portefeuille
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-[#1C2438] text-white border border-white/10 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
            Journal
          </button>
        </div>
      </div>

      {/* 🚀 TAB 1: ACTIVE ROUTES */}
      {activeTab === 'route' && (
        <div className="p-4 space-y-5 animate-fade-in">
          {driverStatus === 'pause' ? (
            <div className="text-center py-20 opacity-60">
              <span className="text-5xl block mb-4 filter grayscale">☕</span>
              <p className="text-xs font-black uppercase tracking-widest text-amber-500">Mode Pause Activé</p>
              <p className="text-[10px] text-slate-500 mt-2">Reprenez le service pour recevoir des commandes.</p>
            </div>
          ) : activeOrders.length === 0 ? (
            <div className="bg-[#121824] border border-dashed border-white/10 p-10 rounded-[2rem] text-center animate-pulse shadow-sm mt-4">
              <span className="text-4xl block mb-4 opacity-70">📡</span>
              <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Recherche d'interventions...</p>
            </div>
          ) : (
            activeOrders.map(order => {
              const { address, note } = extractNoteAndAddress(order.delivery_address);
              const isEnRoute = order.status === 'route';
              
              return (
              <div key={order.id} className={`rounded-[2rem] p-1 shadow-2xl relative overflow-hidden transition-all duration-300 ${isEnRoute ? 'bg-amber-400' : 'bg-slate-800'}`}>
                <div className={`${isEnRoute ? 'bg-amber-400 text-slate-900' : 'bg-[#1C2438] text-white'} p-5 rounded-[1.8rem] space-y-4`}>
                  
                  {/* Header */}
                  <div className={`flex justify-between items-start border-b pb-3 ${isEnRoute ? 'border-slate-900/10' : 'border-white/10'}`}>
                    <div className="space-y-1 text-left">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isEnRoute ? 'text-slate-700' : 'text-slate-400'}`}>Facture Numérique</span>
                      <h4 className="text-xs font-black font-mono">#{order.id?.toString().substring(0,8).toUpperCase()}</h4>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-md ${isEnRoute ? 'bg-slate-900 text-amber-500' : 'bg-white/10 text-slate-300'}`}>
                      <Clock size={12} />
                      {order.created_at ? new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-3">
                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isEnRoute ? 'text-slate-700' : 'text-slate-400'}`}>Point d'Enlèvement</span>
                      <h3 className="text-base font-black leading-tight flex items-center gap-2 mt-0.5">
                        <Store size={16} className={isEnRoute ? "text-slate-900" : "text-amber-500"}/>
                        Am Ali Kitchen
                      </h3>
                    </div>

                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isEnRoute ? 'text-slate-700' : 'text-slate-400'}`}>Destination Client</span>
                      <h3 className="text-base font-black leading-tight flex items-start gap-2 mt-0.5">
                        <MapPin size={18} className="text-red-500 shrink-0"/>
                        {address}
                      </h3>
                    </div>
                    
                    {note && (
                      <div className={`p-3 rounded-xl border flex items-start gap-2 ${isEnRoute ? 'bg-white/40 border-white/50 text-slate-900' : 'bg-amber-500/10 border-amber-500/20 text-amber-100'}`}>
                        <FileText size={16} className={isEnRoute ? "text-slate-900 shrink-0" : "text-amber-500 shrink-0"}/>
                        <div>
                          <span className={`text-[8px] font-black uppercase tracking-widest block mb-0.5 ${isEnRoute ? 'text-slate-700' : 'text-amber-500'}`}>Note du Client:</span>
                          <p className="text-xs font-bold leading-snug">{note}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Map (Shows only when EN ROUTE) */}
                  {isEnRoute && (
                    <div className="h-32 w-full bg-slate-900/10 rounded-2xl overflow-hidden border border-slate-900/20 relative shadow-inner">
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${(Number(order.delivery_lng) || 10.1815)-0.01},${(Number(order.delivery_lat) || 36.8065)-0.01},${(Number(order.delivery_lng) || 10.1815)+0.01},${(Number(order.delivery_lat) || 36.8065)+0.01}&layer=mapnik&marker=${order.delivery_lat || 36.8065},${order.delivery_lng || 10.1815}`}
                        width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                      ></iframe>
                    </div>
                  )}

                  <div className={`flex justify-between items-end border-t pt-3 ${isEnRoute ? 'border-slate-900/10' : 'border-white/10'}`}>
                    <div className="space-y-0.5">
                      <span className={`text-[9px] font-black uppercase tracking-widest block ${isEnRoute ? 'text-slate-700' : 'text-slate-400'}`}>À encaisser (Cash)</span>
                      <span className={`text-2xl font-black tracking-tight ${!isEnRoute && 'text-emerald-400'}`}>{Number(order.total_price || 0).toFixed(3)} <span className="text-sm font-bold">DT</span></span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold truncate block ${isEnRoute ? 'text-slate-800' : 'text-slate-300'}`}>
                        📦 {Array.isArray(order.items) ? order.items.reduce((sum, i) => sum + i.quantity, 0) : 0} Articles
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  {order.status === 'prete' ? (
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => acceptOrder(order.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
                        <CheckCircle size={16}/> Accepter
                      </button>
                      <button onClick={() => refuseOrder(order.id)} className="px-6 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 py-4 rounded-2xl text-xs font-black uppercase shadow-sm transition-all active:scale-95">
                        Refuser
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${order.delivery_lat},${order.delivery_lng}`} target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-black transition-transform active:scale-95">
                          <Navigation size={14} className="text-blue-400"/> GPS Map
                        </a>
                        <button className="bg-red-600 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                          <LifeBuoy size={14}/> SOS
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <a href={`https://wa.me/${order.customer_phone}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#10b981] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform">
                          <MessageCircle size={14}/> WhatsApp Client
                        </a>
                        <a href="https://wa.me/21658050693" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#121824] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform border border-white/10">
                          <Store size={14} className="text-amber-500"/> Am Ali Resto
                        </a>
                      </div>

                      <button onClick={() => handleOpenPinModal(order.id)} className="w-full bg-slate-900 border-2 border-slate-900 text-emerald-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 mt-2 active:scale-95 transition-transform">
                        <Lock size={16}/> Confirmer (PIN Client)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
            })
          )}
        </div>
      )}

      {/* 💰 TAB 2: PORTEFEUILLE (Wallet) */}
      {activeTab === 'wallet' && (
        <div className="p-4 space-y-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#1C2438] to-[#121824] p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden border border-white/5">
            <div className="absolute -right-4 -top-4 opacity-10 text-amber-500"><Wallet size={120}/></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Gains du jour (Estimés)</span>
            <h2 className="text-4xl font-black text-amber-500">{todaysEarnings.toFixed(3)} <span className="text-lg text-white">DT</span></h2>
            
            <div className="mt-6 flex justify-between items-end border-t border-white/10 pt-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Missions Livrées</span>
                <span className="text-xl font-black text-white">{deliveredTodayCount}</span>
              </div>
              <button className="bg-amber-500 text-slate-950 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95">
                Retirer
              </button>
            </div>
          </div>

          <div className="bg-[#121824] border border-white/5 rounded-[2rem] p-5">
            <h3 className="text-xs font-black uppercase text-white mb-4 flex items-center gap-2"><Activity size={14} className="text-amber-500"/> Statistiques Pro</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                <span className="text-slate-400">Taux d'acceptation</span>
                <span className="font-black text-emerald-400">100%</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                <span className="text-slate-400">Note globale</span>
                <span className="font-black text-amber-500 flex items-center gap-1">{driverProfile.rating} <Star size={10} fill="currentColor"/></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Commandes refusées</span>
                <span className="font-black text-red-500">{orders.filter(o=>o.status==='refused').length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📜 TAB 3: JOURNAL (History) */}
      {activeTab === 'history' && (
        <div className="p-4 space-y-3 animate-fade-in">
          {historyOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-bold uppercase tracking-widest">Aucun historique disponible</div>
          ) : (
            historyOrders.map(order => (
              <div key={order.id} className="bg-[#121824] p-4 rounded-2xl border border-white/5 flex justify-between items-center shadow-md transition-all hover:bg-[#1C2438]">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    {order.status === 'delivered' ? <CheckCircle size={18}/> : <XCircle size={18}/>}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white font-mono">#{order.id?.toString().substring(0,6).toUpperCase()}</h4>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'}) : ''}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {order.status === 'delivered' ? (
                    <>
                      <span className="text-xs font-black text-emerald-400 block">+2.500 DT</span>
                      <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">Livré</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-black text-red-500 block">0.000 DT</span>
                      <span className="text-[9px] font-black text-red-500/50 uppercase tracking-widest">Refusé</span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 🔐 PIN CONFIRMATION MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[500] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#121824] border border-white/10 p-6 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl relative">
            <button onClick={() => setShowPinModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white bg-white/5 p-2 rounded-full transition-colors"><XCircle size={18}/></button>
            
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Lock size={28} className="text-amber-500"/>
            </div>
            
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-1">Code de Vérification</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-6 px-2">Demandez au client le code PIN à 4 chiffres affiché sur son application.</p>
            
            <input 
              type="text" 
              inputMode="numeric" 
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="----"
              className={`w-full bg-[#0A0E17] border-2 p-5 rounded-2xl text-4xl tracking-[0.5em] font-mono font-black text-center text-amber-500 focus:outline-none transition-colors ${pinError ? 'border-red-500' : 'border-white/10 focus:border-amber-500'}`}
            />
            
            {pinError && <p className="text-xs text-red-500 font-bold mt-3 animate-pulse">Code PIN incorrect. Veuillez réessayer.</p>}

            <button 
              onClick={verifyAndCloseOrder}
              disabled={pinInput.length !== 4}
              className="w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl mt-6 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
            >
              Valider la Livraison
            </button>
            
            <div className="mt-4 flex items-start gap-2 text-left bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
              <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5"/>
              <p className="text-[8px] text-amber-100/70 font-bold leading-relaxed text-justify">
                **Conformité INPDP:** En validant, le livreur certifie la remise en main propre. Cette action est irréversible et clôture le suivi GPS.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* زر تسجيل الخروج */}
      <button onClick={onLogout} className="fixed bottom-4 right-4 bg-red-500/10 text-red-500 p-3 rounded-full border border-red-500/20 backdrop-blur-md z-40 hover:bg-red-500 hover:text-white transition-colors">
        <XCircle size={18}/>
      </button>

    </div>
  );
}
