import React from 'react';
import { useLivreurOrders } from '../hooks/useLivreurOrders';

export default function LivreurDashboard() {
  const {
    isOnline,
    setIsOnline,
    activeTab,
    setActiveTab,
    activeOrders,
    stats,
    loading,
    confirmOrder,
    setConfirmOrder,
    handleOpenNavigation,
    handleStartTrip,
    handleFinalizeDelivery,
  } = useLivreurOrders();

  return (
    <div dir="ltr" className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-sans pb-28 select-none">
      
      {/* 1. HEADER */}
      <header className="bg-white border-b border-slate-100 px-4 py-2.5 sticky top-0 z-20 flex justify-between items-center shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-sm">
            E
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 leading-none">
              Eagle<span className="text-red-600">.Livreur</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              ZONE: TUNIS CAPITAL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">
            ⚠️
          </button>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 transition-all ${
              isOnline
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
            {isOnline ? 'EN LIGNE' : 'HORS LIGNE'}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="p-4 max-w-md mx-auto w-full space-y-4 flex-1">
        
        {/* 2. PERFORMANCE HEADER */}
        <div className="bg-[#0b1329] text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase block">
                GAINS D'AUJOURD'HUI
              </span>
              <div className="text-2xl font-black tracking-tight text-white mt-0.5">
                +{stats.dailyEarnings.toFixed(3)} <span className="text-xs font-bold text-slate-300">TND</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase block">
                COURSES EFFECTUÉES
              </span>
              <div className="text-xl font-black text-white mt-0.5">
                {stats.completedTripsToday} <span className="text-xs text-slate-400 font-normal">Courses</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/50">
            <div className="flex justify-between text-[10px] font-extrabold mb-1.5">
              <span className="text-amber-400">⚡ Prime du jour: +{stats.bonusAmount.toFixed(3)} DT</span>
              <span className="text-slate-400">{stats.completedTripsToday}/{stats.targetTrips} Courses</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.completedTripsToday / stats.targetTrips) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* CASH WARNING */}
        <div className="bg-[#fefce8] border border-amber-200/60 p-3.5 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="text-xs">
            <p className="font-extrabold text-amber-900 text-[11px]">Attention: Seuil Caisse Proche</p>
            <p className="text-amber-700 text-[10px] mt-0.5">
              Vous avez <strong className="font-black text-amber-900">{stats.cashInHand.toFixed(3)} DT</strong> en caisse (Limite: {stats.cashLimit} DT)
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs">
            🛡️
          </div>
        </div>

        {/* 3. ORDERS LIST */}
        {activeTab === 'encours' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                Chargement des courses...
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-2xs">
                <p className="text-slate-400 text-xs font-extrabold flex items-center justify-center gap-2">
                  📦 Aucune course active pour le moment
                </p>
              </div>
            ) : (
              activeOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-4 space-y-3 relative overflow-hidden"
                >
                  {/* Order Code & Status */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                        CODE COMMANDE
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-black text-xs text-slate-900">{order.order_code}</span>
                        <span className="text-[11px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          #{order.short_code}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-black px-2.5 py-1 rounded-full tracking-wider uppercase ${
                        order.status === 'EN_ROUTE'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}
                    >
                      {order.status === 'EN_ROUTE' ? '⌛ EN ROUTE' : '⏳ EN PREPARATION'}
                    </span>
                  </div>

                  {/* Partner & Client Info */}
                  <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">RESTAURANT / PARTENAIRE</span>
                        <p className="font-extrabold text-slate-800 text-xs mt-0.5">🏪 {order.restaurant_name}</p>
                      </div>
                      {order.restaurant_phone && (
                        <a
                          href={`tel:${order.restaurant_phone}`}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-emerald-600 rounded-lg text-[10px] font-bold shadow-2xs flex items-center gap-1"
                        >
                          📞 Appeler
                        </a>
                      )}
                    </div>

                    <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">CLIENT & ADRESSE</span>
                        <p className="font-extrabold text-slate-800 text-xs mt-0.5">👤 {order.customer_name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{order.customer_address}</p>
                      </div>
                      {order.customer_phone && (
                        <a
                          href={`tel:${order.customer_phone}`}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-emerald-600 rounded-lg text-[10px] font-bold shadow-2xs flex items-center gap-1"
                        >
                          📞 Appeler
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="bg-[#0b1329] text-white p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block">Gain Livreur:</span>
                      <span className="text-emerald-400 font-black text-xs">+{order.delivery_fee.toFixed(3)} DT</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-bold block">À Collecter (Cash):</span>
                      <span className="text-white font-black text-sm">{order.order_value.toFixed(3)} DT</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => handleOpenNavigation(order.lat, order.lng)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
                    >
                      ⚠️ OUVRIR DANS GOOGLE MAPS
                    </button>

                    {order.status !== 'EN_ROUTE' ? (
                      <button
                        onClick={() => handleStartTrip(order.id)}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
                      >
                        🚀 COMMENCER COURSE
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmOrder(order)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
                      >
                        ✅ CONFIRMER LIVRAISON
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'wallet' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs text-center space-y-4">
            <h3 className="text-xs font-bold text-slate-800">Mon Portefeuille Caisse</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-bold">Total en Caisse</span>
              <span className="text-2xl font-black text-slate-900">{stats.cashInHand.toFixed(3)} TND</span>
            </div>
          </div>
        )}
      </main>

      {/* CONFIRMATION MODAL */}
      {confirmOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-slate-900 text-center">Valider la Livraison</h3>
            <p className="text-xs text-slate-500 text-center">
              Avez-vous bien encaissé la somme de <strong className="text-slate-900 font-black">{confirmOrder.order_value.toFixed(3)} DT</strong> ?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmOrder(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleFinalizeDelivery}
                className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirmer ✅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2 px-6 z-30 shadow-lg">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button
            onClick={() => setActiveTab('encours')}
            className={`flex-1 max-w-[100px] py-2 text-center rounded-2xl text-[10px] font-extrabold flex flex-col items-center justify-center transition-all ${
              activeTab === 'encours'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>🚲</span>
            <span className="mt-0.5">En Cours ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('livre')}
            className={`flex-1 max-w-[100px] py-2 text-center rounded-2xl text-[10px] font-extrabold flex flex-col items-center justify-center transition-all ${
              activeTab === 'livre'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>📋</span>
            <span className="mt-0.5">Livré ({stats.completedTripsToday})</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 max-w-[100px] py-2 text-center rounded-2xl text-[10px] font-extrabold flex flex-col items-center justify-center transition-all ${
              activeTab === 'wallet'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>💼</span>
            <span className="mt-0.5">Caisse / Wallet</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
