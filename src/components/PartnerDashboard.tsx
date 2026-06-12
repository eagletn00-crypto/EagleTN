import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Power, Settings, Plus, Edit2, Trash2, Clock, CheckCircle, ShoppingBag, LayoutList, Wallet, Image as ImageIcon, Check, Star, MapPin, XCircle, Camera, AlertCircle, Percent, Shirt } from 'lucide-react';

interface PartnerDashboardProps {
  onLogout: () => void;
}

export default function PartnerDashboard({ onLogout: _onLogout }: PartnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'commandes' | 'menu' | 'journal'>('menu'); 
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals UI
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Product Form State (مطابق 100% لأعمدة جدول Supabase الحقيقية)
  const [currentProduct, setCurrentProduct] = useState<any>({
    id: null,
    name: '',
    name_ar: '',
    price: '',
    promo_price: '',
    is_promo: false,
    category: 'PLAT',
    image_url: '',
    in_stock: true,
    is_special: false
  });
  const [productUploadFile, setProductUploadFile] = useState<File | null>(null);

  // Restaurant Settings Form State
  const [settingsForm, setSettingsForm] = useState<any>({
    name: '',
    description: '',
    address: '',
    opening_time: '',
    closing_time: '',
    logo_url: '',
    cover_url: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const categories = ['PLAT', 'SANDWICH', 'BOISSON', 'SUPPLÉMENT'];

  useEffect(() => {
    fetchDashboardData();
    const subscription = supabase.channel('partner_secure_stream_v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchDashboardData)
      .subscribe();
      
    return () => { supabase.removeChannel(subscription); };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. جلب بيانات المتجر بناء على البريد أو الجلسة لمنع تداخل الشركاء
      const { data: restos } = await supabase.from('restaurants').select('*');
      let currentStore = null;

      if (restos && restos.length > 0) {
        const userEmail = user.email || '';
        currentStore = restos.find(r => 
          (r.restaurant_url && userEmail.includes(r.restaurant_url)) ||
          (r.store_type && userEmail.toLowerCase().includes(r.store_type.toLowerCase())) ||
          (r.name && userEmail.toLowerCase().includes(r.name.toLowerCase().split(' ')[0]))
        ) || restos[0];
      }

      if (currentStore) {
        setRestaurantData(currentStore);
        setSettingsForm({
          name: currentStore.name || '',
          description: currentStore.description || '',
          address: currentStore.address || '',
          opening_time: currentStore.opening_time || '',
          closing_time: currentStore.closing_time || '',
          logo_url: currentStore.logo_url || '',
          cover_url: currentStore.cover_url || ''
        });

        // 🛠️ جلب معزول وصارم للمنتجات التابعة لهذا المعرف فقط لحل مشكلة ظهور عم علي للبقية
        const { data: prods } = await supabase.from('products')
          .select('*')
          .eq('restaurant_id', currentStore.id)
          .order('created_at', { ascending: false });
        
        setProducts(prods || []);

        // جلب الطلبات وفلترتها محاسبياً للـ Journal
        const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (ordersData) {
          const partnerOrders = ordersData.filter(order => {
            let itemsArray = [];
            try { itemsArray = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []); } catch(e) { itemsArray = []; }
            return itemsArray.some((item: any) => (prods || []).some(p => p.name === item.name));
          });
          setOrders(partnerOrders.length > 0 ? partnerOrders : ordersData);
        }
      }
      
    } catch (error) {
      console.error("Erreur de filtrage dynamique", error);
    } finally {
      setIsLoading(false);
    }
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
    await supabase.from('products').update({ in_stock: !p.in_stock }).eq('id', p.id);
    fetchDashboardData();
  };

  const toggleProductSpecial = async (p: any) => {
    await supabase.from('products').update({ is_special: !p.is_special }).eq('id', p.id);
    fetchDashboardData();
  };

  const toggleProductPromo = async (p: any) => {
    await supabase.from('products').update({ is_promo: !p.is_promo }).eq('id', p.id);
    fetchDashboardData();
  };

  const deleteProduct = async (id: string) => {
    if(confirm("Supprimer cet article définitivement ?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchDashboardData();
    }
  };

  const openProductModal = (prod: any = null) => {
    if (prod) {
      setCurrentProduct({
        id: prod.id,
        name: prod.name || '',
        name_ar: prod.name_ar || '',
        price: prod.price || '',
        promo_price: prod.promo_price || '',
        is_promo: prod.is_promo ?? false,
        category: prod.category || 'PLAT',
        image_url: prod.image_url || '',
        in_stock: prod.in_stock ?? true,
        is_special: prod.is_special ?? false
      });
    } else {
      setCurrentProduct({
        id: null,
        name: '',
        name_ar: '',
        price: '',
        promo_price: '',
        is_promo: false,
        category: restaurantData?.store_type === 'boutique' ? 'SUPPLÉMENT' : 'PLAT',
        image_url: '',
        in_stock: true,
        is_special: false
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
        name: currentProduct.name,
        name_ar: currentProduct.name_ar,
        price: parseFloat(currentProduct.price),
        promo_price: currentProduct.promo_price ? parseFloat(currentProduct.promo_price) : null,
        is_promo: currentProduct.is_promo,
        category: currentProduct.category,
        image_url: finalImageUrl,
        in_stock: currentProduct.in_stock,
        is_special: currentProduct.is_special
      };

      if (currentProduct.id) {
        await supabase.from('products').update(payload).eq('id', currentProduct.id);
      } else {
        await supabase.from('products').insert([payload]);
      }

      setShowProductModal(false);
      fetchDashboardData();
    } catch (e) { console.error(e); } 
    finally { setIsUploading(false); }
  };

  const handleRestaurantSave = async () => {
    if (!restaurantData) return;
    setIsUploading(true);
    try {
      let finalLogo = settingsForm.logo_url;
      let finalCover = settingsForm.cover_url;

      if (logoFile) { const url = await uploadToStorage(logoFile); if (url) finalLogo = url; }
      if (coverFile) { const url = await uploadToStorage(coverFile); if (url) finalCover = url; }

      await supabase.from('restaurants').update({
        name: settingsForm.name,
        description: settingsForm.description,
        address: settingsForm.address,
        opening_time: settingsForm.opening_time,
        closing_time: settingsForm.closing_time,
        logo_url: finalLogo,
        cover_url: finalCover
      }).eq('id', restaurantData.id);

      setShowSettingsModal(false);
      fetchDashboardData();
    } catch (e) { console.error(e); } 
    finally { setIsUploading(false); }
  };

  const isBoutique = restaurantData?.store_type === 'boutique';
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  let totalBrut = 0;
  deliveredOrders.forEach(order => {
    try {
      let itemsArray = [];
      if (typeof order.items === 'string') {
         itemsArray = JSON.parse(order.items || '[]');
      } else if (Array.isArray(order.items)) {
         itemsArray = order.items;
      }
      if (Array.isArray(itemsArray)) {
        itemsArray.forEach((item: any) => {
          if (item) {
            totalBrut += (Number(item.price || 0) * Number(item.quantity || 1));
          }
        });
      }
    } catch (e) { console.error(e); }
  });

  const commissionEagle = totalBrut * 0.10;
  const netRestaurant = totalBrut - commissionEagle;

  if (isLoading) return <div className="h-screen w-screen bg-[#FDFBF7] flex items-center justify-center text-slate-400 font-black tracking-widest text-xs">EAGLE GROUPE TN...</div>;

  return (
    <div className="min-h-screen w-screen bg-[#FDFBF7] text-slate-900 font-sans overflow-x-hidden pb-24">
      
      {/* 👑 PREMIUM HEADER */}
      <div className="bg-white border-b border-slate-100 shadow-sm relative">
        <div className="h-32 bg-slate-200 relative overflow-hidden">
          {restaurantData?.cover_url ? <img src={restaurantData.cover_url} className="w-full h-full object-cover opacity-90" /> : <div className="w-full h-full bg-slate-800"></div>}
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => setShowSettingsModal(true)} className="bg-white/90 backdrop-blur text-slate-700 p-2 rounded-full shadow-md hover:text-amber-600 transition-colors"><Settings size={18}/></button>
            <button onClick={_onLogout} className="bg-white/90 backdrop-blur text-slate-700 p-2 rounded-full shadow-md hover:text-red-600 transition-colors"><Power size={18}/></button>
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
            <p className="text-xs text-slate-500 font-medium mt-1">{restaurantData?.description || "Tableau de bord officiel connecté."}</p>
            <div className="flex gap-4 mt-2 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-300"/> {restaurantData?.address || "Tunis, Tunisie"}</span>
              <span className="flex items-center gap-1"><Clock size={12} className="text-slate-300"/> {restaurantData?.opening_time || "00:00"} - {restaurantData?.closing_time || "23:59"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 NAV TABS */}
      <div className="px-5 py-4">
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] shadow-inner">
          <button onClick={() => setActiveTab('commandes')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'commandes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
             Commandes
          </button>
          <button onClick={() => setActiveTab('menu')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'menu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
             Menu
          </button>
          <button onClick={() => setActiveTab('journal')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'journal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
             Journal
          </button>
        </div>
      </div>

      {/* 🍔 TAB 2: MENU */}
      {activeTab === 'menu' && (
        <div className="px-5 space-y-4 pb-10">
          <div className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-[2rem] shadow-sm">
            <div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                {isBoutique ? 'Gestion du Catalogue 🛍️' : 'Gestion du Menu 🍽️'}
              </h2>
              <p className="text-[9px] font-medium text-slate-400 mt-0.5">
                {isBoutique ? 'Modifier les prix, photos, promos et stocks d\'articles' : 'Modifier les prix, photos, promos et stocks de plats'}
              </p>
            </div>
            <button onClick={() => openProductModal()} className="bg-slate-900 text-white px-4 py-3 rounded-[1rem] flex items-center gap-1.5 text-xs font-black uppercase tracking-widest">
              <Plus size={16} /> {isBoutique ? 'Ajouter un article' : 'Ajouter un plat'}
            </button>
          </div>

          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="bg-white border border-slate-100 p-8 rounded-[2rem] text-center shadow-sm flex flex-col items-center justify-center gap-2">
                {isBoutique ? <Shirt size={32} className="text-slate-300"/> : <span>🍽️</span>}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {isBoutique ? 'Aucun article disponible pour votre établissement.' : 'Aucun plat disponible pour votre établissement.'}
                </p>
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
                      <span className={`text-xs font-black ${p.is_promo ? 'text-red-500' : 'text-amber-600'}`}>
                        {p.is_promo && p.promo_price ? Number(p.promo_price).toFixed(3) : Number(p.price || 0).toFixed(3)} DT
                      </span>
                      {p.is_promo && p.promo_price && (
                        <span className="text-[9px] text-slate-400 line-through">{Number(p.price).toFixed(3)} DT</span>
                      )}
                    </div>
                    
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <button onClick={() => toggleProductStock(p)} className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border ${p.in_stock ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {p.in_stock ? 'En Stock' : 'Rupture'}
                      </button>
                      <button onClick={() => toggleProductSpecial(p)} className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border flex items-center gap-0.5 ${p.is_special ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        <Star size={8} className={p.is_special ? 'fill-amber-500 text-amber-500' : ''}/> {isBoutique ? 'En Vedette' : 'Spécial'}
                      </button>
                      <button onClick={() => toggleProductPromo(p)} className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border flex items-center gap-0.5 ${p.is_promo ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        <Percent size={8}/> Promo
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <button onClick={() => openProductModal(p)} className="bg-slate-900 text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                       Modifier <Camera size={12}/>
                     </button>
                     <button onClick={() => deleteProduct(p.id)} className="text-red-400 text-[9px] font-black uppercase flex items-center justify-center gap-1">
                       <Trash2 size={12}/>
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 📦 TAB 1: COMMANDES */}
      {activeTab === 'commandes' && (
        <div className="px-5 space-y-4 pb-10">
          {activeOrders.length === 0 ? (
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucune commande active</p>
            </div>
          ) : (
            activeOrders.map(order => {
              let itemsArray = [];
              try { itemsArray = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []); } catch(e) { itemsArray = []; }
              const orderFoodTotal = itemsArray.reduce((sum: number, item: any) => sum + (Number(item?.price || 0) * Number(item?.quantity || 1)), 0);
              return (
                <div key={order.id} className="bg-white border border-amber-100 p-5 rounded-[2rem] shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  <div className="flex justify-between items-start border-b border-slate-50 pb-3 mb-3">
                    <p className="text-[10px] text-slate-400 font-mono">ID: #{order.id.split('-')[0].toUpperCase()}</p>
                    <p className="text-lg font-black text-slate-900">{orderFoodTotal.toFixed(3)} DT</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {itemsArray.map((item: any, idx: number) => (
                      <div key={idx} className="text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-xl flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-amber-600">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  {order.status === 'confirmed' && (
                    <button onClick={() => updateOrderStatus(order.id, 'prete')} className="w-full bg-amber-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
                      {isBoutique ? 'Marquer comme Prêt à livrer' : 'Marquer comme Prête'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 💰 TAB 3: JOURNAL */}
      {activeTab === 'journal' && (
        <div className="px-5 space-y-5 pb-10">
          <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Portefeuille Numérique 🦅</p>
            <h3 className="text-4xl font-black text-slate-900 mb-6">{netRestaurant.toFixed(3)} <span className="text-sm text-slate-400">DT</span></h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Chiffre d'affaires Brut</span>
                <span className="font-mono text-slate-900">{totalBrut.toFixed(3)} DT</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-red-500">
                <span>Commission Eagle (10%)</span>
                <span className="font-mono">- {commissionEagle.toFixed(3)} DT</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ MODAL MODIFIER PRODUIT */}
      {showProductModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                {currentProduct.id ? (isBoutique ? 'Modifier l\'article ✏️' : 'Modifier le plat ✏️') : (isBoutique ? 'Ajouter un article ➕' : 'Ajouter un plat ➕')}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 bg-slate-50 rounded-full p-1"><XCircle size={20}/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">
                  {isBoutique ? 'Nom de l\'article (Français) *' : 'Nom du plat (Français) *'}
                </label>
                <input type="text" placeholder="Ex: Veste en cuir / Pizza" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">
                  {isBoutique ? 'Nom de l\'article (Arabe)' : 'Nom du plat (Arabe)'}
                </label>
                <input type="text" placeholder="Ex: قميص" value={currentProduct.name_ar} onChange={e => setCurrentProduct({...currentProduct, name_ar: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500 text-right" dir="rtl" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Prix Normal (DT) *</label>
                  <input type="number" step="0.001" placeholder="12.500" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Prix Promo (DT)</label>
                  <input type="number" step="0.001" placeholder="10.000" value={currentProduct.promo_price} onChange={e => setCurrentProduct({...currentProduct, promo_price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Catégorie *</label>
                <select value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold text-slate-600 uppercase">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">
                  {isBoutique ? 'Photo de l\'article' : 'Photo du plat'}
                </label>
                <div className="border-2 border-dashed border-slate-200 bg-slate-50 p-4 rounded-2xl text-center relative overflow-hidden flex flex-col items-center">
                  <input type="file" accept="image/*" onChange={e => e.target.files && setProductUploadFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <Camera size={20} className="mb-1 text-amber-500"/>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{productUploadFile ? productUploadFile.name : 'Choisir depuis le téléphone 📱'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button type="button" onClick={() => setCurrentProduct({...currentProduct, in_stock: !currentProduct.in_stock})} className={`py-2 px-1 rounded-xl border text-[9px] font-black uppercase ${currentProduct.in_stock ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-500'}`}>
                  {currentProduct.in_stock ? 'En Stock' : 'Rupture'}
                </button>
                <button type="button" onClick={() => setCurrentProduct({...currentProduct, is_special: !currentProduct.is_special})} className={`py-2 px-1 rounded-xl border text-[9px] font-black uppercase flex items-center justify-center gap-0.5 ${currentProduct.is_special ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <Star size={10} className={currentProduct.is_special ? 'fill-amber-500 text-amber-500' : ''}/> {isBoutique ? 'En Vedette' : 'Spécial'}
                </button>
                <button type="button" onClick={() => setCurrentProduct({...currentProduct, is_promo: !currentProduct.is_promo})} className={`py-2 px-1 rounded-xl border text-[9px] font-black uppercase flex items-center justify-center gap-0.5 ${currentProduct.is_promo ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <Percent size={10}/> {currentProduct.is_promo ? 'Promo Actif' : 'Normal'}
                </button>
              </div>
              
              <button disabled={isUploading || !currentProduct.name || !currentProduct.price} onClick={handleProductSave} className="w-full bg-slate-900 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-md">
                {isUploading ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ MODAL RESTAURANT SETTINGS */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-6 shadow-2xl space-y-4 no-scrollbar">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 sticky top-0 bg-white z-10">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Paramètres Profil Pro 👑</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-red-500 bg-slate-50 rounded-full p-1"><XCircle size={20}/></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Nom de l'établissement" value={settingsForm.name} onChange={e => setSettingsForm({...settingsForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none" />
              <textarea placeholder="Description / Message" value={settingsForm.description} onChange={e => setSettingsForm({...settingsForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none h-20" />
              <button disabled={isUploading} onClick={handleRestaurantSave} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
