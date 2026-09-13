import React, { useEffect, useState } from 'react';
import { usePartnerStore, Order } from '../lib/usePartnerStore';
import { supabase } from '../lib/supabaseClient';
import { 
  LayoutGrid, UtensilsCrossed, Briefcase, Printer, 
  Ban, Check, Clock, Bell, RefreshCw, X, MapPin, 
  Eye, EyeOff, SlidersHorizontal, Loader2, QrCode, AlertCircle
} from 'lucide-react';

const formatOrderStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
    case 'en attente':
      return 'En attente de confirmation';
    case 'preparing':
    case 'en cours':
      return 'En cours de préparation';
    case 'ready_for_pickup':
    case 'ready':
      return 'Prêt pour retrait';
    case 'delivered':
      return 'Commande livrée';
    case 'cancelled':
    case 'expired':
      return 'Commande expirée';
    default:
      return status || 'Statut inconnu';
  }
};

export default function PartnerDashboard() {
  const { 
    ordersMap, 
    isLoading, 
    activeTab, 
    setActiveTab, 
    subscribeToRealtime,
    playNotificationSound,
    fetchInitialOrders
  } = usePartnerStore();

  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);
  const [privacyBlur, setPrivacyBlur] = useState<boolean>(false);
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState<string | null>(null);
  const [showStockModal, setShowStockModal] = useState<boolean>(false);
  
  const [fleetStatus] = useState<'fluide' | 'intense' | 'indisponible'>('fluide');
  const [timers, setTimers] = useState<Record<string, number>>({});

  const [quickStockItems, setQuickStockItems] = useState([
    { id: '1', name: 'Plat Ojja Royale', available: true },
    { id: '2', name: 'Couscous Poisson', available: true },
    { id: '3', name: 'Brik à l\'œuf', available: false },
    { id: '4', name: 'Sandwich Mlawi Poulet', available: true },
  ]);

  useEffect(() => {
    const unsubscribe = subscribeToRealtime();
    return () => unsubscribe();
  }, [subscribeToRealtime]);

  // العداد التنازلي التلقائي وحساب المهلة اللوجستية
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const nextTimers = { ...prev };
        Object.keys(ordersMap).forEach((id) => {
          const ord = ordersMap[id];
          if (ord.status === 'pending' || ord.status === 'en attente') {
            const currentVal = nextTimers[id] !== undefined ? nextTimers[id] : 60;
            nextTimers[id] = currentVal > 0 ? currentVal - 1 : 0;
          }
        });
        return nextTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ordersMap]);

  const allOrders = Object.values(ordersMap);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) console.error('Erreur update:', error);
    } finally {
      setIsUpdatingStatus(null);
      setRejectingOrderId(null);
      setSelectedRejectReason(null);
    }
  };

  const toggleStockItem = (id: string) => {
    setQuickStockItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const formatCurrencyDT = (amount?: number) => {
    if (amount === undefined || amount === null) return '0,000 DT';
    if (privacyBlur) return '•••••• DT';
    return `${amount.toFixed(3).replace('.', ',')} DT`;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#FAFAFA] font-sans text-slate-800 select-none overflow-hidden">
      
      {/* ==========================================
          المحتوى الرئيسي للتدفق اللوجستي - Ultra Premium Field Layout
          ========================================== */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5 pb-24 md:pb-8">
        
        {/* Top Header & Status Indicators */}
        <header className="flex flex-col space-y-3.5 pb-3 border-b border-slate-200/60">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Terminal Partenaire</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">En Direct</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight mt-0.5">Flux Logistique</h1>
            </div>

            <button
              onClick={() => setPrivacyBlur(!privacyBlur)}
              className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-center shrink-0 ${
                privacyBlur 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-700' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 shadow-2xs'
              }`}
              title="Mode Confidentialité"
            >
              {privacyBlur ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* شريط الشارات ومؤشرات الحالة الموحد */}
          <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <div className="flex items-center space-x-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-2xs shrink-0">
              <span className={`w-2 h-2 rounded-full ${
                fleetStatus === 'fluide' ? 'bg-emerald-500' : fleetStatus === 'intense' ? 'bg-amber-500' : 'bg-rose-500'
              }`} />
              <span className="text-[11px] text-slate-500 font-medium">Livreurs:</span>
              <span className="text-[11px] font-bold text-slate-900 capitalize">{fleetStatus}</span>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-xl shrink-0">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-emerald-800 text-[11px] font-semibold">Cuisine ouverte</span>
            </div>

            <button 
              onClick={() => fetchInitialOrders()}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all text-xs font-semibold flex items-center space-x-1.5 shrink-0 shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Actualiser</span>
            </button>
          </div>
        </header>

        {/* شبكة عرض الطلبات الميدانية */}
        {isLoading && allOrders.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-slate-100 rounded w-24" />
                  <div className="h-4 bg-slate-100 rounded w-16" />
                </div>
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-10 bg-slate-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : allOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60 shadow-2xs max-w-md mx-auto p-8 space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-slate-900">Aucun flux actif</h3>
            <p className="text-slate-400 text-xs">Le terminal EAGLE TN استقبـال الطلبات المباشرة بانتظام.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {allOrders.map((ord: any) => {
              const isPending = ord.status === 'pending' || ord.status === 'en attente';
              const timeLeft = timers[ord.id] !== undefined ? timers[ord.id] : 60;
              const isTimeout = isPending && timeLeft === 0;

              return (
                <div 
                  key={ord.id} 
                  className={`bg-white border rounded-2xl p-4.5 shadow-2xs space-y-3.5 transition-all flex flex-col justify-between relative ${
                    isPending && !isTimeout
                      ? 'border-amber-400/80 ring-2 ring-amber-500/10 bg-gradient-to-b from-amber-500/[0.015] to-transparent' 
                      : isTimeout 
                      ? 'border-slate-200 bg-slate-50/60'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Details */}
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                      <span className="font-mono text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/50">
                        ID: #{ord.id.slice(0, 8).toUpperCase()}
                      </span>

                      {/* المبلغ المالي متناسب وبدون ضخامة مفرطة */}
                      <span className={`text-lg font-bold text-[#111111] tracking-tight ${privacyBlur ? 'blur-xs select-none' : ''}`}>
                        {formatCurrencyDT(ord.total_amount)}
                      </span>
                    </div>

                    {/* بيانات العميل والعنوان */}
                    <div className="space-y-1">
                      <h4 className={`font-bold text-[#1C1C1E] text-sm ${privacyBlur ? 'blur-xs select-none' : ''}`}>
                        {ord.client_name || 'Client EAGLE TN'}
                      </h4>
                      <p className="text-xs text-[#636366] flex items-center space-x-1.5 leading-relaxed truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ord.delivery_address || 'Adresse non spécifiée'}</span>
                      </p>
                    </div>

                    {/* حالة العداد ورقم الـ PIN الميداني البارز */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                      {isTimeout ? (
                        <span className="flex items-center space-x-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Délai dépassé</span>
                        </span>
                      ) : isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-[#D97706]">En attente</span>
                            <span className="text-[10px] text-amber-700/80 font-mono">Expire dans {timeLeft}s</span>
                          </div>
                        </div>
                      ) : (
                        <span className="flex items-center space-x-1.5 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          <span>{formatOrderStatus(ord.status)}</span>
                        </span>
                      )}

                      {/* كادر الـ PIN البارز جداً للعمل الميداني */}
                      {ord.verification_code && (
                        <div className="flex items-center space-x-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">PIN</span>
                          <span className="text-xs font-mono font-black tracking-widest text-amber-400">
                            {ord.verification_code}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* أزرار الإجراءات الأساسية المحسنة لمنع الاقتطاع */}
                  <div className="pt-2 flex items-center space-x-2 w-full">
                    <button
                      onClick={() => setSelectedOrderForReceipt(ord)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all border border-slate-200/80 cursor-pointer shrink-0"
                      title="Bon Thermal"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {isPending && !isTimeout && (
                      <button
                        onClick={() => setRejectingOrderId(ord.id)}
                        className="p-2.5 bg-[#FFECEB] hover:bg-[#FEE2E2] text-[#E11D48] rounded-xl transition-all border border-rose-200/60 cursor-pointer shrink-0"
                        title="Refuser"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}

                    {isTimeout ? (
                      <button
                        disabled
                        className="flex-1 bg-slate-100 text-slate-400 font-semibold text-xs py-2.5 px-3 rounded-xl cursor-not-allowed border border-slate-200/60 text-center"
                      >
                        Expirée
                      </button>
                    ) : (
                      <button
                        onClick={() => updateOrderStatus(ord.id, isPending ? 'preparing' : 'ready_for_pickup')}
                        disabled={isUpdatingStatus === ord.id}
                        className="flex-1 min-w-0 bg-[#0F172A] hover:bg-[#1E293B] active:bg-slate-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                      >
                        {isUpdatingStatus === ord.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 shrink-0" />
                            <span className="truncate">{isPending ? 'Accepter' : 'Marquer prêt'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modals & Popups */}
        {rejectingOrderId && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Motif d'annulation</h3>
                <button onClick={() => setRejectingOrderId(null)} className="p-1 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'stock', label: 'Rupture de stock' },
                  { id: 'closed', label: 'Fermeture temporaire' },
                  { id: 'capacity', label: 'Capacité dépassée' }
                ].map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedRejectReason(reason.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                      selectedRejectReason === reason.id 
                        ? 'bg-[#0F172A] border-[#0F172A] text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>

              <button
                disabled={!selectedRejectReason || isUpdatingStatus === rejectingOrderId}
                onClick={() => updateOrderStatus(rejectingOrderId, `cancelled_${selectedRejectReason}`)}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center ${
                  selectedRejectReason 
                    ? 'bg-[#E11D48] text-white shadow-sm cursor-pointer' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isUpdatingStatus === rejectingOrderId ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirmer l'annulation</span>}
              </button>
            </div>
          </div>
        )}

        {/* Modal Quick Stock */}
        {showStockModal && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase">Gestion du Stock Rapide</h3>
                <button onClick={() => setShowStockModal(false)} className="p-1 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {quickStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    <button
                      onClick={() => toggleStockItem(item.id)}
                      className={`w-10 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                        item.available ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        item.available ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Receipt */}
        {selectedOrderForReceipt && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-900">BON DE PRÉPARATION</h3>
                  <span className="text-[9px] text-slate-400">Impression Thermal</span>
                </div>
                <button onClick={() => setSelectedOrderForReceipt(null)} className="p-1 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 font-mono text-[11px] bg-slate-50 p-3.5 rounded-xl border border-dashed border-slate-200">
                <div className="flex justify-between">
                  <span>Partenaire:</span>
                  <span className="font-bold">Chez Om Ali</span>
                </div>
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-bold">#{selectedOrderForReceipt.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-xs font-bold">
                  <span>Total:</span>
                  <span>{formatCurrencyDT(selectedOrderForReceipt.total_amount)}</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full bg-[#0F172A] text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ==========================================
          الشريط الجانبي / الملاحة السفلى للهواتف (Responsive Navigation)
          ========================================== */}
      <nav className="fixed bottom-0 left-0 right-0 md:relative md:w-20 bg-white border-t md:border-t-0 md:border-r border-slate-200/80 flex md:flex-col items-center justify-around md:justify-start py-3 md:py-6 md:space-y-8 z-40 shadow-lg md:shadow-none">
        
        {/* Logo الشعار على الأجهزة الكبيرة */}
        <div className="hidden md:flex w-10 h-10 rounded-xl bg-[#0F172A] text-white font-black text-lg items-center justify-center shadow-xs">
          E
        </div>

        {/* قائمة الأيقونات الميدانية */}
        <div className="flex md:flex-col space-x-6 md:space-x-0 md:space-y-6 items-center w-full justify-around md:justify-center">
          <button
            onClick={() => setActiveTab('orders')}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders' ? 'text-[#0F172A] bg-slate-100 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Flux Logistique"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowStockModal(true)}
            className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer"
            title="Stock Rapide"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'menu' ? 'text-[#0F172A] bg-slate-100 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Carte & Menu"
          >
            <UtensilsCrossed className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'wallet' ? 'text-[#0F172A] bg-slate-100 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Portefeuille"
          >
            <Briefcase className="w-5 h-5" />
          </button>
        </div>

        {/* زر التنبيه الصوتي */}
        <div className="hidden md:flex mt-auto pt-4 border-t border-slate-100 w-full justify-center">
          <button 
            onClick={playNotificationSound}
            className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all cursor-pointer"
            title="Signal Sonore"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>

      </nav>

    </div>
  );
}
