import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface CustomerHomeProps {
  onSelectRestaurant: (restoName: string) => void;
  restaurantStatus: boolean;
}

export default function CustomerHome({ onSelectRestaurant, restaurantStatus }: CustomerHomeProps) {
  const [activeTab, setActiveTab] = useState('Accueil');
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopPhone, setShopPhone] = useState('');

  // حالات تتبع الطلب الحي للزبون
  const [liveOrder, setLiveOrder] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // مصفوفة الأيقونات الاحترافية
  const navItems = [
    { name: 'Accueil', icon: '🏠' },
    { name: 'Explorer', icon: '🔍' },
    { name: 'Commandes', icon: '🛒' },
    { name: 'Compte', icon: '👤' }
  ];

  // 💡 التعديل 1: نظام الاستماع اللحظي المتزامن مع سوبابيس فور فتح تبويب الطلبات
  useEffect(() => {
    if (activeTab === 'Commandes') {
      fetchLatestOrder();
    }
  }, [activeTab]);

  useEffect(() => {
    // مستمع حقيقي لأي تحديث في جدول الطلبات ليعكس الحالة فوراً في هاتف العميل
    const ordersSubscription = supabase
      .channel('live-customer-orders')
      .on(
        'postgres_changes',
        { event: 'UPDATE', filter: 'status=neq.Livrée', schema: 'public', table: 'orders' },
        (payload) => {
          if (liveOrder && payload.new.id === liveOrder.id) {
            setLiveOrder(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [liveOrder]);

  const fetchLatestOrder = async () => {
    setLoadingOrder(true);
    try {
      // جلب آخر طلب نشط لم يكتمل بعد للعميل الحالي
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setLiveOrder(data[0]);
      }
    } catch (err) {
      console.error("Erreur de suivi:", err);
    } finally {
      setLoadingOrder(false);
    }
  };

  // دالة استخراج الـ PIN الأمني من نص العنوان بأمان وحرفية
  const extractPin = (addressString: string) => {
    if (!addressString) return "----";
    const match = addressString.match(/🔒 PIN:\s*(\d+)/);
    return match ? match[1] : "----";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900" dir="ltr">

      {/* 1. Header */}
      <nav className="bg-white p-4 flex justify-between items-center sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦅</span>
          <h1 className="text-lg font-black tracking-tight">Eagle<span className="text-red-600">.tn</span></h1>
        </div>
        <button onClick={() => setShowPartnerModal(true)} className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-lg border border-red-100">🤝 Devenir Partenaire</button>
      </nav>

      {/* المحتوى حسب التبويب المختار */}
      <div className="p-4 space-y-6">
        {activeTab === 'Accueil' && (
          <div className="space-y-6 animate-fadeIn">
            {/* عرض شريكنا المميز */}
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Nos Partenaires Premium</h3>
            <div onClick={() => onSelectRestaurant('Am Ali Kitchen')} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-all">
              <div className="h-40 bg-gradient-to-tr from-amber-50 to-red-50 flex items-center justify-center relative">
                <span className="text-5xl">🍲</span>
                <span className="absolute top-3 right-3 bg-red-600 text-white font-black text-[9px] px-2 py-1 rounded-md">✓ LIVRAISON GRATUITE</span>
              </div>
              <div className="p-4">
                <h4 className="font-black text-base">Am Ali Kitchen</h4>
                <p className="text-[10px] text-gray-400 font-bold">Hergma • Kammounia • Couscous</p>
                <div className="flex justify-between items-center pt-3 mt-2 border-t text-[10px] font-black text-gray-500">
                  <span>⏱️ 20-35 min</span>
                  <span className={`px-2 py-0.5 rounded-lg ${restaurantStatus ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {restaurantStatus ? 'OUVERT' : 'FERMÉ'}
                  </span>
                </div>
              </div>
            </div>

            {/* بانر إضافي الشركاء */}
            <div className="bg-gray-900 rounded-3xl p-5 text-white shadow-lg relative">
              <h3 className="font-black text-base">Vendre sur Eagle ?</h3>
              <p className="text-[10px] text-gray-400 mt-1 mb-3">Rejoignez le leader de la livraison rapide à Tunis.</p>
              <button onClick={() => setShowPartnerModal(true)} className="bg-white text-gray-900 font-black text-[10px] px-4 py-2 rounded-xl">🚀 Inscrivez-vous</button>
            </div>
          </div>
        )}

        {activeTab === 'Explorer' && (
          <div className="text-center py-20 text-gray-400 font-black animate-fadeIn">
            <span className="text-4xl block mb-2">🔍</span>
            Recherche de spécialités régionales bientôt disponible
          </div>
        )}

        {/* 💡 التعديل 2: تحويل تبويب "Commandes" إلى لوحة تتبع ملاحية حية تليق بـ Eagle TN */}
        {activeTab === 'Commandes' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Suivi de votre commande live</h3>
            
            {loadingOrder ? (
              <div className="text-center py-12 text-xs font-bold text-gray-400 animate-pulse">Synchronisation avec Supabase...</div>
            ) : liveOrder ? (
              <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-xl space-y-5">
                
                {/* عرض كود الـ PIN الأمني الفخم الصارم للعميل */}
                <div className="bg-slate-900 text-white rounded-2xl p-4 flex justify-between items-center border border-slate-800 shadow-md">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Code de Sécurité Obligatoire</h4>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">Donnez ce code au livreur à l'arrivée</p>
                  </div>
                  <span className="text-xl font-black tracking-widest bg-emerald-600 text-white px-4 py-2 rounded-xl font-mono shadow-sm">
                    {extractPin(liveOrder.delivery_address)}
                  </span>
                </div>

                {/* شريط المراحل الحركي الذكي التفاعلي المتجاوب */}
                <div className="pt-2">
                  <div className="flex justify-between items-center relative px-2">
                    <div className="absolute left-4 right-4 h-1 bg-gray-100 top-4 z-0"></div>
                    <div className={`absolute left-4 h-1 bg-emerald-500 top-4 z-0 transition-all duration-700`} 
                         style={{ 
                           width: liveOrder.status === 'En attente' ? '0%' : 
                                  liveOrder.status === 'En préparation' ? '33%' : 
                                  liveOrder.status === 'Prête / En livraison' ? '66%' : '100%' 
                         }}></div>

                    {[
                      { key: 'En attente', label: 'Reçu', icon: '🛎️' },
                      { key: 'En preparation', label: 'Cuisine', icon: '🍲' },
                      { key: 'Prête / En livraison', label: 'Route', icon: '🛵' },
                      { key: 'Livrée', label: 'Arrivé', icon: '🎁' }
                    ].map((step, index) => {
                      const isCurrent = liveOrder.status === step.key || (step.key === 'En preparation' && liveOrder.status === 'En préparation');
                      const isPassed = index <= (
                        liveOrder.status === 'En attente' ? 0 : 
                        liveOrder.status === 'En préparation' ? 1 : 
                        liveOrder.status === 'Prête / En livraison' ? 2 : 3
                      );

                      return (
                        <div key={step.key} className="flex flex-col items-center z-10 relative">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all duration-300 ${isCurrent ? 'bg-slate-900 text-white scale-110 ring-4 ring-slate-100' : isPassed ? 'bg-emerald-500 text-white' : 'bg-white border text-gray-300'}`}>
                            {step.icon}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-wider mt-2 ${isCurrent ? 'text-slate-900 font-black' : 'text-gray-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-2"></div>

                {/* تفاصيل الفاتورة النقدية بالدينار */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>Statut Actuel :</span>
                    <span className="font-black text-slate-800 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md border text-[9px]">{liveOrder.status}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>Montant à payer Cash :</span>
                    <span className="font-black text-red-600">{(Number(liveOrder.total_amount)).toFixed(3)} DT</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-[2rem] p-8 text-center border border-gray-100 shadow-sm opacity-60">
                <span className="text-5xl block mb-4">📭</span>
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Aucune commande active pour le moment.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Compte' && (
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm text-center animate-fadeIn">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-3xl mb-3 shadow-inner">👤</div>
            <h4 className="font-black text-lg text-gray-800">Client Privilège Eagle</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Compte Instantané Sécurisé</p>
            <div className="h-px bg-gray-100 my-4"></div>
            <p className="text-xs font-bold text-gray-500 leading-relaxed">Vos informations d'identification et de livraison sont chiffrées localement sur votre terminal.</p>
          </div>
        )}
      </div>

      {/* 2. شريط الأيقونات السفلي الثابت (Bottom Nav) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.name ? 'text-red-600 scale-110' : 'text-gray-400'}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] font-black">{item.name}</span>
          </button>
        ))}
      </div>

      {/* Modal Partner */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="font-black text-base">Devenir Partenaire 🦅</h3>
            <input type="text" placeholder="Nom du commerce" value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full bg-gray-50 border p-3 rounded-xl font-bold text-xs" />
            <input type="tel" placeholder="Téléphone" value={shopPhone} onChange={(e) => setShopPhone(e.target.value)} className="w-full bg-gray-50 border p-3 rounded-xl font-bold text-xs" />
            <button onClick={() => { alert("Demande envoyée !"); setShowPartnerModal(false); }} className="w-full bg-red-600 text-white font-black py-3 rounded-xl text-xs">ENVOYER</button>
          </div>
        </div>
      )}
    </div>
  );
}
