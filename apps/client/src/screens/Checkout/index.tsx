import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, User, ShoppingBag, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { supabase } from '../../lib/supabase';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 2.500 : 0.000;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Votre panier est vide.');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const partnerId = items[0]?.partnerId || null;

      // 1. إدراج الطلب الرئيسي في جدول orders
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          partner_id: partnerId,
          customer_name: customerName,
          customer_phone: customerPhone,
          delivery_address: deliveryAddress,
          notes: notes,
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          total_price: grandTotal,
          status: 'pending',
          payment_method: 'cash_on_delivery'
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 2. إدراج عناصر الطلب في جدول order_items
      const orderItemsToInsert = items.map((item) => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        item_name: item.name_fr || item.name,
        unit_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsErr) console.error('Error saving order items:', itemsErr);

      // 3. تفريغ السلة والانتقال لشاشة تتبع الطلب
      clearCart();
      navigate(`/order-tracking/${orderData.id}`);
    } catch (err: any) {
      console.error('Order creation failed:', err);
      setErrorMsg(err.message || 'Une erreur est survenue lors de la validation du commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] max-w-md mx-auto p-4 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mb-4">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-lg font-black text-slate-900 mb-1">Votre panier est vide</h2>
        <p className="text-xs text-slate-500 mb-6">Découvrez nos restaurants et ajoutez de délicieux plats.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-amber-500 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-md hover:bg-amber-400 transition-all"
        >
          Parcourir le menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] max-w-md mx-auto pb-28 font-sans antialiased text-slate-900">
      {/* Header */}
      <div className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md z-30 px-4 py-3 border-b border-slate-200/60 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-xl shadow-sm text-slate-700 hover:bg-slate-100 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-black text-slate-900 tracking-tight">Caisse & Finalisation</h1>
        <div className="w-8"></div>
      </div>

      <form onSubmit={handlePlaceOrder} className="p-4 space-y-4">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-red-600">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Customer & Delivery Form */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
            Informations de livraison
          </h2>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <User size={13} className="text-amber-500" /> Nom & Prénom *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mohamed Ben Ali"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Phone size={13} className="text-amber-500" /> Numéro de Téléphone *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +216 20 123 456"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <MapPin size={13} className="text-amber-500" /> Adresse exacte de livraison *
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Cité El Ghazala, Rue Habib Bourguiba, Appt 4"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500">Instructions (Optionnel)</label>
            <input
              type="text"
              placeholder="e.g. Sans h'rissa, sonner à l'interphone"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Mode de paiement</h2>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-black text-xs">
                💵
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Paiement à la livraison</p>
                <p className="text-[10px] text-slate-500 font-medium">Payez en espèces dès réception de la commande</p>
              </div>
            </div>
            <CheckCircle2 size={18} className="text-amber-600" />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Résumé de la commande</h2>
          
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 font-black text-slate-800 text-[11px] px-2 py-0.5 rounded-md">
                    {item.quantity}x
                  </span>
                  <span className="font-bold text-slate-800">{item.name_fr || item.name}</span>
                </div>
                <span className="font-extrabold text-slate-900">{(item.price * item.quantity).toFixed(3)} DT</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(3)} DT</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Frais de livraison</span>
              <span>{deliveryFee.toFixed(3)} DT</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Total TTC</span>
              <span className="text-amber-600 font-black">{grandTotal.toFixed(3)} DT</span>
            </div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold pt-2">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Facturation conforme aux normes de la République Tunisienne</span>
        </div>

        {/* Submit Action Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200/80 p-4 max-w-md mx-auto z-40">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Confirmer la commande ({grandTotal.toFixed(3)} DT)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
