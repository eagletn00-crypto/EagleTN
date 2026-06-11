import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Menu({ onBack }: { onBack: () => void }) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setMenuItems(data);
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) return alert("الرجاء إدخال بيانات التوصيل!");
    if (!acceptedTerms) return alert("يجب الموافقة على الشروط!");
    
    setSubmitting(true);
    try {
      const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0) + 2.500;
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      
      const { data: order, error: err1 } = await supabase.from('orders').insert([{
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        delivery_address: `${customerInfo.address} 🔒 PIN:${pin}`,
        total_price: Number(total.toFixed(3)),
        status: 'En attente'
      }]).select().single();
      
      if (err1) throw err1;
      
      const itemsPayload = cart.map(i => ({ order_id: order.id, product_name: i.title, price: parseFloat(i.price), quantity: i.quantity }));
      const { error: err2 } = await supabase.from('order_items').insert(itemsPayload);
      
      if (err2) throw err2;
      
      alert(`تم طلبك بنجاح! كود الأمان: ${pin}`);
      setCart([]);
      onBack();
    } catch (e: any) {
      alert("خطأ: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">
      <div className="bg-slate-900 text-white p-6">
        <button onClick={onBack} className="text-amber-500 font-black mb-4">← RETOUR</button>
        <h2 className="text-2xl font-black uppercase tracking-widest">Am Ali Kitchen</h2>
      </div>

      <div className="p-4 space-y-4">
        {menuItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-100 shadow-sm">
            <div>
              <h3 className="font-black text-sm">{item.title}</h3>
              <p className="text-red-600 font-black text-xs">{Number(item.price).toFixed(3)} DT</p>
            </div>
            <button onClick={() => addToCart(item)} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-xs">+ AJOUTER</button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 shadow-2xl rounded-t-3xl">
          <h3 className="font-black mb-3">Votre Panier 🛒</h3>
          <input className="w-full p-2 border rounded-lg text-xs mb-1" placeholder="Nom" onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
          <input className="w-full p-2 border rounded-lg text-xs mb-1" placeholder="Téléphone" onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
          <input className="w-full p-2 border rounded-lg text-xs mb-3" placeholder="Adresse" onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
          <label className="flex items-center gap-2 text-[10px] font-bold mb-4">
            <input type="checkbox" onChange={e => setAcceptedTerms(e.target.checked)} /> أوافق على الشروط.
          </label>
          <button onClick={handleCheckout} disabled={submitting} className="w-full bg-red-600 text-white font-black py-4 rounded-xl uppercase">
            {submitting ? '...' : 'Confirmer la commande 🦅'}
          </button>
        </div>
      )}
    </div>
  );
}
