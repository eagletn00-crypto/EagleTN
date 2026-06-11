import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { ShoppingBag, MapPin, Clock, ShieldCheck, ArrowRight, Scale, CheckCircle, AlertCircle, LocateFixed, User, ClipboardList, Home, ChevronRight, Store, Bike, PhoneCall, LayoutGrid, Star, Trash2, QrCode, Lock, ShieldAlert, Activity, RefreshCw, BadgeCheck, XCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import PartnerDashboard from './PartnerDashboard';
import LivreurDashboard from './LivreurDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

interface RestaurantMenuProps {
  onAdminLogin?: () => void;
  onPartnerLogin?: () => void;
  onLivreurLogin?: () => void;
  onBack?: () => void;
}

export default function RestaurantMenu({ onAdminLogin: _onAdminLogin, onPartnerLogin: _onPartnerLogin, onLivreurLogin: _onLivreurLogin, onBack: _onBack }: RestaurantMenuProps) {
  
  const [appView, setAppView] = useState<'splash' | 'login' | 'hub' | 'stores_list' | 'menu' | 'cart' | 'tracking' | 'profile' | 'admin_dashboard' | 'partner_dashboard' | 'livreur_dashboard'>('splash');
  
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [showProLogin, setShowProLogin] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'partenaire' | 'livreur' | 'contact' | 'legal'>('none');
  const [formData, setFormData] = useState({ name: '', phone: '', type: '', region: '', note: '', agreed: false });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState('TOUS');

  const [fullName, setFullName] = useState(() => localStorage.getItem('eagle_name') || '');
  const [phone, setPhone] = useState(() => localStorage.getItem('eagle_phone') || '');
  const [deliveryAddress, setDeliveryAddress] = useState(() => localStorage.getItem('eagle_address') || 'Cité Nacer, Tunis');
  const [clientNote, setClientNote] = useState('');

  const [clientLat, setClientLat] = useState<number>(36.8065);
  const [clientLng, setClientLng] = useState<number>(10.1815);
  
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showSecretCode, setShowSecretCode] = useState(false);

  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [currentOrderStatus, setCurrentOrderStatus] = useState<string>('');
  const [orderPinCode, setOrderPinCode] = useState<string>('----');
  
  const [restaurantVerificationTimer, setRestaurantVerificationTimer] = useState<number>(60); 
  const [clientCancelTimer, setClientCancelTimer] = useState<number>(300); 

  const [driverInfo, setDriverInfo] = useState({
    name: "Ahmed Ben Ali",
    rating: "4.9",
    phone: "21658050693",
    whatsapp: "21658050693",
    note: "Coursier certifié Eagle Pro Live"
  });

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'info' });
  const [showGoogleDisclosure, setShowGoogleDisclosure] = useState(false);

  const storeLat = Number(selectedStore?.lat) || 36.8120;
  const storeLng = Number(selectedStore?.lng) || 10.1800;
  const BASE_FEE = 2.000;
  const PRICE_PER_KM = 0.800;
  const distanceInKm = calculateDistance(storeLat, storeLng, clientLat, clientLng);
  const dynamicDeliveryFee = Number((BASE_FEE + (distanceInKm * PRICE_PER_KM)).toFixed(3));

  const _triggerEagleScream = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
      audio.volume = 0.6;
      audio.play();
    } catch (_e) {}
  };

  const getSovereignSalutation = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return "Bonjour";
    if (hr >= 12 && hr < 18) return "Salut";
    return "Bonsoir";
  };

  const isValidTunisianPhone = (phoneNumber: string) => {
    return /^\d{8}$/.test(phoneNumber.trim());
  };

  useEffect(() => {
    localStorage.setItem('eagle_name', fullName);
    localStorage.setItem('eagle_phone', phone);
    localStorage.setItem('eagle_address', deliveryAddress);
  }, [fullName, phone, deliveryAddress]);

  useEffect(() => {
    const clockEngine = setInterval(() => {
      if (currentOrderId) {
        if (currentOrderStatus === 'confirmed' && restaurantVerificationTimer > 0) {
          setRestaurantVerificationTimer(t => t - 1);
          if (restaurantVerificationTimer === 1) {
            handleTimeoutCancellation();
          }
        }
        if (currentOrderStatus === 'prete' && clientCancelTimer > 0) {
          setClientCancelTimer(t => t - 1);
        }
      }
    }, 1000);
    return () => clearInterval(clockEngine);
  }, [currentOrderId, currentOrderStatus, restaurantVerificationTimer, clientCancelTimer]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 4000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return showToast("Champs requis", "error");
    if (!isValidTunisianPhone(formData.phone)) return showToast("Le numéro doit comporter exactement 8 chiffres", "error");
    if (!formData.agreed) return showToast("Veuillez accepter les conditions légales", "error");
    try {
      const targetTable = activeModal === 'partenaire' ? 'partner_applications' : activeModal === 'livreur' ? 'driver_applications' : 'support_messages';
      await supabase.from(targetTable).insert([{
        name: formData.name, phone: formData.phone, type: formData.type || null, region: formData.region || null, note: formData.note
      }]);
      showToast("Demande transmise avec succès.", "success");
      setActiveModal('none');
      setFormData({ name: '', phone: '', type: '', region: '', note: '', agreed: false });
    } catch (_err) { showToast("Erreur d'enregistrement", "error"); } 
  };

  const handleSecretClick = () => {
    setSecretClickCount(prev => prev + 1);
    if (secretClickCount >= 4) {
      setShowProLogin(true);
      setSecretClickCount(0);
      showToast("Terminal Professionnel Déverrouillé 🦅", "success");
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: storesData } = await supabase.from('restaurants').select('*').eq('id', 1).maybeSingle();
      if (storesData) {
        setStores([storesData]);
      } else {
        const { data: allStores } = await supabase.from('restaurants').select('*').limit(1);
        if (allStores) setStores(allStores);
      }

      const savedPhone = localStorage.getItem('eagle_phone');
      if (savedPhone) {
        const { data: activeOrder } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_phone', savedPhone)
          .neq('status', 'delivered')
          .neq('status', 'refused')
          .neq('status', 'cancelled_timeout')
          .neq('status', 'cancelled_client')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (activeOrder) {
          setCurrentOrderId(activeOrder.id);
          setCurrentOrderStatus(activeOrder.status);
          setOrderPinCode(activeOrder.pin_code);
          setAppView('tracking');
          return;
        }
      }
      if (appView === 'splash') setTimeout(() => setAppView('login'), 4000);
    };
    fetchInitialData();
  }, [appView]); 

  useEffect(() => {
    if (!currentOrderId) return;
    const channel = supabase
      .channel(`order_realtime_${currentOrderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${currentOrderId}` }, (payload: any) => {
        if (payload.new) {
          setCurrentOrderStatus(payload.new.status);
          if (payload.new.status === 'delivered') setShowSuccessOverlay(true);
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentOrderId]);

  const handleLoadStoreType = async (type: string) => {
    const { data } = await supabase.from('restaurants').select('*').eq('store_type', type);
    if (data && data.length > 0) setStores(data);
    setAppView('stores_list');
  };

  const handleSelectStore = async (store: any) => {
    if (store.is_open === false) {
      showToast("Ce partenaire est actuellement fermé", "error");
      return;
    }
    setSelectedStore(store);
    try {
      const { data, error: _err } = await supabase.from('products').select('*').eq('restaurant_id', store.id);
      if (data) setProducts(data);
      setAppView('menu');
    } catch (_e) { 
      showToast("Erreur de chargement du menu", "error");
    }
  };

  const addToCart = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart(prev => { const updated = { ...prev }; if (updated[id] > 1) updated[id]--; else delete updated[id]; return updated; });
  const deleteFromCart = (id: string) => setCart(prev => { const updated = { ...prev }; delete updated[id]; return updated; }); 

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => { const p = products.find(prod => String(prod.id) === id); return sum + (p ? Number(p.price || 0) * qty : 0); }, 0);
  const totalPrice = subtotal > 0 ? subtotal + dynamicDeliveryFee : 0;

  const triggerLocationRequest = () => { if (!localStorage.getItem('eagle_gps_accepted')) setShowGoogleDisclosure(true); else executeLocationFetch(); };

  const executeLocationFetch = () => {
    setShowGoogleDisclosure(false);
    localStorage.setItem('eagle_gps_accepted', 'true');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setClientLat(position.coords.latitude); setClientLng(position.coords.longitude);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          setDeliveryAddress(`${data.address?.road || 'Cité Nacer'}, Tunis`);
          showToast("Position synchronisée !", "success");
        } catch (_err) { setDeliveryAddress(`Cité Nacer, Tunis`); } 
      });
    }
  };

  const handleTimeoutCancellation = async () => {
    if (!currentOrderId) return;
    await supabase.from('orders').update({ status: 'cancelled_timeout' }).eq('id', currentOrderId);
    setCurrentOrderStatus('cancelled_timeout');
    showToast("Délai de validation expiré. Commande annulée.", "error");
    setAppView('hub');
  };

  const handleClientCancellation = async () => {
    if (!currentOrderId || clientCancelTimer <= 0) return;
    const { error } = await supabase.from('orders').update({ status: 'cancelled_client' }).eq('id', currentOrderId);
    if (!error) {
      showToast("Commande annulée par le client.", "info");
      resetEcosystemFlow();
    }
  };

  const handleConfirmOrder = async () => {
    if (!fullName || !phone || !deliveryAddress || !legalAccepted || totalItems === 0) {
      return showToast("Données ou panier invalides", "error");
    }
    if (!isValidTunisianPhone(phone)) {
      return showToast("Le numéro de téléphone doit comporter exactement 8 chiffres", "error");
    }

    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const itemsArrayPayload = Object.entries(cart).map(([id, qty]) => { 
      const p = products.find(prod => String(prod.id) === id); 
      return { 
        id, 
        name: p?.name_fr || p?.name || 'Article sans nom', 
        price: Number(p?.price || 0), 
        quantity: qty 
      }; 
    });
    
    try {
      const finalDeliveryAddress = clientNote ? `${deliveryAddress} | Note: ${clientNote}` : deliveryAddress;

      const { data, error } = await supabase.from('orders').insert([{ 
        customer_name: fullName, 
        customer_phone: phone, 
        delivery_address: finalDeliveryAddress, 
        items: itemsArrayPayload, 
        total_price: totalPrice, 
        status: 'confirmed', 
        pin_code: generatedPin, 
        delivery_lat: clientLat, 
        delivery_lng: clientLng
      }]).select();
      
      if (!error && data && data.length > 0) { 
        setOrderPinCode(generatedPin); 
        setCurrentOrderId(data[0].id); 
        setCurrentOrderStatus('confirmed'); 
        setRestaurantVerificationTimer(60); 
        setClientCancelTimer(300); 
        setAppView('tracking'); 
      } else {
        showToast("Échec de l'enregistrement, veuillez réessayer.", "error");
        console.error("Order Insert Error:", error);
      }
    } catch (_err) { 
      showToast("Erreur de connexion serveur", "error"); 
    }
  };

  const formatTimeMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTrackingStatusText = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'confirmed': return 'Commande confirmée ✅';
      case 'prete': return 'Le Chef a accepté ta commande 🧑‍🍳';
      case 'accepted_livreur': return 'Livreur a accepté ta commande 🛵';
      case 'route': return 'Le Livreur est en route 📍';
      case 'delivered': return 'Livré avec succès 🎉';
      case 'cancelled_timeout': return 'Annulée (Délai dépassé) ⏳';
      case 'cancelled_client': return 'Commande annulée par vous ❌';
      case 'refused': return 'Commande refusée par le restaurant 🚫';
      default: return 'Traitement en cours... ⏳';
    }
  };

  const resetEcosystemFlow = () => { setShowSuccessOverlay(false); setCart({}); setCurrentOrderId(null); setCurrentOrderStatus(''); setAppView('hub'); };

  const filteredProducts = selectedCategory === 'TOUS' 
    ? products.filter(p => p.restaurant_id === selectedStore?.id)
    : products.filter(p => p.restaurant_id === selectedStore?.id && p.category?.toUpperCase() === selectedCategory.toUpperCase());

  if (appView === 'partner_dashboard') return <PartnerDashboard onLogout={() => setAppView('login')} />;
  if (appView === 'livreur_dashboard') return <LivreurDashboard onLogout={() => setAppView('login')} />;
  if (appView === 'admin_dashboard') return <SuperAdminDashboard onLogout={() => setAppView('login')} />;

  return (
    <div className="h-screen w-screen bg-[#FDFBF7] text-slate-900 font-sans overflow-x-hidden overflow-y-auto max-w-md mx-auto relative shadow-2xl pb-24 border-x border-slate-100">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes breathe { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 35px rgba(239,68,68,0.2)); } 50% { transform: scale(1.02); filter: drop-shadow(0 0 55px rgba(239,68,68,0.5)); } }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
      `}} />

      {/* TOAST SYSTEM */}
      {toast.show && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] px-4 py-3 rounded-2xl flex items-center gap-2 shadow-xl border w-11/12 max-w-sm bg-slate-900 text-white border-white/15 animate-fade-in">
          <p className="text-xs font-black tracking-wider truncate">{toast.message}</p>
        </div>
      )}

      {/* 🛑 GOOGLE DISCLOSURE MODAL (Légal) */}
      {showGoogleDisclosure && (
        <div className="absolute inset-0 z-[500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] text-center max-w-sm shadow-2xl space-y-4 border-t-4 border-amber-500 animate-fade-in">
            <ShieldCheck size={40} className="text-amber-500 mx-auto" />
            <h2 className="text-lg font-black uppercase">Autorisation GPS</h2>
            <p className="text-xs text-slate-600 font-bold leading-relaxed text-justify" dir="rtl">
              "يستخدم Eagle.tn موقعك الجغرافي لمرة واحدة فقط لتحديد مكان التوصيل بدقة وحساب المسافة القانونية للشحنة. هل توافق؟"
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowGoogleDisclosure(false)} className="flex-1 bg-slate-100 py-3 rounded-xl font-black text-[10px] uppercase">Refuser</button>
              <button onClick={executeLocationFetch} className="flex-1 bg-amber-500 text-slate-950 py-3 rounded-xl font-black text-[10px] uppercase">Accepter</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LEGAL & CONDITIONS */}
      {activeModal !== 'none' && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#121620] border border-white/10 w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl relative flex flex-col max-h-[90%] animate-fade-in text-white">
            <button onClick={() => setActiveModal('none')} className="absolute top-4 right-4 bg-white/10 p-2 rounded-full text-slate-300 z-10"><ArrowRight size={18} className="rotate-180" /></button>

            {activeModal === 'legal' ? (
              <div className="space-y-4 text-right overflow-y-auto pr-1 pt-4" dir="rtl">
                <div className="flex items-center justify-end gap-2 text-amber-500 mb-2">
                  <Scale size={24} /> <h3 className="text-xl font-black">الشروط والخصوصية القانونية للمنصة</h3>
                </div>
                <div className="space-y-4 text-xs font-bold text-slate-300 leading-relaxed text-justify">
                  <p className="text-amber-400">**تنبيه: نسخة تجريبية وحماية المعطيات الشخصية (INPDP)**</p>
                  <p>"هذا التطبيق متاح حالياً في نسخته التجريبية (Bêta) لغرض الاختبار والتطوير. بضغطكم على 'تأكيد الطلب'، توافقون على أن الخدمة قد تواجه بعض الأعطال التقنية أو التأخير في التوصيل. توافقون على مشاركة موقعكم الجغرافي لغرض تحسين نظام التتبع الفني، وتلتزم المنصة بمعالجة هذه البيانات بشكل مؤقت وسري وفق المبادئ العامة لـقانون حماية المعطيات الشخصية بتونس."</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 overflow-y-auto pt-4 pr-1">
                <div className="border-b border-white/10 pb-3 mb-2">
                  <h3 className="text-xl font-black text-white uppercase">
                    {activeModal === 'partenaire' && 'Devenir Partenaire'}
                    {activeModal === 'livreur' && 'Devenir Livreur'}
                    {activeModal === 'contact' && 'Service Client 📞'}
                  </h3>
                </div>
                <input type="text" required placeholder="Nom et Prénom *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none" />
                <input type="tel" required placeholder="Numéro de Téléphone (8 chiffres) *" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none" />
                <textarea placeholder="Note..." value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none h-20 resize-none" />
                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer select-none">
                  <input type="checkbox" required checked={formData.agreed} onChange={e => setFormData({ ...formData, agreed: e.target.checked })} className="mt-0.5 accent-amber-500 w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold text-slate-300 text-right" dir="rtl">أقر وأوافق بكل صرامة على كافة الشروط القانونية والتشريعية.</span>
                </label>
                <button type="submit" className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Soumettre</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* [شاشة النجاح التامة - ULTRA PREMIUM] */}
      {showSuccessOverlay && (
        <div className="absolute inset-0 z-[999] flex flex-col items-center justify-center p-6 animate-fade-in overflow-hidden">
          {/* Background Blur & Overlay */}
          <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl"></div>

          {/* Content Container */}
          <div className="relative bg-gradient-to-b from-[#121620] to-[#0A0A0A] border border-amber-500/20 w-full max-w-sm rounded-[3rem] p-8 text-center space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-breathe">

            {/* Top Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber-500 rounded-b-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>

            {/* Success Icon / Image */}
            <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 w-full h-full rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] border-4 border-[#121620]">
                <CheckCircle size={56} className="text-[#0A0A0A]" />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">Livraison Réussie</h2>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Merci pour votre confiance</p>
            </div>

            {/* Message */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-inner">
              <p className="text-xs font-bold text-slate-300 leading-relaxed text-center">
                Votre commande a été livrée avec succès. Nous espérons que ce repas sera à la hauteur de vos attentes. <br/><br/><span className="text-amber-500 font-black text-sm">Bon appétit ! 🦅</span>
              </p>
            </div>

            {/* Action Button */}
            <button onClick={resetEcosystemFlow} className="w-full bg-white text-slate-950 hover:bg-amber-500 hover:text-slate-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-[0_10px_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
              <Home size={16} /> Accueil Eagle.tn
            </button>
          </div>
        </div>
      )}

      {/* [1] SPLASH SCREEN */}
      {appView === 'splash' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0f12] via-[#050608] to-[#000000] z-50 flex flex-col items-center justify-center p-6 select-none animate-fade-in">
          <div className="relative w-full max-w-xs h-80 flex items-center justify-center mb-2 animate-breathe">
            <img src="/eagle-bg.png" alt="Eagle TN logo master" className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(239,68,68,0.25)]" />
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 shadow-[0_0_15px_rgba(239,68,68,0.4)] px-6 py-2.5 rounded-full border border-white/20 mb-4 animate-pulse">
            <span className="text-base">🦅</span>
            <span className="text-xs font-black tracking-[0.2em] text-white uppercase font-sans">WELCOME TO EAGLE.TN</span>
            <span className="text-base">🇹🇳</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white font-sans">Eagle<span className="text-red-500">.tn</span></h1>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">G R O U P E</p>
          <div className="pt-6 w-full max-w-xs space-y-3">
            <button onClick={() => setAppView('login')} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl shadow-xl transform active:scale-95 transition-transform">COMMANDER MAINTENANT</button>
          </div>
        </div>
      )}

      {/* [2] LOGIN PORTAL */}
      {appView === 'login' && (
        <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col justify-center p-6 z-40">
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] w-full max-w-sm mx-auto space-y-6">
            {showProLogin ? (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center"><h3 className="text-white font-black uppercase tracking-widest text-sm">Zone Souveraine</h3></div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Professionnel *" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe *" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none" />
                <button onClick={async () => {
                  if(email === 'admin@eagle.tn' && password === '123') { setAppView('admin_dashboard'); return; }
                  if(email.includes('partner') && password === '123') { setAppView('partner_dashboard'); return; }
                  if(email.includes('livreur') && password === '123') { setAppView('livreur_dashboard'); return; }
                }} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Terminal</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center" onClick={handleSecretClick}><h3 className="text-white font-black uppercase tracking-widest text-sm">Espace Client</h3></div>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nom et Prénom *" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Numéro de Téléphone (8 chiffres) *" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none" />
                <button onClick={() => { 
                  if(!fullName || !phone) return showToast("Champs requis", "error"); 
                  if(!isValidTunisianPhone(phone)) return showToast("Le numéro doit comporter 8 chiffres", "error");
                  setAppView('hub'); 
                }} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Accéder</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* [3] SUPER APP ECOSYSTEM (HUB) */}
      {appView === 'hub' && (
        <div className="p-5 space-y-6 animate-fade-in pt-8 pb-32">
          {fullName && (
            <div className="mb-2">
              <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">{getSovereignSalutation()}, {fullName ? fullName.split(' ')[0] : ''}</span>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Espaces & Services</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">L'EXCELLENCE À PORTÉE DE MAIN.</p>
            </div>
            <span className="text-red-500 bg-red-50 p-2.5 rounded-[1rem] shadow-sm border border-red-100 flex items-center justify-center animate-pulse">
              <Star size={20} className="fill-red-500" />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => handleLoadStoreType('restaurant')} className="relative h-40 rounded-[2rem] overflow-hidden cursor-pointer shadow-md border border-slate-100 group transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" alt="Resto" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">🏪 Restaurant</span>
            </div>
            <div onClick={() => handleLoadStoreType('patisserie')} className="relative h-40 rounded-[2rem] overflow-hidden cursor-pointer shadow-md border border-slate-100 group transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80" alt="Pâtisserie" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">🧁 Pâtisserie</span>
            </div>
            <div onClick={() => handleLoadStoreType('para')} className="relative h-40 rounded-[2rem] overflow-hidden cursor-pointer shadow-md border border-slate-100 group transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80" alt="Para" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">🧴 Para-Bien-être</span>
            </div>
            <div onClick={() => handleLoadStoreType('boutique')} className="relative h-40 rounded-[2rem] overflow-hidden cursor-pointer shadow-md border border-slate-100 group transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80" alt="Boutique" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">🛍️ Boutique</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div onClick={() => setActiveModal('partenaire')} className="bg-slate-900 text-white p-5 rounded-[2rem] flex justify-between items-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]">
              <div><h4 className="text-xs font-black uppercase tracking-wider">Devenir Partenaire</h4></div><Store size={18} className="text-red-500" />
            </div>
            <div onClick={() => setActiveModal('livreur')} className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-[2rem] flex justify-between items-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]">
              <div><h4 className="text-xs font-black uppercase tracking-wider">Devenir Coursier</h4></div><Bike size={18} className="text-white" />
            </div>
            <div onClick={() => setActiveModal('contact')} className="bg-white border border-slate-200 p-5 rounded-[2rem] flex items-center justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-slate-50">
              <span className="text-xs font-black uppercase text-slate-800">Contactez-nous 📞</span><ChevronRight size={14} className="text-slate-400" />
            </div>
            <div className="text-center pt-4">
              <button onClick={() => setActiveModal('legal')} className="text-[11px] font-black text-red-600/80 hover:text-red-600 underline uppercase tracking-wider transition-colors"> Conditions Générales & INPDP ⚖️</button>
            </div>
          </div>
          
          <div className="text-center pt-8 pb-4 text-[10px] text-slate-400 font-medium font-sans border-t border-slate-100/60">
            © 2026 Eagle.tn. Tous droits réservés. Déposé auprès de l'OTDAV.
          </div>
        </div>
      )}

      {/* [4] STORES LIST */}
      {appView === 'stores_list' && (
        <div className="p-4 space-y-4 max-w-md mx-auto pb-24 animate-fade-in">
          <button onClick={() => setAppView('hub')} className="text-slate-400 text-sm font-black mb-4 flex items-center gap-1"><ArrowRight className="rotate-180" size={16} /> Retour</button>
          {stores.map(store => (
            <div key={store.id} onClick={() => handleSelectStore(store)} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex justify-between items-center cursor-pointer mb-4 shadow-sm hover:border-red-200 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="relative w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border text-3xl overflow-hidden shadow-inner">
                  <span>🏪</span>
                  {store.logo_url && <img src={store.logo_url} alt="Logo" className="absolute inset-0 w-full h-full object-cover z-10" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">{store.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{store.store_type}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
          ))}
        </div>
      )}

      {/* [5] MENU SECTION */}
      {appView === 'menu' && selectedStore && (
        <div className="pb-32 max-w-md mx-auto animate-fade-in select-none">
          <div className="relative h-44 w-full bg-slate-900 rounded-b-[2.5rem] overflow-hidden shadow-md">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            <div className="absolute top-5 left-4 right-4 flex justify-between items-center z-10">
              <button onClick={() => setAppView('stores_list')} className="bg-white/20 p-2 rounded-xl text-white backdrop-blur-sm transition-transform active:scale-95"><ArrowRight className="rotate-180" size={20} /></button>
              <div onClick={() => setAppView('cart')} className="bg-white/90 p-2.5 rounded-xl cursor-pointer shadow-sm transition-transform active:scale-95"><ShoppingBag size={18} /></div>
            </div>
            
            <div className="absolute bottom-4 left-6 right-6 z-10 flex justify-between items-end">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white flex items-center gap-1.5 leading-none">
                  {selectedStore.name} 
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">Vérifié</span>
                </h2>
                <p className="text-[10px] text-slate-300 font-bold flex items-center gap-1 mt-1.5"><MapPin size={11} className="text-red-500"/> Cité Ibn Khaldoun, Tunis</p>
                <p className="text-[9px] text-slate-400 font-medium font-mono flex items-center gap-1">Horaires: 00:00 - 00:00 • <span className="text-amber-500 font-black flex items-center"><Star size={10} fill="currentColor" className="mr-0.5"/>Top 7</span></p>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${selectedStore.is_open ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                {selectedStore.is_open ? 'Ouvert' : 'Fermé'}
              </div>
            </div>
          </div>

          <div className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-xl z-30 py-4 px-2 border-b border-slate-100">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {['TOUS', 'PLAT', 'SANDWICH', 'BOISSON'].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="p-4 grid grid-cols-2 gap-4">
            {filteredProducts.map(p => {
              const qty = cart[p.id] || 0;
              return (
                <div key={p.id} className="bg-white rounded-[2rem] p-3 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:scale-[1.03] hover:shadow-md">
                  <div className="h-24 w-full bg-slate-50 rounded-[1.5rem] overflow-hidden mb-2 relative flex items-center justify-center text-3xl">
                    {p.image_url ? <img src={p.image_url} className="absolute inset-0 w-full h-full object-cover" /> : "🍲"}
                  </div>
                  <h3 className="font-black text-xs text-slate-800 leading-tight mb-1">{p.name_fr || p.name || 'Plat sans nom'}</h3>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-50">
                    <span className="font-black text-xs text-yellow-600 font-mono">{Number(p.price || 0).toFixed(3)} <span className="text-[8px] font-black text-slate-400">DT</span></span>
                    
                    {qty > 0 ? (
                      <div className="flex items-center gap-1.5 bg-slate-100 px-1.5 py-1 rounded-full animate-fade-in border border-slate-200/50">
                        <button onClick={(e) => { e.stopPropagation(); removeFromCart(p.id); }} className="bg-white text-slate-900 w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors">-</button>
                        <span className="text-xs font-mono font-black text-slate-800 px-0.5">{qty}</span>
                        <button onClick={(e) => { e.stopPropagation(); addToCart(p.id); }} className="bg-white text-slate-900 w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shadow-sm flex items-center justify-center">+</button>
                      </div>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); addToCart(p.id); }} className="bg-slate-900 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-sm">
                        Ajouter
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {totalItems > 0 && <button onClick={() => setAppView('cart')} className="fixed bottom-24 left-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-2xl font-black text-xs uppercase shadow-lg text-center z-30 transform active:scale-95 transition-transform tracking-widest font-sans">Voir Panier ({totalPrice.toFixed(3)} DT)</button>}
        </div>
      )}

      {/* [6] CART & CHECKOUT */}
      {appView === 'cart' && (
        <div className="p-4 space-y-5 pb-32 max-w-md mx-auto animate-fade-in select-text">
          <button onClick={() => setAppView('menu')} className="text-slate-400 text-sm font-black flex items-center gap-1 transition-transform active:scale-95"><ArrowRight className="rotate-180" size={16} /> Retour</button>
          
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b pb-2 border-slate-50"><User size={14} className="text-red-500"/> Details de Livraison</h3>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nom et Prénom *" className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border border-slate-100 focus:outline-none focus:border-red-300" />
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Numéro de Téléphone (8 chiffres) *" className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border border-slate-100 focus:outline-none focus:border-red-300" />
            
            <button onClick={triggerLocationRequest} className="w-full bg-emerald-50 border border-emerald-100 text-emerald-600 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-98">localisation automatique</button>
            <input type="text" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} placeholder="Zone text (Ex: Cité Nacer)..." className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border border-slate-100 focus:outline-none focus:border-red-300" />
            
            <input type="text" value={clientNote} onChange={e => setClientNote(e.target.value)} placeholder="Note client ou remarques pour la livraison..." className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border border-slate-100 focus:outline-none focus:border-red-300" />
          </div>

          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b pb-2 mb-3">Récapitulatif du panier</h3>
            <div className="space-y-3">
              {Object.entries(cart).map(([id, qty]) => {
                const p = products.find(prod => String(prod.id) === id);
                if (!p) return null;
                return (
                  <div key={id} className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="space-y-0.5">
                      <p className="font-black text-slate-800">{qty}x {p.name_fr || p.name || 'Article'}</p>
                      <p className="font-mono text-[10px] text-red-600">{(Number(p.price || 0) * qty).toFixed(3)} DT</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(p.id)} className="bg-white border text-slate-900 w-6 h-6 rounded-full font-black text-center text-xs shadow-sm flex items-center justify-center">-</button>
                      <span className="text-xs font-mono font-black text-slate-800 px-0.5">{qty}</span>
                      <button onClick={() => addToCart(p.id)} className="bg-white border text-slate-900 w-6 h-6 rounded-full font-black text-center text-xs shadow-sm flex items-center justify-center">+</button>
                      <button onClick={() => deleteFromCart(p.id)} className="text-red-400 hover:text-red-500 p-1 transition-colors ml-1"><Trash2 size={15}/></button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-4 space-y-2 font-sans border-t border-slate-100 mt-3 text-xs">
              <div className="flex justify-between text-slate-600"><span>Frais de livraison (km: {distanceInKm.toFixed(1)})</span><span className="font-bold text-slate-800">{dynamicDeliveryFee.toFixed(3)} DT</span></div>
              <div className="flex justify-between text-slate-600"><span>Sous-total</span><span className="font-mono text-slate-800">{subtotal.toFixed(3)} DT</span></div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-dashed"><span className="uppercase text-red-600">TOTAL FACTURÉ:</span><span className="text-emerald-600 font-sans font-black text-lg">{totalPrice.toFixed(3)} DT</span></div>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 bg-amber-50/40 border border-amber-500/20 rounded-2xl cursor-pointer select-none">
            <input type="checkbox" checked={legalAccepted} onChange={e => setLegalAccepted(e.target.checked)} className="mt-1 accent-red-600 w-4 h-4 shrink-0" />
            <div className="space-y-1 text-right flex-1" dir="rtl">
              <p className="text-[10px] font-black uppercase text-red-600 flex items-center gap-1 justify-end"><ShieldAlert size={12}/> تنبيه: نسخة تجريبية وحماية المعطيات الشخصية (INPDP)</p>
              <p className="font-bold text-[9px] text-slate-600 leading-relaxed text-justify">
                "أوافق على تتبع مسار الشحنة لضمان سرعة الوصول ونفي النزاعات التشغيلية. يحق لي إلغاء الطلب مجاناً في غضون 5 دقائق فقط من التأكيد وقبل بدء المأمورية الفعلية. المنصة تخلي مسؤوليتها الجنائية والمدنية تماماً عن الأعطال الفنية وانقطاع الإنترنت وتضع العبء القانوني على عاتق الناقل الفعلي."
              </p>
            </div>
          </label>
          <button onClick={handleConfirmOrder} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transform active:scale-95 transition-transform font-sans text-xs">CONFIRMER LA COMMANDE</button>
        </div>
      )}

      {/* [7] TRACKING PLATFORM - التتبع اللحظي المؤتمت الذكي مع إخفاء الكارت */}
      {appView === 'tracking' && (
        <div className="p-4 space-y-4 max-w-md mx-auto pb-32 animate-fade-in">
          <div className="bg-[#121824] text-white p-6 rounded-[2.5rem] text-center space-y-4 shadow-2xl border border-slate-800 relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-[11px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2"><ShieldCheck size={16}/> VÉRIFICATION SÉCURISÉE</h3>
              <span className="text-[9px] bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-full uppercase font-black border border-[#10b981]/20 flex items-center gap-1"><RefreshCw size={10} className="animate-spin"/> Actualisé</span>
            </div>

            <div className="bg-black/30 border border-white/5 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Suivi d'état en direct</span>
              <p className="text-xs font-black text-amber-500 tracking-wide animate-pulse">{getTrackingStatusText(currentOrderStatus)}</p>
            </div>

            {currentOrderStatus === 'prete' && clientCancelTimer > 0 && (
              <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Annulation gratuite possible</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-500 animate-pulse">{formatTimeMinutes(clientCancelTimer)}</span>
                  <button onClick={handleClientCancellation} className="bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Annuler</button>
                </div>
              </div>
            )}

            {!showSecretCode ? (
              <button onClick={() => setShowSecretCode(true)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-black uppercase tracking-wider hover:bg-white/10 transition-colors">
                <Lock size={28} className="text-red-500 mb-1"/>
                Afficher le Code Secret (PIN / QR)
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white p-4 rounded-3xl flex justify-center border-2 border-red-500 max-w-[180px] mx-auto shadow-lg">
                  <QRCodeSVG value={`eagle://order-verify/${currentOrderId}/${orderPinCode}`} size={140} />
                </div>
                <span className="text-4xl font-mono tracking-[0.4em] font-black text-red-500 block">{orderPinCode}</span>
                <button onClick={() => setShowSecretCode(false)} className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center justify-center w-full gap-1 pt-2 hover:text-slate-300"><Lock size={12}/> Masquer</button>
              </div>
            )}
          </div>

          <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100 h-52 overflow-hidden relative group">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${clientLng-0.01},${clientLat-0.01},${clientLng+0.01},${clientLat+0.01}&layer=mapnik&marker=${clientLat},${clientLng}`}
              width="100%" height="100%" style={{ border: 0, borderRadius: '2rem' }} loading="lazy"
            ></iframe>
          </div>

          {/* ظهور ذكي لبطاقة السائق فقط عندما يقبل الطلب */}
          {['accepted_livreur', 'route', 'delivered'].includes(currentOrderStatus?.toLowerCase()) ? (
            <div className="bg-white border p-5 rounded-[2.5rem] shadow-sm flex flex-col gap-4 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#121824] rounded-2xl flex items-center justify-center text-red-500 shrink-0 shadow-sm"><span>🛵</span></div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">COURSIER ASSIGNÉ</span>
                    <h4 className="font-black text-sm text-slate-900">{driverInfo.name}</h4>
                  </div>
                </div>
                <div className="bg-red-50 px-2.5 py-1 rounded-xl flex items-center gap-0.5 border border-red-100 text-red-600 font-black text-xs">
                  <span>{driverInfo.rating}</span> <span>★</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 font-sans">
                <a href={`tel:${driverInfo.phone}`} className="flex items-center justify-center gap-2 bg-[#121824] text-white py-3.5 rounded-2xl text-[10px] font-black uppercase transition-transform active:scale-95">Appeler</a>
                <a href={`https://wa.me/${driverInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#10b981] text-white py-3.5 rounded-2xl text-[10px] font-black uppercase shadow-sm transition-transform active:scale-95">WhatsApp</a>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 border border-dashed border-slate-300 p-6 rounded-[2.5rem] text-center animate-pulse">
              <span className="text-3xl block mb-2 opacity-50">🦅</span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recherche d'un aigle disponible...</p>
            </div>
          )}
        </div>
      )}

      {/* [8] PROFILE SECTION */}
      {appView === 'profile' && (
        <div className="p-6 space-y-6 max-w-md mx-auto pb-24 animate-fade-in">
          <div className="text-center space-y-2 pt-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center border-2 border-red-500 shadow-md">
              <User size={36} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{fullName || "Compte Client"}</h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest">{phone || "Numéro non enregistré"}</p>
          </div>

          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Adresse de livraison</span>
              <MapPin size={16} className="text-red-500" />
            </div>
            <p className="text-xs font-bold text-slate-500">{deliveryAddress || "Aucune adresse enregistrée"}</p>
          </div>

          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-colors">Déconnexion</button>
        </div>
      )}

      {/* 🧭 NAV BAR 3D PREMIUM (Émojis & sans texte) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center py-4 z-40 px-6 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-safe">
        <button onClick={() => setAppView('hub')} className={`p-2 transition-all duration-300 ${appView === 'hub' || appView === 'stores_list' || appView === 'menu' || appView === 'cart' ? 'scale-125 filter drop-shadow-[0_2px_5px_rgba(239,68,68,0.4)] opacity-100' : 'opacity-50 hover:opacity-80'}`}>
          <span className="text-3xl">🏠</span>
        </button>
        <button onClick={() => { if(currentOrderId) setAppView('tracking'); else showToast("Aucune commande active", "info"); }} className={`p-2 transition-all duration-300 ${appView === 'tracking' ? 'scale-125 filter drop-shadow-[0_2px_5px_rgba(239,68,68,0.4)] opacity-100' : 'opacity-50 hover:opacity-80'}`}>
          <span className="text-3xl">🛵</span>
        </button>
        <button onClick={() => setAppView('profile')} className={`p-2 transition-all duration-300 ${appView === 'profile' ? 'scale-125 filter drop-shadow-[0_2px_5px_rgba(239,68,68,0.4)] opacity-100' : 'opacity-50 hover:opacity-80'}`}>
          <span className="text-3xl">👤</span>
        </button>
      </div>
    </div>
  );
}
