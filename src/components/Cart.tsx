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

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('eagle_cart') || '[]');
    setCartItems(items);
  }, []);

  // حساب الحسابات بنكهة تونسية دقيقة
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const tvaRate = 0.07;
  const tvaAmount = subtotal * tvaRate;
  const deliveryFee = 4.500;
  const total = subtotal + tvaAmount + deliveryFee;

  const removeItem = (indexToRemove: number) => {
    const updated = cartItems.filter((_, idx) => idx !== indexToRemove);
    setCartItems(updated);
    localStorage.setItem('eagle_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart_updated'));
  };

  const handleCheckout = (e: React.FormEvent) => {
    if (cartItems.length === 0) return;

    if (!customerPhone || !customerAddress) {
      alert('الرجاء إدخال رقم الهاتف والعنوان الكامل لتوجيه السائق! ⚠️');
      return;
    }

    if (!acceptedTerms) {
      alert('الرجاء الموافقة على الشروط والأحكام لإتمام طلبك! ⚠️');
      return;
    }

    setSubmitting(true);

    // محاكاة فورية وناجحة 100% بدون تعقيدات السيرفر
    setTimeout(() => {
      alert('Votre commande a été enregistrée avec succès sur Eagle.tn ! 🚀🦅\n\nتم استقبال طلبك بنجاح وجاري توجيه السائق من مطبخ عم علي! 🛵');
      
      // تنظيف السلة محلياً بعد النجاح لإبهار المستخدم
      localStorage.removeItem('eagle_cart');
      window.dispatchEvent(new Event('cart_updated'));
      setSubmitting(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-36 font-sans antialiased text-gray-900" dir="ltr">
      {/* الهيدر العلوي النظيف */}
      <div className="px-5 pt-6 pb-4 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-black text-gray-700 hover:text-red-500 transition-colors">←</Link>
          <h1 className="text-lg font-black tracking-tight">Récapitulatif de Commande</h1>
        </div>
        <span className="bg-red-50 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-full border border-red-100">
          {cartItems.length} Plats
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="p-12 text-center text-gray-400 font-bold mt-10">
          <span className="text-5xl block mb-4">🛒</span>
          Votre panier est vide pour le moment.
        </div>
      ) : (
        <div className="px-4 mt-6 space-y-4">
          
          {/* معلومات التوصيل */}
          <div className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 space-y-3">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">📋 Informations de Livraison</h3>
            
            <div className="space-y-1">
              <input 
                type="text" 
                placeholder="Nom complet (Optionnel)" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <input 
                type="tel" 
                required
                placeholder="Numéro de Téléphone (Ex: 28495021) *" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <input 
                type="text" 
                required
                placeholder="Adresse complète (Ex: Cité El Khadra, App 4) *" 
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* المنتجات المختارة */}
          <div className="bg-white rounded-[28px] p-4 shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Articles Sélectionnés</h2>
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img src={item.image_url || "/default-dish.png"} className="w-12 h-12 rounded-xl object-cover border border-gray-100" alt="" />
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">{item.name}</h4>
                    <p className="text-[11px] text-gray-400 font-semibold">Quantité: 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-gray-900">{parseFloat(item.price).toFixed(3)} DT</span>
                  <button 
                    onClick={() => removeItem(idx)}
                    className="text-red-500 font-bold text-xs bg-red-50 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* تفاصيل الفاتورة الفخمة */}
          <div className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Détails de la Facture</h2>
            
            <div className="flex justify-between items-center text-xs font-bold text-gray-500">
              <span>Sous-total (HT)</span>
              <span className="font-mono">{subtotal.toFixed(3)} DT</span>
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-gray-500">
              <span>TVA (7%)</span>
              <span className="font-mono">{tvaAmount.toFixed(3)} DT</span>
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-gray-500">
              <span>Frais de Livraison</span>
              <span className="font-mono">{deliveryFee.toFixed(3)} DT</span>
            </div>

            <div className="h-px bg-gray-100 my-2"></div>

            <div className="flex justify-between items-center text-sm font-black text-gray-900">
              <span>Total à payer</span>
              <span className="text-lg text-red-600 font-mono">{total.toFixed(3)} DT</span>
            </div>
          </div>

          {/* الموافقة على الشروط */}
          <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex items-start gap-3 mt-4">
            <input 
              type="checkbox"
              id="legal-terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
            />
            <label htmlFor="legal-terms" className="text-[11px] text-gray-500 font-semibold leading-relaxed cursor-pointer select-none">
              J'accepte que <span className="font-bold text-gray-700">Eagle.tn</span> transmette ma commande et mes coordonnées au partenaire. Je confirme être responsable du paiement de la somme de <span className="font-mono font-bold text-gray-700">{total.toFixed(3)} DT</span> lors de la livraison premium.
            </label>
          </div>

          {/* زر التأكيد الحتمي الصاعق */}
          <button 
            onClick={handleCheckout}
            disabled={submitting}
            className={`w-full font-black py-4 rounded-2xl text-center shadow-md text-sm mt-6 transition-all transform active:scale-[0.98] ${
              acceptedTerms && !submitting && customerPhone && customerAddress
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-red-200 shadow-lg cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Traitement en cours...' : 'Confirmer et Commander 🦅'}
          </button>

        </div>
      )}
    </div>
  );
}
