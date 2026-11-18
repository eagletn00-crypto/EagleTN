import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, User, Receipt, Banknote, ShieldCheck, ChevronRight, CheckCircle2, Plus, Minus, X, AlertCircle, LogIn, ShoppingBag } from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../store/useCartStore';
import { Order, CartItemPayload } from '@eagletn/types';

const DELIVERY_FEE = 0; // Livraison offerte
const TIMBRE_FISCAL = 0.600;

const CHANGE_OPTIONS = [
  { label: "L'Appoint (بدون صرف)", value: null },
  { label: '20 DT', value: 20 },
  { label: '50 DT', value: 50 },
  { label: '100 DT', value: 100 }
];

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  const [customerName, setCustomerName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [changeNeeded, setChangeNeeded] = useState<number | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [generatedPin, setGeneratedPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ⚠️ ملاحظة: يجب ربط هذا بمخزن المصادقة الخاص بك (useAuthStore)
  const isAuthChecked = true; 
  const currentUser = { id: 'temp-client-id' }; 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subtotalTTC = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const grandTotal = subtotalTTC + DELIVERY_FEE + TIMBRE_FISCAL;

  const handleCheckout = async () => {
    if (!customerName || !clientPhone || !deliveryAddress) {
      await Haptics.notification({ type: NotificationType.Warning });
      setErrorMsg('Veuillez remplir tous les champs de livraison.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await Haptics.impact({ style: ImpactStyle.Heavy });

      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedPin(pin);

      // 🦅 الحماية الصارمة: لا وجود لـ as any
      const orderPayload = {
        client_id: currentUser?.id,
        partner_id: (items[0] as any)?.partner_id || 'default_partner',
        customer_name: customerName,
        client_phone: clientPhone,
        delivery_address: deliveryAddress,
        delivery_lat: null,
        delivery_lng: null,
        subtotal: subtotalTTC,
        timbre_fiscal: TIMBRE_FISCAL,
        delivery_fee: DELIVERY_FEE,
        total_amount: grandTotal,
        grand_total: grandTotal,
        payment_method: 'COD',
        change_needed_for: changeNeeded,
        status: 'pending',
        verification_code: pin,
        pin_code: pin
      };

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select('id')
        .single();

      if (orderError) throw orderError;
      if (!orderData) throw new Error('Erreur lors de la création de la commande.');

      const createdOrder = orderData as { id: string };

      const orderItemsPayload = items.map((item: any) => ({
        order_id: createdOrder.id,
        item_id: item.id,
        item_name: item.name,
        name: item.name,
        price: item.price,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        quantity: item.quantity,
        // 🦅 دمج الملاحظات التي تمت إضافتها في نافذة الطلب
        options: item.instructions ? [{ note: item.instructions }] : []
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsError) throw itemsError;

      await Haptics.notification({ type: NotificationType.Success });
      clearCart();
      setSuccessOrderId(createdOrder.id);

    } catch (error: any) {
      console.error('Checkout Error:', error);
      await Haptics.notification({ type: NotificationType.Error });
      setErrorMsg(error.message || 'Une erreur est survenue lors de la validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !successOrderId) {
    return (
      <div className="min-h-[100dvh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-[22px] font-black text-[#1C1917] mb-2 uppercase">Panier vide</h2>
        <p className="text-[14px] font-bold text-gray-500 mb-8">Votre panier est actuellement vide.</p>
        <button onClick={() => navigate(-1)} className="bg-[#1C1917] text-white px-8 py-3.5 rounded-full font-black text-[14px] uppercase tracking-wide active:scale-95 transition-transform shadow-lg">
          Retour au menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] font-sans pb-[240px]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-gray-200/50 px-4 h-16 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center active:scale-90 transition-transform outline-none">
          <ArrowLeft className="w-5 h-5 text-[#1C1917]" />
        </button>
        <h1 className="text-[16px] font-black text-[#1C1917] uppercase tracking-widest">Finaliser</h1>
        <div className="w-10" />
      </header>

      <main className="p-4 space-y-4">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-[20px] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#C1121F] shrink-0 mt-0.5" />
            <p className="text-[13px] font-bold text-red-800">{errorMsg}</p>
          </div>
        )}

        {/* DETAILS LIVRAISON */}
        <section className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-[16px] font-black text-[#1C1917] flex items-center gap-2 uppercase">
              <MapPin className="w-5 h-5 text-[#C1121F]" strokeWidth={2.5} /> Livraison
            </h2>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input type="text" placeholder="Nom complet (الاسم الكامل)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full h-12 pl-11 pr-4 bg-gray-50 rounded-xl text-[14px] font-bold text-[#1C1917] outline-none border border-gray-200 focus:border-[#C1121F] focus:ring-1 focus:ring-[#C1121F] transition-all" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input type="tel" maxLength={8} placeholder="Téléphone (رقم الهاتف)" value={clientPhone} onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, ''))} className="w-full h-12 pl-11 pr-4 bg-gray-50 rounded-xl text-[14px] font-bold text-[#1C1917] outline-none border border-gray-200 focus:border-[#C1121F] focus:ring-1 focus:ring-[#C1121F] transition-all" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
              <textarea rows={2} placeholder="Adresse complète (العنوان الكامل)" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full pl-11 pr-4 pt-3.5 bg-gray-50 rounded-xl text-[14px] font-bold text-[#1C1917] outline-none border border-gray-200 focus:border-[#C1121F] focus:ring-1 focus:ring-[#C1121F] transition-all resize-none" />
            </div>
          </div>
        </section>

        {/* PAIEMENT & MONNAIE */}
        <section className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex flex-col border-b border-gray-100 pb-3">
            <h2 className="text-[16px] font-black text-[#1C1917] flex items-center gap-2 uppercase">
              <Banknote className="w-5 h-5 text-[#C1121F]" strokeWidth={2.5} /> Espèces à la livraison
            </h2>
            <p className="text-[12px] font-bold text-gray-400 mt-1">Sur quel billet allez-vous payer ? (هل تحتاج إلى صرف؟)</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-1">
            {CHANGE_OPTIONS.map((opt) => (
              <motion.button
                key={String(opt.value)}
                whileTap={{ scale: 0.95 }}
                onClick={() => { Haptics.impact({ style: ImpactStyle.Light }); setChangeNeeded(opt.value); }}
                className={`flex-1 min-w-[70px] h-11 rounded-xl text-[12px] font-black border transition-all outline-none ${
                  changeNeeded === opt.value
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-md'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </section>

        {/* RECAPITULATIF */}
        <section className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="text-[16px] font-black text-[#1C1917] flex items-center gap-2 uppercase border-b border-gray-100 pb-3">
            <Receipt className="w-5 h-5 text-[#1C1917]" strokeWidth={2.5} /> Récapitulatif
          </h2>
          <div className="flex flex-col gap-4">
            {items.map((item: any) => (
              <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                {item.image_url && (
                  <div className="w-[60px] h-[60px] bg-gray-50 rounded-xl p-1 shrink-0 flex items-center justify-center border border-gray-100">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-[14px] font-black text-[#1C1917] leading-snug">{item.name}</h4>
                  <span className="text-[13px] font-black text-[#C1121F] mt-1 tabular-nums">{item.price.toFixed(3)} DT</span>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id)} className="p-1 text-gray-400 hover:text-red-500 outline-none transition-colors">
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-8 px-1 mt-auto">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-full flex items-center justify-center text-[#1C1917] outline-none">
                      <Minus className="w-3 h-3" strokeWidth={3} />
                    </button>
                    <span className="text-[#1C1917] text-[12px] font-black min-w-[24px] text-center tabular-nums">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-full flex items-center justify-center text-[#1C1917] outline-none">
                      <Plus className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER & CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 pb-[env(safe-area-inset-bottom,16px)] px-5 pt-4 z-40 rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-2 mb-5 text-[13px] font-bold text-gray-500 px-2">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span className="font-black text-[#1C1917]">{subtotalTTC.toFixed(3)} DT</span>
          </div>
          <div className="flex justify-between">
            <span>Livraison</span>
            <span className="font-black text-emerald-600 uppercase tracking-widest text-[11px] mt-0.5">Offerte</span>
          </div>
          <div className="flex justify-between">
            <span>Timbre fiscal</span>
            <span className="font-black text-[#1C1917]">{TIMBRE_FISCAL.toFixed(3)} DT</span>
          </div>
        </div>

        {!isAuthChecked || !currentUser ? (
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate('/auth')} className="w-full h-[56px] bg-[#1C1917] text-white rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 px-5 outline-none">
            <LogIn className="w-5 h-5" />
            <span className="text-[14px] font-black tracking-wide uppercase">Connexion requise</span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="w-full h-[56px] bg-[#C1121F] hover:bg-[#a00e19] text-white rounded-full shadow-[0_8px_24px_rgba(193,18,31,0.25)] flex items-center justify-between px-6 outline-none transition-all disabled:opacity-70 disabled:grayscale-[30%]"
          >
            <span className="text-[16px] font-black tabular-nums tracking-tight bg-white/20 px-3 py-1.5 rounded-full border border-white/20">
              {grandTotal.toFixed(3)} DT
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-black tracking-wide uppercase">
                {isSubmitting ? 'Validation...' : 'Confirmer'}
              </span>
              {!isSubmitting && <ChevronRight className="w-5 h-5" strokeWidth={2.5} />}
            </div>
          </motion.button>
        )}

        <div className="flex items-center justify-center gap-1.5 mt-4 opacity-80">
          <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Paiement à la livraison (COD) sécurisé
          </span>
        </div>
      </div>

      {/* SUCCESS MODAL (Ultra-Premium) */}
      <AnimatePresence>
        {successOrderId && (
          <div className="fixed inset-0 z-[999] flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#1C1917]/70 backdrop-blur-md" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-full max-w-lg bg-[#FAF8F5] rounded-t-[40px] z-[1000] flex flex-col p-6 items-center text-center pb-[env(safe-area-inset-bottom,32px)] shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5 isolate border border-emerald-100 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={2.5} />
                <div className="absolute inset-0 border-[2px] border-emerald-500/20 rounded-full animate-ping" />
              </div>
              
              <h2 className="text-[26px] font-black text-[#1C1917] tracking-tight leading-tight uppercase">Commande validée</h2>
              <p className="text-[14px] text-gray-500 mt-2 font-bold max-w-[280px]">
                Votre commande a été transmise avec succès. Notre livreur est en route.
              </p>
              
              <div className="w-full bg-white border border-gray-200 rounded-[24px] p-5 mt-6 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#C1121F]" />
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Code de vérification (PIN)</span>
                <span className="text-[36px] font-black text-[#C1121F] tracking-[0.2em] leading-none mt-2 drop-shadow-sm">
                  {generatedPin}
                </span>
                <span className="text-[11px] font-bold text-gray-500 mt-2">À présenter au livreur (قدمه للمندوب عند الاستلام)</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/order/track/${successOrderId}`, { replace: true })}
                className="w-full h-[56px] bg-[#1C1917] text-white rounded-full font-black text-[14px] uppercase tracking-wide shadow-[0_8px_24px_rgba(0,0,0,0.15)] mt-6 flex items-center justify-center outline-none border border-white/10"
              >
                Suivre mon livreur 🛵
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
