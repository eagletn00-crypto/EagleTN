import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { ShoppingBag, MapPin, Clock, ShieldCheck, ArrowRight, Scale, CheckCircle2, LocateFixed, User, ClipboardList, Home, ChevronRight, Store, Bike, Phone, Utensils, Star, Trash2, QrCode, ShieldAlert, RefreshCw, XCircle, Percent, Sparkles, HeartPulse, Shirt, MessageSquare, Eye, EyeOff, Megaphone } from 'lucide-react';
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

const formatTimeMinutes = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
  const [showPassword, setShowPassword] = useState(false);

  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  
  const [selectedCategory, setSelectedCategory] = useState('TOUS');
  const categoriesList = ['TOUS', 'PLAT', 'SANDWICH', 'BOISSON', 'SUPPLÉMENT'];

  const [fullName, setFullName] = useState(() => localStorage.getItem('eagle_name') || '');
  const [phone, setPhone] = useState(() => localStorage.getItem('eagle_phone') || '');
  const [deliveryAddress, setDeliveryAddress] = useState(() => localStorage.getItem('eagle_address') || '');
  const [clientNote, setClientNote] = useState('');

  const [clientLat, setClientLat] = useState<number>(36.8065);
  const [clientLng, setClientLng] = useState<number>(10.1815);
  
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showSecretCode, setShowSecretCode] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [currentOrderStatus, setCurrentOrderStatus] = useState<string>('');
  const [orderPinCode, setOrderPinCode] = useState<string>('----');
  
  const [restaurantVerificationTimer, setRestaurantVerificationTimer] = useState<number>(60); 
  const [clientCancelTimer, setClientCancelTimer] = useState<number>(300); 

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [driverInfo, setDriverInfo] = useState({
    name: "Aigle Livreur 🛵",
    rating: "4.9",
    phone: "21658050693",
    whatsapp: "21658050693",
    note: "Coursier indépendant certifié CNSS & Assurance"
  });

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'info' });
  const [showGoogleDisclosure, setShowGoogleDisclosure] = useState(false);

  const storeLat = Number(selectedStore?.lat) || 36.8120;
  const storeLng = Number(selectedStore?.lng) || 10.1800;
  const BASE_FEE = 2.000;
  const PRICE_PER_KM = 0.800;
  const distanceInKm = calculateDistance(storeLat, storeLng, clientLat, clientLng);
  const dynamicDeliveryFee = Number((BASE_FEE + (distanceInKm * PRICE_PER_KM)).toFixed(3));

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
    if (appView === 'splash') {
      audioRef.current = new Audio('/eagle-scream.mp3');
      audioRef.current.volume = 0.7;
    }
  }, [appView]);

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
          if (restaurantVerificationTimer === 1) handleTimeoutCancellation();
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
      await supabase.from(targetTable).insert([{ name: formData.name, phone: formData.phone, type: formData.type || null, region: formData.region || null, note: formData.note }]);
      showToast("Dossier juridique transmis avec succès.", "success");
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
      const savedPhone = localStorage.getItem('eagle_phone');
      if (savedPhone) {
        const { data: activeOrder } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_phone', savedPhone)
          .in('status', ['confirmed', 'prete', 'accepted_livreur', 'route'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (activeOrder) {
          setCurrentOrderId(activeOrder.id);
          setCurrentOrderStatus(activeOrder.status);
          setOrderPinCode(activeOrder.pin_code);
          if (activeOrder.delivery_lat && activeOrder.delivery_lng) {
            setClientLat(activeOrder.delivery_lat); setClientLng(activeOrder.delivery_lng);
          }
          if (activeOrder.delivery_address) {
            const rawAddr = activeOrder.delivery_address;
            const parts = rawAddr.split('| Note:');
            setDeliveryAddress(parts[0].trim());
            if(parts.length > 1) setClientNote(parts[1].trim());
          }
          setAppView('tracking');
          return;
        }
      }
      if (appView === 'splash') setTimeout(() => setAppView('login'), 3500);
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

  const handleLoadStoreType = async (type: string, isAvailable: boolean) => {
    if (!isAvailable) {
      showToast(`Espace ${type.toUpperCase()} bientôt disponible ! 🦅 À bientôt.`, "info");
      return;
    }
    setStores([]); 
    setAppView('stores_list');
    const { data, error } = await supabase.from('restaurants').select('*');
    if (!error && data) setStores(data);
  };

  const handleSelectStore = async (store: any) => {
    if (String(store.id) !== '1') {
      showToast("Ce partenaire sera bientôt disponible. À bientôt ! 🦅", "info");
      return;
    }
    if (store.is_open === false) return showToast("Ce partenaire est actuellement fermé", "error");
    
    setSelectedStore(store);
    try {
      const { data } = await supabase.from('products').select('*').eq('restaurant_id', store.id).order('id', { ascending: false });
      if (data) setProducts(data);
      setAppView('menu');
    } catch (_e) { showToast("Erreur de chargement", "error"); }
  };

  const getProductPrice = (p: any) => p.is_promo && p.promo_price ? Number(p.promo_price) : Number(p.price || 0);

  const addToCart = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart(prev => { const updated = { ...prev }; if (updated[id] > 1) updated[id]--; else delete updated[id]; return updated; });
  const deleteFromCart = (id: string) => setCart(prev => { const updated = { ...prev }; delete updated[id]; return updated; }); 

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => { const p = products.find(prod => String(prod.id) === id); return sum + (p ? getProductPrice(p) * qty : 0); }, 0);
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
          const cleanAddress = data.address?.neighbourhood || data.address?.suburb || data.address?.city || '';
          setDeliveryAddress(`${cleanAddress ? cleanAddress + ', ' : ''}Tunis`);
          showToast("Position synchronisée !", "success");
        } catch (_err) { setDeliveryAddress(``); } 
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
      showToast("Commande annulée.", "info");
      resetEcosystemFlow();
    }
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting) return; 
    if (!fullName || !phone || !deliveryAddress || !legalAccepted || totalItems === 0) return showToast("Veuillez remplir tous les champs et accepter les conditions", "error");
    if (!isValidTunisianPhone(phone)) return showToast("Le numéro doit comporter 8 chiffres", "error");

    setIsSubmitting(true);
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const itemsArrayPayload = Object.entries(cart).map(([id, qty]) => { 
      const p = products.find(prod => String(prod.id) === id); 
      return { id, name: p?.name_fr || p?.name || 'Article', price: getProductPrice(p), quantity: qty }; 
    });
    
    try {
      const finalDeliveryAddress = clientNote ? `${deliveryAddress} | Note: ${clientNote}` : deliveryAddress;
      const { data, error } = await supabase.from('orders').insert([{ customer_name: fullName, customer_phone: phone, delivery_address: finalDeliveryAddress, items: itemsArrayPayload, total_price: totalPrice, status: 'confirmed', pin_code: generatedPin, delivery_lat: clientLat, delivery_lng: clientLng }]).select();
      
      if (!error && data && data.length > 0) { 
        setOrderPinCode(generatedPin); setCurrentOrderId(data[0].id); setCurrentOrderStatus('confirmed'); 
        setRestaurantVerificationTimer(60); setClientCancelTimer(300); setAppView('tracking'); 
      } else { showToast("Échec d'enregistrement.", "error"); }
    } catch (_err) { showToast("Erreur réseau", "error"); } finally { setIsSubmitting(false); }
  };

  const resetEcosystemFlow = () => { setShowSuccessOverlay(false); setCart({}); setCurrentOrderId(null); setCurrentOrderStatus(''); setAppView('hub'); };

  const handleSplashClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setAppView('login');
  };

  const filteredProducts = selectedCategory === 'TOUS' 
    ? products.filter(p => p.restaurant_id === selectedStore?.id)
    : products.filter(p => p.restaurant_id === selectedStore?.id && p.category?.toUpperCase() === selectedCategory.toUpperCase());

  if (appView === 'partner_dashboard') return <PartnerDashboard onLogout={() => setAppView('login')} />;
  if (appView === 'livreur_dashboard') return <LivreurDashboard onLogout={() => setAppView('login')} />;
  if (appView === 'admin_dashboard') return <SuperAdminDashboard onLogout={() => setAppView('login')} />;

  return (
    <div className="h-screen w-screen bg-[#FDFBF7] text-slate-900 font-sans overflow-x-hidden overflow-y-auto max-w-md mx-auto relative shadow-2xl pb-24 border-x border-slate-100">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { display: inline-block; white-space: nowrap; animation: marquee 15s linear infinite; }
        
        ::-webkit-scrollbar { display: none; }
      `}} />

      {toast.show && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl flex items-center gap-2 shadow-2xl border border-white/10 w-11/12 max-w-sm bg-slate-900 text-white animate-fade-in">
          <p className="text-[11px] font-black tracking-widest truncate">{toast.message}</p>
        </div>
      )}

      {/* 🛑 MODAL DISCLOSURE GPS - FIXED */}
      {showGoogleDisclosure && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] text-center max-w-sm shadow-2xl space-y-4 border-t-4 border-amber-500 animate-fade-in">
            <ShieldCheck size={40} className="text-amber-500 mx-auto" />
            <h2 className="text-lg font-black uppercase">Autorisation GPS</h2>
            <p className="text-xs text-slate-600 font-bold leading-relaxed text-justify" dir="ltr">
              L'application requiert l'accès à votre localisation pour optimiser l'acheminement de la commande. Conformément à la loi INPDP. Acceptez-vous ?
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowGoogleDisclosure(false)} className="flex-1 bg-slate-100 py-3 rounded-xl font-black text-[10px] uppercase transition-all active:scale-95">Refuser</button>
              <button onClick={() => { localStorage.setItem('eagle_gps_accepted', 'true'); executeLocationFetch(); }} className="flex-1 bg-amber-500 text-slate-950 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95">Accepter</button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 WINDOW SYSTEM MODALS - FIXED Z-INDEX & TEXT */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setActiveModal('none')}>
          <div className="bg-[#121620] border border-white/10 w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl relative flex flex-col max-h-[90%] animate-fade-in text-white" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveModal('none')} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-slate-300 z-10 transition-colors"><XCircle size={18} /></button>

            {activeModal === 'legal' ? (
              <div className="space-y-4 text-left overflow-y-auto pr-1 pt-4 pb-6 font-sans">
                <div className="flex items-center justify-start gap-2 text-amber-500 mb-4 border-b border-white/10 pb-3">
                  <Scale size={24} /> <h3 className="text-lg font-black uppercase tracking-widest">Légal & INPDP 2026</h3>
                </div>
                <div className="space-y-4 text-xs leading-relaxed text-justify text-slate-300">
                  <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                    <h4 className="text-xs font-black text-white uppercase mb-2">1. Partenaire Technologique</h4>
                    <p>Eagle.tn agit en tant que partenaire technologique d'élite. Nous garantissons un traçage précis, tandis que l'exécution logistique et la sécurité routière sont assurées par nos coursiers indépendants certifiés.</p>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                    <h4 className="text-xs font-black text-white uppercase mb-2">2. Droits d'auteur</h4>
                    <p>L'ensemble du code, logos, et charte graphique sont la propriété exclusive d'Eagle.tn. Toute reproduction est passible de poursuites judiciaires.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 overflow-y-auto pt-4 pr-1">
                <div className="border-b border-white/10 pb-3 mb-2">
                  <h3 className="text-xl font-black text-white uppercase">
                    {activeModal === 'partenaire' && 'Devenir Partenaire'}
                    {activeModal === 'livreur' && 'Devenir Coursier'}
                    {activeModal === 'contact' && 'Contactez-nous'}
                  </h3>
                </div>
                
                {activeModal === 'livreur' && (
                  <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl text-[10px] text-slate-300 leading-relaxed text-left font-medium mb-4">
                    <p className="text-amber-500 font-black mb-1 uppercase">Contrat B2B & CNSS :</p>
                    <p>En tant que prestataire indépendant, j'assume mes obligations fiscales et d'affiliation à la CNSS. Eagle.tn agit comme intermédiaire technologique.</p>
                  </div>
                )}
                {activeModal === 'partenaire' && (
                  <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl text-[10px] text-slate-300 leading-relaxed text-left font-medium mb-4">
                    <p className="text-amber-500 font-black mb-1 uppercase">Conformité Fiscale :</p>
                    <p>Le partenaire certifie posséder toutes les autorisations (Patente) et assume l'entière responsabilité sanitaire et fiscale de ses produits.</p>
                  </div>
                )}

                <input type="text" required placeholder="Nom et Prénom *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-amber-500/50" />
                <input type="tel" required placeholder="Numéro (8 chiffres) *" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-amber-500/50" />
                {activeModal === 'partenaire' && <input type="text" placeholder="Type d'activité (Ex: Restaurant)" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-amber-500/50" />}
                <textarea placeholder="Observations..." value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white h-20 resize-none focus:outline-none focus:border-amber-500/50" />
                
                {activeModal !== 'contact' && (
                  <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer select-none">
                    <input type="checkbox" required checked={formData.agreed} onChange={e => setFormData({ ...formData, agreed: e.target.checked })} className="mt-0.5 accent-amber-500 w-4 h-4 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-300 text-left">J'accepte strictement les conditions légales et réglementaires.</span>
                  </label>
                )}
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-transform">Soumettre le dossier</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 🦅 شاشة الشكر والنجاح الذهبية الفاخرة - FIXED */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 animate-fade-in overflow-hidden">
          <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl"></div>
          <div className="relative bg-gradient-to-b from-[#121620] to-[#0A0A0A] border border-amber-500/20 w-full max-w-sm rounded-[3rem] p-8 text-center space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-breathe">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber-500 rounded-b-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">✓</div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">Mission Accomplie !</h2>
              <p className="text-amber-500 font-black text-xs uppercase tracking-wider">Livraison Réussie</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-inner">
              <p className="text-[11px] font-bold text-slate-300 leading-relaxed text-center">
                Merci pour votre confiance. Nous espérons que la qualité de notre service a été à la hauteur de vos attentes.
              </p>
              <p className="font-mono text-[9px] text-slate-500 text-center border-t border-white/5 pt-2 mt-2 uppercase tracking-wider">
                Votre satisfaction est notre priorité.
              </p>
            </div>
            <button onClick={resetEcosystemFlow} className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-md shadow-amber-500/10">
              ACCUEIL
            </button>
          </div>
        </div>
      )}

      {/* [1] SPLASH SCREEN */}
      {appView === 'splash' && (
        <div 
          onClick={handleSplashClick}
          className="absolute inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center p-6 select-none animate-fade-in cursor-pointer"
        >
          <div className="absolute inset-0 opacity-80 mix-blend-screen pointer-events-none">
             <img src="/eagle-bg.png" alt="Eagle TN" className="w-full h-full object-cover object-center" />
          </div>
          <div className="absolute bottom-[20%] flex flex-col items-center w-full max-w-xs z-10">
            <h1 className="text-6xl font-black tracking-tighter text-white font-sans drop-shadow-2xl">
              <span className="text-[#FCD34D]">EAGLE</span><span className="text-red-600">.TN</span>
            </h1>
            <div className="flex items-center gap-0 w-full max-w-[200px] mt-2 h-[2px]">
               <div className="h-full bg-red-600 flex-[2]"></div>
               <div className="h-full bg-white flex-[1]"></div>
               <div className="h-full bg-gray-500 flex-[3]"></div>
            </div>
            <p className="text-slate-300 text-[11px] font-black uppercase tracking-[0.2em] mt-8 text-center animate-fade-in" style={{animationDelay: '1s'}}>
              L'art de la livraison,<br/>redéfini.
            </p>
            <p className="text-amber-500/80 text-[10px] font-black mt-2 text-center animate-fade-in" style={{animationDelay: '1.5s'}} dir="rtl">
              فن التوصيل، برؤية جديدة.
            </p>
          </div>
        </div>
      )}

      {/* [2] LOGIN PORTAL */}
      {appView === 'login' && (
        <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col justify-center p-6 z-40">
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] w-full max-w-sm mx-auto space-y-6">
            {showProLogin ? (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center"><h3 className="text-white font-black uppercase tracking-widest text-xs">Terminal Pro</h3></div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Professionnel *" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-amber-500/50" />
                <div className="relative">
                   <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe *" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-amber-500/50" />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-500">{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                </div>
                <button onClick={async () => {
                  if(email === 'admin@eagle.tn' && password === '123') { setAppView('admin_dashboard'); return; }
                  if(password === '123') { localStorage.setItem('eagle_pro_email', email.trim().toLowerCase()); setAppView('partner_dashboard'); return; }
                  if(email.includes('livreur') && password === '123') { setAppView('livreur_dashboard'); return; }
                }} className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 shadow-lg">Connexion</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center" onClick={handleSecretClick}><h3 className="text-white font-black uppercase tracking-widest text-xs">Espace Client</h3></div>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nom et Prénom *" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-red-500/50" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Numéro (8 chiffres) *" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-red-500/50" />
                <button onClick={() => { 
                  if(!fullName || !phone) return showToast("Champs requis", "error"); 
                  if(!isValidTunisianPhone(phone)) return showToast("Numéro invalide", "error");
                  setAppView('hub'); 
                }} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 shadow-lg">Accéder</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* [3] HUB */}
      {appView === 'hub' && (
        <div className="pb-32 bg-[#FDFBF7] min-h-screen">
          <div className="bg-slate-900 text-white py-2 overflow-hidden relative shadow-md">
            <div className="animate-marquee">
              <span className="text-[10px] font-bold tracking-widest uppercase mx-4">
                🚀 Profitez d'une semaine d'essai gratuite sur le terrain ! Découvrez l'élite de la logistique tunisienne.
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase mx-4 text-amber-400" dir="rtl">
                🚀 استمتع بتجربة ميدانية مجانية لمدة أسبوع! اكتشف نخبة الخدمات اللوجستية في تونس.
              </span>
            </div>
          </div>

          <div className="p-5 space-y-6 pt-6">
            {fullName && (
              <div className="mb-2">
                <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 shadow-sm">{getSovereignSalutation()}, {fullName.split(' ')[0]}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Nos Services</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">L'EXCELLENCE TUNISIENNE.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => handleLoadStoreType('restaurant', true)} className="relative h-44 rounded-[2rem] overflow-hidden cursor-pointer shadow-md border border-slate-100 group transition-all duration-300 hover:shadow-lg active:scale-[0.98]">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" alt="Restaurant" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <span className="absolute bottom-4 left-4 text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5"><Utensils size={14} className="text-amber-400"/> Restaurants</span>
              </div>
              <div onClick={() => handleLoadStoreType('Pâtisserie Fine', false)} className="relative h-44 rounded-[2rem] overflow-hidden cursor-pointer shadow-md border border-slate-100 group transition-all duration-300 hover:shadow-lg active:scale-[0.98]">
                <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80" alt="Pâtisserie" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <span className="absolute bottom-4 left-4 text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5"><Sparkles size={14} className="text-amber-500"/> Pâtisserie Fine</span>
              </div>
              <div onClick={() => handleLoadStoreType('Santé & Beauté', false)} className="relative h-44 rounded-[2rem] overflow-hidden cursor-pointer shadow-md border border-slate-100 group transition-all duration-300 hover:shadow-lg active:scale-[0.98]">
                <img src="https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80" alt="Santé" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <span className="absolute bottom-4 left-4 text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5"><HeartPulse size={14} className="text-amber-500"/> Parapharmacie</span>
              </div>
              <div onClick={() => handleLoadStoreType('Mode & Accessoires', false)} className="relative h-44 rounded-[2rem] overflow-hidden cursor-pointer shadow-md border border-slate-100 group transition-all duration-300 hover:shadow-lg active:scale-[0.98]">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80" alt="Boutique" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <span className="absolute bottom-4 left-4 text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5"><Shirt size={14} className="text-amber-500"/> Mode & Boutique</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div onClick={() => setActiveModal('partenaire')} className="bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl flex justify-between items-center cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                <h4 className="text-xs font-black uppercase tracking-wider">Devenir Partenaire</h4><Store size={16} className="text-slate-400" />
              </div>
              <div onClick={() => setActiveModal('livreur')} className="bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl flex justify-between items-center cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                <h4 className="text-xs font-black uppercase tracking-wider">Devenir Coursier</h4><Bike size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* [4] STORES LIST */}
      {appView === 'stores_list' && (
        <div className="p-4 space-y-4 max-w-md mx-auto pb-24 animate-fade-in bg-[#FDFBF7]">
          <button onClick={() => setAppView('hub')} className="text-slate-500 font-black mb-4 flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"><ArrowRight className="rotate-180" size={16} /> Accueil</button>
          
          {stores.map(store => {
            const isAmAli = String(store.id) === '1';
            return (
              <div key={store.id} onClick={() => handleSelectStore(store)} className={`relative overflow-hidden bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col transition-all active:scale-[0.98] group cursor-pointer`}>
                <div className="flex gap-4 items-start z-10">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-inner shrink-0 text-3xl">
                    {store.logo_url ? <img src={store.logo_url} alt="Logo" className="absolute inset-0 w-full h-full object-cover z-20" /> : <span>🏪</span>}
                  </div>
                  <div className="space-y-1 w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-black tracking-tight text-slate-900">{store.name}</h3>
                      {!isAmAli && <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-200">À Bientôt</span>}
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">{store.category || "Cuisine"}</p>
                    
                    <div className="flex items-center gap-3 text-[10px] text-amber-500 font-bold pt-2 font-mono">
                      <span className="flex items-center gap-0.5"><Star size={12} fill="currentColor"/> 4.9 (245)</span>
                      <span className="flex items-center gap-0.5 text-slate-400"><Clock size={11}/> 20-35 min</span>
                    </div>
                  </div>
                </div>
                {isAmAli && <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors z-10" />}
              </div>
            );
          })}
        </div>
      )}

      {/* [5] MENU SECTION */}
      {appView === 'menu' && selectedStore && (
        <div className="pb-32 max-w-md mx-auto animate-fade-in select-none bg-[#FDFBF7] min-h-screen">
          <div className="relative h-44 w-full bg-slate-900 rounded-b-[2.5rem] overflow-hidden shadow-md">
            <img src={selectedStore.banner_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            <div className="absolute top-5 left-4 right-4 flex justify-between items-center z-10">
              <button onClick={() => setAppView('stores_list')} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl text-white backdrop-blur-sm transition-all"><ArrowRight className="rotate-180" size={20} /></button>
              <div onClick={() => setAppView('cart')} className="bg-white/90 hover:bg-white p-2.5 rounded-xl cursor-pointer shadow-sm relative">
                <ShoppingBag size={18} />
                {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">{totalItems}</span>}
              </div>
            </div>
            <div className="absolute bottom-4 left-6 z-10 right-4">
              <h2 className="text-2xl font-black text-white">{selectedStore.name}</h2>
            </div>
          </div>

          <div className="sticky top-0 bg-[#FDFBF7]/95 backdrop-blur-xl z-30 py-4 px-4 border-b border-slate-100">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categoriesList.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all shadow-sm ${selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 grid grid-cols-2 gap-4">
            {filteredProducts.map(p => {
              const qty = cart[p.id] || 0;
              return (
                <div key={p.id} className="bg-white rounded-[2rem] p-3 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[160px]">
                  <div className="h-24 w-full bg-slate-50 rounded-[1rem] overflow-hidden mb-2 relative flex items-center justify-center text-3xl">
                    {p.image_url ? <img src={p.image_url} className="absolute inset-0 w-full h-full object-cover" /> : "🍲"}
                  </div>
                  <h3 className="font-black text-xs text-slate-800 leading-tight mb-1">{p.name_fr || p.name}</h3>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-50">
                    <span className="font-black text-xs text-slate-900 font-mono">{getProductPrice(p).toFixed(3)} <span className="text-[8px] text-slate-400">DT</span></span>
                    {qty > 0 ? (
                      <div className="flex items-center gap-1.5 bg-slate-50 px-1 py-1 rounded-full border border-slate-200/50">
                        <button onClick={() => removeFromCart(p.id)} className="bg-white text-slate-900 w-5 h-5 rounded-full font-black text-center text-xs shadow-sm">-</button>
                        <span className="text-xs font-mono font-black">{qty}</span>
                        <button onClick={() => addToCart(p.id)} className="bg-white text-slate-900 w-5 h-5 rounded-full font-black text-center text-xs shadow-sm">+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(p.id)} className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider active:scale-95 transition-colors">Ajouter</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {totalItems > 0 && <button onClick={() => setAppView('cart')} className="fixed bottom-24 left-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-2xl font-black text-xs uppercase shadow-xl flex justify-between items-center px-6 z-30"><span>Voir Panier</span> <span className="font-mono">{totalPrice.toFixed(3)} DT</span></button>}
        </div>
      )}

      {/* [6] CART */}
      {appView === 'cart' && (
        <div className="p-4 space-y-5 pb-32 max-w-md mx-auto animate-fade-in bg-white min-h-screen">
          <button onClick={() => setAppView('menu')} className="text-slate-400 hover:text-slate-600 text-sm font-black flex items-center gap-1"><ArrowRight className="rotate-180" size={16} /> Retour</button>
          
          <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-2"><User size={14} className="text-red-500"/> Details de Livraison</h3>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nom et Prénom *" className="w-full bg-white p-4 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none focus:border-red-300" />
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Numéro de Téléphone (8 chiffres) *" className="w-full bg-white p-4 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none focus:border-red-300" />
            <button onClick={triggerLocationRequest} className="w-full bg-emerald-50 text-emerald-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider border border-emerald-100 flex justify-center items-center gap-2"><LocateFixed size={16}/> Localisation Automatique (GPS)</button>
            <input type="text" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} placeholder="Zone / Adresse détaillée... *" className="w-full bg-white p-4 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none focus:border-red-300" />
            <textarea value={clientNote} onChange={e => setClientNote(e.target.value)} placeholder="Note client pour le coursier..." className="w-full bg-white p-4 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none focus:border-red-300 h-20 resize-none" />
          </div>

          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b pb-2 mb-3">Récapitulatif</h3>
            <div className="space-y-2">
              {Object.entries(cart).map(([id, qty]) => {
                const p = products.find(prod => String(prod.id) === id);
                if (!p) return null;
                return (
                  <div key={id} className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{qty}x {p.name_fr || p.name}</p>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="font-bold">{(getProductPrice(p) * qty).toFixed(3)} DT</span>
                      <button onClick={() => deleteFromCart(p.id)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={14}/></button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-4 space-y-2 font-sans mt-4 text-xs">
              <div className="flex justify-between text-slate-500"><span>Frais de livraison</span><span className="font-mono text-slate-800">{dynamicDeliveryFee.toFixed(3)} DT</span></div>
              <div className="flex justify-between text-slate-500"><span>Sous-total</span><span className="font-mono text-slate-800">{subtotal.toFixed(3)} DT</span></div>
              <div className="flex justify-between text-base font-black text-slate-900 mt-3 bg-slate-100 p-4 rounded-xl border border-slate-200 items-center">
                 <span className="uppercase text-slate-800 text-[10px] tracking-widest">TOTAL FACTURÉ</span>
                 <span className="text-slate-900 font-sans font-black text-lg">{totalPrice.toFixed(3)} DT</span>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer select-none">
            <input type="checkbox" checked={legalAccepted} onChange={e => setLegalAccepted(e.target.checked)} className="mt-1 accent-slate-900 w-4 h-4 shrink-0" />
            <div className="space-y-1 text-left flex-1" dir="ltr">
              <p className="text-[10px] font-black uppercase text-slate-900 flex items-center gap-1 justify-start"><ShieldCheck size={12} className="text-emerald-500"/> Sécurité & Traçabilité (INPDP)</p>
              <p className="font-medium text-[9px] text-slate-500 leading-relaxed text-justify mt-1">
                Eagle.tn agit en tant que partenaire technologique d'élite. Nous garantissons un traçage précis, tandis que l'exécution logistique est assurée par nos coursiers indépendants. Droit de rétractation de 5 min applicable.
              </p>
            </div>
          </label>
          
          <button disabled={isSubmitting} onClick={handleConfirmOrder} className={`w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transform transition-all flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-75 scale-95 cursor-not-allowed' : 'active:scale-95'}`}>
            {isSubmitting ? <><RefreshCw size={16} className="animate-spin"/> TRAITEMENT...</> : 'CONFIRMER LA COMMANDE'}
          </button>
        </div>
      )}

      {/* [7] TRACKING PLATFORM - الأبيض السلس الفخم مع أزرار خطية وأيقونات عصرية */}
      {appView === 'tracking' && (
        <div className="min-h-screen w-full bg-[#FDFBF7] animate-fade-in pb-32 overflow-x-hidden">
          
          <div className="p-4 pt-6">
            <div className="h-48 w-full bg-slate-100 rounded-[2rem] overflow-hidden relative shadow-md border border-slate-200">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${clientLng-0.003},${clientLat-0.003},${clientLng+0.003},${clientLat+0.003}&layer=mapnik`}
                width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }} loading="lazy"
              ></iframe>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                 <span className="text-4xl animate-bounce drop-shadow-md">🦅</span>
                 <div className="w-6 h-6 bg-amber-500/30 rounded-full animate-ping absolute top-4"></div>
              </div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black text-slate-800 uppercase tracking-widest border border-slate-200 flex items-center gap-1.5 shadow-sm"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> GPS Live</div>
            </div>
          </div>

          <div className="px-4 flex justify-between items-center gap-3">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex-1 shadow-sm">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Statut</span>
              {currentOrderStatus === 'confirmed' && restaurantVerificationTimer > 0 && <p className="text-xs font-black text-amber-500 animate-pulse uppercase">Validation ({restaurantVerificationTimer}s)</p>}
              {currentOrderStatus === 'prete' && clientCancelTimer > 0 && <p className="text-xs font-black text-amber-500 uppercase">Prête</p>}
              {['accepted_livreur', 'route'].includes(currentOrderStatus) && <p className="text-xs font-black text-emerald-500 uppercase tracking-wider font-mono">En Logistique</p>}
            </div>
            {currentOrderStatus === 'prete' && clientCancelTimer > 0 && (
              <button onClick={handleClientCancellation} className="bg-red-50 text-red-500 font-black px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest border border-red-100 transition-all active:scale-95 flex flex-col items-center justify-center">
                <XCircle size={14} className="mb-0.5"/> <span>Annuler</span>
              </button>
            )}
          </div>

          <div className="p-4 mt-2">
             <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-md relative overflow-hidden flex flex-col items-center justify-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-50 pb-2">QR Code de Suivi</span>
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                   <QRCodeSVG value={`eagle://order-verify/${currentOrderId}/${orderPinCode}`} size={120} bgColor="#ffffff" fgColor="#0f172a" />
                </div>
                <p className="text-[10px] font-black text-slate-800 font-mono tracking-widest mt-4 uppercase">EGL-{orderPinCode}</p>
             </div>
          </div>

          {['accepted_livreur', 'route'].includes(currentOrderStatus) && (
            <div className="px-4 mb-4">
              <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl">🛵</div>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Coursier Partenaire</span>
                      <h4 className="font-black text-sm text-slate-800">{driverInfo.name}</h4>
                    </div>
                  </div>
                  <div className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100 font-black text-[10px]">{driverInfo.rating} ★</div>
                </div>

                <div className="grid grid-cols-2 gap-2 font-sans">
                  <a href={`tel:${driverInfo.phone}`} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-3 rounded-xl text-[10px] font-black uppercase text-center shadow-sm">Appeler</a>
                  <a href={`https://wa.me/${driverInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 py-3 rounded-xl text-[10px] font-black uppercase text-center shadow-sm">WhatsApp</a>
                </div>
              </div>
            </div>
          )}

          <div className="px-4">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-md">
              <div className="space-y-6 relative pl-2">
                <div className="absolute left-[11px] top-3 bottom-5 w-[2px] bg-slate-100 z-0"></div>

                {[
                  { key: 'confirmed', label: 'Commande envoyée', icon: '📝', desc: 'Attente du restaurant.' },
                  { key: 'prete', label: 'En préparation', icon: '👨‍🍳', desc: 'Traitement en cours.' },
                  { key: 'accepted_livreur', label: 'Livreur assigné', icon: '🤝', desc: 'Prise en charge logistique.' },
                  { key: 'route', label: 'En route vers vous', icon: '🛵', desc: 'Préparez votre code PIN.' },
                  { key: 'delivered', label: 'Livré 🎉', icon: '🎉', desc: 'Merci !' }
                ].map((step, idx) => {
                  const statesList = ['confirmed', 'prete', 'accepted_livreur', 'route', 'delivered'];
                  const isCurrent = currentOrderStatus === step.key;
                  const isPassed = statesList.indexOf(currentOrderStatus) >= idx;

                  return (
                    <div key={idx} className="flex gap-5 items-start relative z-10 animate-fade-in">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${isCurrent ? 'bg-amber-500 text-white border-amber-400 scale-125 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : isPassed ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-white text-slate-300 border-slate-100'}`}>{step.icon}</div>
                      <div className="flex-1 pb-1 pt-0.5">
                        <p className={`text-xs font-black uppercase tracking-wider ${isPassed ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                        {isCurrent && <p className="text-[9px] text-amber-500 font-bold mt-1 tracking-wide">{step.desc}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* شريط التنقل السفلي */}
      {appView !== 'splash' && appView !== 'login' && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around items-center py-4 z-40 px-6 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.03)] pb-safe">
          <button onClick={() => setAppView('hub')} className={`p-2 transition-all duration-300 relative flex flex-col items-center ${['hub', 'stores_list', 'menu', 'cart'].includes(appView) ? 'scale-110 text-slate-900 opacity-100' : 'opacity-40 text-slate-400'}`}>
            <Home size={22} strokeWidth={['hub', 'stores_list', 'menu', 'cart'].includes(appView) ? 2.5 : 1.5} />
            <span className="text-[8px] font-black uppercase mt-1">Accueil</span>
          </button>
          <button onClick={() => { if(currentOrderId) setAppView('tracking'); else showToast("Aucune commande active", "info"); }} className={`p-2 transition-all duration-300 relative flex flex-col items-center ${appView === 'tracking' ? 'scale-110 text-slate-900 opacity-100' : 'opacity-40 text-slate-400'}`}>
            <ClipboardList size={22} strokeWidth={appView === 'tracking' ? 2.5 : 1.5} />
            <span className="text-[8px] font-black uppercase mt-1">Suivre</span>
          </button>
        </div>
      )}

    </div>
  );
}
