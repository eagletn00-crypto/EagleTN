import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Power, Settings, Plus, Edit2, Trash2, Clock, CheckCircle, ShoppingBag, LayoutList, Wallet, Image as ImageIcon, Check, Star, MapPin, XCircle, Camera } from 'lucide-react';

interface PartnerDashboardProps {
  onLogout: () => void;
}

export default function PartnerDashboard({ onLogout: _onLogout }: PartnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'commandes' | 'menu' | 'journal'>('commandes');
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Product Form State
  const [currentProduct, setCurrentProduct] = useState<any>({ id: null, name_fr: '', price: '', category: 'PLAT', image_url: '', is_available: true, is_special: false });
  const [productUploadFile, setProductUploadFile] = useState<File | null>(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<any>({ name: '', description: '', address: '', opening_time: '', closing_time: '', logo_url: '', cover_url: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const categories = ['PLAT', 'SANDWICH', 'BOISSON', 'SUPPLÉMENT'];

  useEffect(() => {
    fetchDashboardData();
    const ordersSubscription = supabase.channel('partner_orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchDashboardData).subscribe();
    return () => { supabase.removeChannel(ordersSubscription); };
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch First Restaurant (Or specific to partner in future)
        const { data: resto } = await supabase.from('restaurants').select('*').limit(1).single();
        if (resto) {
          setRestaurantData(resto);
          setSettingsForm({ name: resto.name || '', description: resto.description || '', address: resto.address || '', opening_time: resto.opening_time || '', closing_time: resto.closing_time || '', logo_url: resto.logo_url || '', cover_url: resto.cover_url || '' });
          
          const { data: prods } = await supabase.from('products').select('*').eq('restaurant_id', resto.id).order('created_at', { ascending: false });
          if (prods) setProducts(prods);
        }

        const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (ordersData) setOrders(ordersData);
      }
    } catch (error) { console.error("Erreur de chargement", error); } 
    finally { setIsLoading(false); }
  };

  const toggleRestaurantStatus = async () => {
    if (!restaurantData) return;
    const newStatus = !restaurantData.is_open;
    await supabase.from('restaurants').update({ is_open: newStatus }).eq('id', restaurantData.id);
    setRestaurantData({ ...restaurantData, is_open: newStatus });
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    fetchDashboardData();
  };

  const toggleProductStock = async (p: any) => {
    await supabase.from('products').update({ is_available: !p.is_available }).eq('id', p.id);
    fetchDashboardData();
  };

  const toggleProductSpecial = async (p: any) => {
    await supabase.from('products').update({ is_special: !p.is_special }).eq('id', p.id);
    fetchDashboardData();
  };

  const deleteProduct = async (id: string) => {
    if(confirm("Confirmer la suppression ?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchDashboardData();
    }
  };

  const openProductModal = (prod: any = null) => {
    if (prod) setCurrentProduct(prod);
    else setCurrentProduct({ id: null, name_fr: '', price: '', category: 'PLAT', image_url: '', is_available: true, is_special: false });
    setProductUploadFile(null);
    setShowProductModal(true);
  };

  // UPLOAD HELPER FUNCTION
  const uploadToStorage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const { error } = await supabase.storage.from('products').upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    }
    return null;
  };

  const handleProductSave = async () => {
    if (!currentProduct.name_fr || !currentProduct.price || !restaurantData) return;
    setIsUploading(true);
    try {
      let finalImageUrl = currentProduct.image_url;
      if (productUploadFile) {
        const uploadedUrl = await uploadToStorage(productUploadFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const payload = { restaurant_id: restaurantData.id, name: currentProduct.name_fr, name_fr: currentProduct.name_fr, price: parseFloat(currentProduct.price), category: currentProduct.category, image_url: finalImageUrl };

      if (currentProduct.id) await supabase.from('products').update(payload).eq('id', currentProduct.id);
      else await supabase.from('products').insert([payload]);

      setShowProductModal(false);
      fetchDashboardData();
    } catch (e) { console.error(e); } 
    finally { setIsUploading(false); }
  };

  const handleRestaurantSave = async () => {
    setIsUploading(true);
    try {
      let finalLogo = settingsForm.logo_url;
      let finalCover = settingsForm.cover_url;

      if (logoFile) { const url = await uploadToStorage(logoFile); if (url) finalLogo = url; }
      if (coverFile) { const url = await uploadToStorage(coverFile); if (url) finalCover = url; }

      await supabase.from('restaurants').update({ name: settingsForm.name, description: settingsForm.description, address: settingsForm.address, opening_time: settingsForm.opening_time, closing_time: settingsForm.closing_time, logo_url: finalLogo, cover_url: finalCover }).eq('id', restaurantData.id);

      setShowSettingsModal(false);
      fetchDashboardData();
    } catch (e) { console.error(e); } 
    finally { setIsUploading(false); }
  };

  const activeOrders = orders.filter(o => ['confirmed', 'prete'].includes(o.status));
  const historyOrders = orders.filter(o => ['delivered', 'cancelled_timeout', 'cancelled_client', 'refused'].includes(o.status));
  const totalRevenue = historyOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + Number(o.total_price || 0), 0);

  if (isLoading) return <div className="h-screen w-screen bg-[#FDFBF7] flex items-center justify-center text-amber-500 font-black">CHARGEMENT...</div>;

  return (
    <div className="min-h-screen w-screen bg-[#FDFBF7] text-slate-900 font-sans overflow-x-hidden pb-24">
      
      {/* 👑 HEADER PREMIUM (Cover + Logo + Pro) */}
      <div className="bg-white border-b border-slate-100 shadow-sm relative">
        <div className="h-32 bg-slate-200 relative overflow-hidden">
          {restaurantData?.cover_url ? <img src={restaurantData.cover_url} className="w-full h-full object-cover opacity-80" /> : <div className="w-full h-full bg-gradient-to-r from-slate-800 to-slate-900"></div>}
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => setShowSettingsModal(true)} className="bg-white/90 backdrop-blur text-slate-700 p-2 rounded-full shadow-md hover:text-amber-600 transition-colors"><Settings size={18}/></button>
            <button onClick={_onLogout} className="bg-white/90 backdrop-blur text-slate-700 p-2 rounded-full shadow-md hover:text-red-600 transition-colors"><Power size={18}/></button>
          </div>
        </div>

        <div className="px-5 pt-0 pb-4 relative">
          <div className="flex justify-between items-end -mt-10 mb-3">
            <div className="w-20 h-20 bg-white rounded-[1.2rem] p-1 shadow-lg border border-slate-100 z-10 relative">
              {restaurantData?.logo_url ? <img src={restaurantData.logo_url} className="w-full h-full rounded-xl object-cover" /> : <div className="w-full h-full bg-amber-100 rounded-xl flex items-center justify-center text-2xl">👨‍🍳</div>}
            </div>
            
            {/* 🟢 TOGGLE STATUT OUVERT/FERMÉ */}
            <div className={`flex flex-col items-end`}>
               <button onClick={toggleRestaurantStatus} className={`relative w-14 h-7 rounded-full transition-colors duration-300 shadow-inner border mb-1 ${restaurantData?.is_open ? 'bg-emerald-500 border-emerald-600' : 'bg-red-500 border-red-600'}`}>
                 <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${restaurantData?.is_open ? 'left-8' : 'left-1'}`}></div>
               </button>
               <span className={`text-[9px] font-black uppercase tracking-widest ${restaurantData?.is_open ? 'text-emerald-600' : 'text-red-500'}`}>{restaurantData?.is_open ? 'OUVERT' : 'FERMÉ'}</span>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">{restaurantData?.name || "Nom du Restaurant"} <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-md border border-amber-200 uppercase tracking-widest flex items-center gap-0.5">Pro 👑</span></h1>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">{restaurantData?.description || "Ajoutez une description ou un message pour vos clients dans les paramètres."}</p>
            <div className="flex gap-4 mt-2 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-300"/> {restaurantData?.address || "Localisation non définie"}</span>
              <span className="flex items-center gap-1"><Clock size={12} className="text-slate-300"/> {restaurantData?.opening_time || "00:00"} - {restaurantData?.closing_time || "23:59"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS */}
      <div className="px-5 py-4">
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] shadow-inner">
          <button onClick={() => setActiveTab('commandes')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'commandes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            <ShoppingBag size={14}/> Commandes {activeOrders.length > 0 && <span className="bg-red-500 text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center">{activeOrders.length}</span>}
          </button>
          <button onClick={() => setActiveTab('menu')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'menu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            <LayoutList size={14}/> Menu
          </button>
          <button onClick={() => setActiveTab('journal')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'journal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            <Wallet size={14}/> Journal
          </button>
        </div>
      </div>

      {/* 📦 TAB 1: COMMANDES */}
      {activeTab === 'commandes' && (
        <div className="px-5 space-y-4 pb-10">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 mb-2">En Cours ({activeOrders.length})</h2>
          
          {activeOrders.length === 0 ? (
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] text-center shadow-sm">
              <span className="text-4xl block mb-2 opacity-30 grayscale">🛒</span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucune commande en attente</p>
            </div>
          ) : (
            activeOrders.map(order => (
              <div key={order.id} className="bg-white border border-amber-100 p-5 rounded-[2rem] shadow-[0_5px_15px_rgba(245,158,11,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <div className="flex justify-between items-start border-b border-slate-50 pb-3 mb-3">
                  <div>
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Nouveau</span>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">ID: #{order.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">{Number(order.total_price).toFixed(3)} <span className="text-[10px] text-slate-400">DT</span></p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="bg-white w-6 h-6 rounded-lg shadow-sm flex items-center justify-center text-amber-600 border border-slate-100">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
                {order.status === 'confirmed' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateOrderStatus(order.id, 'refused')} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 active:scale-95 transition-transform">Refuser</button>
                    <button onClick={() => updateOrderStatus(order.id, 'prete')} className="flex-[2] bg-amber-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform flex justify-center items-center gap-1"><CheckCircle size={14}/> Accepter & Préparer</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 🍔 TAB 2: GESTION DU MENU & UPLOAD */}
      {activeTab === 'menu' && (
        <div className="px-5 space-y-4 pb-10">
          <div className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-[2rem] shadow-sm">
            <div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Gestion du Menu</h2>
              <p className="text-[9px] font-medium text-slate-400 mt-0.5">Stock & Spécialités</p>
            </div>
            <button onClick={() => openProductModal()} className="bg-slate-900 text-white px-4 py-3 rounded-[1rem] flex items-center gap-1.5 text-xs font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform">
              <Plus size={16} /> Ajouter
            </button>
          </div>

          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className={`bg-white border p-3 rounded-[1.5rem] flex items-center gap-3 shadow-sm transition-all ${p.is_available ? 'border-slate-100' : 'border-red-100 opacity-75'}`}>
                <div className="w-16 h-16 bg-slate-50 rounded-[1rem] overflow-hidden border border-slate-100 shrink-0 relative flex items-center justify-center">
                  {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-slate-300"/>}
                  {!p.is_available && <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[1px]"></div>}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xs font-black text-slate-900 leading-tight">{p.name_fr}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] font-black font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{Number(p.price).toFixed(3)} DT</p>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{p.category}</span>
                  </div>
                  
                  {/* أزرار الحالة (Stock & Special) */}
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => toggleProductStock(p)} className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border flex items-center gap-1 transition-colors ${p.is_available ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                      <CheckCircle size={10}/> {p.is_available ? 'En Stock' : 'Rupture'}
                    </button>
                    <button onClick={() => toggleProductSpecial(p)} className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border flex items-center gap-1 transition-colors ${p.is_special ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      <Star size={10} className={p.is_special ? 'fill-amber-500' : ''}/> Spécial
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pl-2 border-l border-slate-100">
                   <button onClick={() => openProductModal(p)} className="text-slate-400 hover:text-amber-500 transition-colors p-1"><Edit2 size={16}/></button>
                   <button onClick={() => deleteProduct(p.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 💰 TAB 3: JOURNAL */}
      {activeTab === 'journal' && (
        <div className="px-5 space-y-5 pb-10">
          <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Wallet size={100} className="text-amber-500"/></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500"/> Portefeuille Numérique</p>
            <p className="text-[9px] text-slate-400 font-bold mb-4">Total Net (Commandes Livrées)</p>
            <h3 className="text-3xl font-black font-sans tracking-tight text-slate-900">{totalRevenue.toFixed(3)} <span className="text-sm text-slate-400">DT</span></h3>
          </div>
        </div>
      )}

      {/* 🖼️ MODAL: SETTINGS (RESTAURANT PROFILE) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-6 shadow-2xl space-y-4 no-scrollbar">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 sticky top-0 bg-white z-10">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Paramètres Pro 👑</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-red-500 bg-slate-50 rounded-full p-1"><XCircle size={20}/></button>
            </div>
            
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-1">Nom du Restaurant</label>
                <input type="text" value={settingsForm.name} onChange={e => setSettingsForm({...settingsForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-1">Message d'accueil / Description</label>
                <textarea value={settingsForm.description} onChange={e => setSettingsForm({...settingsForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500 h-20 resize-none" />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-1">Adresse (Localisation)</label>
                <input type="text" value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} placeholder="Ex: Cité Nacer, Tunis" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-1">Ouverture</label>
                  <input type="time" value={settingsForm.opening_time} onChange={e => setSettingsForm({...settingsForm, opening_time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-1">Fermeture</label>
                  <input type="time" value={settingsForm.closing_time} onChange={e => setSettingsForm({...settingsForm, closing_time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="border-2 border-dashed border-slate-200 bg-slate-50 p-4 rounded-2xl text-center relative overflow-hidden flex flex-col items-center justify-center">
                  <input type="file" accept="image/*" onChange={e => e.target.files && setLogoFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <Camera size={20} className="text-amber-500 mb-1"/>
                  <p className="text-[9px] font-black text-slate-500 uppercase">{logoFile ? 'Logo Sélect.' : 'Upload Logo'}</p>
                </div>
                <div className="border-2 border-dashed border-slate-200 bg-slate-50 p-4 rounded-2xl text-center relative overflow-hidden flex flex-col items-center justify-center">
                  <input type="file" accept="image/*" onChange={e => e.target.files && setCoverFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <ImageIcon size={20} className="text-amber-500 mb-1"/>
                  <p className="text-[9px] font-black text-slate-500 uppercase">{coverFile ? 'Cover Sélect.' : 'Upload Cover'}</p>
                </div>
              </div>

              <button disabled={isUploading} onClick={handleRestaurantSave} className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-md flex justify-center items-center gap-2 mt-4">
                {isUploading ? 'Sauvegarde...' : <><Check size={16}/> Mettre à jour le Profil</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{currentProduct.id ? 'Éditer Produit' : 'Nouveau Produit'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 bg-slate-50 rounded-full p-1"><XCircle size={20}/></button>
            </div>
            
            <div className="space-y-3">
              <input type="text" placeholder="Nom du produit *" value={currentProduct.name_fr} onChange={e => setCurrentProduct({...currentProduct, name_fr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
              
              <input type="number" placeholder="Prix en DT (ex: 12.500) *" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
              
              <select value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500 text-slate-600 uppercase tracking-wider">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <div className="border-2 border-dashed border-slate-200 bg-slate-50 p-6 rounded-2xl text-center relative overflow-hidden flex flex-col items-center">
                <input type="file" accept="image/*" onChange={e => e.target.files && setProductUploadFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <ImageIcon size={24} className="mb-2 text-amber-500"/>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {productUploadFile ? productUploadFile.name : (currentProduct.image_url ? 'Changer l\'image' : 'Upload Image Produit')}
                </p>
              </div>
              
              <button disabled={isUploading || !currentProduct.name_fr || !currentProduct.price} onClick={handleProductSave} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-md mt-2 flex justify-center items-center gap-2">
                {isUploading ? 'Sauvegarde...' : <><Check size={16}/> Enregistrer</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
