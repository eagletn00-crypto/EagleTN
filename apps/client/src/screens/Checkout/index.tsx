import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { orderService } from '../../services/orderService';
import { DeliveryAddress } from '../../types';

export const CheckoutScreen: React.FC = () => {
  const navigate = useNavigate();
  const { items, partnerId, clearCart } = useCartStore();

  const [address, setAddress] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // حساب المجموع الفرعي مباشرة من مصفوفة العناصر لتجنب الاعتماد على أساليب غير معرفة
  const subtotal = items.reduce(
    (sum, item) => sum + ((item.menu_item?.price || 0) * item.quantity),
    0
  );

  const deliveryFee = 3.0;
  const totalAmount = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!partnerId || items.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    if (!address.trim()) {
      setError('Veuillez saisir une adresse de livraison.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const deliveryAddressObj: DeliveryAddress = {
        description: address,
        street: address
      };

      const order = await orderService.createOrder({
        partner_id: partnerId,
        client_id: 'guest_client_id',
        items: items as any,
        subtotal,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        address,
        delivery_address: deliveryAddressObj
      });

      clearCart();
      navigate(`/order/${order.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 max-w-md mx-auto">
      <header className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-xl">⬅️</button>
        <h1 className="text-lg font-black text-slate-900">Commander</h1>
      </header>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h2 className="text-xs font-black text-slate-700 uppercase">Adresse de livraison</h2>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ex: Rue Habib Bourguiba, Tunis"
            className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold border border-slate-200 outline-none focus:border-amber-500"
          />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2 text-xs">
          <div className="flex justify-between font-bold text-slate-600">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(3)} DT</span>
          </div>
          <div className="flex justify-between font-bold text-slate-600">
            <span>Frais de livraison</span>
            <span>{deliveryFee.toFixed(3)} DT</span>
          </div>
          <hr className="my-2 border-slate-100" />
          <div className="flex justify-between font-black text-slate-900 text-sm">
            <span>Total</span>
            <span className="text-amber-600">{totalAmount.toFixed(3)} DT</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-amber-500 text-slate-950 font-black rounded-2xl text-xs shadow-md hover:bg-amber-400 disabled:opacity-50"
        >
          {isSubmitting ? 'Validation en cours...' : 'Confirmer la commande'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutScreen;
