import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [dbError, setDbError] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadCart = () => {
    const rawItems = JSON.parse(localStorage.getItem('eagle_cart') || '[]');
    const aggregated: { [key: string]: any } = {};
    rawItems.forEach((item: any) => {
      if (aggregated[item.id]) {
        aggregated[item.id].quantity += (item.quantity || 1);
      } else {
        aggregated[item.id] = { ...item, quantity: item.quantity || 1 };
      }
    });
    setCartItems(Object.values(aggregated));
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('cart_updated', loadCart);
    return () => window.removeEventListener('cart_updated', loadCart);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity || 0), 0);
  const deliveryFee = 2.500; 
  const total = subtotal + deliveryFee;

  const updateQuantity = (id: string, delta: number) => {
    const rawItems = JSON.parse(localStorage.getItem('eagle_cart') || '[]');
    let updated;
    if (delta === 1) {
      const targetItem = rawItems.find((i: any) => String(i.id) === String(id));
      if (targetItem) rawItems.push(targetItem);
      updated = [...rawItems];
    } else {
      const index = rawItems.findIndex((i: any) => String(i.id) === String(id));
      if (index !== -1) rawItems.splice(index, 1);
      updated = [...rawItems];
    }
    localStorage.setItem('eagle_cart', JSON.stringify(updated));
    loadCart();
    window.dispatchEvent(new Event('cart_updated'));
  };

  const removeItemCompletely = (id: string) => {
    const rawItems = JSON.parse(localStorage.getItem('eagle_cart') || '[]');
    const updated = rawItems.filter((i: any) => String(i.id) !== String(id));
    localStorage.setItem('eagle_cart', JSON.stringify(updated));
    loadCart();
    window.dispatchEvent(new Event('cart_updated'));
  };

  // 💡 الدالة المصممة جراحياً بالمطابقة المجهرية التامة مع جدولك الحالي الحقيقي
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!customerName || !customerPhone || !customerAddress) {
      setDbError('⚠️ الرجاء إدخال كافة البيانات المطلوبة!');
      return;
    }
    if (!acceptedTerms) {
      setDbError('⚠️ الرجاء الموافقة على الدرع القانوني!');
      return;
    }

    setSubmitting(true);
    setDbError(null);

    try {
      const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
      const secureAddress = `${customerAddress} \n🔒 PIN: ${generatedPin}`;
      
      // تحويل الفاتورة الإجمالية إلى نوع رقمي بحت Numeric الصارم المتوافق مع السكينما المعروضة
      const cleanTotalPrice = Number(total.toFixed(3));

      // الخطوة 1: الإدخال الصارم في الحقول النصية والمالية الأربعة المتواجدة في جدول orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: String(customerName),
          customer_phone: String(customerPhone),
          delivery_address: String(secureAddress),
          total_price: cleanTotalPrice,
          status: 'En attente'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // الخطوة 2: الإدخال المجمع في جدول order_items المخصص للوجبات
      if (orderData && orderData.id) {
        const orderItemsPayload = cartItems.map(item => ({
          order_id: orderData.id, 
          product_name: String(item.name),
          price: Number(parseFloat(item.price).toFixed(3)),
          quantity: Number(item.quantity)
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsPayload);

        if (itemsError) throw itemsError;
      }

      localStorage.removeItem('eagle_cart');
      window.dispatchEvent(new Event('cart_updated'));
      navigate('/tracking', { state: { order: orderData, pin: generatedPin } });

    } catch (err: any) {
      console.error(err);
      // حرق الرسالة القديمة فرنسية الأصل وعرض نص الخطأ الحقيقي القادم من سوبابيس
      setDbError(`❌ سوبابيس ترفض: ${err.message || err.details || 'تضارب في قيود الحقول الجدولية'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-36 font-sans antialiased text-gray-900" dir="ltr">
      {/* عرض الأخطاء الحقيقية في الواجهة لكسر صمت الكاش */}
      {dbError && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown w-11/12 max-w-sm">
          <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl text-xs font-black border border-red-500/30 text-center leading-relaxed">
            {dbError}
          </div>
        </div>
      )}

      <div className="px-5 py-4 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center font-black">◀</Link>
        <h1 className="text-sm font-black tracking-widest uppercase text-gray-800">Récapitulatif Numérique</h1>
        <span className="bg-red-50 text-red-600 font-black px-3 py-1 rounded-full text-xs">{cartItems.reduce((sum, i) => sum + i.quantity, 0)}</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 opacity-40">
          <span className="text-6xl mb-4">📭</span>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500">Votre panier est vide.</p>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
          
          <div className="w-full h-24 bg-slate-200 rounded-[1.8rem] overflow-hidden relative flex items-center justify-center border border-gray-200/60 shadow-sm">
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80')" }}></div>
            <span className="z-10 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl text-[9px] font-black text-gray-800 border border-gray-100 shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
              📍 Localisation Automatique Activée
            </span>
          </div>

          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Détails de Livraison</h3>
            <input type="text" placeholder="Nom Complet *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-gray-50 border border-gray-200/60 rounded-xl p-3.5 text-xs font-bold outline-none" />
            <input type="tel" placeholder="Numéro de Téléphone *" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200/60 rounded-xl p-3.5 text-xs font-bold outline-none" />
            <textarea placeholder="Ex: Cité Ibn Khaldoun, Tunis... *" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={2} className="w-full bg-gray-50 border border-gray-200/60 rounded-xl p-3.5 text-xs font-bold outline-none resize-none"></textarea>
          </div>

          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 p-2">Articles Selectionnés</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 px-2 border-b border-gray-50 last:border-none">
                <div className="flex flex-col">
                  <span className="font-black text-xs text-gray-800">{item.name}</span>
                  <span className="text-[10px] font-bold text-gray-400 mt-0.5">{(parseFloat(item.price)).toFixed(3)} DT</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-50 border border-gray-200/60 rounded-xl p-1 gap-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 bg-white border rounded-lg font-black text-xs shadow-sm flex items-center justify-center text-gray-500">-</button>
                    <span className="font-black text-xs px-2 text-gray-800">{item.quantity}x</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 bg-slate-900 text-white rounded-lg font-black text-xs shadow-sm flex items-center justify-center">+</button>
                  </div>
                  <button onClick={() => removeItemCompletely(item.id)} className="text-red-500 font-bold text-xs hover:text-red-700 px-1">✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Résumé du Coût</h3>
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Sous-total</span>
              <span className="font-black">{subtotal.toFixed(3)} DT</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Frais de Livraison 🛵</span>
              <span className="font-black">{deliveryFee.toFixed(3)} DT</span>
            </div>
            <div className="h-px bg-gray-100 my-1"></div>
            <div className="flex justify-between font-black text-sm items-center">
              <span className="text-gray-800">Coût Total Net</span>
              <span className="font-black text-red-600 text-base">{total.toFixed(3)} DT</span>
            </div>

            <label className="flex items-start gap-3 p-3.5 bg-red-50/40 rounded-2xl border border-red-100/60 cursor-pointer mt-3 select-none">
              <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 w-4 h-4 accent-emerald-600 rounded cursor-pointer" />
              <span className="text-[10px] font-black text-gray-700 leading-tight" dir="rtl">
                أوافق على شروط التطبيق وهو غير مسؤول عن أي إخلالات خارجة عن سيطرته. ✅
              </span>
            </label>
          </div>

          <button 
            onClick={handleCheckout} 
            disabled={submitting || !acceptedTerms} 
            className={`w-full text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs ${acceptedTerms && !submitting ? 'bg-emerald-600 active:scale-[0.98]' : 'bg-gray-300 cursor-not-allowed'}`}>
            {submitting ? 'Connexion Supabase...' : 'Confirmer et Commander 🦅'}
          </button>
        </div>
      )}
    </div>
  );
}
