import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useCart } from '../context/CartContext';

export default function Home() {
  // 1. حالات نظام التنقل (Navigation State)
  const [view, setView] = useState<'restaurants' | 'menu'>('restaurants');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  
  // 2. حالات المنيو (Menu State)
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [loading, setLoading] = useState(true);
  
  // 3. حالات السلة والطلب
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedDrink, setSelectedDrink] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [address, setAddress] = useState('');
  const { cart, addToCart, getCartTotal, getCartCount, clearCart } = useCart();

  const drinks = [
    { name: 'Coca Cola', price: 2.000, icon: '🥤' },
    { name: 'Fanta', price: 2.000, icon: '🍊' },
    { name: 'Boga Cidre', price: 2.000, icon: '🍎' },
    { name: 'Eau 0.5L', price: 1.000, icon: '💧' }
  ];

  // جلب المطاعم عند فتح التطبيق
  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true);
      const { data, error } = await supabase.from('restaurants').select('*');
      if (!error && data) setRestaurants(data);
      setLoading(false);
    }
    fetchRestaurants();
  }, []);

  // دالة الدخول لمطعم معين
  const openRestaurantMenu = async (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setView('menu');
    setLoading(true);
    
    // جلب وجبات هذا المطعم فقط
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('restaurant_id', restaurant.id);
      
    if (!error && data) setProducts(data);
    setLoading(false);
    setActiveCategory('الكل');
  };

  // استخراج التصنيفات ديناميكياً (Plat, Sandwich...)
  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category || 'أطباق')))];
  const filteredProducts = activeCategory === 'الكل' ? products : products.filter(p => (p.category || 'أطباق') === activeCategory);

  const submitOrder = async () => {
    if (cart.length === 0 || !address.trim()) {
      alert('تأكد من وجود طلبات وإدخال عنوان التوصيل! 📍');
      return;
    }
    const { error } = await supabase.from('orders').insert([{
      total_price: getCartTotal(),
      status: 'En attente',
      customer_address: address,
      restaurant_id: selectedRestaurant?.id
    }]);

    if (!error) {
      alert('تم إرسال الطلب بنجاح! 🦅✅');
      clearCart(); setShowInvoice(false); setAddress(''); setView('restaurants');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-black pb-32 font-sans">
      {/* Header الديناميكي */}
      <div className="p-4 text-center bg-white shadow-sm sticky top-0 z-20 flex justify-between items-center h-16">
        {view === 'menu' ? (
          <button onClick={() => setView('restaurants')} className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-xl active:scale-95">🔙 رجوع</button>
        ) : <div className="w-16"></div>}
        
        <h1 className="text-xl font-black text-gray-900 tracking-widest truncate max-w-[200px]">
          {view === 'menu' ? selectedRestaurant?.name : 'EAGLE TN'}
        </h1>
        <div className="w-16"></div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-32"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-yellow-500"></div></div>
      ) : view === 'restaurants' ? (
        /* ------------------ شاشة المطاعم ------------------ */
        <div className="p-4 space-y-5">
          <h2 className="font-black text-xl text-right text-gray-800 mb-2">اكتشف المطاعم 🛵</h2>
          {restaurants.map(rest => (
            <div key={rest.id} onClick={() => openRestaurantMenu(rest)} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform relative">
              <img src={rest.cover_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80'} className="w-full h-36 object-cover bg-gray-200" />
              <div className="absolute top-24 right-4 bg-white p-1 rounded-2xl shadow-md">
                <img src={rest.logo_url || `https://ui-avatars.com/api/?name=${rest.name}&background=FBBF24&color=000`} className="w-16 h-16 rounded-xl object-cover" />
              </div>
              <div className="p-5 pt-8 text-right">
                <h3 className="font-black text-xl text-gray-900">{rest.name}</h3>
                <p className="text-xs font-bold text-gray-400 mt-1">{rest.category || 'أشهى المأكولات'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ------------------ شاشة المنيو ------------------ */
        <div>
          {/* شريط التصنيفات (Categories Tabs) */}
          <div className="bg-white/80 backdrop-blur-md px-4 py-3 border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide sticky top-16 z-10 flex flex-row-reverse gap-2">
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveCategory(cat as string)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${activeCategory === cat ? 'bg-yellow-400 text-gray-900 shadow-sm' : 'bg-gray-100 text-gray-500'}`}
              >
                {cat as string}
              </button>
            ))}
          </div>

          {/* شبكة الوجبات */}
          <div className="p-4 grid grid-cols-2 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-2 text-center text-gray-400 font-bold mt-10">لا توجد وجبات في هذا التصنيف.</div>
            ) : (
              filteredProducts.map(p => (
                <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white rounded-3xl p-3 shadow-sm border border-gray-50 cursor-pointer active:scale-95 transition-transform flex flex-col">
                  <img src={p.image_url || 'https://via.placeholder.com/150'} className="w-full h-28 object-cover rounded-2xl mb-3 bg-gray-100" />
                  <h3 className="font-bold text-xs text-right leading-tight mb-2 text-gray-800">{p.name_ar || p.name_fr || p.name}</h3>
                  <p className="font-black text-sm text-yellow-600 text-right mt-auto">{Number(p.price || 0).toFixed(3)} DT</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ------------------ المكونات المشتركة (السلة والمودال) ------------------ */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-6 left-4 right-4 bg-gray-900 text-white p-4 rounded-3xl flex justify-between items-center z-40 shadow-2xl">
          <button onClick={() => setShowInvoice(true)} className="text-yellow-400 font-black text-sm bg-gray-800 px-5 py-2.5 rounded-2xl active:scale-95 transition-transform">السلة ({getCartCount()})</button>
          <span className="font-black text-lg">{getCartTotal().toFixed(3)} DT</span>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-white z-50 p-5 flex flex-col">
          <button onClick={() => { setSelectedProduct(null); setSelectedDrink(null); }} className="mb-4 text-left font-black text-xl text-gray-400 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center active:bg-gray-200">✕</button>
          <img src={selectedProduct.image_url || 'https://via.placeholder.com/150'} className="w-full h-56 object-cover rounded-[2rem] shadow-sm" />
          <h2 className="text-2xl font-black mt-5 text-right text-gray-900">{selectedProduct.name_ar || selectedProduct.name_fr || selectedProduct.name}</h2>
          <p className="text-gray-500 text-xs mt-2 text-right leading-relaxed">{selectedProduct.description || "وجبة مميزة تُحضر بعناية تامة."}</p>
          
          {/* قسم الإضافات (المشروبات) */}
          <div className="mt-6 bg-gray-50 p-4 rounded-3xl border border-gray-100">
            <p className="text-xs text-gray-400 mb-3 text-right font-black uppercase tracking-wider">🥤 إضافات (اختياري)</p>
            <div className="grid grid-cols-4 gap-2">
              {drinks.map(d => (
                <button key={d.name} onClick={() => setSelectedDrink(selectedDrink?.name === d.name ? null : d)} className={`p-2 rounded-2xl border transition-all ${selectedDrink?.name === d.name ? 'border-yellow-400 bg-yellow-50 shadow-sm' : 'bg-white border-transparent'}`}>
                  <div className="text-2xl mb-1">{d.icon}</div>
                  <div className="text-[9px] font-black truncate text-gray-600">{d.name}</div>
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => { 
            addToCart({
              ...selectedProduct, 
              name: selectedProduct.name_ar || selectedProduct.name_fr || selectedProduct.name || 'وجبة',
              price: Number(selectedProduct.price) + (selectedDrink?.price || 0), 
              drink: selectedDrink
            }); 
            setSelectedProduct(null); setSelectedDrink(null); 
          }} className="w-full bg-yellow-400 text-gray-900 font-black py-4 rounded-3xl mt-auto active:scale-95 transition-transform text-lg shadow-lg">
            إضافة للسلة • {Number(Number(selectedProduct.price) + (selectedDrink?.price || 0)).toFixed(3)} DT
          </button>
        </div>
      )}

      {showInvoice && (
        <div className="fixed inset-0 bg-gray-50 z-50 p-5 flex flex-col">
          <h2 className="text-3xl font-black mb-6 text-right text-gray-900">فاتورتك 🧾</h2>
          <div className="flex-1 overflow-y-auto space-y-3 mb-6 bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
            {cart.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-3">
                <div className="text-left">
                  <span className="font-bold text-sm text-gray-800">{item.name}</span>
                  {item.drink && <p className="text-[10px] text-gray-400 font-bold mt-0.5">+ {item.drink.name}</p>}
                </div>
                <span className="font-black text-yellow-600 text-sm">{Number(item.price).toFixed(3)} DT</span>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <label className="block text-right text-xs font-black text-gray-400 mb-2 uppercase">عنوان التوصيل 📍</label>
            <input type="text" placeholder="المنطقة، الشارع، علامة مميزة..." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-white border border-gray-200 rounded-[2rem] p-4 text-right text-sm outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-sm" dir="rtl"/>
          </div>
          <div className="py-3 text-2xl font-black text-center mb-4 text-gray-900">
            المجموع: <span className="text-yellow-500">{getCartTotal().toFixed(3)} DT</span>
          </div>
          <button onClick={submitOrder} className="w-full bg-gray-900 text-white py-4 rounded-3xl font-black text-lg active:scale-95 transition-transform shadow-xl">تأكيد الطلب 🚀</button>
          <button onClick={() => setShowInvoice(false)} className="w-full text-gray-500 py-3 mt-3 font-black rounded-3xl active:bg-gray-200 transition-colors">إلغاء وتعديل</button>
        </div>
      )}
    </div>
  );
}
