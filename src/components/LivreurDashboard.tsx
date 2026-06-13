import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Bike, MapPin, CheckCircle, Package, ArrowRight, Phone, ShieldCheck, XCircle, RefreshCw, Radar, Navigation, QrCode as QrCodeIcon, MessageCircle, Wallet, User, Clock, AlertTriangle } from 'lucide-react';

interface LivreurDashboardProps {
  onLogout: () => void;
}

export default function LivreurDashboard({ onLogout }: LivreurDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'radar' | 'active' | 'wallet'>('radar');
  
  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [pinCode, setPinCode] = useState('');

  // 💡 جلب الطلبات الحية
  useEffect(() => {
    fetchDriverOrders();
    const sub = supabase.channel('livreur_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchDriverOrders)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const fetchDriverOrders = async () => {
    setIsLoading(true);
    // جلب الطلبات الجاهزة، والتي قبلها السائق، والتي في الطريق
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['prete', 'accepted_livreur', 'route', 'delivered'])
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOrders(data);
    }
    setIsLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    fetchDriverOrders();
  };

  const handleAcceptMission = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted_livreur');
    setActiveTab('active');
  };

  const verifyHandoff = () => {
    if (pinCode === selectedOrder?.pin_code) {
      updateOrderStatus(selectedOrder.id, 'route');
      setShowHandoffModal(false);
      setPinCode('');
    } else {
      alert("Code PIN incorrect. Veuillez vérifier avec le restaurant.");
    }
  };

  const activeDeliveries = orders.filter(o => ['accepted_livreur', 'route'].includes(o.status));
  const availableMissions = orders.filter(o => o.status === 'prete');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  // حساب أرباح السائق (مثلاً 2 دينار على كل توصيلة)
  const driverEarnings = deliveredOrders.length * 2.000;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden pb-24">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes radar { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
        .animate-radar::before, .animate-radar::after { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 2px solid #10b981; animation: radar 3s linear infinite; }
        .animate-radar::after { animation-delay: 1.5s; }
      `}} />

      {/* 👑 HEADER */}
      <div className="bg-[#121620] border-b border-white/10 p-6 pt-10 sticky top-0 z-40 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center">
              <Bike size={24} className="text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-2">Eagle Fleet <span className="bg-emerald-500 text-slate-900 text-[8px] px-2 py-0.5 rounded-full">PRO</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"><Activity size={10} className="text-emerald-500"/> Connecté & Actif</p>
            </div>
          </div>
          <button onClick={onLogout} className="bg-white/5 border border-white/10 p-2.5 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-colors">
            <Power size={18} />
          </button>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS */}
      <div className="p-5">
        <div className="flex bg-[#121620] p-1.5 rounded-[1.5rem] shadow-inner border border-white/5 relative">
          <button onClick={() => setActiveTab('radar')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all relative ${activeTab === 'radar' ? 'bg-emerald-500 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}>
            <Radar size={14}/> Radar
            {availableMissions.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] animate-pulse">{availableMissions.length}</span>}
          </button>
          <button onClick={() => setActiveTab('active')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all relative ${activeTab === 'active' ? 'bg-emerald-500 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}>
            <Navigation size={14}/> Missions
            {activeDeliveries.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center text-[8px] font-black">{activeDeliveries.length}</span>}
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'wallet' ? 'bg-emerald-500 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}>
            <Wallet size={14}/> Gains
          </button>
        </div>
      </div>

      {/* 📡 TAB 1: RADAR (Missions Disponibles) */}
      {activeTab === 'radar' && (
        <div className="px-5 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20"><RefreshCw size={32} className="text-emerald-500 animate-spin"/></div>
          ) : availableMissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center animate-radar">
                <Radar size={40} className="text-emerald-500" />
              </div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest text-center">Recherche de nouvelles<br/>missions de livraison...</p>
            </div>
          ) : (
            availableMissions.map(order => (
              <div key={order.id} className="bg-[#121620] border border-emerald-500/30 p-5 rounded-[2rem] shadow-[0_5px_20px_rgba(16,185,129,0.1)] relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nouvelle Mission</span>
                    <span className="text-lg font-black text-white">#{String(order.id).split('-')[0].toUpperCase()}</span>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                    <CheckCircle size={12}/> <span className="text-[9px] font-black uppercase">Prête au resto</span>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                    <Store size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Point de collecte</p>
                      <p className="text-xs font-bold text-slate-300">Restaurant Eagle Partner</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                    <MapPin size={16} className="text-[#10b981] shrink-0 mt-0.5"/>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Livraison Client</p>
                      <p className="text-xs font-bold text-slate-300">{order.delivery_address}</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => handleAcceptMission(order.id)} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-4 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                  <Bike size={16}/> Accepter la course
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* 🗺️ TAB 2: ACTIVE MISSIONS (En cours) */}
      {activeTab === 'active' && (
        <div className="px-5 space-y-4">
          {activeDeliveries.length === 0 ? (
            <div className="text-center py-20">
              <CheckCircle size={48} className="text-slate-700 mx-auto mb-4"/>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Aucune course en cours</p>
              <button onClick={() => setActiveTab('radar')} className="mt-4 text-emerald-500 text-[10px] font-black uppercase border border-emerald-500/30 px-4 py-2 rounded-xl">Retour au Radar</button>
            </div>
          ) : (
            activeDeliveries.map(order => (
              <div key={order.id} className="bg-[#121620] border border-amber-500/30 p-5 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Activity size={10} className="animate-pulse"/> {order.status === 'route' ? 'En Route' : 'Aller au Resto'}</span>
                    <span className="text-lg font-black text-white mt-1 block">#{String(order.id).split('-')[0].toUpperCase()}</span>
                  </div>
                  <span className="text-xl font-black text-emerald-500">2.000 <span className="text-[10px] text-slate-400">DT</span></span>
                </div>

                {order.status === 'route' && order.delivery_lat && order.delivery_lng && (
                  <div className="w-full h-32 bg-slate-800 rounded-2xl mb-4 overflow-hidden relative border border-white/10">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${order.delivery_lng-0.005},${order.delivery_lat-0.005},${order.delivery_lng+0.005},${order.delivery_lat+0.005}&layer=mapnik&marker=${order.delivery_lat},${order.delivery_lng}`}
                      width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }} loading="lazy"
                    ></iframe>
                  </div>
                )}

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                    <User size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Client</p>
                      <p className="text-xs font-bold text-white">{order.customer_name}</p>
                    </div>
                    <div className="flex gap-2">
                       <a href={`tel:${order.customer_phone}`} className="bg-[#10b981]/20 text-[#10b981] p-2 rounded-lg"><Phone size={14}/></a>
                       <a href={`https://wa.me/216${order.customer_phone}`} className="bg-[#10b981]/20 text-[#10b981] p-2 rounded-lg"><MessageCircle size={14}/></a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                    <MapPin size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Adresse de Livraison</p>
                      <p className="text-xs font-bold text-slate-300">{order.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {order.status === 'accepted_livreur' ? (
                  <button onClick={() => { setSelectedOrder(order); setShowHandoffModal(true); }} className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                    <QrCodeIcon size={16}/> Scanner & Récupérer
                  </button>
                ) : (
                  <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="w-full bg-gradient-to-r from-emerald-500 to-[#059669] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 border border-emerald-400">
                    <CheckCircle size={16}/> Confirmer la Livraison
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 💰 TAB 3: WALLET & GAINS */}
      {activeTab === 'wallet' && (
        <div className="px-5 space-y-4">
           <div className="bg-gradient-to-br from-[#121620] to-[#0a0a0a] border border-emerald-500/20 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2"><Wallet size={12}/> Gains du Jour</p>
            <h3 className="text-5xl font-black text-white mb-2">{driverEarnings.toFixed(3)} <span className="text-lg text-emerald-500">DT</span></h3>
            <p className="text-xs font-bold text-slate-500 mb-6 border-b border-white/10 pb-4">Soit {deliveredOrders.length} courses complétées.</p>
            
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Historique récent</h4>
              {deliveredOrders.slice(0,5).map(o => (
                <div key={o.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                   <div className="flex items-center gap-2">
                     <CheckCircle size={14} className="text-emerald-500"/>
                     <span className="text-[10px] font-mono text-slate-300">#{o.id.slice(0,6)}</span>
                   </div>
                   <span className="text-xs font-black text-emerald-500">+2.000 DT</span>
                </div>
              ))}
              {deliveredOrders.length === 0 && <p className="text-[10px] text-slate-500 text-center py-2">Aucune course livrée aujourd'hui</p>}
            </div>
          </div>
        </div>
      )}

      {/* 🤝 MODAL DE HANDOFF (SÉCURITÉ PIN/QR) */}
      {showHandoffModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#121620] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative text-center">
            <button onClick={() => setShowHandoffModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><XCircle size={24}/></button>
            
            <div className="w-20 h-20 bg-amber-500/10 rounded-full mx-auto flex items-center justify-center mb-6 border border-amber-500/30">
               <ShieldCheck size={32} className="text-amber-500"/>
            </div>
            
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Handoff Sécurisé</h2>
            <p className="text-xs text-slate-400 font-bold mb-8 leading-relaxed">Demandez au restaurant de vous scanner, ou entrez le code PIN affiché sur l'écran du restaurant.</p>

            <div className="space-y-4">
              <input 
                type="text" 
                maxLength={4}
                value={pinCode} 
                onChange={e => setPinCode(e.target.value)} 
                placeholder="Code PIN à 4 chiffres" 
                className="w-full bg-black border border-amber-500/50 p-5 rounded-2xl text-2xl font-black text-amber-500 tracking-[0.5em] text-center focus:outline-none focus:border-amber-400 shadow-inner" 
              />
              <button disabled={pinCode.length < 4} onClick={verifyHandoff} className="w-full bg-amber-500 disabled:opacity-50 disabled:active:scale-100 text-slate-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                <CheckCircle size={16}/> Valider la récupération
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
