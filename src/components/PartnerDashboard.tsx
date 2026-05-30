import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';

export default function PartnerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [restaurantStatus, setRestaurantStatus] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  // استخدام useRef للحفاظ على العدد السابق للطلبات في حالة الانتظار منعا للتكرار المزعج
  const prevPendingCountRef = useRef<number>(0);

  // حالات النافذة المنبثقة للتعديل الاحترافي
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // دالة تشغيل صوت النسر التنبيهي
  const playEagleSound = () => {
    const audio = new Audio("https://www.soundjay.com/nature/sounds/eagle-call-01.mp3");
    audio.volume = 0.8;
    audio.play().catch(err => console.log("Audio auto-play interaction constraint:", err));
  };

  const fetchLiveAndRealData = async () => {
    try {
      const { data: restData } = await supabase
        .from('restaurants')
        .select('is_open')
        .eq('id', 1)
        .single();
      if (restData) setRestaurantStatus(restData.is_open);

      const { data: fetchedOrders } = await supabase
        .from('orders')
        .select(`*, order_items (*)`)
        .order('created_at', { ascending: false });

      const { data: fetchedMenu } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (fetchedMenu) setMenuItems(fetchedMenu);
      
      if (fetchedOrders) {
        // حساب عدد الطلبات الحالية التي في حالة انتظار
        const currentPendingCount = fetchedOrders.filter(o => o.status === 'en_attente').length;
        
        // إذا زاد عدد الطلبات المنتظرة عن المرة السابقة، نطلق الصوت فورا
        if (currentPendingCount > prevPendingCountRef.current) {
          playEagleSound();
        }
        
        // تحديث المرجع بالعدد الحالي
        prevPendingCountRef.current = currentPendingCount;
        setOrders(fetchedOrders);
      }
    } catch (err) {
      console.error("Error loading real-time data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAndRealData();

    // التسمع للحركات والتغيرات بشكل مستقر
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchLiveAndRealData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleToggleKitchen = async () => {
    const nextStatus = !restaurantStatus;
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({ is_open: nextStatus })
        .eq('id', 1);

      if (error) throw error;
      setRestaurantStatus(nextStatus);
      alert(`🦅 تم تحديث حالة المطبخ إلى: ${nextStatus ? 'مفتوح 🟢' : 'مغلق 🔴'}`);
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'accepte' })
        .eq('id', orderId);
      if (error) throw error;
      fetchLiveAndRealData();
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
  };

  const handleRefuseOrder = async (orderId: string) => {
    if (!window.confirm("هل أنت متأكد من إلغاء هذا الطلب؟ ⚠️")) return;
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'annule' })
        .eq('id', orderId);
      if (error) throw error;
      fetchLiveAndRealData();
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
  };

  const handleToggleStock = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: !currentStatus })
        .eq('id', productId);
      if (error) throw error;
      fetchLiveAndRealData();
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setEditName(product.name || '');
    setEditPrice(product.price?.toString() || '');
    setEditImageUrl(product.image_url || '');
    setIsEditModalOpen(true);
  };

  const handleSaveProductChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !editName || !editPrice) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editName,
          price: parseFloat(editPrice),
          image_url: editImageUrl
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;
      setIsEditModalOpen(false);
      fetchLiveAndRealData();
      alert("🦅 تم تحديث البيانات بنجاح!");
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b111e] text-white p-4 font-sans select-none relative" dir="ltr">
      
      {/* الترويسة العلوية */}
      <div className="bg-[#161f30] p-4 rounded-2xl border border-gray-800/80 mb-6 flex justify-between items-center shadow-xl">
        <div>
          <h1 className="text-base font-black tracking-tight text-white">Eagle TN • Partner</h1>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">Espace Gestion de Restaurant</p>
        </div>
        
        <button 
          onClick={handleToggleKitchen}
          className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer ${restaurantStatus ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${restaurantStatus ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-[9px] font-extrabold tracking-wider uppercase">
            {restaurantStatus ? 'Cuisine Ouverte' : 'Cuisine Fermée'}
          </span>
        </button>
      </div>

      {/* 1. قسم الطلبات المباشرة */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-black border-l-4 border-amber-500 pl-2.5 tracking-wide text-gray-100">
            Suivi des Commandes En Direct
          </h2>
          {/* زر اختبار يدوي للصوت لكسر حماية المتصفح عند أول دخول */}
          <button 
            onClick={playEagleSound}
            className="text-[10px] text-red-400 font-black flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg cursor-pointer active:scale-95 transition-all"
          >
            ⚠️ Alerte Sonore Active 🔊
          </button>
        </div>

        {orders.filter(o => o.status !== 'annule' && o.status !== 'livre').length === 0 ? (
          <div className="bg-[#161f30] p-6 rounded-2xl border border-gray-800/80 text-center py-10">
            <p className="text-xs text-gray-400 font-bold">Aucune commande active</p>
            <p className="text-amber-500/80 font-black text-[11px] mt-1">بانتظار طلبات جديدة حية... 🦅</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.filter(o => o.status !== 'annule' && o.status !== 'livre').map((order) => (
              <div key={order.id} className="bg-[#161f30] p-4 rounded-2xl border-2 border-amber-500/90 shadow-2xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[9px] text-gray-500 font-mono block">ID: #EAG-{order.id.slice(0,4).toUpperCase()}</span>
                    <h3 className="text-xs font-black text-gray-200 mt-0.5">Client: {order.customer_name}</h3>
                  </div>
                  <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-wide">
                    {order.status === 'en_attente' ? 'Nouveau 🔥' : order.status === 'accepte' ? 'Accepté 🧑‍🍳' : order.status}
                  </span>
                </div>
                
                <div className="border-t border-gray-800/80 my-3 pt-3 text-xs text-gray-300 space-y-1.5 font-semibold">
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item: any, idx: number) => (
                      <p key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span className="font-mono text-gray-400">{(item.price * item.quantity).toFixed(3)} DT</span>
                      </p>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-500 italic">Aucun article spécifié</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-800/60 pt-3 mt-3">
                  <span className="text-xs text-gray-400 font-bold">Total à encaisser:</span>
                  <span className="text-sm font-black text-amber-500 font-mono">{Number(order.total_price).toFixed(3)} DT</span>
                </div>

                {order.status === 'en_attente' && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <button 
                      onClick={() => handleAcceptOrder(order.id)}
                      className="col-span-3 bg-[#10b981] hover:bg-[#0e9f6e] text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-md active:scale-95"
                    >
                      Accepter & Préparer
                    </button>
                    <button 
                      onClick={() => handleRefuseOrder(order.id)}
                      className="col-span-1 bg-[#1e293b] hover:bg-red-950/40 text-red-400 font-black text-xs py-3 rounded-xl border border-gray-800 transition-all active:scale-95"
                    >
                      Refuser
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📋 2. قسم إدارة قائمة المأكولات */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-black border-l-4 border-blue-500 pl-2.5 tracking-wide text-gray-100">
            Gestion de la Carte (Menu)
          </h2>
        </div>

        <div className="bg-[#161f30] rounded-2xl border border-gray-800 divide-y divide-gray-800/50 overflow-hidden shadow-2xl">
          {menuItems.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#0b111e] overflow-hidden flex-shrink-0 border border-gray-800 flex items-center justify-center text-xl">
                  {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : "🍲"}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-gray-200 truncate">{item.name}</h4>
                  <p className="text-xs text-amber-500 font-black font-mono mt-1">{Number(item.price).toFixed(3)} DT</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={() => openEditModal(item)}
                  className="bg-[#1e293b] hover:bg-[#334155] text-gray-300 font-black text-[11px] px-3 py-2 rounded-xl border border-gray-800 transition-all active:scale-95"
                >
                  ✏️ Editer
                </button>
                <button 
                  onClick={() => handleToggleStock(item.id, item.in_stock !== false)}
                  className={`font-black text-[11px] px-3 py-2 rounded-xl border transition-all active:scale-95 ${item.in_stock !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                >
                  {item.in_stock !== false ? 'Stock' : 'Épuisé'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📥 3. النافذة المنبثقة للتعديل */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#0b111e]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161f30] w-full max-w-sm rounded-3xl p-5 border border-gray-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-sm font-black text-white">✏️ Modifier l'Article</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 font-black text-xs bg-[#0b111e] w-6 h-6 rounded-full flex items-center justify-center border border-gray-800">✕</button>
            </div>

            <form onSubmit={handleSaveProductChanges} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 block mb-1 uppercase">Nom du Plat *</label>
                <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-[#0b111e] border border-gray-800 rounded-xl p-3 text-xs font-bold outline-none text-white focus:border-amber-500" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 block mb-1 uppercase">Prix (DT) *</label>
                <input type="number" step="0.001" required value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full bg-[#0b111e] border border-gray-800 rounded-xl p-3 text-xs font-bold outline-none text-white focus:border-amber-500" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 block mb-1 uppercase">URL de l'image</label>
                <input type="text" value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} className="w-full bg-[#0b111e] border border-gray-800 rounded-xl p-3 text-xs font-bold outline-none text-white focus:border-amber-500" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-1/3 bg-[#1e293b] text-gray-400 font-black py-3 rounded-xl text-xs">Annuler</button>
                <button type="submit" disabled={isSubmitting} className="w-2/3 bg-amber-500 text-slate-950 font-black py-3 rounded-xl text-xs">{isSubmitting ? 'Enregistrement...' : 'Sauvegarder 🚀'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
