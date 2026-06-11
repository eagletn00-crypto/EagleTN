import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Shield, TrendingUp, ShoppingBag, Users, Store, RefreshCw, LogOut, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AdminDashboard({ onLogout }: { onLogout?: () => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ commandes: 0, revenue: 0, clients: 154, partenaires: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: storesData } = await supabase.from('restaurants').select('*', { count: 'exact', head: true });

    if (ordersData) {
      setOrders(ordersData);
      setStats({
        commandes: ordersData.length,
        revenue: ordersData.reduce((acc, o) => acc + Number(o.total_price || 0), 0),
        clients: 154,
        partenaires: storesData?.length || 0
      });
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  useEffect(() => { fetchDashboardData(); }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 font-sans">
      {/* Header */}
      <header className="flex justify-between items-end mb-8 pt-4">
        <div>
           <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">Eagle Groupe TN</p>
           <h1 className="text-2xl font-black text-white tracking-tighter">Command Center</h1>
        </div>
        <button onClick={onLogout} className="bg-white/5 p-3 rounded-full border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-all">
          <LogOut size={18} />
        </button>
      </header>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="col-span-2 bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-[2rem] shadow-lg shadow-amber-900/20">
           <div className="flex justify-between items-center mb-2">
             <span className="text-[10px] font-black text-slate-900/80 uppercase">Chiffre d'Affaires</span>
             <TrendingUp className="text-slate-900" size={20} />
           </div>
           <p className="text-4xl font-black text-slate-950 tracking-tight">{stats.revenue.toFixed(3)} <span className="text-lg">DT</span></p>
        </div>
        <div className="bg-[#0f172a] border border-white/5 p-5 rounded-[2rem]">
           <ShoppingBag className="text-blue-400 mb-3" size={20} />
           <p className="text-[10px] font-black text-slate-500 uppercase">Commandes</p>
           <p className="text-2xl font-black text-white">{stats.commandes}</p>
        </div>
        <div className="bg-[#0f172a] border border-white/5 p-5 rounded-[2rem]">
           <Store className="text-purple-400 mb-3" size={20} />
           <p className="text-[10px] font-black text-slate-500 uppercase">Partenaires</p>
           <p className="text-2xl font-black text-white">{stats.partenaires}</p>
        </div>
      </div>

      {/* Orders Management */}
      <div className="bg-[#0f172a]/50 border border-white/5 rounded-[2.5rem] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live Orders
          </h2>
          <button onClick={fetchDashboardData} className={`text-slate-500 hover:text-amber-500 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}>
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all">
              <div>
                <p className="text-xs font-black text-white">{order.customer_name}</p>
                <p className="text-[9px] text-slate-500 uppercase mt-0.5">{order.delivery_address}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-amber-500">{Number(order.total_price).toFixed(3)} DT</p>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
