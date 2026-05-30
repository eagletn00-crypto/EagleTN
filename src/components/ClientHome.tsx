import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function ClientHome() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // حالات النموذج المنبثق للشركاء
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: restData } = await supabase.from('restaurants').select('*');
      const { data: prodData } = await supabase.from('products').select('*');
      
      if (restData) setRestaurants(restData);
      if (prodData) setProducts(prodData);
    } catch (err) {
      console.error("خطأ أثناء جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = () => {
    const items = JSON.parse(localStorage.getItem('eagle_cart') || '[]');
    setCartCount(items.length);
  };

  useEffect(() => {
    fetchData();
    updateCartCount();
    window.addEventListener('cart_updated', updateCartCount);
    return () => window.removeEventListener('cart_updated', updateCartCount);
  }, []);

  const addToCart = (product: any) => {
    const items = JSON.parse(localStorage.getItem('eagle_cart') || '[]');
    items.push(product);
    localStorage.setItem('eagle_cart', JSON.stringify(items));
    updateCartCount();
    alert(`🦅 تمت إضافة ${product.name} إلى السلة!`);
  };

  const handleFilterClick = (term: string) => {
    setSearchQuery(term);
    const container = document.getElementById('products-section');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !businessName || !partnerPhone) {
      alert('الرجاء ملء كافة الحقول ⚠️');
      return;
    }
    setIsSubmittingLead(true);
    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          customer_name: `[Partner Lead] ${partnerName} (${businessName})`,
          customer_phone: partnerPhone,
          customer_address: 'طلب انضمام شريك جديد عبر البنر',
          status: 'En attente',
          total_price: 0
        }]);

      if (error) throw error;
      alert('Merci! Demande reçue. 🚀🦅');
      setShowPartnerModal(false);
      setPartnerName('');
      setBusinessName('');
      setPartnerPhone('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50/70 min-h-screen pb-32 font-sans antialiased text-gray-900">
      
      {/* 1. الترويسة العلوية الفخمة بأسلوب آبل */}
      <div className="bg-white px-5 pt-5 pb-4 flex items-center justify-between sticky top-0 z-40 border-b border-gray-100/80 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-3">
          <span className="text-3xl filter drop-shadow-[0_2px_4px_rgba(239,68,68,0.15)]">🦅</span>
          <div>
            <h1 className="text-base font-black tracking-wider text-gray-950">
              {selectedRestaurant ? selectedRestaurant.name : 'EAGLE.TN'}
            </h1>
            <span className="text-[9px] bg-red-50 text-red-600 border border-red-200/50 px-2 py-0.5 rounded-md font-extrabold tracking-widest block mt-0.5 w-fit">
              {selectedRestaurant ? `${selectedRestaurant.category || 'Menu'}` : '🏛️ STARTUP ACT'}
            </span>
          </div>
        </div>
        
        <Link to="/cart" className="relative p-2.5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-800">
          <span className="text-base">🛒</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* واجهة المطاعم الرئيسية الكبرى (Accueil) */}
      {!selectedRestaurant ? (
        <>
          {/* 2. بنر استقطاب الشركاء التفاعلي */}
          <div 
            onClick={() => setShowPartnerModal(true)}
            className="mx-4 mt-4 bg-gradient-to-r from-red-600 via-red-500 to-red-700 p-4 rounded-[24px] shadow-sm text-white flex justify-between items-center relative overflow-hidden cursor-pointer transform active:scale-[0.99] transition-all hover:opacity-95"
          >
            <div className="absolute right-0 top-0 opacity-10 text-7xl translate-x-4 -translate-y-2 font-black">🦅</div>
            <div className="space-y-1 pr-2">
              <span className="text-xs font-black uppercase tracking-wider block">Livraison Premium 4K</span>
              <p className="text-[11px] text-white font-bold underline decoration-white/50 underline-offset-2">
                Pour devenir partenaire, laissez vos informations ou contactez-nous 💬
              </p>
            </div>
            <span className="text-[9px] bg-white text-red-600 px-2 py-1 rounded-xl font-black uppercase shrink-0 shadow-sm">
              Rejoindre
            </span>
          </div>

          {/* 3. شريط البحث الانسيابي عن المطاعم */}
          <div className="px-4 mt-4">
            <div className="bg-white border border-gray-200/80 rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm focus-within:border-red-500 transition-colors">
              <span className="text-gray-400 text-sm">🔍</span>
              <input 
                type="text" 
                placeholder="Rechercher un restaurant ou une spécialité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold outline-none text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* 4. فئات الخدمات المربعة الفاخرة */}
          <div className="px-4 mt-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Espaces de commande</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-100 p-4 rounded-[24px] flex items-center justify-between shadow-sm">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-gray-900 block">Pâtisserie</span>
                  <span className="text-[9px] text-gray-400 font-bold">Gâteaux & Délices</span>
                </div>
                <span className="text-2xl">🎂</span>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-[24px] flex items-center justify-between shadow-sm">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-gray-900 block">Shopping</span>
                  <span className="text-[9px] text-gray-400 font-bold">Boutiques TN</span>
                </div>
                <span className="text-2xl">🛍️</span>
              </div>
            </div>
          </div>

          {/* 5. عرض قائمة المطاعم مع الـ Cover والـ Logo الحقيقي */}
          <div className="mt-7 px-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Nos Partenaires Premium
            </h3>
            
            {loading ? (
              <p className="text-center text-xs text-gray-400 py-4">جاري تحميل المطاعم المتوفرة... 🍲</p>
            ) : filteredRestaurants.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">لا توجد مطاعم متوفرة حالياً.</p>
            ) : (
              <div className="space-y-4">
                {filteredRestaurants.map((rest) => {
                  // جلب الصورة الحقيقية للغلاف والشعار من الجداول أو وضع كروت افتراضية فخمة في حال غيابها
                  const coverImg = rest.cover_url || rest.banner_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80";
                  const logoImg = rest.logo_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80";

                  return (
                    <div 
                      key={rest.id}
                      onClick={() => { setSelectedRestaurant(rest); setSearchQuery(''); }}
                      className="bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all transform active:scale-[0.99] cursor-pointer group"
                    >
                      {/* عرض الـ Cover الفاخر للمطعم */}
                      <div className="relative h-40 bg-slate-100 overflow-hidden">
                        <img 
                          src={coverImg} 
                          alt={rest.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      </div>

                      {/* عرض الـ Logo وبيانات المطعم أسفل الـ Cover */}
                      <div className="p-4 flex items-center justify-between gap-3 relative">
                        <div className="flex items-center gap-3">
                          {/* شعار المطعم الدائري المستقل */}
                          <img 
                            src={logoImg} 
                            alt="" 
                            className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-white shrink-0"
                          />
                          <div>
                            <h4 className="font-black text-sm text-gray-900 group-hover:text-red-600 transition-colors">{rest.name}</h4>
                            <p className="text-[11px] text-gray-400 font-bold mt-0.5">{rest.category || 'Traditional'} • Cité Ibn Khaldoun</p>
                          </div>
                        </div>

                        <span className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-red-100/50 shrink-0">
                          Menu 📋
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        /* واجهة الـ Menu الحصرية للمطعم المختار */
        <div className="px-4 mt-4 animate-fade-in">
          
          <button 
            onClick={() => setSelectedRestaurant(null)}
            className="mb-4 bg-gray-950 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1 active:scale-95 transition-transform"
          >
            ← Retour aux restaurants
          </button>

          {/* ترويسة المنيو مع الـ Logo الصغير */}
          <div className="bg-white p-4 rounded-2xl border mb-4 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-3">
              {selectedRestaurant.logo_url && (
                <img src={selectedRestaurant.logo_url} className="w-10 h-10 rounded-full object-cover border shadow-sm" alt="" />
              )}
              <div>
                <h3 className="font-black text-xs text-gray-400">قائمة مأكولات</h3>
                <p className="text-base font-black text-gray-900">{selectedRestaurant.name}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">★ 4.8</span>
          </div>

          {/* وجبات المطعم الحقيقية بالتصميم العالمي المتقن */}
          <div id="products-section" className="space-y-3">
            {products.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-6">جاري تحميل قائمة المأكولات... 🍲</p>
            ) : (
              products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex justify-between items-center gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-extrabold text-sm text-gray-900">{p.name}</h4>
                    <p className="text-[11px] text-gray-400 font-semibold">{p.description || 'Pas de description disponible'}</p>
                    <p className="text-sm font-black text-red-600 mt-1">{p.price} DT</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="w-16 h-16 rounded-xl object-cover border" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border flex items-center justify-center text-xl">🍲</div>
                    )}
                    <button 
                      onClick={() => addToCart(p)}
                      className="bg-gray-950 text-white w-8 h-8 rounded-xl flex items-center justify-center font-black shadow-md mt-2 active:scale-95 transition-transform"
                    >
                      +
                </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* نموذج الشركاء المنبثق */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-gray-950 flex items-center gap-1.5">🤝 Devenir Partenaire</h3>
              <button onClick={() => setShowPartnerModal(false)} className="text-gray-400 font-black text-sm bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center">✕</button>
            </div>
            <form onSubmit={handlePartnerSubmit} className="space-y-3">
              <input type="text" placeholder="Nom *" required value={partnerName} onChange={(e) => setPartnerName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none" />
              <input type="text" placeholder="Boutique *" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none" />
              <input type="tel" placeholder="Téléphone *" required value={partnerPhone} onChange={(e) => setPartnerPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none" />
              <button type="submit" className="w-full bg-gray-950 text-white font-black py-3.5 rounded-xl text-xs mt-2">Envoyer 🚀</button>
            </form>
          </div>
        </div>
      )}

      {/* شريط التنقل السفلي */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-3.5 flex justify-around items-center z-40 shadow-xl">
        <div onClick={() => { setSelectedRestaurant(null); setSearchQuery(''); }} className="flex flex-col items-center gap-0.5 text-red-600 cursor-pointer">
          <span className="text-base">🏠</span>
          <span className="text-[9px] font-black tracking-wide">Accueil</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-gray-400 cursor-pointer">
          <span className="text-base">🔍</span>
          <span className="text-[9px] font-black tracking-wide">Explorer</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-gray-400 cursor-pointer">
          <span className="text-base">📄</span>
          <span className="text-[9px] font-black tracking-wide">Commandes</span>
        </div>
        <Link to="/login" className="flex flex-col items-center gap-0.5 text-gray-400 cursor-pointer">
          <span className="text-base">👤</span>
          <span className="text-[9px] font-black tracking-wide">Profil</span>
        </Link>
      </div>

    </div>
  );
}
