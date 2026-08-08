import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Banknote, ShieldCheck, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'edinar'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [note, setNote] = useState('');

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 2.500 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleConfirmOrder = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 max-w-md mx-auto font-sans antialiased relative overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-48 h-48 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-10 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-6 shadow-xl text-center space-y-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Commande Reçue ! / تم استلام طلبك</h2>
            <p className="text-xs text-slate-500 font-medium">
              Votre commande a été transmise au restaurant. Suivez la livraison en temps réel.
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs font-bold text-amber-900">
            Montant total : {grandTotal.toFixed(3)} TND
          </div>

          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs transition-all active:scale-[0.99]"
          >
            <span>Suivre la commande / الانتقال لتتبع الطلب</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32 max-w-md mx-auto font-sans antialiased relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sticky top-0 z-30 bg-[#FDFBF7]/80 backdrop-blur-md p-4 border-b border-amber-900/5 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white/80 border border-white/90 text-slate-800 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-black text-slate-900">Confirmation de commande</h1>
        <div className="w-9" />
      </div>

      <div className="p-4 space-y-4 relative z-10">
        <div className="bg-white/75 backdrop-blur-md border border-white/90 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={12} className="text-amber-600" /> Adresse de livraison
            </span>
            <span className="text-xs font-bold text-amber-600 cursor-pointer">Changer</span>
          </div>
          <div>
            <p className="text-xs font-black text-slate-900">El Manar 2, Tunis</p>
            <p className="text-[11px] text-slate-500">Rue Habib Bourguiba, Appt 4B</p>
          </div>
        </div>

        <div className="bg-white/75 backdrop-blur-md border border-white/90 rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Résumé de la commande ({items.reduce((acc, i) => acc + i.quantity, 0)} articles)
          </h3>

          <div className="space-y-2 divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className="text-slate-400 text-[11px] ml-1.5">x{item.quantity}</span>
                </div>
                <span className="font-bold text-slate-800">{(item.price * item.quantity).toFixed(3)} TND</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note spéciale (ex: sans harissa, sauce à part...)"
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="bg-white/75 backdrop-blur-md border border-white/90 rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Mode de Paiement / طريقة الدفع
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                paymentMethod === 'cash'
                  ? 'bg-amber-500/15 border-amber-500 text-amber-950 font-black shadow-sm'
                  : 'bg-white/50 border-slate-200/70 text-slate-600 font-medium hover:bg-white/80'
              }`}
            >
              <Banknote size={20} className={paymentMethod === 'cash' ? 'text-amber-600' : 'text-slate-500'} />
              <span className="text-[10px]">Espèces (نقداً)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center relative ${
                paymentMethod === 'card'
                  ? 'bg-amber-500/15 border-amber-500 text-amber-950 font-black shadow-sm'
                  : 'bg-white/50 border-slate-200/70 text-slate-600 font-medium hover:bg-white/80'
              }`}
            >
              <CreditCard size={20} className={paymentMethod === 'card' ? 'text-amber-600' : 'text-slate-500'} />
              <span className="text-[10px]">Carte Bancaire</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('edinar')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center relative ${
                paymentMethod === 'edinar'
                  ? 'bg-amber-500/15 border-amber-500 text-amber-950 font-black shadow-sm'
                  : 'bg-white/50 border-slate-200/70 text-slate-600 font-medium hover:bg-white/80'
              }`}
            >
              <Wallet size={20} className={paymentMethod === 'edinar' ? 'text-amber-600' : 'text-slate-500'} />
              <span className="text-[10px]">e-Dinar 🇹🇳</span>
            </button>
          </div>
        </div>

        <div className="bg-white/75 backdrop-blur-md border border-white/90 rounded-2xl p-4 shadow-sm space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span className="font-bold text-slate-900">{subtotal.toFixed(3)} TND</span>
          </div>
          <div className="flex justify-between">
            <span>Frais de livraison</span>
            <span className="font-bold text-slate-900">{deliveryFee.toFixed(3)} TND</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
            <span>Total Final</span>
            <span className="text-amber-700">{grandTotal.toFixed(3)} TND</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 pt-2">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>Facturation & Sécurité conformes INPDP Tunisie</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur-xl border-t border-white/90 z-40">
        <button
          onClick={handleConfirmOrder}
          disabled={isSubmitting || items.length === 0}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-400 font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs tracking-wider transition-all active:scale-[0.99]"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Confirmer la commande ({grandTotal.toFixed(3)} TND)</span>
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
