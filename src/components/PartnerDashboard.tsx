import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Power, Settings, Plus, Edit2, Trash2, Clock, CheckCircle, XCircle, ShoppingBag, LayoutList, Wallet, Image as ImageIcon, Check } from 'lucide-react';

interface PartnerDashboardProps {
  onLogout: () => void;
}

export default function PartnerDashboard({ onLogout: _onLogout }: PartnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'commandes' | 'menu' | 'journal'>('commandes');
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for Upload & Add Product
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name_fr: '', price: '', category: 'PLAT', image_url: '' });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const categories = ['PLAT', 'SANDWICH', 'BOISSON', 'SUPPLÉMENT'];

  useEffect(() => {
    fetchDashboardData();
    const ordersSubscription = supabase
      .channel('partner_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchDashboardData)
      .subscribe();

    return () => { supabase.removeChannel(ordersSubscription); };
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Profile & Restaurant
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setPartnerProfile(profile);
        
        // جلب بيانات المطعم المربوط بهذا الشريك (أو المطعم الافتراضي للتجربة)
        const { data: resto } = await supabase.from('restaurants').select('*').limit(1).single();
        setRestaurantData(resto);

        // 2. Fetch Orders for this restaurant
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (ordersData) setOrders(ordersData);

        // 3. Fetch Products
        if (resto) {
          const { data: prods } = await supabase.from('products').select('*').eq('restaurant_id', resto.id).order('created_at', { ascending: false });
          if (prods) setProducts(prods);
        }
      }
    } catch (error) {
      console.error("Erreur de chargement", error);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadFile(e.target.files[0]);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name_fr || !newProduct.price || !restaurantData) return;
    setIsUploading(true);
    try {
      let finalImageUrl = newProduct.image_url;

      // ⬆️ رفع الصورة إلى Supabase Storage Bucket
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('products').upload(filePath, uploadFile);
        
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
          finalImageUrl = publicUrl;
        }
      }

      // إدراج المنتج في قاعدة البيانات
      await supabase.from('products').insert([{
        restaurant_id: restaurantData.id,
        name: newProduct.name_fr,
        name_fr: newProduct.name_fr,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        image_url: finalImageUrl,
        is_available: true
      }]);

      setShowAddModal(false);
      setNewProduct({ name_fr: '', price: '', category: 'PLAT', image_url: '' });
      setUploadFile(null);
      fetchDashboardData();
    } catch (error) {
      console.error("Erreur d'ajout", error);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if(confirm("Confirmer la suppression de cet article ?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchDashboardData();
    }
  };

  // 계산 المداخيل
  const activeOrders = orders.filter(o => ['confirmed', 'prete'].includes(o.status));
  const historyOrders = orders.filter(o => ['delivered', 'cancelled_timeout', 'cancelled_client', 'refused'].includes(o.status));
  const totalRevenue = historyOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + Number(o.total_price || 0), 0);

  if (isLoading) return <div className="h-screen w-screen bg-[#FDFBF7] flex items-center justify-center text-amber-500 font-black">CHARGEMENT...</div>;

  return (
    <div className="min-h-screen w-screen bg-[#FDFBF7] text-slate-900 font-sans overflow-x-hidden pb-24">
      
      {/* 👑 HEADER PREMIUM LIGHT */}
      <div className="bg-white border-b border-slate-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)] px-5 pt-8 pb-5 sticky top-0 z-40">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg border-2 border-white">
              👨‍🍳
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">{restaurantData?.name || "Partenaire"}</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Salutations, Chef / Gérant</p>
            </div>
          </div>
          <button onClick={_onLogout} className="bg-slate-50 p-2.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm">
            <Power size={18} />
          </button>
        </div>

        {/* 🟢 TOGGLE STATUT OUVERT/FERMÉ */}
        <div className={`mt-2 flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 shadow-sm ${restaurantData?.is_open ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Statut de la Cuisine</p>
            <p className={`text-sm font-black mt-0.5 ${restaurantData?.is_open ? 'text-emerald-600' : 'text-red-600'}`}>
              {restaurantData?.is_open ? 'OUVERT - Prêt à recevoir' : 'FERMÉ - Pause'}
            </p>
          </div>
          <button onClick={toggleRestaurantStatus} className={`relative w-16 h-8 rounded-full transition-colors duration-300 shadow-inner border ${restaurantData?.is_open ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-200 border-slate-300'}`}>
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${restaurantData?.is_open ? 'left-9' : 'left-1'}`}></div>
          </button>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS */}
      <div className="px-5 py-4">
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] shadow-inner">
          <button onClick={() => setActiveTab('commandes')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'commandes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            <ShoppingBag size={14}/> Commandes
            {activeOrders.length > 0 && <span className="bg-red-500 text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center animate-pulse">{activeOrders.length}</span>}
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
                
                {order.status === 'prete' && (
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-1"><Clock size={12}/> En attente du livreur...</p>
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
          <div className="flex justify-between items-center bg-slate-900 text-white p-5 rounded-[2rem] shadow-xl">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest">Gestion du Menu</h2>
              <p className="text-[9px] font-medium text-slate-400 mt-0.5">Produits & Spécialités</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="w-10 h-10 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="bg-white border border-slate-100 p-3 rounded-[1.5rem] flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-slate-50 rounded-[1rem] overflow-hidden border border-slate-100 shrink-0 flex items-center justify-center">
                  {p.image_url ? <img src={p.image_url} alt={p.name_fr} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-slate-300"/>}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-slate-900 leading-tight">{p.name_fr}</h4>
                  <p className="text-[9px] font-bold text-amber-600 mt-1">{Number(p.price).toFixed(3)} DT</p>
                </div>
                <div className="flex flex-col gap-1 pr-1">
                   <button className="bg-slate-50 p-2 rounded-lg text-slate-500 hover:text-amber-500 border border-slate-100 transition-colors"><Edit2 size={12}/></button>
                   <button onClick={() => deleteProduct(p.id)} className="bg-red-50 p-2 rounded-lg text-red-400 hover:text-red-600 border border-red-100 transition-colors"><Trash2 size={12}/></button>
                </div>
              </div>
            ))}
          </div>

          {/* 🖼️ MODAL UPLOAD PRODUIT */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nouveau Produit</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 bg-slate-50 rounded-full p-1"><XCircle size={20}/></button>
                </div>
                
                <div className="space-y-3">
                  <input type="text" placeholder="Nom du produit *" value={newProduct.name_fr} onChange={e => setNewProduct({...newProduct, name_fr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
                  
                  <input type="number" placeholder="Prix (ex: 12.500) *" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500" />
                  
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500 text-slate-600">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <div className="border-2 border-dashed border-slate-200 bg-slate-50 p-6 rounded-2xl text-center relative overflow-hidden">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <ImageIcon size={24} className="mx-auto mb-2 text-amber-500"/>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {uploadFile ? uploadFile.name : 'Upload Image (Optionnel)'}
                    </p>
                  </div>
                  
                  <button disabled={isUploading || !newProduct.name_fr || !newProduct.price} onClick={handleAddProduct} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-md mt-2 flex justify-center items-center gap-2">
                    {isUploading ? 'Sauvegarde...' : <><Check size={16}/> Enregistrer</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 💰 TAB 3: PORTEFEUILLE & JOURNAL */}
      {activeTab === 'journal' && (
        <div className="px-5 space-y-5 pb-10">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden border border-slate-700">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={80}/></div>
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-1">Portefeuille Numérique Professionnel</p>
            <p className="text-[10px] text-slate-400 font-medium mb-4">Solde des commandes livrées</p>
            <h3 className="text-3xl font-black font-sans tracking-tight">{totalRevenue.toFixed(3)} <span className="text-sm text-slate-400">DT</span></h3>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 mb-2">Historique des Ventes</h4>
            {historyOrders.length === 0 ? (
              <p className="text-[10px] text-slate-400 text-center font-bold py-4">Aucun historique disponible.</p>
            ) : (
              historyOrders.map(order => (
                <div key={order.id} className="bg-white border border-slate-100 p-4 rounded-[1.5rem] flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[10px] font-black text-slate-800">Commande #{order.id.substring(0,6).toUpperCase()}</p>
                    <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${order.status === 'delivered' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {order.status === 'delivered' ? 'LIVRÉE' : 'ANNULÉE / REFUSÉE'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-black font-mono ${order.status === 'delivered' ? 'text-emerald-600' : 'text-slate-400 line-through'}`}>
                      {Number(order.total_price).toFixed(3)} DT
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
