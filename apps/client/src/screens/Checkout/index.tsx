import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, MapPin, Phone, CreditCard, CheckCircle2 } from 'lucide-react';
import { Partner } from '../../types/partner';
import { OrderItem } from '../../types/order';

interface CheckoutProps {
  partner?: Partner;
  cartItems?: OrderItem[];
  customerAddress?: string;
  customerPhone?: string;
  onConfirmOrder: (orderData: {
    address: string;
    phone: string;
    notes: string;
    pin: string;
    totalAmount: number;
  }) => void;
  onBack: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  partner,
  cartItems = [], // Defensive Default Value
  customerAddress = 'Avenue Habib Bourguiba, Tunis',
  customerPhone = '+216 98 000 000',
  onConfirmOrder,
  onBack,
}) => {
  const [address, setAddress] = useState(customerAddress);
  const [phone, setPhone] = useState(customerPhone);
  const [notes, setNotes] = useState('');
  const [pin] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safely calculate totals even if cartItems is empty
  const safeItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = safeItems.reduce((acc, item) => acc + (item?.total_price || 0), 0);
  const deliveryFee = partner?.delivery_fee || 2.500;
  const totalAmount = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onConfirmOrder({
        address,
        phone,
        notes,
        pin,
        totalAmount,
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dir-ltr pb-12 selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 pt-8 rounded-b-3xl shadow-xl border-b border-slate-800">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold tracking-wide">Validation de la Commande</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {/* Restaurant Summary */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">Partenaire</span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">{partner?.name || 'Chez Om Ali'}</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400 font-mono">{safeItems.length} articles</span>
        </div>

        {/* Order Items Breakdown */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Résumé du Panier</h3>
          {safeItems.length > 0 ? (
            safeItems.map((item, idx) => (
              <div key={item.menu_item_id || idx} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                <span className="font-semibold text-slate-800">{item.quantity}x {item.name}</span>
                <span className="font-mono font-bold text-slate-900">{(item.total_price || 0).toFixed(3)} DT</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 italic text-center py-2">Votre panier est actuellement vide</div>
          )}
        </div>

        {/* Address & Phone Inputs */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informations de Livraison</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Adresse de livraison
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> Numéro de téléphone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Price Breakdown & Total */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Sous-total</span>
            <span className="font-mono">{subtotal.toFixed(3)} DT</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Frais de livraison</span>
            <span className="font-mono">{deliveryFee.toFixed(3)} DT</span>
          </div>
          <hr className="border-slate-100 my-1" />
          <div className="flex justify-between text-sm font-black text-slate-900">
            <span>Total À Payer</span>
            <span className="font-mono text-emerald-600">{totalAmount.toFixed(3)} DT</span>
          </div>
        </div>

        {/* Confirm Order Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Traitement en cours...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirmer la Commande • {totalAmount.toFixed(3)} DT</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Paiement sécurisé à la livraison (COD)</span>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
