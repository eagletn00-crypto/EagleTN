import React, { useState } from 'react';
import KitchenOrderCard, { Order } from '../components/kitchen/KitchenOrderCard';
import { usePartnerOrders } from '../hooks/usePartnerOrders';

interface KitchenKDSProps {
  partnerId: string;
}

export default function KitchenKDS({ partnerId }: KitchenKDSProps) {
  const { orders = [], updateOrderStatus, isLoading, error } = usePartnerOrders(partnerId);
  const [activeTab, setActiveTab] = useState<'live' | 'encours' | 'journal'>('live');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E9EBEF] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-[#E9EBEF] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] border-t-amber-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E9EBEF] flex items-center justify-center p-6">
        <div className="p-8 rounded-[2rem] bg-[#E9EBEF] shadow-[inset_8px_8px_16px_#c8cad0,inset_-8px_-8px_16px_#ffffff] text-center max-w-md mx-auto">
          <svg className="w-12 h-12 text-rose-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h2 className="text-lg font-black text-stone-800 mb-2">Erreur de Synchronisation</h2>
          <p className="text-sm text-stone-500 font-medium">Connexion au flux des commandes interrompue.</p>
        </div>
      </div>
    );
  }

  const safeOrders = Array.isArray(orders) ? orders : [];
  const liveOrders = safeOrders.filter((o): o is Order => o?.status === 'pending');
  const enCoursOrders = safeOrders.filter((o): o is Order => ['accepted', 'in_preparation', 'ready_for_pickup'].includes(o?.status));
  const journalOrders = safeOrders.filter((o): o is Order => ['delivered', 'cancelled'].includes(o?.status));

  const displayOrders = activeTab === 'live' ? liveOrders : activeTab === 'encours' ? enCoursOrders : journalOrders;

  return (
    <div className="w-full min-h-screen bg-[#E9EBEF] p-4 md:p-6 pb-28 font-sans antialiased selection:bg-amber-500/20">
      
      {/* HEADER BRANDING ULTRA PREMIUM */}
      <header className="flex items-center justify-between mb-8 px-1 pt-2 max-w-md mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center border border-white/50 relative overflow-hidden">
            <span className="text-2xl drop-shadow-md z-10">🦅</span>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent z-0"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-stone-800 tracking-tighter uppercase leading-none">EAGLE TN</h1>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mt-1">Espace Partenaire</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="w-12 h-12 rounded-2xl bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] flex items-center justify-center font-black text-xl text-stone-800 border border-white/40">
            {liveOrders.length + enCoursOrders.length}
          </div>
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-1.5 mr-1">Actives</span>
        </div>
      </header>

      {/* Tabs Neumorphism */}
      <div className="flex bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] rounded-2xl p-1.5 mb-8 max-w-md mx-auto border border-white/20">
        <button 
          onClick={() => setActiveTab('live')}
          className={`flex-1 py-3.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'live' ? 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] text-rose-600' : 'text-stone-500'
          }`}
        >
          {liveOrders.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />}
          Live ({liveOrders.length})
        </button>

        <button 
          onClick={() => setActiveTab('encours')}
          className={`flex-1 py-3.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
            activeTab === 'encours' ? 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] text-amber-600' : 'text-stone-500'
          }`}
        >
          En Cours ({enCoursOrders.length})
        </button>

        <button 
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-3.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
            activeTab === 'journal' ? 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] text-stone-800' : 'text-stone-500'
          }`}
        >
          Journal
        </button>
      </div>

      {/* Rendu dynamique des commandes */}
      <div className="flex flex-col gap-6 max-w-md mx-auto">
        {displayOrders.length === 0 ? (
          <div className="w-full h-48 rounded-[2rem] bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex flex-col items-center justify-center border border-white/30">
            <div className="w-16 h-16 rounded-full bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <span className="text-[11px] font-black text-stone-400 uppercase tracking-widest">Aucune commande</span>
            <span className="text-[10px] font-bold text-stone-400 mt-1">La cuisine est calme pour le moment</span>
          </div>
        ) : (
          displayOrders.map((order) => (
            <KitchenOrderCard 
              key={order.id} 
              order={order} 
              onUpdateStatus={updateOrderStatus} 
            />
          ))
        )}
      </div>
      
    </div>
  );
}
