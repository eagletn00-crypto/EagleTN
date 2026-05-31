import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const navigate = useNavigate();

  // دالة تحديث السلة من التخزين المحلي
  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem('eagle_cart') || '[]');
    setCartItems(items);
  };

  useEffect(() => {
    loadCart();
    // المستمع السحري: أي تغيير في السلة من المنيو، سيقوم هذا بتحديث السلة فوراً!
    window.addEventListener('cart_updated', loadCart);
    return () => window.removeEventListener('cart_updated', loadCart);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const tvaAmount = subtotal * 0.07;
  const deliveryFee = 4.500;
  const total = subtotal + tvaAmount + deliveryFee;

  const removeItem = (indexToRemove: number) => {
    const updated = cartItems.filter((_, idx) => idx !== indexToRemove);
    setCartItems(updated);
    localStorage.setItem('eagle_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart_updated'));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!customerPhone || !customerAddress) {
      alert('الرجاء إدخال الهاتف والعنوان! ⚠️');
      return;
    }
    if (!acceptedTerms) {
      alert('الرجاء الموافقة على الشروط! ⚠️');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      alert('تم استلام طلبك بنجاح! 🦅\nجاري تجهيز طلبك في مطبخ عم علي.');
      localStorage.removeItem('eagle_cart');
      window.dispatchEvent(new Event('cart_updated'));
      navigate('/');
    }, 1200);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-36 font-sans antialiased text-gray-900" dir="ltr">
      <div className="px-5 pt-6 pb-4 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="text-xl font-black text-gray-700">←</Link>
        <h1 className="text-lg font-black">Récapitulatif de Commande</h1>
        <span className="bg-red-50 text-red-600 font-black px-2 py-1 rounded-full">{cartItems.length}</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="p-12 text-center text-gray-400 font-bold mt-10">Votre panier est vide.</div>
      ) : (
        <div className="px-4 mt-6 space-y-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border space-y-3">
            <input type="text" placeholder="Nom" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-gray-50 rounded-xl p-3 text-xs font-bold" />
            <input type="tel" placeholder="Téléphone *" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-gray-50 rounded-xl p-3 text-xs font-bold" />
            <input type="text" placeholder="Adresse *" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full bg-gray-50 rounded-xl p-3 text-xs font-bold" />
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-sm border">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b">
                <span className="font-bold text-sm">{item.name}</span>
                <div className="flex gap-4">
                  <span className="font-black text-sm">{parseFloat(item.price).toFixed(3)} DT</span>
                  <button onClick={() => removeItem(idx)} className="text-red-500 font-bold">X</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border space-y-2">
            <div className="flex justify-between font-bold text-sm"><span>Total</span><span className="font-black text-red-600">{total.toFixed(3)} DT</span></div>
          </div>

          <button onClick={handleCheckout} disabled={submitting} className="w-full bg-red-600 text-white font-black py-4 rounded-2xl">
            {submitting ? '...' : 'Confirmer et Commander 🦅'}
          </button>
        </div>
      )}
    </div>
  );
}
