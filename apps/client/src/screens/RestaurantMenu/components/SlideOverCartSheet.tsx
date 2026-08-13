import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface SlideOverCartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  partnerId: string;
  onOrderSuccess: (orderId: string) => void;
}

export const SlideOverCartSheet: React.FC<SlideOverCartSheetProps> = ({
  isOpen,
  onClose,
  cartItems,
  partnerId,
  onOrderSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedLegalTerms, setAcceptedLegalTerms] = useState(false);
  const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);

  // Form States
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [currentGpsAddress] = useState('Position GPS Actuelle (Tunisie)');
  const [locationType, setLocationType] = useState<'current' | 'custom'>('current');
  const [kitchenNote, setKitchenNote] = useState('');
  const [driverNote, setDriverNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [changeAmount, setChangeAmount] = useState('');
  const [driverTip, setDriverTip] = useState<number>(0);
  const [promoCode, setPromoCode] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.500;
  const platformFee = 0.500;
  const discount = promoCode.trim().toUpperCase() === 'EAGLE' ? 1.500 : 0.000;
  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + driverTip - discount);

  const handleCheckout = async () => {
    if (!acceptedLegalTerms) {
      alert('Veuillez accepter les conditions de confidentialité (INDPD) pour continuer.');
      return;
    }

    if (cartItems.length === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();

      const finalAddress = locationType === 'current' ? currentGpsAddress : customAddress;

      const formattedItems = cartItems.map((item) => ({
        item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        item_name_fr: item.name,
      }));

      const parsedChangeAmount = changeAmount.trim() !== '' ? parseInt(changeAmount, 10) : null;

      const { data, error } = await supabase.rpc('create_checkout_order', {
        p_client_id: user?.id || null,
        p_partner_id: partnerId || null,
        p_client_name: clientName.trim() || 'Client Guest',
        p_client_phone: clientPhone.trim() || 'Non spécifié',
        p_delivery_address: finalAddress.trim() || 'Adresse non spécifiée',
        p_kitchen_note: kitchenNote.trim(),
        p_driver_note: driverNote.trim(),
        p_payment_method: paymentMethod,
        p_change_amount: isNaN(Number(parsedChangeAmount)) ? null : parsedChangeAmount,
        p_driver_tip: driverTip,
        p_promo_code: promoCode.trim(),
        p_indpd_accepted: acceptedLegalTerms,
        p_cgu_accepted: acceptedLegalTerms,
        p_items: formattedItems,
        p_subtotal: subtotal,
        p_delivery_fee: deliveryFee,
        p_platform_fee: platformFee,
      });

      if (error) throw error;

      if (data && data.success) {
        setOrderConfirmedId(data.order_id);
        onOrderSuccess(data.order_id);
      } else {
        throw new Error(data?.message || 'Erreur lors de la validation de la commande');
      }

    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Erreur: ' + (err.message || 'Problème de connexion avec Supabase'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderConfirmedId) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-emerald-100 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
            ✓
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Commande Confirmée!</h3>
          <p className="text-xs text-slate-500 font-medium">
            Votre commande a été enregistrée avec succès.
          </p>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs font-mono font-bold text-slate-700">
            ID: {orderConfirmedId}
          </div>
          <button
            onClick={() => {
              setOrderConfirmedId(null);
              onClose();
            }}
            className="w-full py-3.5 bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
          >
            Fermer et suivre la commande 🛵
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-md bg-[#FAF9F6] text-slate-900 h-full flex flex-col justify-between p-6 overflow-y-auto shadow-2xl">
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">Mon Panier</h2>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Eagle TN • Express Delivery</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-200/60 text-slate-600 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center font-bold text-lg transition-all"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Articles sélectionné(s)</h3>
            {cartItems.length === 0 ? (
              <p className="text-center text-slate-400 py-8 text-sm font-semibold">Votre panier est vide</p>
            ) : (
              <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm space-y-1">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center font-mono">
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Quantité: x{item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black text-emerald-600">{(item.price * item.quantity).toFixed(3)} DT</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Détails de livraison</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="Nom complet"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
              <input
                type="tel"
                placeholder="Téléphone (+216)"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLocationType('current')}
                className={`flex-1 py-3 rounded-2xl text-xs font-extrabold border transition-all flex items-center justify-center gap-2 ${
                  locationType === 'current'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>📍</span> Position GPS
              </button>
              <button
                type="button"
                onClick={() => setLocationType('custom')}
                className={`flex-1 py-3 rounded-2xl text-xs font-extrabold border transition-all flex items-center justify-center gap-2 ${
                  locationType === 'custom'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>✏️</span> Autre adresse
              </button>
            </div>

            {locationType === 'custom' && (
              <input
                type="text"
                placeholder="Adresse exacte (Rue, Résidence, Appartement...)"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
            )}
          </div>

          <div className="space-y-2.5">
            <input
              type="text"
              placeholder="Instructions cuisine 🍳 (ex: Sans piment, extra fromage)"
              value={kitchenNote}
              onChange={(e) => setKitchenNote(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
            <input
              type="text"
              placeholder="Instructions livreur 🛵 (ex: 3ème étage, appeler à l'arrivée)"
              value={driverNote}
              onChange={(e) => setDriverNote(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Mode de paiement</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`py-3.5 rounded-2xl text-xs font-extrabold border transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === 'cod'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>💵</span> Espèces (COD)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3.5 rounded-2xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1.5 relative overflow-hidden ${
                  paymentMethod === 'card'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>💳</span> Carte / e-Dinar
                <span className="text-[9px] bg-amber-500/20 text-amber-600 font-black px-1.5 py-0.5 rounded-md border border-amber-500/30">
                  À bientôt
                </span>
              </button>
            </div>

            {paymentMethod === 'cod' && (
              <input
                type="text"
                placeholder="Rendu de monnaie (ex: Billet de 50 DT)"
                value={changeAmount}
                onChange={(e) => setChangeAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-extrabold text-slate-500">Pourboire livreur:</span>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((tip) => (
                  <button
                    key={tip}
                    type="button"
                    onClick={() => setDriverTip(tip)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      driverTip === tip
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tip === 0 ? 'Aucun' : `${tip} DT`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Code promo (ex: EAGLE)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-2xl p-3.5 text-xs font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 uppercase font-mono transition-all shadow-sm"
            />
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-500 font-bold">
              <span>Sous-total</span>
              <span className="font-mono text-emerald-600">{subtotal.toFixed(3)} DT</span>
            </div>
            <div className="flex justify-between text-slate-500 font-bold">
              <span>Frais de livraison</span>
              <span className="font-mono text-emerald-600">{deliveryFee.toFixed(3)} DT</span>
            </div>
            <div className="flex justify-between text-slate-500 font-bold">
              <span>Frais de service</span>
              <span className="font-mono text-emerald-600">{platformFee.toFixed(3)} DT</span>
            </div>
            {driverTip > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Pourboire livreur</span>
                <span className="font-mono">+{driverTip.toFixed(3)} DT</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Remise Code Promo</span>
                <span className="font-mono">-{discount.toFixed(3)} DT</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 font-black text-base pt-3 border-t border-slate-100">
              <span>Total à payer</span>
              <span className="font-mono text-emerald-600 text-lg">{grandTotal.toFixed(3)} DT</span>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-3 text-[11px] text-slate-500 font-medium leading-relaxed cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedLegalTerms}
                onChange={(e) => setAcceptedLegalTerms(e.target.checked)}
                className="mt-0.5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>
                J'accepte le traitement de mes données personnelles conformément à la réglementation <strong className="text-slate-800">INDPD (Tunisie)</strong>.
              </span>
            </label>
          </div>
        </div>

        <div className="pt-5 border-t border-slate-200">
          <button
            onClick={handleCheckout}
            disabled={isSubmitting || !acceptedLegalTerms || cartItems.length === 0}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
          >
            {isSubmitting ? 'Validation en cours...' : `Confirmer la commande • ${grandTotal.toFixed(3)} DT`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideOverCartSheet;
