import React, { useState } from 'react';
import { usePartnerOrders } from '../../hooks/usePartnerOrders';
import { usePartnerDashboardData } from '../../hooks/usePartnerDashboardData';
import KitchenOrderCard from '../kitchen/KitchenOrderCard';

export default function CuisineTab() {
  const { partner } = usePartnerDashboardData();
  const { orders, updateOrderStatus, isLoading } = usePartnerOrders(partner?.id);
  const [activeTab, setActiveTab] = useState<'live' | 'encours' | 'journal'>('live');

  // فرز الطلبات
  const liveOrders = orders.filter(o => o.status === 'pending');
  const enCoursOrders = orders.filter(o => ['accepted', 'in_preparation', 'ready_for_pickup'].includes(o.status));
  const journalOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  const displayOrders = activeTab === 'live' ? liveOrders : activeTab === 'encours' ? enCoursOrders : journalOrders;

  return (
    <div className="w-full min-h-screen bg-[#E9EBEF] p-4 pb-28">
      <h2 className="text-xl font-black tracking-tight mb-6 text-stone-800">Station KDS</h2>

      {/* Tabs Neumorphism */}
      <div className="flex bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] rounded-2xl p-1.5 mb-6">
        <button 
          onClick={() => setActiveTab('live')}
          className={`flex-1 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'live' ? 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] text-rose-600' : 'text-stone-500'
          }`}
        >
          {liveOrders.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
          Live ({liveOrders.length})
        </button>

        <button 
          onClick={() => setActiveTab('encours')}
          className={`flex-1 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
            activeTab === 'encours' ? 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] text-emerald-600' : 'text-stone-500'
          }`}
        >
          En Cours ({enCoursOrders.length})
        </button>

        <button 
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
            activeTab === 'journal' ? 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] text-stone-800' : 'text-stone-500'
          }`}
        >
          Journal
        </button>
      </div>

      {/* قائمة الطلبات المفلترة */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
           <div className="text-center py-10 text-stone-400 font-bold text-xs">Chargement...</div>
        ) : displayOrders.length === 0 ? (
           <div className="w-full h-32 rounded-[2rem] bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center border border-white/30">
             <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Aucune commande</span>
           </div>
        ) : (
          displayOrders.map(order => (
            <KitchenOrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
          ))
        )}
      </div>
    </div>
  );
}
