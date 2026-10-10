import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  Sparkles,
  Plus,
  Minus,
  AlertCircle,
  Navigation,
  Phone,
  Store
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  partner_id?: string;
}

interface Partner {
  id: string;
  name: string;
  [key: string]: any;
}

interface CheckoutScreenProps {
  cartItems?: CartItem[];
  partnerId?: string;
  partner?: Partner | null;
  customerAddress?: string;
  customerPhone?: string;
  onRemoveItem?: (itemId: string) => void;
  onRequireAuth?: () => void;
  onConfirmOrder?: (orderData: any) => Promise<any>;
  onBack?: () => void;
  onOrderSuccess?: (orderId: string) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cartItems: initialCart = [],
  partnerId,
  partner,
  customerAddress,
  customerPhone,
  onRemoveItem,
  onConfirmOrder,
  onBack,
  onOrderSuccess,
}) => {
  const [cart, setCart] = useState<CartItem[]>(initialCart.length > 0 ? initialCart : [
    { id: '1', name: 'Plat Tunisien', price: 6.000, quantity: 1, partner_id: partnerId || partner?.id || 'default-partner' },
    { id: '2', name: 'Casse-Croûte Escalope', price: 6.000, quantity: 1, partner_id: partnerId || partner?.id || 'default-partner' }
  ]);

  const [address, setAddress] = useState<string>(customerAddress || 'Avenue Habib Bourguiba, Ksour Essaf');
  const [deliveryNote, setDeliveryNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 35.4244, lng: 11.0286 });
  const [locating, setLocating] = useState<boolean>(false);
  const [locSuccess, setLocSuccess] = useState<boolean>(false);

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [phoneInput, setPhoneInput] = useState<string>(customerPhone || '');
  const [showPhoneGate, setShowPhoneGate] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialCart && initialCart.length > 0) {
      setCart(initialCart);
    }
  }, [initialCart]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (data) {
          setProfile(data);
          const existingPhone = data.phone_number || data.phone || customerPhone;
          if (existingPhone) {
            setPhoneInput(existingPhone.replace('+216', ''));
          } else {
            setShowPhoneGate(true);
          }
        } else {
          setShowPhoneGate(true);
        }
      }
    };
    fetchUserData();
  }, [customerPhone]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('La géolocalisation n\'est pas supportée.');
      return;
    }
    setLocating(true);
    setErrorMsg(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
        setLocSuccess(true);
        setTimeout(() => setLocSuccess(false), 3000);
      },
      () => {
        setLocating(false);
        setErrorMsg('Impossible de récupérer la position GPS.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const updateQuantity = (id: string, delta: number) => {
    const stringId = String(id);
    if (delta < 0 && onRemoveItem && cart.find(i => String(i.id) === stringId)?.quantity === 1) {
      onRemoveItem(stringId);
    }
    setCart(prev => prev.map(item => {
      if (String(item.id) === stringId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const subtotalHT = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tvaAmount = Number((subtotalHT * 0.19).toFixed(3));
  const timbreFiscal = 1.000;
  
  const envDeliveryFee = (import.meta as any).env?.VITE_DEFAULT_DELIVERY_FEE;
  const deliveryFee = Number(envDeliveryFee ? Number(envDeliveryFee) : 2.000);
  const grandTotal = Number((subtotalHT + tvaAmount + timbreFiscal + deliveryFee).toFixed(3));

  const handleSavePhoneAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[24579]\d{7}$/.test(phoneInput)) {
      setErrorMsg('Numéro tunisien invalide.');
      return;
    }
    const fullPhone = `+216${phoneInput}`;
    try {
      if (user) {
        await supabase.from('profiles').update({ phone_number: fullPhone, phone: fullPhone }).eq('id', user.id);
      }
      setProfile((prev: any) => ({ ...prev, phone_number: fullPhone }));
      setShowPhoneGate(false);
      setErrorMsg(null);
    } catch {
      setErrorMsg('Erreur enregistrement téléphone.');
    }
  };

  const resolvePartnerUUID = async (inputPartnerId: string): Promise<string> => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(inputPartnerId)) return inputPartnerId;

    const { data } = await supabase
      .from('partners')
      .select('id')
      .or(`id.eq.${inputPartnerId},name.ilike.%${inputPartnerId}%`)
      .maybeSingle();

    if (data?.id) return data.id;

    const { data: fallback } = await supabase.from('partners').select('id').limit(1).maybeSingle();
    if (fallback?.id) return fallback.id;

    throw new Error("Partenaire introuvable.");
  };

  const handleConfirmOrder = async () => {
    setErrorMsg(null);
    const activePhone = profile?.phone_number || profile?.phone || customerPhone;
    if (!activePhone) {
      setShowPhoneGate(true);
      return;
    }
    if (cart.length === 0) {
      setErrorMsg('Votre panier est vide.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Adresse de livraison requise.');
      return;
    }

    setLoading(true);
    try {
      const rawPartnerId = partner?.id || partnerId || cart[0]?.partner_id || 'default-partner';
      const validPartnerUuid = await resolvePartnerUUID(rawPartnerId);

      const dynamicPinCode = Math.floor(1000 + Math.random() * 9000).toString();

      // الحمولة المطابقة تماماً لـ Supabase Schema (بدون الحقل الوهمي pin)
      const orderPayload = {
        partner_id: validPartnerUuid,
        client_id: user?.id || null,
        user_id: user?.id || null,
        client_name: profile?.full_name || user?.user_metadata?.full_name || 'Client VIP',
        client_phone: activePhone,
        subtotal_ht: subtotalHT,
        tva_amount: tvaAmount,
        timbre_fiscal: timbreFiscal,
        delivery_fee: deliveryFee,
        grand_total: grandTotal,
        total_amount: grandTotal,
        delivery_address: address,
        delivery_note: deliveryNote,
        order_items: cart,
        status: 'pending',
        payment_method: paymentMethod,
        cgu_accepted: true,
        inpdp_accepted: true,
        delivery_lat: coords.lat,
        delivery_lng: coords.lng,
        pin_code: dynamicPinCode,
        verification_code: dynamicPinCode
      };

      if (onConfirmOrder) {
        const resId = await onConfirmOrder(orderPayload);
        if (resId && onOrderSuccess) {
          onOrderSuccess(resId);
          return;
        }
      }

      const { data, error } = await supabase.from('orders').insert([orderPayload]).select().single();
      if (error) throw error;

      if (onOrderSuccess && data) {
        onOrderSuccess(data.id);
      } else if (onBack) {
        onBack();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la validation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] pb-40 text-slate-900 max-w-md mx-auto border-x border-slate-200/60 shadow-2xl relative selection:bg-emerald-500/15">
      
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
          <div>
            <h1 className="font-extrabold text-xs text-slate-900 tracking-tight">Finaliser la Commande</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Store className="w-3 h-3 text-emerald-600" />
              <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-wide truncate max-w-[160px]">
                {partner?.name ? partner.name : 'EAGLE TN'}
              </p>
            </div>
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black">
          🛒
        </div>
      </header>

      <main className="p-3.5 space-y-3">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-[11px] font-bold flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-[22px] p-3.5 ring-1 ring-slate-200/70 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-[11px] uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Adresse & GPS</span>
            </div>
            
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold transition-all border border-emerald-200/50"
            >
              <Navigation className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'Localisation...' : locSuccess ? 'Fixé !' : 'GPS Actif'}</span>
            </button>
          </div>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adresse de livraison..."
            className="w-full h-10 px-3 bg-slate-50 border border-slate-200/70 rounded-xl text-[11px] font-bold text-slate-900 focus:outline-none focus:border-emerald-600 transition-all"
          />
          <input
            type="text"
            value={deliveryNote}
            onChange={(e) => setDeliveryNote(e.target.value)}
            placeholder="Instructions livreur (ex: Étage 2...)"
            className="w-full h-9 px-3 bg-slate-50 border border-slate-200/70 rounded-xl text-[11px] font-medium text-slate-700 focus:outline-none focus:border-emerald-600 transition-all"
          />
        </div>

        <div className="bg-white rounded-[22px] p-3.5 ring-1 ring-slate-200/70 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Articles</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {cart.reduce((acc, i) => acc + i.quantity, 0)} total
            </span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-[11px] font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-[10px] font-extrabold text-emerald-600 font-mono mt-0.5">{(item.price).toFixed(3)} TND</p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => updateQuantity(String(item.id), -1)}
                    className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] font-extrabold font-mono w-4 text-center text-slate-900">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(String(item.id), 1)}
                    className="w-6 h-6 rounded-lg bg-emerald-600 text-white shadow-xs flex items-center justify-center hover:bg-emerald-500 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[22px] p-3.5 ring-1 ring-slate-200/70 shadow-sm space-y-2.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paiement</span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                paymentMethod === 'cash'
                  ? 'bg-emerald-50/60 border-emerald-500 text-emerald-950 shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 text-slate-600'
              }`}
            >
              <Banknote className={`w-4 h-4 ${paymentMethod === 'cash' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <div>
                <p className="text-[11px] font-extrabold">Espèces</p>
                <p className="text-[9px] text-slate-500">À la livraison</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                paymentMethod === 'card'
                  ? 'bg-emerald-50/60 border-emerald-500 text-emerald-950 shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 text-slate-600'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${paymentMethod === 'card' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <div>
                <p className="text-[11px] font-extrabold">Carte</p>
                <p className="text-[9px] text-slate-500">En ligne</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[22px] p-3.5 ring-1 ring-slate-200/70 shadow-sm space-y-2 text-[11px]">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Résumé Financier</span>
          <div className="flex justify-between text-slate-600">
            <span>Sous-total HT</span>
            <span className="font-bold font-mono text-slate-900">{subtotalHT.toFixed(3)} TND</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>TVA (19%)</span>
            <span className="font-bold font-mono text-slate-900">{tvaAmount.toFixed(3)} TND</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Timbre Fiscal</span>
            <span className="font-bold font-mono text-slate-900">{timbreFiscal.toFixed(3)} TND</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Livraison</span>
            <span className="font-bold font-mono text-slate-900">{deliveryFee.toFixed(3)} TND</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-black text-slate-900">
            <span>Total Global</span>
            <span className="text-emerald-600 font-mono text-sm font-black">{grandTotal.toFixed(3)} TND</span>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-slate-200/80 p-3 z-40 shadow-xl">
        <button
          type="button"
          disabled={loading || cart.length === 0}
          onClick={handleConfirmOrder}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-pulse">Validation...</span>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confirmer et Payer {grandTotal.toFixed(3)} TND</span>
            </>
          )}
        </button>
      </footer>

      {showPhoneGate && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-5 max-w-xs w-full space-y-3.5 shadow-2xl">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-sm text-slate-900">Téléphone Requis</h3>
              <p className="text-[11px] text-slate-500">Pour contacter le livreur lors de la course.</p>
            </div>

            <form onSubmit={handleSavePhoneAndProceed} className="space-y-3 pt-1">
              <div className="relative flex items-center">
                <span className="absolute left-3 font-bold text-[11px] text-slate-500 bg-slate-100 px-1.5 py-1 rounded-md">+216</span>
                <input
                  type="tel"
                  required
                  maxLength={8}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="98 123 456"
                  className="w-full h-11 pl-16 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={phoneInput.length !== 8}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 rounded-xl font-extrabold text-xs shadow-md transition-all disabled:opacity-40"
              >
                Enregistrer 🚀
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutScreen;
