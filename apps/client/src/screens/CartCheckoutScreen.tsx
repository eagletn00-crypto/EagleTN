import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export interface CartCheckoutScreenProps {
  items?: Array<{ id: string; name: string; price: number; quantity: number; ArabicName?: string }>;
  onBack?: () => void;
  onUpdateQuantity?: (id: string, delta: number) => void;
  onRemoveItem?: (id: string) => void;
  onConfirmOrder?: () => void;
}

export const CartCheckoutScreen: React.FC<CartCheckoutScreenProps> = (props) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartStore = useCartStore ? useCartStore() : null;
  const items = props.items || cartStore?.items || [
    { id: '1', name: 'Plat Tunisien', price: 6.000, quantity: 1, ArabicName: 'صحن تونسي' },
    { id: '2', name: 'Lablebi Special', price: 4.000, quantity: 1, ArabicName: 'صحن لبلابي عادي' },
  ];

  const updateQuantity = (id: string, delta: number) => {
    if (props.onUpdateQuantity) {
      props.onUpdateQuantity(id, delta);
    } else if (cartStore?.updateQuantity) {
      cartStore.updateQuantity(id, delta);
    }
  };

  const removeItem = (id: string) => {
    if (props.onRemoveItem) {
      props.onRemoveItem(id);
    } else if (cartStore?.removeItem) {
      cartStore.removeItem(id);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 2.500 : 0;
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    
    if (props.onConfirmOrder) {
      props.onConfirmOrder();
    } else {
      setTimeout(() => {
        if (cartStore?.clearCart) cartStore.clearCart();
        setIsSubmitting(false);
        navigate('/');
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-sans pb-32 max-w-md mx-auto relative shadow-2xl overflow-hidden selection:bg-amber-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={() => (props.onBack ? props.onBack() : navigate(-1))}
          className="h-9 w-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
        >
          ←
        </button>
        <div className="text-center">
          <h1 className="text-sm font-black text-slate-900 tracking-tight">Mon Panier (السلة)</h1>
          <p className="text-[10px] text-slate-400 font-medium">Eagle TN Express</p>
        </div>
        <button
          onClick={() => cartStore?.clearCart && cartStore.clearCart()}
          className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
        >
          Vider
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* Selected Items List */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            ARTICLES SÉLECTIONNÉS
          </h2>

          {items.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center space-y-3 shadow-xs">
              <span className="text-4xl block">🛍️</span>
              <p className="text-xs font-bold text-slate-700">Votre panier est vide</p>
              <button
                onClick={() => navigate('/')}
                className="text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl"
              >
                Découvrir le menu
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-slate-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {item.ArabicName || item.name}
                    </p>
                    <p className="text-xs font-black text-amber-600 pt-0.5">
                      {(item.price * item.quantity).toFixed(3)} DT
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-6 h-6 rounded-lg bg-white text-slate-500 hover:text-rose-600 flex items-center justify-center text-xs font-bold shadow-xs transition-colors"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center text-xs font-black shadow-xs active:scale-95"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-slate-900 px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-xs active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Payment Methods Section */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            MODE DE PAIEMENT
          </h2>

          <div className="space-y-2">
            <div
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === 'cash'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">💵</div>
                <div>
                  <p className="text-xs font-black">Paiement à la livraison (Espèces)</p>
                  <p className={`text-[10px] ${paymentMethod === 'cash' ? 'text-slate-300' : 'text-slate-400'}`}>
                    الدفع نقداً عند الاستلام الميداني
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cash' ? 'border-amber-400 bg-amber-400' : 'border-slate-300'
                }`}
              >
                {paymentMethod === 'cash' && <span className="text-slate-950 text-[10px] font-black">✓</span>}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/60 bg-slate-50/50 opacity-70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">💳</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-700">Carte Bancaire / E-Dinar</p>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      À BIENTÔT
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">الدفع الإلكتروني عبر البطاقات البنكية (قريباً)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Invoice Summary */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
            RÉSUMÉ DE LA FACTURE
          </h2>

          <div className="space-y-2 text-xs font-medium text-slate-600">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="font-bold text-slate-900">{subtotal.toFixed(3)} DT</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de livraison terrain</span>
              <span className="font-bold text-emerald-600">+{deliveryFee.toFixed(3)} DT</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-sm font-black text-slate-900">
              <span>TOTAL À PAYER</span>
              <span className="text-base text-amber-600">{total.toFixed(3)} DT</span>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-slate-200/80 p-4 z-50">
        <button
          onClick={handleConfirmOrder}
          disabled={items.length === 0 || isSubmitting}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Traitement de la commande...</span>
          ) : (
            <>
              <span>CONFIRMER LA COMMANDE TERRAIN</span>
              <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg font-black">
                {total.toFixed(3)} DT
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartCheckoutScreen;
