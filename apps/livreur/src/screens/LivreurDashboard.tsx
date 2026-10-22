import React, { useState } from 'react';
import { useLivreurOrders } from '../hooks/useLivreurOrders';
import { BottomNav, TabType } from '../components/BottomNav';
import { OrderMap } from '../components/OrderMap';
import { ConfirmDeliveryModal } from '../components/ConfirmDeliveryModal';

export default function LivreurDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('commandes');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedMapOrder, setSelectedMapOrder] = useState<string | null>(null);
  
  // التحكم في نافذة التسليم الآمنة
  const [deliveryModalOrder, setDeliveryModalOrder] = useState<any | null>(null);

  const { orders, loading, acceptOrder, deliverOrder } = useLivreurOrders();

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  const cashInHand = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const netEarnings = completedOrders.reduce((sum, o) => sum + o.deliveryFee, 0);
  const cashLimit = 150.0;

  const handleAccept = async (id: string) => {
    await acceptOrder(id);
    setSelectedMapOrder(id);
  };

  const executeDelivery = async (pin: string) => {
    if (deliveryModalOrder) {
      await deliverOrder(deliveryModalOrder.id);
      setDeliveryModalOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#E9EBEF] flex flex-col font-sans pb-28 select-none antialiased">
      
      {/* نافذة التسليم الآمنة (POD) */}
      {deliveryModalOrder && (
        <ConfirmDeliveryModal 
          order={deliveryModalOrder} 
          onConfirm={executeDelivery}
          onClose={() => setDeliveryModalOrder(null)}
        />
      )}

      {/* HEADER ULTRA PREMIUM */}
      <header className="px-5 pt-10 pb-4 flex justify-between items-center sticky top-0 z-40 bg-[#E9EBEF]/90 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase block mb-1">
            EAGLE TN • Livreur
          </span>
          <h1 className="text-xl font-black text-stone-800 tracking-tight">EAGLE Rider 🛵</h1>
        </div>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-4 py-2.5 rounded-full text-xs font-black transition-all duration-300 flex items-center gap-2 ${
            isOnline
              ? 'bg-[#E9EBEF] text-emerald-600 shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff]'
              : 'bg-[#E9EBEF] text-rose-500 shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></span>
          {isOnline ? 'En Ligne' : 'Hors Ligne'}
        </button>
      </header>

      {/* CONTENT */}
      <main className="flex-1 p-5 max-w-md mx-auto w-full flex flex-col gap-6">

        {!isOnline && (
          <div className="w-full bg-[#E9EBEF] rounded-[2rem] p-5 text-center shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] border border-white/40">
            <span className="text-sm font-black text-rose-600 block mb-1">Vous êtes Hors Ligne 🔴</span>
            <p className="text-xs font-bold text-stone-500">Passez en ligne pour recevoir les missions disponibles.</p>
          </div>
        )}

        {/* TAB 1: COMMANDES */}
        {activeTab === 'commandes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-black text-stone-800 tracking-tight">
                Missions ({activeOrders.length})
              </h2>
              <span className="text-[10px] bg-[#E9EBEF] text-emerald-600 shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
                GPS Actif 📍
              </span>
            </div>

            {loading ? (
              <div className="w-full h-32 rounded-[2rem] bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest animate-pulse">Recherche de missions...</span>
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="w-full h-40 rounded-[2rem] bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex flex-col items-center justify-center border border-white/30">
                <span className="text-3xl mb-3 opacity-50">🛵</span>
                <span className="text-xs font-black text-stone-400 uppercase tracking-widest">Aucune mission</span>
              </div>
            ) : (
              activeOrders.map((order) => {
                const isMapOpen = selectedMapOrder === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] flex flex-col gap-4 border border-white/40"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-stone-500 bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] px-2.5 py-1 rounded-md uppercase tracking-wider">
                            #{order.short_code}
                          </span>
                        </div>
                        
                        <h3 className="font-black text-stone-800 text-lg leading-tight mt-2">{order.restaurantName}</h3>
                        <p className="text-[11px] font-bold text-stone-500 flex items-center gap-1.5">
                          <span className="text-rose-500">📍</span> {order.deliveryAddress}
                        </p>
                        <p className="text-[11px] font-bold text-stone-600">
                          👤 {order.clientName} (
                          <a href={`tel:${order.clientPhone}`} className="text-emerald-600 underline underline-offset-2 ml-1">
                            {order.clientPhone}
                          </a>)
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-black text-emerald-600 tracking-tighter">
                          +{order.deliveryFee.toFixed(3)}
                        </span>
                        <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest">DT Gain</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#E9EBEF] p-4 rounded-2xl shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex justify-between items-center mt-2 border border-white/20">
                       <span className="font-bold text-[11px] text-stone-500 uppercase tracking-widest">Encaissement (COD)</span>
                      <span className="text-amber-600 font-black text-lg">{order.totalAmount.toFixed(3)} DT</span>
                    </div>

                    {isMapOpen && (
                      <div className="rounded-2xl overflow-hidden shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] border border-white/40 p-1">
                        <OrderMap
                          pickupLat={order.pickupCoords.lat}
                          pickupLng={order.pickupCoords.lng}
                          dropoffLat={order.dropoffCoords.lat}
                          dropoffLng={order.dropoffCoords.lng}
                          clientAddress={order.deliveryAddress}
                        />
                      </div>
                    )}

                    <div className="flex gap-3 mt-1">
                      {order.status === 'ready_for_pickup' ? (
                        <button
                          onClick={() => handleAccept(order.id)}
                          className="flex-[2] py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-200 flex justify-center items-center gap-2 bg-[#E9EBEF] text-emerald-600 shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff]"
                        >
                          Accepter 🛵
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setSelectedMapOrder(isMapOpen ? null : order.id)}
                            className={`flex-[2] py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-200 flex justify-center items-center gap-2 ${
                              isMapOpen
                                ? 'bg-[#E9EBEF] text-emerald-600 shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff]'
                                : 'bg-[#E9EBEF] text-emerald-600 shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff]'
                            }`}
                          >
                            {isMapOpen ? 'Cacher Carte' : 'Itinéraire 🗺️'}
                          </button>

                          <button
                            // فتح النافذة الآمنة بدلاً من نافذة المتصفح الافتراضية
                            onClick={() => setDeliveryModalOrder(order)}
                            className="flex-[2] bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-stone-800 font-black text-[11px] uppercase tracking-widest py-3.5 rounded-2xl transition-all duration-200"
                          >
                            Terminer ✅
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        
        {/* TAB 2: FINANCE */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-stone-800 tracking-tight px-1">Tableau de Bord</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] flex flex-col justify-between">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Cash en Main</span>
                <span className="text-xl font-black text-amber-600">{cashInHand.toFixed(3)} DT</span>
                <div className="w-full bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] rounded-full h-2 mt-4 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min((cashInHand / cashLimit) * 100, 100)}%` }}></div>
                </div>
                <span className="text-[9px] text-stone-400 font-bold block pt-2 text-right">Plafond: {cashLimit} DT</span>
              </div>
              <div className="bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] flex flex-col justify-between">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Gains Nets</span>
                <span className="text-xl font-black text-emerald-600">+{netEarnings.toFixed(3)} DT</span>
                <span className="text-[9px] text-stone-400 font-bold block mt-auto">Revenus accumulés aujourd'hui</span>
              </div>
            </div>
            <div className="bg-[#E9EBEF] p-6 rounded-[2rem] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] border border-white/50 flex flex-col items-center text-center mt-4">
              <span className="text-[11px] font-black text-stone-500 uppercase tracking-widest mb-2">Versement Agence Requis</span>
              <p className="text-3xl font-black text-stone-800 mb-6">{cashInHand.toFixed(3)} DT</p>
              <button
                onClick={() => alert("Code QR généré pour le dépôt agence.")}
                className="w-full bg-[#E9EBEF] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-emerald-600 font-black text-[11px] uppercase tracking-widest py-4 rounded-2xl transition-all duration-200"
              >
                Générer Code QR 📲
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: JOURNAL */}
        {activeTab === 'journal' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-stone-800 tracking-tight px-1 mb-2">Journal ({completedOrders.length})</h2>
            {completedOrders.length === 0 ? (
              <div className="w-full h-32 rounded-[2rem] bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Aucune livraison aujourd'hui</span>
              </div>
            ) : (
              completedOrders.map((order) => (
                <div key={order.id} className="bg-[#E9EBEF] p-4 rounded-2xl shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">#{order.short_code}</span>
                    <p className="text-sm font-black text-stone-800">{order.restaurantName}</p>
                  </div>
                  <span className="text-sm font-black text-emerald-600">+{order.deliveryFee.toFixed(3)} DT</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: PROFIL */}
        {activeTab === 'profil' && (
          <div className="space-y-6">
            <div className="bg-[#E9EBEF] p-6 rounded-[2rem] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-stone-800 font-black text-2xl flex items-center justify-center border border-white/50">
                ER
              </div>
              <div>
                <h3 className="font-black text-stone-800 text-lg">EAGLE Rider TN</h3>
                <p className="text-xs font-bold text-stone-500 mt-1">+216 20 000 000</p>
                <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  Compte Vérifié ✓
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeOrdersCount={activeOrders.length}
      />
    </div>
  );
}
