import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Power, Settings, Plus, Edit2, Trash2, Clock, CheckCircle, ShoppingBag, LayoutList, Wallet, Image as ImageIcon, Check, Star, MapPin, XCircle, Camera, AlertCircle, Percent, Shirt, Lock } from 'lucide-react';

interface PartnerDashboardProps {
  onLogout: () => void;
}

export default function PartnerDashboard({ onLogout: _onLogout }: PartnerDashboardProps) {
  const [authEmail, setAuthEmail] = useState<string | null>(localStorage.getItem('eagle_pro_email'));
  const [accessDenied, setAccessDenied] = useState(false);

  const [activeTab, setActiveTab] = useState<'commandes' | 'menu' | 'journal'>('menu'); 
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [currentProduct, setCurrentProduct] = useState<any>({
    id: null, name: '', name_ar: '', price: '', promo_price: '', is_promo: false, category: 'PLAT', image_url: '', in_stock: true, is_special: false
  });
  const [productUploadFile, setProductUploadFile] = useState<File | null>(null);

  const [settingsForm, setSettingsForm] = useState<any>({
    name: '', category: '', logo_url: '', banner_url: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const categories = ['PLAT', 'SANDWICH', 'BOISSON', 'SUPPLÉMENT'];

  useEffect(() => {
    if (authEmail) {
      fetchSecureDashboardData(authEmail);
      const subscription = supabase.channel('partner_strict_auth')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchSecureDashboardData(authEmail))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchSecureDashboardData(authEmail))
        .subscribe();
      return () => { supabase.removeChannel(subscription); };
    } else {
      setIsLoading(false);
    }
  }, [authEmail]);

  const fetchSecureDashboardData = async (email: string) => {
    setIsLoading(true);
    setAccessDenied(false);
    try {
      const { data: currentStore, error: storeError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_email', email.toLowerCase().trim())
        .single();

      if (storeError || !currentStore) {
        setAccessDenied(true);
        setIsLoading(false);
        return;
      }

      setRestaurantData(currentStore);
      setSettingsForm({
        name: currentStore.name || '',
        category: currentStore.category || '',
        logo_url: currentStore.logo_url || '',
        banner_url: currentStore.banner_url || ''
      });

      let query = supabase.from('products').select('*');
      if (currentStore.id === 1) {
        query = query.or(`restaurant_id.eq.${currentStore.id},restaurant_id.is.null`);
      } else {
        query = query.eq('restaurant_id', currentStore.id);
      }
      
      const { data: prods, error: prodErr } = await query.order('id', { ascending: false });
      if (prodErr) console.error("Erreur de produits:", prodErr);
      
      setProducts(prods || []);

      const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (ordersData) {
        // 💡 التعديل الجراحي الأول: مطابقة الطلبات بالمعرف الفريد (id) لضمان عدم ضياع أي طلب بسبب تشابه أو اختلاف الأسماء
        const filteredOrders = ordersData.filter(order => {
          let itemsArray = [];
          try { itemsArray = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []); } catch(e) { itemsArray = []; }
          return itemsArray.some((item: any) => (prods || []).some(p => String(p.id) === String(item.id) || p.name === item.name));
        });
        setOrders(filteredOrders);
      }
      
    } catch (error) {
      console.error("Erreur critique de sécurité", error);
      setAccessDenied(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProLogout = () => {
    localStorage.removeItem('eagle_pro_email');
    setAuthEmail(null);
    _onLogout();
  };

  const toggleRestaurantStatus = async () => {
    if (!restaurantData) return;
    const newStatus = !restaurantData.is_open;
    await supabase.from('restaurants').update({ is_open: newStatus }).eq('id', restaurantData.id);
    setRestaurantData({ ...restaurantData, is_open: newStatus });
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if(authEmail) fetchSecureDashboardData(authEmail);
  };

  const toggleProductStock = async (p: any) => {
    await supabase.from('products').update({ in_stock: !p.in_stock }).eq('id', p.id);
    if(authEmail) fetchSecureDashboardData(authEmail);
  };

  const toggleProductSpecial = async (p: any) => {
    await supabase.from('products').update({ is_special: !p.is_special }).eq('id', p.id);
    if(authEmail) fetchSecureDashboardData(authEmail);
  };

  const toggleProductPromo = async (p: any) => {
    await supabase.from('products').update({ is_promo: !p.is_promo }).eq('id', p.id);
    if(authEmail) fetchSecureDashboardData(authEmail);
  };

  const deleteProduct = async (id: string) => {
    if(confirm("Supprimer cet article définitivement ?")) {
      await supabase.from('products').delete().eq('id', id);
      if(authEmail) fetchSecureDashboardData(authEmail);
    }
  };

  const openProductModal = (prod: any = null) => {
    if (prod) {
      setCurrentProduct({
        id: prod.id, name: prod.name || '', name_ar: prod.name_ar || '', price: prod.price || '',
        promo_price: prod.promo_price || '', is_promo: prod.is_promo ?? false, category: prod.category || 'PLAT',
        image_url: prod.image_url || '', in_stock: prod.in_stock ?? true, is_special: prod.is_special ?? false
      });
    } else {
      setCurrentProduct({
        id: null, name: '', name_ar: '', price: '', promo_price: '', is_promo: false,
        category: restaurantData?.store_type === 'boutique' ? 'SUPPLÉMENT' : 'PLAT',
        image_url: '', in_stock: true, is_special: false
      });
    }
    setProductUploadFile(null);
    setShowProductModal(true);
  };

  const uploadToStorage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file);
      if (!error) {
        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        return data.publicUrl;
      }
    } catch (e) { console.error(e); }
    return null;
  };

  const handleProductSave = async () => {
    if (!currentProduct.name || !currentProduct.price || !restaurantData) return;
    setIsUploading(true);
    try {
      let finalImageUrl = currentProduct.image_url;
      if (productUploadFile) {
        const uploadedUrl = await uploadToStorage(productUploadFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const payload: any = {
        restaurant_id: restaurantData.id,
        name: currentProduct.name, name_ar: currentProduct.name_ar,
        price: parseFloat(currentProduct.price),
        promo_price: currentProduct.promo_price ? parseFloat(currentProduct.promo_price) : null,
        is_promo: currentProduct.is_promo, category: currentProduct.category,
        image_url: finalImageUrl, in_stock: currentProduct.in_stock, is_special: currentProduct.is_special
      };

      if (currentProduct.id) await supabase.from('products').update(payload).eq('id', currentProduct.id);
      else await supabase.from('products').insert([payload]);

      setShowProductModal(false);
      if(authEmail) fetchSecureDashboardData(authEmail);
    } catch (e) { console.error(e); } 
    finally { setIsUploading(false); }
  };

  const handleRestaurantSave = async () => {
    if (!restaurantData) return;
    setIsUploading(true);
    try {
      let finalLogo = settingsForm.logo_url;
      let finalBanner = settingsForm.banner_url;

      if (logoFile) { const url = await uploadToStorage(logoFile); if (url) finalLogo = url; }
      if (bannerFile) { const url = await uploadToStorage(bannerFile); if (url) finalBanner = url; }

      await supabase.from('restaurants').update({
        name: settingsForm.name, category: settingsForm.category,
        logo_url: finalLogo, banner_url: finalBanner
      }).eq('id', restaurantData.id);

      setShowSettingsModal(false);
      if(authEmail) fetchSecureDashboardData(authEmail);
    } catch (e) { console.error(e); } 
    finally { setIsUploading(false); }
  };

  if (!authEmail) {
    return (
      <div className="min-h-screen bg-[#121620] flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-sm text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-20 h-20 bg-amber-500/10 rounded-[1.5rem] mx-auto flex items-center justify-center border border-amber-500/20">
            <Lock size={32} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-white font-black text-2xl tracking-widest uppercase">Portal Pro</h2>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-2 border-b border-white/10 pb-4">Vérification d'identité 🦅</p>
          </div>
          <p className="text-xs text-slate-300 font-medium">Entrez l'email officiel de votre établissement.</p>
          <input type="email" placeholder="Email professionnel..." id="pro_auth_input" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-white text-xs font-bold focus:outline-none focus:border-amber-500 text-center" />
          <button onClick={() => {
            const val = (document.getElementById('pro_auth_input') as HTMLInputElement).value;
            if(val) { localStorage.setItem('eagle_pro_email', val.trim().toLowerCase()); setAuthEmail(val.trim().toLowerCase()); }
          }} className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black uppercase text-xs">Valider l'accès</button>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="h-screen w-screen bg-[#FDFBF7] flex items-center justify-center text-slate-400 font-black tracking-widest text-xs uppercase">Chargement des données...</div>;

  if (accessDenied || !restaurantData) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <XCircle size={64} className="text-red-500 mb-2"/>
        <h2 className="text-xl font-black text-slate-900 uppercase">Accès Refusé</h2>
        <p className="text-xs font-bold text-slate-500 mb-4">L'email <span className="text-amber-600">"{authEmail}"</span> n'est lié à aucun établissement.</p>
        <button onClick={handleProLogout} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase">Réessayer</button>
      </div>
    );
  }

  const isBoutique = restaurantData?.category?.toLowerCase().includes('boutique') || restaurantData?.store_type === 'boutique';
  
  // 💡 حساب المحفظة بدقة
  const deliveredOrders = (orders || []).filter(o => o.status === 'delivered');
  let totalBrut = 0;
  deliveredOrders.forEach(order => {
    try {
      let itemsArray = [];
      if (typeof order.items === 'string') { itemsArray = JSON.parse(order.items || '[]'); } 
      else if (Array.isArray(order.items)) { itemsArray = order.items; }
      
      itemsArray.forEach((item: any) => {
        // التعديل الجراحي الثاني: حماية المحفظة بضمان التطابق عبر المعرف (id)
        if (item && products.some(p => String(p.id) === String(item.id) || p.name === item.name)) {
          totalBrut += (Number(item.price || 0) * Number(item.quantity || 1));
        }
      });
    } catch (e) { console.error(e); }
  });

  const commissionEagle = totalBrut * 0.10;
  const netRestaurant = totalBrut - commissionEagle;

  return (
    <div className="min-h-screen w-screen bg-[#FDFBF7] text-slate-900 font-sans overflow-x-hidden pb-24">
      <div className="bg-white border-b border-slate-100 shadow-sm relative">
        <div className="h-32 bg-slate-200 relative overflow-hidden">
          {restaurantData?.banner_url ? <img src={restaurantData.banner_url} className="w-full h-full object-cover opacity-90" /> : <div className="w-full h-full bg-slate-800"></div>}
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => setShowSettingsModal(true)} className="bg-white/90 backdrop-blur text-slate-700 p-2 rounded-full shadow-md hover:text-amber-600 transition-colors"><Settings size={18}/></button>
            <button onClick={handleProLogout} className="bg-white/90 backdrop-blur text-slate-700 p-2 rounded-full shadow-md hover:text-red-600 transition-colors"><Power size={18}/></button>
          </div>
        </div>

        <div className="px-5 pt-0 pb-4 relative">
          <div className="flex justify-between items-end -mt-10 mb-3">
            <div className="w-20 h-20 bg-white rounded-[1.2rem] p-1 shadow-lg border border-slate-100 z-10 relative">
              {restaurantData?.logo_url ? <img src={restaurantData.logo_url} className="w-full h-full rounded-xl object-cover" /> : <div className="w-full h-full bg-amber-50 rounded-xl flex items-center justify-center text-2xl">{isBoutique ? '🛍️' : '👨‍🍳'}</div>}
            </div>
            
            <div className="flex flex-col items-end">
               <button onClick={toggleRestaurantStatus} className={`relative w-14 h-7 rounded-full transition-colors duration-300 shadow-inner border mb-1 ${restaurantData?.is_open ? 'bg-emerald-500 border-emerald-600' : 'bg-red-500 border-red-600'}`}>
                 <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${restaurantData?.is_open ? 'left-8' : 'left-1'}`}></div>
               </button>
               <span className={`text-[9px] font-black uppercase tracking-widest ${restaurantData?.is_open ? 'text-emerald-600' : 'text-red-500'}`}>{restaurantData?.is_open ? 'OUVERT' : 'FERMÉ'}</span>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">{restaurantData?.name || "Espace Partenaire"} <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md border border-amber-200 uppercase tracking-widest flex items-center gap-0.5">Pro 👑</span></h1>
            <p className="text-xs text-slate-500 font-medium mt-1">{restaurantData?.category || "Tableau de bord sécurisé"}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] shadow-inner">
          <button onClick={() => setActiveTab('commandes')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'commandes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Commandes</button>
          <button onClick={() => setActiveTab('menu')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'menu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{isBoutique ? 'Catalogue' : 'Menu'}</button>
          <button onClick={() => setActiveTab('journal')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'journal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Journal</button>
        </div>
      </div>

      {activeTab === 'menu' && (
        <div className="px-5 space-y-4 pb-10">
          <div className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-[2rem] shadow-sm">
            <div><h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{isBoutique ? 'Catalogue 🛍️' : 'Menu 🍽️'}</h2></div>
            <button onClick={() => openProductModal()} className="bg-slate-900 text-white px-4 py-3 rounded-[1rem] flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"><Plus size={16} /> Ajouter</button>
          </div>

          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="bg-white border border-slate-100 p-8 rounded-[2rem] text-center shadow-sm flex flex-col items-center justify-center gap-2">
                {isBoutique ? <Shirt size={32} className="text-slate-300"/> : <span className="text-3xl grayscale opacity-50">🍽️</span>}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{isBoutique ? 'Aucun article.' : 'Aucun plat.'}</p>
              </div>
            ) : (
              products.map(p => (
                <div key={p.id} className={`bg-white border p-3 rounded-[1.5rem] flex items-center gap-3 shadow-sm transition-all ${p.in_stock ? 'border-slate-100' : 'border-red-100 opacity-75'}`}>
                  <div className="w-20 h-20 bg-slate-50 rounded-[1rem] overflow-hidden border border-slate-100 shrink-0 relative flex items-center justify-center shadow-inner">
                    {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-slate-300"/>}
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{p.name || p.name_ar}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-black ${p.is_promo ? 'text-red-500' : 'text-amber-600'}`}>{p.is_promo && p.promo_price ? Number(p.promo_price).toFixed(3) : Number(p.price || 0).toFixed(3)} DT</span>
                      {p.is_promo && p.promo_price && <span className="text-[9px] text-slate-400 line-through">{Number(p.price || 0).toFixed(3)} DT</span>}
                    </div>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <button onClick={() => toggleProductStock(p)} className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border ${p.in_stock ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>{p.in_stock ? 'En Stock' : 'Rupture'}</button>
                      <button onClick={() => toggleProductSpecial(p)} className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border ${p.is_special ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}><Star size={8} className="inline mr-0.5"/> {isBoutique ? 'Vedette' : 'Spécial'}</button>
                      <button onClick={() => toggleProductPromo(p)} className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border ${p.is_promo ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}><Percent size={8} className="inline mr-0.5"/> Promo</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <button onClick={() => openProductModal(p)} className="bg-slate-900 text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase shadow-sm">Modifier</button>
                     <button onClick={() => deleteProduct(p.id)} className="text-red-400 text-[9px] font-black uppercase flex items-center justify-center gap-1"><Trash2 size={12}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'commandes' && (
        <div className="px-5 space-y-4 pb-10">
          {(orders || []).length === 0 ? (
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucune commande active</p>
            </div>
          ) : (
            (orders || []).map(order => {
              let itemsArray = [];
              try { itemsArray = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []); } catch(e) { itemsArray = []; }
              const orderFoodTotal = itemsArray.reduce((sum: number, item: any) => sum + (Number(item?.price || 0) * Number(item?.quantity || 1)), 0);
              return (
                <div key={order.id} className="bg-white border border-amber-100 p-5 rounded-[2rem] shadow-sm relative overflow-hidden mb-4">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  <div className="flex justify-between items-start border-b border-slate-50 pb-3 mb-3">
                    <p className="text-[10px] text-slate-400 font-mono">ID: #{String(order.id).split('-')[0].toUpperCase()}</p>
                    <p className="text-lg font-black text-slate-900">{orderFoodTotal.toFixed(3)} DT</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {itemsArray.map((item: any, idx: number) => (
                      <div key={idx} className="text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-xl flex justify-between">
                        <span>{item.name}</span><span className="text-amber-600">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  {order.status === 'confirmed' && (
                    <button onClick={() => updateOrderStatus(order.id, 'prete')} className="w-full bg-amber-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">Prête à Livrer</button>
                  )}
                  {order.status === 'prete' && (
                     <div className="w-full bg-emerald-50 text-emerald-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center border border-emerald-100">En attente du livreur</div>
                  )}
                  {order.status === 'delivered' && (
                     <div className="w-full bg-slate-100 text-slate-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">Livrée</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'journal' && (
        <div className="px-5 space-y-5 pb-10">
          <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Portefeuille Numérique 🦅</p>
            <h3 className="text-4xl font-black text-slate-900 mb-6">{(Number(netRestaurant) || 0).toFixed(3)} <span className="text-sm text-slate-400">DT</span></h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Brut</span><span className="font-mono text-slate-900">{(Number(totalBrut) || 0).toFixed(3)} DT</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-red-500">
                <span>Commission (10%)</span><span className="font-mono">- {(Number(commissionEagle) || 0).toFixed(3)} DT</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProductModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{currentProduct.id ? 'Modifier ✏️' : 'Ajouter ➕'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 bg-slate-50 rounded-full p-1"><XCircle size={20}/></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Nom (Français) *" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none" />
              <input type="text" placeholder="Nom (Arabe)" value={currentProduct.name_ar} onChange={e => setCurrentProduct({...currentProduct, name_ar: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold text-right" dir="rtl" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" step="0.001" placeholder="Prix (DT) *" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none" />
                <input type="number" step="0.001" placeholder="Promo (DT)" value={currentProduct.promo_price} onChange={e => setCurrentProduct({...currentProduct, promo_price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none" />
              </div>
              <select value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold uppercase">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="border-2 border-dashed border-slate-200 bg-slate-50 p-4 rounded-2xl text-center relative flex flex-col items-center">
                <input type="file" accept="image/*" onChange={e => e.target.files && setProductUploadFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                <Camera size={20} className="mb-1 text-amber-500"/>
                <p className="text-[9px] font-black text-slate-500 uppercase">{productUploadFile ? productUploadFile.name : 'Choisir image'}</p>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button type="button" onClick={() => setCurrentProduct({...currentProduct, in_stock: !currentProduct.in_stock})} className={`py-2 px-1 rounded-xl border text-[9px] font-black uppercase ${currentProduct.in_stock ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200'}`}>{currentProduct.in_stock ? 'En Stock' : 'Rupture'}</button>
                <button type="button" onClick={() => setCurrentProduct({...currentProduct, is_special: !currentProduct.is_special})} className={`py-2 px-1 rounded-xl border text-[9px] font-black uppercase ${currentProduct.is_special ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>Spécial</button>
                <button type="button" onClick={() => setCurrentProduct({...currentProduct, is_promo: !currentProduct.is_promo})} className={`py-2 px-1 rounded-xl border text-[9px] font-black uppercase ${currentProduct.is_promo ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>Promo</button>
              </div>
              <button disabled={isUploading || !currentProduct.name || !currentProduct.price} onClick={handleProductSave} className="w-full bg-slate-900 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">
                {isUploading ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-6 shadow-2xl space-y-4 no-scrollbar">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 sticky top-0 bg-white z-10">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Paramètres 👑</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 bg-slate-50 rounded-full p-1"><XCircle size={20}/></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Nom de l'établissement" value={settingsForm.name} onChange={e => setSettingsForm({...settingsForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none" />
              <input type="text" placeholder="Catégorie (Ex: Restaurant, Boutique)" value={settingsForm.category} onChange={e => setSettingsForm({...settingsForm, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none" />
              
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-dashed border-slate-200 bg-slate-50 p-4 rounded-2xl text-center relative">
                  <input type="file" accept="image/*" onChange={e => e.target.files && setLogoFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0" />
                  <p className="text-[9px] font-black text-slate-500 uppercase">{logoFile ? 'Logo Prêt' : 'Modifier Logo'}</p>
                </div>
                <div className="border border-dashed border-slate-200 bg-slate-50 p-4 rounded-2xl text-center relative">
                  <input type="file" accept="image/*" onChange={e => e.target.files && setBannerFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0" />
                  <p className="text-[9px] font-black text-slate-500 uppercase">{bannerFile ? 'Bannière Prête' : 'Modifier Bannière'}</p>
                </div>
              </div>
              <button disabled={isUploading} onClick={handleRestaurantSave} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
