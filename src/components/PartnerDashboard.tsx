import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Store, Clock, Edit3, Save, BookOpen, Trash2, Package, RefreshCw, User, Sliders, Bell, MessageCircle, Star, Volume2, VolumeX, MapPin, ToggleLeft, ToggleRight, Plus, Image, FileText, Check, AlertCircle } from 'lucide-react';

interface PartnerDashboardProps {
  onLogout: () => void;
}

export default function PartnerDashboard({ onLogout }: PartnerDashboardProps) {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [journalLogs, setJournalLogs] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'journal'>('orders');
  const [subOrderTab, setSubOrderTab] = useState<'current' | 'history'>('current');
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [soundAlertActive, setSoundAlertActive] = useState(true);

  // Compte à rebours dynamique pour la préparation de la cuisine
  const [orderCountdowns, setOrderCountdowns] = useState<{ [key: string]: number }>({});

  // Configuration de la boutique Am Ali Kitchen
  const [shopLogo, setShopLogo] = useState('');
  const [shopCover, setShopCover] = useState('');
  const [shopHours, setShopHours] = useState('08:00 - 23:00');

  // Ajout de nouveaux plats
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdIsSpecial, setNewProdIsSpecial] = useState(false);

  // Edition des plats existants
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editIsSpecial, setEditIsSpecial] = useState(false);
  const [editInStock, setEditInStock] = useState(true);

  // Fenêtre de sélection du délai de préparation
  const [selectedOrderIdForPrep, setSelectedOrderIdForPrep] = useState<string | null>(null);

  useEffect(() => {
    fetchPartnerEcosystem();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setOrderCountdowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          if (updated[id] > 0) {
            updated[id] = updated[id] - 1;
          } else {
            delete updated[id];
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchPartnerEcosystem = async () => {
    try {
      setLoading(true);
      // Cible stricte sur le restaurant ID 1 (Am Ali Kitchen)
      const { data: restoData } = await supabase.from('restaurants').select('*').eq('id', 1).maybeSingle();
      
      let targetResto = restoData;
      if (!targetResto) {
        const { data: firstResto } = await supabase.from('restaurants').select('*').limit(1).single();
        targetResto = firstResto;
      }

      if (targetResto) {
        setRestaurant(targetResto);
        setShopLogo(targetResto.logo_url || '');
        setShopCover(targetResto.cover_url || '');
        setShopHours(targetResto.min_delivery_time || '08:00 - 23:00');
        
        let { data: prodData } = await supabase.from('products').select('*').eq('restaurant_id', targetResto.id).order('id', { ascending: false });
        if (!prodData || prodData.length === 0) {
          const { data: fallbackData } = await supabase.from('products').select('*').limit(15);
          if (fallbackData) prodData = fallbackData;
        }
        if (prodData) setProducts(prodData);

        const { data: ordData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (ordData) {
          setOrders(ordData);
          
          const historyLogs = ordData.map((order: any) => {
            const dateObj = new Date(order.created_at);
            const formattedDate = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const formattedTime = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return {
              time: `${formattedDate} à ${formattedTime}`,
              action: `FACTURE NUMÉRIQUE #${order.id?.toString().substring(0, 6).toUpperCase()}`,
              detail: `Commande traitée de ${Number(order.total_price || 0).toFixed(3)} DT pour le client ${order.customer_name || 'Eagle User'}`
            };
          });
          setJournalLogs(historyLogs);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('partner_orders_realtime_node')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        fetchPartnerEcosystem();
        if (soundAlertActive) {
          playEagleScream();
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        fetchPartnerEcosystem();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [soundAlertActive]);

  const playEagleScream = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
      audio.volume = 1.0;
      audio.play();
    } catch(e){}
  };

  const toggleStoreStatus = async () => {
    if (!restaurant) return;
    const nextStatus = !restaurant.is_open;
    const { error } = await supabase.from('restaurants').update({ is_open: nextStatus }).eq('id', restaurant.id);
    if (!error) {
      setRestaurant({ ...restaurant, is_open: nextStatus });
    }
  };

  const toggleProductStock = async (productId: string, currentStock: boolean) => {
    const { error } = await supabase.from('products').update({ in_stock: !currentStock }).eq('id', productId);
    if (!error) {
      setProducts(products.map(p => p.id === productId ? { ...p, in_stock: !currentStock } : p));
    }
  };

  const handleAddNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !restaurant) return;
    const { data, error } = await supabase.from('products').insert([{
      restaurant_id: restaurant.id,
      name: newProdName,
      name_fr: newProdName,
      price: Number(newProdPrice),
      image_url: newProdImage || null,
      category: 'PLAT',
      in_stock: true,
      is_special: newProdIsSpecial
    }]).select();

    if (!error && data) {
      setProducts([data[0], ...products]);
      setShowAddProduct(false);
      setNewProdName(''); setNewProdPrice(''); setNewProdImage(''); setNewProdIsSpecial(false);
    }
  };

  const openEditModal = (product: any) => {
    setEditingProductId(String(product.id));
    setEditName(product.name_fr || product.name);
    setEditPrice(String(product.price));
    setEditImage(product.image_url || '');
    setEditIsSpecial(product.is_special || false);
    setEditInStock(product.in_stock ?? true);
    setShowEditProduct(true);
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId || !editName || !editPrice) return;
    const { error } = await supabase.from('products').update({ 
      name_fr: editName, 
      price: Number(editPrice), 
      image_url: editImage,
      is_special: editIsSpecial,
      in_stock: editInStock
    }).eq('id', editingProductId);

    if (!error) {
      setProducts(products.map(p => String(p.id) === editingProductId ? { ...p, name_fr: editName, price: Number(editPrice), image_url: editImage, is_special: editIsSpecial, in_stock: editInStock } : p));
      setShowEditProduct(false);
      setEditingProductId(null);
    }
  };

  const saveStoreSettings = async () => {
    if (!restaurant) return;
    const { error } = await supabase.from('restaurants').update({
      logo_url: shopLogo,
      cover_url: shopCover,
      min_delivery_time: shopHours
    }).eq('id', restaurant.id);
    if (!error) {
      setRestaurant({ ...restaurant, logo_url: shopLogo, cover_url: shopCover, min_delivery_time: shopHours });
      setShowSettings(false);
    }
  };

  const updateOrderStatusDirect = async (orderId: string, nextStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: nextStatus }).eq('id', orderId);
    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    }
  };

  const acceptOrderWithTime = async (minutes: number) => {
    if (!selectedOrderIdForPrep) return;
    const { error } = await supabase.from('orders').update({ status: 'prete' }).eq('id', selectedOrderIdForPrep);

    if (!error) {
      const orderIdStr = selectedOrderIdForPrep.toString();
      setOrders(orders.map(o => o.id === selectedOrderIdForPrep ? { ...o, status: 'prete' } : o));
      setOrderCountdowns(prev => ({ ...prev, [orderIdStr]: minutes * 60 }));
      setSelectedOrderIdForPrep(null);
    }
  };

  const formatCountdown = (seconds: number) => {
    if (!seconds || seconds <= 0) return "00:00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredOrders = orders.filter(o => subOrderTab === 'current' ? o.status !== 'delivered' && o.status !== 'refused' : o.status === 'delivered' || o.status === 'refused');

  return (
    <div className="h-screen w-screen bg-[#0B0F19] text-slate-100 font-sans overflow-x-hidden overflow-y-auto max-w-md mx-auto relative shadow-2xl pb-24 border-x border-white/5">
      
      {/* HEADER DE LA BOUTIQUE ASSIGNÉE */}
      <div className="bg-[#121824] p-6 rounded-b-[2.5rem] shadow-xl border-b border-white/5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#0A0E17] rounded-2xl flex items-center justify-center border border-amber-500/20 overflow-hidden text-2xl shadow-inner">
              {restaurant?.logo_url ? <img src={restaurant.logo_url} className="w-full h-full object-cover" /> : <span>🍳</span>}
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">{restaurant?.name || "Am Ali Kitchen"}</h2>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">ECOSYSTEM PARTNER NODE</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSoundAlertActive(!soundAlertActive)} className={`p-2.5 rounded-xl border transition-all ${soundAlertActive ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {soundAlertActive ? <Volume2 size={16}/> : <VolumeX size={16}/>}
            </button>
            <button onClick={() => setShowSettings(true)} className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-slate-300"><Sliders size={16}/></button>
          </div>
        </div>

        <div className="bg-[#0A0E17] border border-white/5 p-4 rounded-2xl flex justify-between items-center mt-4 shadow-inner">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 block tracking-widest">CUISINE STATUT</span>
            <span className={`text-xs font-black flex items-center gap-1.5 ${restaurant?.is_open ? 'text-emerald-400' : 'text-red-400'}`}>
              {restaurant?.is_open ? "استقبال الطلبات مفتوح حياً" : "المطبخ مغلق الآن"} 
              <span className={`w-2 h-2 rounded-full ${restaurant?.is_open ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
            </span>
          </div>
          <button onClick={toggleStoreStatus} className="focus:outline-none">
            {restaurant?.is_open ? <ToggleRight size={38} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"/> : <ToggleLeft size={38} className="text-slate-600"/>}
          </button>
        </div>
      </div>

      {/* TABS DE NAVIGATION */}
      <div className="p-4 grid grid-cols-3 gap-2 sticky top-0 bg-[#0B0F19]/95 backdrop-blur-md z-30 border-b border-white/5">
        <button onClick={() => setActiveTab('orders')} className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${activeTab === 'orders' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-[#121824] border-white/5 text-slate-400'}`}>
          Commandes
        </button>
        <button onClick={() => setActiveTab('products')} className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${activeTab === 'products' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-[#121824] border-white/5 text-slate-400'}`}>
          Menu Menu
        </button>
        <button onClick={() => setActiveTab('journal')} className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${activeTab === 'journal' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-[#121824] border-white/5 text-slate-400'}`}>
          Le Journal
        </button>
      </div>

      {/* ZONE D'AFFICHAGE DYNAMIQUE */}
      <div className="p-4 space-y-4">
        
        {/* TAB 1: GESTION DE COMMANDES + FACTURE PRO (Screenshot & Copy Optimization) */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-2 bg-[#121824] p-1.5 rounded-xl border border-white/5">
              <button onClick={() => setSubOrderTab('current')} className={`py-2.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${subOrderTab === 'current' ? 'bg-[#0B0F19] text-white shadow-inner' : 'text-slate-500'}`}>En Cours</button>
              <button onClick={() => setSubOrderTab('history')} className={`py-2.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${subOrderTab === 'history' ? 'bg-[#0B0F19] text-white shadow-inner' : 'text-slate-500'}`}>Historique</button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-bold uppercase tracking-widest">Aucune commande disponible</div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-[#121824] p-1 rounded-3xl border border-white/5 shadow-xl select-text">
                  
                  {/* FAXTURE NUMÉRIQUE PROFESSIONNELLE POUR LE SCREENSHOT */}
                  <div className="bg-[#0A0E17]/90 p-5 rounded-[1.7rem] border border-amber-500/10 space-y-4 relative">
                    
                    {/* Logos d'identité en filigrane ou entête */}
                    <div className="flex justify-between items-start border-b border-white/5 pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">ID COMPTABILITÉ: #{order.id?.toString().substring(0,8).toUpperCase()}</span>
                        <div className="text-[11px] text-amber-500 flex items-center gap-1 font-mono">
                          <Clock size={12}/> {order.created_at ? new Date(order.created_at).toLocaleString('fr-FR') : '--/--/----'}
                        </div>
                      </div>
                      
                      {/* Badge dynamique de statut logistique انسيابي */}
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                        order.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse' :
                        order.status === 'prete' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {order.status === 'confirmed' ? 'Nouveau 🔔' : order.status === 'prete' ? 'En Préparation 🧑‍🍳' : order.status}
                      </span>
                    </div>

                    {/* Données du Client & Zone Géographique Stricte */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-500">Client:</span><span className="font-black text-white">{order.customer_name || 'Ueu'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Téléphone:</span><span className="font-mono text-white">{order.customer_phone || '-- --- ---'}</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-500">Zone / Région:</span><span className="font-bold text-white flex items-center gap-1"><MapPin size={12} className="text-red-400"/> {order.delivery_address || 'Rue, Tunis'}</span></div>
                      {order.note && (
                        <div className="bg-white/5 p-2 rounded-xl text-[11px] text-slate-400 border border-white/5 mt-1">
                          <span className="font-bold text-amber-500 block text-[9px] uppercase tracking-wider mb-0.5">Note du Client:</span>
                          "{order.note}"
                        </div>
                      )}
                    </div>

                    {/* Liste des articles facturés */}
                    <div className="space-y-2 py-3 border-y border-white/5">
                      {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-slate-200">
                          <span className="font-medium">{item.quantity}x {item.name_fr || item.name}</span>
                          <span className="font-mono text-slate-400">{Number(item.price * item.quantity).toFixed(3)} DT</span>
                        </div>
                      ))}
                    </div>

                    {/* Net à encaisser */}
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">NET À ENCAISSER:</span>
                      <span className="text-xl font-black text-emerald-400 font-sans">{Number(order.total_price || 42.501).toFixed(3)} DT</span>
                    </div>
                  </div>

                  {/* BOUTONS LOGISTIQUES INSIENS / DYNAMIQUES */}
                  <div className="p-3 bg-[#161D2F] rounded-b-3xl flex gap-2">
                    {orderCountdowns[order.id?.toString()] !== undefined ? (
                      <div className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex justify-between items-center">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Temps restant de cuisson</span>
                        <span className="font-mono text-base font-black text-white tracking-wider animate-pulse">{formatCountdown(orderCountdowns[order.id?.toString()])}</span>
                      </div>
                    ) : (
                      order.status === 'confirmed' ? (
                        <>
                          <button onClick={() => setSelectedOrderIdForPrep(order.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase py-3.5 rounded-xl transition-transform active:scale-98">
                            Accepter & Préparer 🟢
                          </button>
                          <button onClick={() => updateOrderStatusDirect(order.id, 'refused')} className="bg-red-600/20 border border-red-600/30 hover:bg-red-600 text-red-400 text-xs font-black uppercase px-4 py-3.5 rounded-xl transition-colors">
                            Refuser 🔴
                          </button>
                        </>
                      ) : (
                        <div className="w-full bg-[#0A0E17]/40 text-slate-500 text-[11px] font-black uppercase py-3 rounded-xl text-center tracking-widest border border-white/5">
                          Statut logistique: {order.status?.toUpperCase()}
                        </div>
                      )
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: MODAL COMPLET DE MODIFICATION DU MENU */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#121824] p-4 rounded-2xl flex items-center justify-between border border-white/5 shadow-inner">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-white block uppercase tracking-wide">Gestion du Menu 🍲</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">STOCK & SPÉCIALITÉS</span>
              </div>
              <button onClick={() => setShowAddProduct(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2.5 rounded-xl shadow-md transition-transform active:scale-95"><Plus size={18}/></button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {products.map((product) => (
                <div key={product.id} className="bg-[#121824] p-3 rounded-2xl border border-white/5 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-3 flex-1">
                    <img src={product.image_url || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-xl object-cover border border-white/10" alt="Plat" />
                    <div>
                      <h4 className="text-xs font-black text-white">{product.name_fr || product.name}</h4>
                      <span className="text-xs font-black text-amber-500 mt-1 block">{Number(product.price).toFixed(3)} DT</span>
                      {product.is_special && <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest mt-1">★ PLAT DU JOUR</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <button onClick={() => openEditModal(product)} className="bg-[#1C2438] text-slate-300 px-3 py-2 rounded-xl text-[10px] font-black flex items-center gap-1.5 hover:text-white transition-colors">
                      <Edit3 size={12}/> Editer
                    </button>
                    <button onClick={() => toggleProductStock(product.id, product.in_stock ?? true)} className={`px-3 py-2 rounded-xl text-[10px] font-black flex items-center justify-center transition-colors ${product.in_stock !== false ? 'bg-[#0f3d2e] text-emerald-400 border border-emerald-500/20' : 'bg-[#3d0f14] text-red-400 border border-red-500/20'}`}>
                      {product.in_stock !== false ? 'Stock' : 'Épuisé'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HISTORIQUE DE TOUTES LES FACTURES REÇUES */}
        {activeTab === 'journal' && (
          <div className="bg-[#121824] text-slate-200 p-5 rounded-[2.5rem] shadow-2xl space-y-4 border border-white/5 font-mono animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase flex items-center gap-1.5"><BookOpen size={14}/> HISTORIQUE DES COMMANDES REÇUES</span>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto text-right text-[11px]" dir="rtl">
              {journalLogs.map((log, index) => (
                <div key={index} className="border-b border-white/5 pb-3">
                  <div className="text-slate-500 text-[10px] font-sans mb-1 text-left" dir="ltr">{log.time}</div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-white text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10">{log.action}</span>
                  </div>
                  <p className="text-slate-300 font-medium pt-1 text-justify leading-relaxed">{log.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: SÉLECTION DU TEMPS DE CUISINE DINAMIQUE */}
      {selectedOrderIdForPrep !== null && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[400] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#121824] border border-white/10 p-6 rounded-[2.5rem] w-full max-w-sm text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-3xl">🧑‍🍳</div>
            <h3 className="text-sm font-black uppercase text-amber-500 tracking-wide">Temps de Préparation</h3>
            <p className="text-xs text-slate-400 font-medium pb-2">Veuillez indiquer le temps requis pour la cuisson de ce plat :</p>
            
            <div className="grid grid-cols-5 gap-2 pt-2">
              {[10, 15, 20, 25, 30].map((mins) => (
                <button 
                  key={mins} 
                  onClick={() => acceptOrderWithTime(mins)}
                  className="bg-[#1C2438] text-white border border-white/5 font-mono font-black text-sm py-4 rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md active:scale-95"
                >
                  {mins}'
                </button>
              ))}
            </div>
            <button onClick={() => setSelectedOrderIdForPrep(null)} className="text-xs text-slate-500 font-black uppercase tracking-widest pt-4 block mx-auto hover:text-slate-300">Annuler</button>
          </div>
        </div>
      )}

      {/* MODAL: INTEGRATION DE NOUVEAU PRODUIT */}
      {showAddProduct && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[400] flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleAddNewProduct} className="bg-[#121824] border border-white/10 p-6 rounded-[2.5rem] w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase text-amber-500 tracking-widest flex items-center gap-1.5"><Package size={14}/> Créer un nouveau plat</h3>
            <div className="space-y-3 pt-2">
              <input type="text" required value={newProdName} onChange={(e) => setNewProdName(e.target.value)} className="w-full bg-[#0A0E17] border border-white/10 p-3.5 rounded-xl text-xs font-bold text-white focus:outline-none" placeholder="Nom du plat *"/>
              <input type="number" step="0.001" required value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} className="w-full bg-[#0A0E17] border border-white/10 p-3.5 rounded-xl text-xs font-mono text-white focus:outline-none" placeholder="Prix (DT) *"/>
              <input type="text" value={newProdImage} onChange={(e) => setNewProdImage(e.target.value)} className="w-full bg-[#0A0E17] border border-white/10 p-3.5 rounded-xl text-xs font-mono text-white focus:outline-none" placeholder="Lien de la photo (URL depuis mobile)"/>
              
              <label className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/5 cursor-pointer select-none">
                <input type="checkbox" checked={newProdIsSpecial} onChange={(e) => setNewProdIsSpecial(e.target.checked)} className="accent-amber-500 w-4 h-4" />
                <span className="text-[10px] font-black uppercase text-amber-500">Marquer comme Plat du Jour ⭐</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 bg-[#1C2438] text-slate-300 py-3.5 rounded-xl text-[10px] font-black uppercase">Annuler</button>
              <button type="submit" className="flex-1 bg-amber-500 text-slate-950 py-3.5 rounded-xl text-[10px] font-black uppercase shadow-md">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: MODIFICATION DE PRODUIT DEPUIS MOBILE (EDITEUR GENERAL) */}
      {showEditProduct && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[400] flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSaveEditProduct} className="bg-[#121824] border border-white/10 p-6 rounded-[2.5rem] w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase text-emerald-400 tracking-widest flex items-center gap-1.5"><Edit3 size={14}/> Modifier le plat</h3>
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 pl-1">Nom du plat</label>
                <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-[#0A0E17] border border-white/10 p-3.5 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50"/>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 pl-1">Prix (DT)</label>
                <input type="number" step="0.001" required value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full bg-[#0A0E17] border border-white/10 p-3.5 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"/>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 pl-1">Photo depuis un mobile (URL)</label>
                <input type="text" value={editImage} onChange={(e) => setEditImage(e.target.value)} className="w-full bg-[#0A0E17] border border-white/10 p-3.5 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"/>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer select-none">
                  <input type="checkbox" checked={editIsSpecial} onChange={(e) => setEditIsSpecial(e.target.checked)} className="accent-amber-500 w-4 h-4" />
                  <span className="text-[9px] font-black uppercase text-amber-500">Plat du Jour ⭐</span>
                </label>
                <label className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer select-none">
                  <input type="checkbox" checked={editInStock} onChange={(e) => setEditInStock(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                  <span className="text-[9px] font-black uppercase text-emerald-400">En Stock ✔️</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <button type="button" onClick={() => setShowEditProduct(false)} className="flex-1 bg-[#1C2438] text-slate-300 py-3.5 rounded-xl text-[10px] font-black uppercase">Annuler</button>
              <button type="submit" className="flex-1 bg-emerald-500 text-white py-3.5 rounded-xl text-[10px] font-black uppercase shadow-md">Mettre à jour 🚀</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CONFIGURATION GENERALE */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-[400] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#121824] text-white p-6 rounded-[2.5rem] w-full max-w-sm space-y-4 shadow-2xl border border-white/10">
            <h3 className="text-xs font-black uppercase text-slate-300 tracking-widest flex items-center gap-1.5"><Store size={14}/> Configuration Identity</h3>
            <div className="space-y-3 pt-2">
              <input type="text" value={shopLogo} onChange={(e) => setShopLogo(e.target.value)} className="w-full bg-[#0A0E17] border border-white/10 p-3 rounded-xl text-xs font-mono text-white focus:outline-none" placeholder="Lien du Logo"/>
              <input type="text" value={shopCover} onChange={(e) => setShopCover(e.target.value)} className="w-full bg-[#0A0E17] border border-white/10 p-3 rounded-xl text-xs font-mono text-white focus:outline-none" placeholder="Lien de la Couverture"/>
              <input type="text" value={shopHours} onChange={(e) => setShopHours(e.target.value)} className="w-full bg-[#0A0E17] border border-white/10 p-3 rounded-xl text-xs font-bold text-white focus:outline-none" placeholder="Horaires (08:00 - 23:00)"/>
            </div>
            <div className="flex gap-3 pt-3">
              <button onClick={() => setShowSettings(false)} className="flex-1 bg-[#1C2438] text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase">Fermer</button>
              <button onClick={saveStoreSettings} className="flex-1 bg-amber-500 text-slate-950 py-3 rounded-xl text-[10px] font-black uppercase shadow-md">Sauver</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
