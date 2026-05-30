import PartnerDashboard from './components/PartnerDashboard';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';

interface MenuItem {
  id: any; 
  name: string;
  price: number;
  in_stock: boolean;    
  image_url: string;   
  logo_url?: string;    
  cover_url?: string;   
  is_promo?: boolean;
  promo_price?: number;
  is_special?: boolean;
}

// =========================================================================
// 🏠 0. HOME VIEW (واجهة الاستقبال الفاتحة الفخمة)
// =========================================================================
function HomeView({ cartCount, cart, menuItems, addToCart, removeFromCart, onValidate }: any) {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const DEFAULT_COVER = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500";

  const getCartTotal = () => {
    return Object.keys(cart).reduce((total, id) => {
      const item = menuItems.find((m: any) => String(m.id) === String(id));
      if (!item) return total;
      return total + (item.price * cart[id]);
    }, 0);
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-6 pb-24 bg-slate-50 text-slate-900 min-h-screen relative" dir="ltr">
      <header className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦅</span>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900">EAGLE.TN</h1>
            <span className="bg-red-100 text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded border border-red-200">STARTUP ACT</span>
          </div>
        </div>
        <div onClick={() => setIsCartOpen(true)} className="relative bg-white p-2.5 rounded-full border border-slate-200 shadow-sm cursor-pointer active:scale-95 transition-all">
          <span className="text-sm">🛒</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">
              {cartCount}
            </span>
          )}
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md p-3 space-y-3">
        <div className="relative h-40 bg-slate-200 rounded-2xl overflow-hidden">
          <img src={DEFAULT_COVER} alt="Am Ali" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          <div className="absolute bottom-3 left-3 text-white">
            <h4 className="text-sm font-black flex items-center gap-1">Am Ali Kitchen 🍳</h4>
            <p className="text-[10px] text-amber-400 font-bold">LIVRAISON EXPRESS</p>
          </div>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">🟢 Disponible</span>
          <button onClick={() => navigate('/restaurant/am-ali')} className="bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1">
            <span>Menu 📋</span>
          </button>
        </div>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-4/5 max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl text-slate-900">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-black text-sm text-slate-800">Mon Panier 🛒</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-sm font-bold text-gray-400">✕</button>
              </div>
              {cartCount > 0 ? (
                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {Object.keys(cart).map(id => {
                    const item = menuItems.find((m: any) => String(m.id) === String(id));
                    if (!item) return null;
                    return (
                      <div key={id} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] font-mono font-bold text-amber-600">{(item.price).toFixed(3)} DT</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white border rounded-lg p-0.5 shadow-sm">
                          <button onClick={() => removeFromCart(item.id)} className="w-5 h-5 text-xs text-red-500 font-bold">-</button>
                          <span className="text-xs font-mono font-bold text-slate-700">{cart[id]}</span>
                          <button onClick={() => addToCart(item.id)} className="w-5 h-5 text-xs text-emerald-500 font-bold">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-10">Votre panier est vide 📭</p>
              )}
            </div>
            {cartCount > 0 && (
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-black">
                  <span>Total:</span>
                  <span className="font-mono text-amber-600 text-sm">{getCartTotal().toFixed(3)} DT</span>
                </div>
                <button onClick={() => { setIsCartOpen(false); onValidate(); }} className="w-full bg-slate-950 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider">
                  Valider la Commande 🚀
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 🛒 1. CLIENT MENU VIEW (واجهة المنيو المظلمة الاحترافية)
// =========================================================================
function ClientMenuView({ cart, addToCart, removeFromCart, getCartTotal, getCartCount, onValidate, menuItems }: any) {
  const DEFAULT_COVER = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500";
  const DEFAULT_LOGO = "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?w=100";
  const DEFAULT_FOOD = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150";

  return (
    <div className="p-4 max-w-md mx-auto space-y-6 pb-32 bg-slate-950 text-white min-h-screen relative" dir="ltr">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800/60">
        <img src={menuItems[0]?.cover_url || DEFAULT_COVER} alt="Cover" className="w-full h-40 object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
          <img src={menuItems[0]?.logo_url || DEFAULT_LOGO} alt="Logo" className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 bg-slate-950" />
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Am Ali Kitchen</h1>
            <p className="text-[10px] text-emerald-400 font-extrabold tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 w-max mt-0.5">● CARTE MENU LIVE</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider border-l-2 border-amber-500 pl-2">Les Plats Disponibles</h2>
        <div className="space-y-3.5">
          {menuItems.map((item: MenuItem) => {
            const isAvailable = item.in_stock !== false;
            const currentQuantity = cart[String(item.id)] || 0;

            return (
              <div key={item.id} className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between gap-4 shadow-md">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0">
                  <img src={item.image_url || DEFAULT_FOOD} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-100 truncate">{item.name}</h4>
                  <p className="text-xs text-amber-500 font-black font-mono mt-1">{Number(item.price).toFixed(3)} DT</p>
                </div>
                <div className="flex-shrink-0">
                  {isAvailable ? (
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1 rounded-xl">
                      {currentQuantity > 0 ? (
                        <>
                          <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 bg-slate-900 text-red-400 font-black rounded-lg text-xs">-</button>
                          <span className="text-xs font-mono font-bold px-1.5 text-white">{currentQuantity}</span>
                          <button onClick={() => addToCart(item.id)} className="w-6 h-6 bg-amber-500 text-slate-950 font-black rounded-lg text-xs">+</button>
                        </>
                      ) : (
                        <button onClick={() => addToCart(item.id)} className="px-3 py-1 bg-amber-500 font-black rounded-lg text-[10px] text-slate-950 active:scale-95">
                          Ajouter +
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-lg font-bold">Épuisé</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {getCartCount() > 0 && (
        <div className="fixed bottom-6 left-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 rounded-2xl shadow-2xl flex justify-between items-center z-40 border border-amber-400/20">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-900/80">{getCartCount()} Articles</p>
            <p className="text-base font-mono font-black mt-0.5">{getCartTotal().toFixed(3)} DT</p>
          </div>
          <button onClick={onValidate} className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all">
            COMMENCER 🚀
          </button>
        </div>
      )}
    </div>
  );
}

function PartnerView() { return <div className="p-4 text-center text-xs text-gray-400 bg-slate-950 min-h-screen text-white pt-10">🍳 Espace Resto Connecté.</div>; }

// =========================================================================
// 🗺 ROUTER CORE WITH REMOVED STATUS TO AVOID DB MISMATCH
// =========================================================================
export default function App() {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    supabase.from('products').select('*').order('id', { ascending: true }).then(({ data }) => {
      if (data) setMenuItems(data as MenuItem[]);
    });
  }, []);

  const addToCart = (id: any) => { const k = String(id); setCart(prev => ({ ...prev, [k]: (prev[k] || 0) + 1 })); };
  const removeFromCart = (id: any) => { const k = String(id); setCart(prev => { const u = { ...prev }; if (u[k] > 1) u[k]--; else delete u[k]; return u; }); };
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const getCartTotal = () => {
    return Object.keys(cart).reduce((t, id) => {
      const item = menuItems.find(m => String(m.id) === String(id));
      return t + (item ? item.price * cart[id] : 0);
    }, 0);
  };

  const handleCentralValidation = async () => {
    if (cartCount === 0) return;

    // ⚡ حذف حقل الحالة لإجبار قاعدة البيانات على استخدام القيمة الافتراضية بنجاح
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: 'Bilel S. (Eagle Pro Live)',
        total_price: getCartTotal(),
        delivery_address: 'Tunis, Cité El Khadra',
        customer_phone: '+21655123456'
      }])
      .select()
      .single();

    if (orderError) {
      alert(`Erreur Orders DB: ${orderError.message}`);
      return;
    }

    const insertedOrderId = orderData.id;
    const itemsPayload = Object.keys(cart).map(id => {
      const item = menuItems.find(m => String(m.id) === String(id));
      return {
        order_id: insertedOrderId,
        product_name: item?.name || 'Plat Inconnu',
        quantity: cart[id],
        price: item ? item.price : 0
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsPayload);

    if (itemsError) {
      alert(`Erreur Items DB: ${itemsError.message}`);
    } else {
      setCart({});
      alert("🎉 Commande validée avec succès !");
      window.location.href = '/'; 
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView cartCount={cartCount} cart={cart} menuItems={menuItems} addToCart={addToCart} removeFromCart={removeFromCart} onValidate={handleCentralValidation} />} />
        <Route path="/restaurant/am-ali" element={<ClientMenuView cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} getCartTotal={getCartTotal} getCartCount={() => cartCount} onValidate={handleCentralValidation} menuItems={menuItems} />} />
        <Route path="/partner" element={<PartnerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
