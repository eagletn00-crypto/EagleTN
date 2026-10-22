import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  AlertCircle,
  Navigation,
  Phone,
  Store,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Minus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';

interface CheckoutScreenProps {
  partner?: any;
  cartItems?: any[];
  customerAddress?: string;
  customerPhone?: string;
  onRemoveItem?: (itemId: string) => void;
  onRequireAuth?: () => void;
  onConfirmOrder?: (orderData: any) => Promise<any>;
  onBack?: () => void;
  onOrderSuccess?: (orderId: string) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  onBack,
  onOrderSuccess,
}) => {
  // جلب السلة والشريك من الـ Store المركزي بدلاً من الـ Props
  const { cartItems, selectedPartner, updateQuantity, removeFromCart, customerAddress, setCustomerAddress } = useAppStore();
  
  const [address, setAddress] = useState<string>(customerAddress || '');
  const [deliveryNote, setDeliveryNote] = useState<string>('');
  const [restaurantNote, setRestaurantNote] = useState<string>('');
  const [phone, setPhone] = useState<string>('28495021'); // الافتراضي للتجربة

  // إحداثيات الـ GPS
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsAcquired, setGpsAcquired] = useState<boolean>(false);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // مزامنة العنوان مع الـ Store
  useEffect(() => {
    setCustomerAddress(address);
  }, [address, setCustomerAddress]);

  const handleGetLocation = () => {
    if (!('geolocation' in navigator)) {
      setErrorMsg("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setGpsLoading(true);
    setErrorMsg(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);
        setGpsAcquired(true);
        setGpsLoading(false);
        if (!address) {
          setAddress(`Position GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        }
      },
      (error) => {
        setGpsLoading(false);
        console.error("GPS Error:", error);
        setErrorMsg("Veuillez activer votre GPS pour autoriser la livraison sécurisée.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // الحساب المالي الجبائي التونسي
  const subtotalTTC = cartItems.reduce((acc, item) => acc + (item.total_price || (item.price * item.quantity)), 0);
  const deliveryFee = 2.500;
  const timbreFiscal = 1.000;
  const grandTotal = Number((subtotalTTC + deliveryFee + timbreFiscal).toFixed(3));

  const handleConfirmOrder = async () => {
    setErrorMsg(null);
    if (cartItems.length === 0) {
      setErrorMsg('Votre panier est vide.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg("L'adresse de livraison est requise.");
      return;
    }
    if (!latitude || !longitude) {
      setErrorMsg("Veuillez valider votre position GPS exacte avant de commander.");
      return;
    }

    setLoading(true);
    try {
      const itemsPayload = cartItems.map(item => ({
        item_name: item.name,
        quantity: Number(item.quantity) || 1,
        unit_price: Number(item.unit_price || item.price) || 0
      }));

      // Fallback ID إذا لم يكن هناك شريك محدد (للتجارب)
      const targetPartnerUuid = selectedPartner?.id || 'c468b8f6-46ec-4653-8f43-7b387c719e80';

      const { data: orderId, error } = await supabase.rpc('create_full_order', {
        p_partner_id: targetPartnerUuid,
        p_total_amount: grandTotal,
        p_subtotal_ht: subtotalTTC,
        p_delivery_fee: deliveryFee,
        p_delivery_address: address,
        p_items: itemsPayload
      });

      if (error) throw error;

      if (orderId) {
        await supabase
          .from('orders')
          .update({
            delivery_latitude: latitude,
            delivery_longitude: longitude,
            client_phone: phone,
            delivery_note: deliveryNote,
            notes: restaurantNote
          })
          .eq('id', orderId);

        if (onOrderSuccess) onOrderSuccess(orderId);
      }
    } catch (err: any) {
      console.error('Erreur validation commande:', err);
      setErrorMsg(err.message || "Erreur lors de la validation de la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-36 text-stone-900 max-w-md mx-auto relative selection:bg-emerald-500/15 antialiased">
      {/* Header الزجاجي */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl px-4 py-4 flex items-center justify-between shadow-sm border-b border-white">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-[1.25rem] bg-white border border-stone-100 shadow-sm flex items-center justify-center text-stone-600 hover:text-emerald-600 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
          <div>
            <h1 className="font-black text-sm text-stone-800 tracking-tight uppercase">Caisse</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Store className="w-3 h-3 text-emerald-500" />
              <p className="text-[10px] text-stone-500 font-bold truncate max-w-[150px]">
                {selectedPartner?.name ? selectedPartner.name : 'Restaurant Partenaire'}
              </p>
            </div>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[9px] font-black uppercase tracking-wider">Sécurisé</span>
        </div>
      </header>

      <main className="p-4 space-y-5">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-3xl text-xs font-bold flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* سلة المشتريات Ultra Premium */}
        <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              Votre Commande ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </span>
            <span className="text-sm font-black text-stone-800">
              {subtotalTTC.toFixed(3)} <span className="text-[10px] text-stone-500">DT</span>
            </span>
          </div>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-stone-50/50 rounded-2xl border border-stone-100/80">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-800 truncate">{item.name}</h4>
                  <p className="text-[11px] font-black text-emerald-600 mt-0.5">
                    {item.price.toFixed(3)} <span className="text-[9px]">DT</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-200/50 shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.quantity === 1) removeFromCart(item.id);
                      else updateQuantity(item.id, -1);
                    }}
                    className="w-7 h-7 rounded-lg bg-stone-50 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold active:scale-95 transition-transform"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-black w-4 text-center text-stone-800">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 font-bold active:scale-95 transition-transform"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* معلومات العميل */}
        <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-100 space-y-4">
          
          {/* الهاتف */}
          <div>
            <label className="text-[10px] font-black uppercase text-stone-500 tracking-wider flex items-center gap-1.5 mb-2">
              <Phone className="w-3.5 h-3.5 text-emerald-500" /> Numéro de téléphone
            </label>
            <div className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 focus-within:border-emerald-200 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
              <span className="text-xs font-black text-stone-400">+216</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent text-sm font-black text-stone-800 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="h-px bg-stone-100 w-full" />

          {/* العنوان و GPS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Livraison
              </label>

              {gpsAcquired ? (
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmé
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gpsLoading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-[9px] font-black uppercase tracking-wider shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{gpsLoading ? 'Recherche...' : 'GPS Requis'}</span>
                </button>
              )}
            </div>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50 transition-all resize-none"
              placeholder="Appartement, Étage, Bâtiment..."
            />
          </div>

          <div className="h-px bg-stone-100 w-full" />

          {/* الملاحظات */}
          <div className="space-y-2">
            <input
              type="text"
              value={restaurantNote}
              onChange={(e) => setRestaurantNote(e.target.value)}
              placeholder="Note pour le chef (ex: sans oignons)..."
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-xs font-medium text-stone-600 focus:outline-none"
            />
            <input
              type="text"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="Note pour le livreur (ex: code porte)..."
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-xs font-medium text-stone-600 focus:outline-none"
            />
          </div>
        </div>

        {/* الفاتورة وتأكيد الطلب (Sticky Bottom) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-2xl border-t border-stone-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 max-w-md mx-auto rounded-t-[2.5rem]">
          <div className="space-y-2 mb-4 px-2">
            <div className="flex justify-between text-[11px] text-stone-500 font-bold">
              <span>Sous-total</span>
              <span className="text-stone-800">{subtotalTTC.toFixed(3)} DT</span>
            </div>
            <div className="flex justify-between text-[11px] text-stone-500 font-bold">
              <span>Livraison</span>
              <span className="text-stone-800">{deliveryFee.toFixed(3)} DT</span>
            </div>
            <div className="flex justify-between text-[11px] text-stone-500 font-bold">
              <span>Timbre Fiscal</span>
              <span className="text-stone-800">{timbreFiscal.toFixed(3)} DT</span>
            </div>
            <div className="pt-3 border-t border-stone-100 flex justify-between items-end">
              <span className="text-xs font-black uppercase text-stone-400 tracking-widest">Total à Payer</span>
              <span className="text-xl font-black text-emerald-600 tracking-tight">
                {grandTotal.toFixed(3)} <span className="text-sm">DT</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-black text-sm uppercase tracking-widest py-5 rounded-[2rem] shadow-xl shadow-stone-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 overflow-hidden relative"
          >
            {/* لمعان خفيف للزر */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
            <ShieldCheck className="w-5 h-5 relative z-10 text-emerald-400" />
            <span className="relative z-10">{loading ? 'Traitement...' : 'Payer à la livraison'}</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default CheckoutScreen;
