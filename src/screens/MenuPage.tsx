import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export default function MenuPage({ restaurantId, onBack }: { restaurantId: string, onBack: () => void }) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [restaurantId]);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('restaurant_id', restaurantId);
    if (data) setMenuItems(data);
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleCheckout = async () => {
    if (!customerName || !customerPhone || !acceptedTerms) {
      alert("الرجاء ملء البيانات والموافقة على الشروط! ⚠️");
      return;
    }
    setSubmitting(true);
    try {
      const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0) + 2.500;
      const { data: order, error } = await supabase.from('orders').insert([{
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: customerAddress + " 🔒 PIN: " + Math.floor(1000 + Math.random() * 9000),
        total_amount: Number(total.toFixed(3)),
        status: 'En attente'
      }]).select().single();
      
      if (error) throw error;
      
      await supabase.from('order_items').insert(cart.map(i => ({
        order_id: order.id,
        product_name: i.name,
        price: parseFloat(i.price),
        quantity: i.quantity
      })));

      alert("تم تأكيد الطلب بنجاح! 🦅");
      setCart([]);
      onBack();
    } catch (e) {
      alert("خطأ في الاتصال: " + e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 pb-20">
      <button onClick={onBack} className="text-amber-500 font-black mb-6">← RETOUR</button>
      <h2 className="text-2xl font-black mb-6 uppercase tracking-widest">{restaurantId}</h2>

      {/* المنيو الديناميكي */}
      <div className="space-y-4">
        {menuItems.map(item => (
          <div key={item.id} className="bg-[#1e293b] p-4 rounded-2xl flex justify-between items-center border border-slate-700">
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-amber-500 text-sm">{parseFloat(item.price).toFixed(3)} DT</p>
            </div>
            <button onClick={() => addToCart(item)} className="bg-amber-500 text-black px-4 py-2 rounded-xl font-black text-xs">+ AJOUTER</button>
          </div>
        ))}
      </div>

      {/* السلة المدمجة داخل المنيو */}
      {cart.length > 0 && (
        <div className="mt-10 bg-white text-slate-900 p-6 rounded-3xl shadow-2xl">
          <h3 className="font-black text-lg mb-4">Votre Panier</h3>
          {cart.map(i => <div key={i.id} className="flex justify-between text-sm py-1">{i.quantity}x {i.name} - {(i.price * i.quantity).toFixed(3)} DT</div>)}
          <input className="w-full mt-4 p-3 border rounded-xl" placeholder="Nom" onChange={e => setCustomerName(e.target.value)} />
          <input className="w-full mt-2 p-3 border rounded-xl" placeholder="Téléphone" onChange={e => setCustomerPhone(e.target.value)} />
          <input className="w-full mt-2 p-3 border rounded-xl" placeholder="Adresse" onChange={e => setCustomerAddress(e.target.value)} />
          <label className="flex items-center gap-2 mt-4 text-xs font-bold">
            <input type="checkbox" onChange={e => setAcceptedTerms(e.target.checked)} />
            أوافق على شروط التطبيق (غير مسؤول عن أي إخلالات خارجة عن السيطرة).
          </label>
          <button onClick={handleCheckout} disabled={submitting} className="w-full mt-4 bg-red-600 text-white py-4 rounded-2xl font-black uppercase">
            {submitting ? '...' : 'Confirmer la commande 🦅'}
          </button>
        </div>
      )}
    </div>
  );
}
