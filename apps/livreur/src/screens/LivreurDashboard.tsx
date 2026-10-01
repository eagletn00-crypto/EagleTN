import React, { useState } from 'react';
import { useLivreurOrders } from '../hooks/useLivreurOrders';
import { BottomNav, TabType } from '../components/BottomNav';
import { OrderMap } from '../components/OrderMap';

export default function LivreurDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('commandes');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedMapOrder, setSelectedMapOrder] = useState<string | null>(null);
  const { orders, loading, acceptOrder, deliverOrder } = useLivreurOrders();

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  const cashInHand = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const netEarnings = completedOrders.reduce((sum, o) => sum + o.deliveryFee, 0);
  const cashLimit = 150.0;

  const handleAccept = async (id: string) => {
    await acceptOrder(id);
    setSelectedMapOrder(id); // فتح الخريطة تلقائياً فور قبول الطلب
  };

  const handleDeliver = async (id: string) => {
    if (window.confirm("Confirmez-vous l'encaissement de la commande et la livraison au client ?")) {
      await deliverOrder(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-24 select-none">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center sticky top-0 z-40 shadow-2xs">
        <div>
          <span className="text-[10px] font-black text-emerald-600 tracking-wider uppercase block">
            EAGLE TN • LIVREUR
          </span>
          <h1 className="text-lg font-black text-gray-900 tracking-tight">EAGLE Rider 🛵</h1>
        </div>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 border shadow-2xs ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-600 border-red-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
          {isOnline ? 'En Ligne' : 'Hors Ligne'}
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-1 mb-4 shadow-2xs">
            <span className="text-sm font-black text-amber-800 block">Vous êtes Hors Ligne 🔴</span>
            <p className="text-xs text-amber-600">Passez en ligne pour recevoir les missions disponibles.</p>
          </div>
        )}

        {/* TAB 1: COMMANDES */}
        {activeTab === 'commandes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-gray-900 tracking-tight">
                Missions En Cours ({activeOrders.length})
              </h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-md">
                GPS Actif 📍
              </span>
            </div>

            {loading ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-2xs">
                <p className="text-xs font-bold text-gray-400">Chargement des missions...</p>
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-xs font-medium">
                Aucune mission attribuée pour le moment.
              </div>
            ) : (
              activeOrders.map((order) => {
                const isMapOpen = selectedMapOrder === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                            #{order.short_code}
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Code: {order.verificationCode}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-gray-900 text-base">{order.restaurantName}</h3>
                        <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                          📍 {order.deliveryAddress}
                        </p>
                        <p className="text-xs font-bold text-gray-700">
                          👤 {order.clientName} (
                          <a href={`tel:${order.clientPhone}`} className="text-emerald-600 underline">
                            {order.clientPhone}
                          </a>
                          )
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-600 block">
                          +{order.deliveryFee.toFixed(3)} DT
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold block">Gain Course</span>
                      </div>
                    </div>

                    <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-100 text-xs flex justify-between items-center">
                      <span className="font-bold text-amber-900">💵 Encaissement Client (COD):</span>
                      <span className="text-amber-800 font-black text-sm">{order.totalAmount.toFixed(3)} DT</span>
                    </div>

                    {/* الخريطة عند الطلب */}
                    {isMapOpen && (
                      <OrderMap
                        pickupLat={order.pickupCoords.lat}
                        pickupLng={order.pickupCoords.lng}
                        dropoffLat={order.dropoffCoords.lat}
                        dropoffLng={order.dropoffCoords.lng}
                        clientAddress={order.deliveryAddress}
                      />
                    )}

                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={() => handleAccept(order.id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 rounded-xl shadow-xs transition-all active:scale-98 flex justify-center items-center gap-1"
                      >
                        {isMapOpen ? 'Itinéraire Actif 🗺️' : 'Accepter la Course 🛵'}
                      </button>
                      
                      <button
                        onClick={() => setSelectedMapOrder(isMapOpen ? null : order.id)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition-all"
                        title="Afficher la Carte"
                      >
                        🗺️
                      </button>

                      <button
                        onClick={() => handleDeliver(order.id)}
                        className="bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-800 text-xs font-black px-4 py-3 rounded-xl transition-all active:scale-98 border border-gray-200"
                      >
                        Terminer ✅
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: FINANCE */}
        {activeTab === 'finance' && (
          <div className="space-y-4">
            <h2 className="text-sm font-black text-gray-900 tracking-tight">Tableau de Bord Financier</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-gray-400 block">Cash en Main (COD)</span>
                <span className="text-lg font-black text-amber-600 block">{cashInHand.toFixed(3)} DT</span>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min((cashInHand / cashLimit) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-[9px] text-gray-400 font-semibold block pt-1">
                  Plafond autorisé: {cashLimit} DT
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-gray-400 block">Gains Nets Journée</span>
                <span className="text-lg font-black text-emerald-600 block">+{netEarnings.toFixed(3)} DT</span>
                <span className="text-[9px] text-emerald-600 font-bold block pt-1">
                  Revenus livraisons accumulés
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-4.5 rounded-2xl text-white shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-100">Versement Espèces Requis</span>
                <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-md">Agence / Dépôt</span>
              </div>
              <p className="text-2xl font-black">{cashInHand.toFixed(3)} DT</p>
              <button
                onClick={() => alert("Code QR généré pour le dépôt agence.")}
                className="w-full bg-white text-emerald-800 text-xs font-black py-2.5 rounded-xl shadow-xs transition-all active:scale-98"
              >
                Générer Code de Dépôt QR 📲
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: JOURNAL */}
        {activeTab === 'journal' && (
          <div className="space-y-3">
            <h2 className="text-sm font-black text-gray-900 tracking-tight">Journal des Courses ({completedOrders.length})</h2>
            {completedOrders.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-xs">
                Aucune livraison enregistrée dans le journal aujourd'hui.
              </div>
            ) : (
              completedOrders.map((order) => (
                <div key={order.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-2xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block">#{order.short_code}</span>
                    <p className="text-xs font-extrabold text-gray-800">{order.restaurantName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600 block">+{order.deliveryFee.toFixed(3)} DT</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: PROFIL */}
        {activeTab === 'profil' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center border border-emerald-200">
                ER
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">EAGLE Rider TN</h3>
                <p className="text-xs text-gray-500 font-semibold">+216 20 000 000</p>
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
