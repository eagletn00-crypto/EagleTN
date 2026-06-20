import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ShieldAlert, Activity, Radio, MapPin, Clock, CheckCircle, XCircle, Store, Navigation, AlertTriangle, RefreshCw, Power, Lock } from 'lucide-react';

interface SuperAdminProps {
  onLogout: () => void;
}

export default function SuperAdminDashboard({ onLogout }: SuperAdminProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'orders'>('overview');
  
  const [systemMsg, setSystemMsg] = useState('');

  useEffect(() => {
    fetchAdminData();
    const channel = supabase
      .channel('super_admin_stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchAdminData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, () => fetchAdminData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (oData) setOrders(oData);

      const { data: rData } = await supabase.from('partners').select('*');
      if (rData) setRestaurants(rData);
    } catch (e) {
      console.error("Erreur de synchronisation", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantForce = async (id: string, currentStatus: boolean) => {
    if(window.confirm(`Voulez-vous vraiment forcer la ${currentStatus ? 'fermeture' : "l'ouverture"} de ce partenaire ?`)) {
      const { error } = await supabase.from('partners').update({ is_open: !currentStatus }).eq('id', id);
      if (!error) fetchAdminData();
      else alert("Erreur de connexion.");
    }
  };

  const broadcastMessage = () => {
    if (!systemMsg) return;
    alert("Transmission Radio : " + systemMsg);
    setSystemMsg('');
  };

  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const totalSales = deliveredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const eagleCommission = totalSales * 0.15; 

  const countAttente = orders.filter(o => o.status === 'confirmed' || o.status === 'prete').length;
  const countRoute = orders.filter(o => o.status === 'route' || o.status === 'accepted_livreur').length;
  const countLivre = deliveredOrders.length;

  const maskPhone = (phone: string) => {
    if (!phone || typeof phone !== 'string') return '********';
    return `${phone.substring(0, 2)}***${phone.substring(5)}`;
  };

  return (
    <div className="h-screen w-screen bg-[#05070A] text-slate-100 font-sans overflow-x-hidden overflow-y-auto max-w-md mx-auto relative pb-24 border-x border-white/5">
      
      <div className="bg-[#0A0E17]/90 backdrop-blur-xl p-6 border-b border-white/5 sticky top-0 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center border border-red-500/30">
            <ShieldAlert size={20} className="text-red-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-[0.2em] uppercase">Eagle<span className="text-red-500">.HQ</span></h1>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Contrôle Système Centralisé</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-white/5 border border-white/10 p-2 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-colors">
          <Power size={18} />
        </button>
      </div>

      <div className="p-4 sticky top-[88px] z-40 bg-[#05070A]">
        <div className="flex gap-2 p-1.5 bg-[#0A0E17] rounded-2xl border border-white/5 shadow-inner">
          <button onClick={() => setActiveTab('overview')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-slate-400 hover:text-white'}`}>
            Analytics
          </button>
          <button onClick={() => setActiveTab('restaurants')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'restaurants' ? 'bg-[#1C2438] text-white border border-white/10 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
            Partenaires
          </button>
          <button onClick={() => setActiveTab('orders')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-[#1C2438] text-white border border-white/10 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
            Radar Live
          </button>
        </div>
      </div>

      <div className="px-4 space-y-6">
        
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#0F1219] p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5"><Activity size={100}/></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Chiffre d'Affaires Global</span>
              <h2 className="text-3xl font-black text-white">{totalSales.toFixed(3)} <span className="text-sm text-amber-500">DT</span></h2>
              
              <div className="mt-6 flex justify-between items-end border-t border-white/10 pt-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block mb-1">Commission Eagle (15%)</span>
                  <span className="text-lg font-black text-emerald-400">+{eagleCommission.toFixed(3)} DT</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Missions</span>
                  <span className="text-lg font-black text-white">{countLivre}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0F1219] p-4 rounded-2xl border border-amber-500/20 text-center">
                <span className="text-2xl block mb-1">⏳</span>
                <span className="text-xl font-black text-white">{countAttente}</span>
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-500 mt-1">En Attente / Prépa</p>
              </div>
              <div className="bg-[#0F1219] p-4 rounded-2xl border border-blue-500/20 text-center">
                <span className="text-2xl block mb-1">🛵</span>
                <span className="text-xl font-black text-white">{countRoute}</span>
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mt-1">En Route</p>
              </div>
            </div>

            <div className="bg-[#121824] p-5 rounded-[2rem] border border-red-500/20 shadow-2xl mt-4">
              <div className="flex items-center gap-2 text-red-500 mb-4">
                <Radio size={16} className="animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Transmission Système 🔊</h3>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={systemMsg}
                  onChange={(e) => setSystemMsg(e.target.value)}
                  placeholder="Alerte globale..."
                  className="flex-1 bg-black/40 border border-white/10 p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-red-500/50"
                />
                <button onClick={broadcastMessage} className="bg-red-600 text-white p-3.5 rounded-xl shadow-lg active:scale-95 transition-transform">
                  <Navigation size={16} className="rotate-90" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="space-y-3 animate-fade-in">
            {restaurants.map(rest => (
              <div key={rest.id} className="bg-[#0F1219] p-4 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden border border-white/10 p-1">
                    {rest.logo_url ? <img src={rest.logo_url} className="w-full h-full object-cover rounded-lg grayscale" /> : <Store size={24} className="m-auto text-slate-500 mt-1"/>}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase">{rest.name}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${rest.is_open ? 'text-emerald-500' : 'text-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rest.is_open ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {rest.is_open ? 'Opérationnel' : 'Fermé'}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleRestaurantForce(rest.id, rest.is_open)} 
                  className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${rest.is_open ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-900'}`}
                >
                  {rest.is_open ? 'RÉVOQUER' : 'ACTIVER'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            <div className="h-48 bg-[#0A0E17] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl relative">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=9.0,36.0,11.0,37.5&layer=mapnik"
                width="100%" height="100%" style={{ border: 0, opacity: 0.8, filter: 'invert(90%) hue-rotate(180deg) brightness(95%)' }}
              ></iframe>
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                 <span className="text-[9px] font-black uppercase text-white tracking-widest">Live Radar</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 pt-2 border-b border-white/10 pb-2">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                 <Clock size={14}/> Journal Logistique
               </h3>
               <RefreshCw size={12} className="text-slate-600 animate-spin-slow"/>
            </div>
            
            <div className="space-y-3 pb-8">
              {orders.slice(0, 15).map(order => {
                let statusColor = "text-slate-400 bg-slate-500/10 border-slate-500/20";
                if (order.status === 'delivered') statusColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                if (order.status === 'route' || order.status === 'accepted_livreur') statusColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
                if (order.status === 'prete' || order.status === 'confirmed') statusColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
                if (order.status?.includes('cancel') || order.status === 'refused') statusColor = "text-red-500 bg-red-500/10 border-red-500/20";

                return (
                  <div key={order.id} className="bg-[#0F1219] p-4 rounded-2xl border border-white/5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border ${statusColor}`}>
                        {order.customer_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="text-left">
                        <h4 className="text-[10px] font-black text-white font-mono flex items-center gap-1">
                          #{order.id?.substring(0, 6).toUpperCase()} 
                          <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider ${statusColor}`}>{order.status || 'En attente'}</span>
                        </h4>
                        <p className="text-[8px] text-slate-500 font-bold uppercase mt-1 tracking-widest flex items-center gap-1">
                          <Lock size={8}/> {maskPhone(order.customer_phone)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-white block">{Number(order.total_amount || 0).toFixed(3)} DT</span>
                      <span className="text-[8px] text-slate-600 uppercase font-bold tracking-widest">
                        {order.created_at ? new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
