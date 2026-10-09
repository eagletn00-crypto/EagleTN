import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, AlertCircle, MapPin, Phone, User, 
  MessageSquare, Trash2, ShieldCheck, Sparkles, Navigation, 
  ChevronRight, Check, CreditCard, Banknote, Building2 
} from 'lucide-react';
import { Partner } from '../../types/partner';
import { supabase } from '../../lib/supabase';
import { InvoiceModal, InvoiceData } from './InvoiceModal';

export interface CartItem {
  id?: string;
  name?: string;
  title?: string;
  quantity: number;
  price?: number;
  total_price?: number;
}

export interface CheckoutProps {
  partner: Partner;
  cartItems: CartItem[];
  customerAddress?: string;
  customerPhone?: string;
  onBack: () => void;
  onRemoveItem?: (itemId: string) => void;
  onOrderSuccess?: (orderId: string) => void;
  onRequireAuth?: () => void;
  onConfirmOrder?: (orderData: {
    address: string;
    phone: string;
    notes: string;
    pin: string;
    totalAmount: number;
  }) => Promise<void>;
}

export const Checkout: React.FC<CheckoutProps> = ({
  partner,
  cartItems,
  customerAddress = '',
  customerPhone = '',
  onBack,
  onRemoveItem,
  onOrderSuccess,
  onRequireAuth,
  onConfirmOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState(customerPhone);
  const [address, setAddress] = useState(customerAddress);
  const [partnerNote, setPartnerNote] = useState('');
  const [livreurNote, setLivreurNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<(InvoiceData & { orderId: string }) | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        if (session.user.user_metadata?.full_name && !customerName) {
          setCustomerName(session.user.user_metadata.full_name);
        }
        if (session.user.phone && !phone) {
          setPhone(session.user.phone);
        }
      }
    };

    checkUserSession();

    const authSuccess = localStorage.getItem('eagle_auth_success');
    if (authSuccess) {
      setAuthSuccessMsg('Authentification réussie. Vous pouvez finaliser votre commande.');
      localStorage.removeItem('eagle_auth_success');
      setTimeout(() => setAuthSuccessMsg(null), 4000);
    }
  }, []);

  const getItemTitle = (item: CartItem) => item.name || item.title || 'Article';

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.price ?? 0;
    return sum + (item.total_price ?? itemPrice * item.quantity);
  }, 0);

  const deliveryFee = partner?.delivery_fee ?? 2.000;
  const driverFee = 1.500;
  const totalAmount = subtotal + deliveryFee;

  const isValidUUID = (str?: string) => {
    if (!str) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
  };

  const isValidTunisianPhone = (phoneNum: string) => {
    const cleanPhone = phoneNum.replace(/\s+/g, '');
    return /^[24579]\d{7}$/.test(cleanPhone);
  };

  const handleFetchAutoLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddress(`GPS: ${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`);
        },
        () => {
          setErrorMsg('Géolocalisation automatique indisponible sur votre appareil.');
        }
      );
    }
  };

  const handleAddQuickChip = (chipText: string, target: 'partner' | 'livreur') => {
    if (target === 'partner') {
      setPartnerNote((prev) => (prev ? `${prev}, ${chipText}` : chipText));
    } else {
      setLivreurNote((prev) => (prev ? `${prev}, ${chipText}` : chipText));
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.replace(/\s+/g, '');

    if (!userId) {
      localStorage.setItem('eagle_pending_checkout', JSON.stringify({
        customerName,
        phone: cleanPhone,
        address,
        partnerNote,
        livreurNote
      }));
      
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        setErrorMsg('Veuillez vous connecter afin de valider votre commande.');
      }
      return;
    }

    if (!customerName.trim() || !cleanPhone || !address.trim()) {
      setErrorMsg('Veuillez renseigner l\'ensemble des champs obligatoires.');
      return;
    }

    if (!isValidTunisianPhone(cleanPhone)) {
      setErrorMsg('Veuillez saisir un numéro de téléphone tunisien valide (8 chiffres).');
      return;
    }

    const resolvedPartnerId = isValidUUID(partner?.id)
      ? partner.id
      : 'a1b2c3d4-a5f6-7890-abcd-111122223333';

    setSubmitting(true);

    try {
      const { data: realPartner, error: partnerError } = await supabase
        .from('partners')
        .select('id, name')
        .eq('id', resolvedPartnerId)
        .single();

      if (partnerError || !realPartner) {
        throw new Error("Le partenaire sélectionné est introuvable ou indisponible.");
      }

      const pinCode = Math.floor(1000 + Math.random() * 9000).toString();

      const combinedNotes = [
        partnerNote ? `[Partenaire]: ${partnerNote}` : '',
        livreurNote ? `[Livreur]: ${livreurNote}` : ''
      ].filter(Boolean).join(' | ');

      if (onConfirmOrder) {
        await onConfirmOrder({
          address,
          phone: cleanPhone,
          notes: combinedNotes,
          pin: pinCode,
          totalAmount,
        });
      }

      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          partner_id: realPartner.id,
          user_id: userId,
          customer_name: customerName,
          client_name: customerName,
          client_phone: cleanPhone,
          delivery_address: address,
          notes: combinedNotes,
          delivery_note: livreurNote || null,
          verification_code: pinCode,
          total_amount: totalAmount,
          subtotal_ht: subtotal,
          delivery_fee: deliveryFee,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (newOrder && cartItems.length > 0) {
        const orderItemsPayload = cartItems.map((item) => {
          const itemPrice = item.price ?? 0;
          const itemId = item.id ?? '';
          return {
            order_id: newOrder.id,
            menu_item_id: isValidUUID(itemId) ? itemId : null,
            item_name: getItemTitle(item),
            quantity: item.quantity,
            unit_price: itemPrice,
            total_price: item.total_price ?? itemPrice * item.quantity,
          };
        });

        await supabase.from('order_items').insert(orderItemsPayload);
      }

      const formattedInvoiceNumber = `FAC-${new Date().getFullYear()}-${newOrder.id.substring(0, 6).toUpperCase()}`;

      setInvoiceData({
        orderId: newOrder.id,
        invoiceNumber: formattedInvoiceNumber,
        orderReference: newOrder.id.substring(0, 8).toUpperCase(),
        issueDate: new Date().toLocaleDateString('fr-TN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        paymentStatus: paymentMethod === 'COD' ? 'COD_PENDING' : 'ONLINE_PENDING',
        paymentMethod: paymentMethod === 'COD' ? 'CASH_ON_DELIVERY' : 'ELECTRONIC_CARD',
        deliveryMode: 'EXPRESS_MOTORCYCLE',
        issuer: {
          companyName: 'EAGLE TN Logistics S.A.R.L',
          tradeName: realPartner.name || partner.name,
          taxId: '1789456/A/M/000',
          address: 'Sakiet Ezzit, Sfax, Tunisie',
          phone: '+216 74 000 000',
          email: 'contact@eagletn.com'
        },
        client: {
          fullName: customerName,
          phone: cleanPhone,
          address: address,
          city: 'Sfax',
          governorate: 'Sfax',
          notes: `${partnerNote ? 'Instructions Cuisine: ' + partnerNote : ''} ${livreurNote ? '| Instructions Livraison: ' + livreurNote : ''}`.trim(),
          customPinCode: pinCode
        },
        items: cartItems.map((item, idx) => {
          const itemPrice = item.price ?? 0;
          const totalItemPrice = item.total_price ?? itemPrice * item.quantity;
          return {
            id: item.id || idx.toString(),
            designation: getItemTitle(item),
            quantity: item.quantity,
            unitPriceHT: itemPrice,
            totalHT: totalItemPrice
          };
        }),
        subtotalHT: subtotal,
        tvaAmount: 0.000,
        deliveryFeeTTC: deliveryFee,
        driverCommissionShare: driverFee,
        grandTotalTTC: totalAmount
      });

    } catch (err: any) {
      console.error('Erreur traitement commande:', err);
      setErrorMsg(err.message || 'Une erreur est survenue lors de la validation de votre commande.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Plus_Jakarta_Sans','Inter',sans-serif] pb-36 max-w-md mx-auto border-x border-slate-200/60 shadow-2xl antialiased selection:bg-[#059669] selection:text-white relative">
      
      {/* EN-TÊTE ULTRA-PREMIUM */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/70 px-5 py-4 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={onBack}
          aria-label="Retour"
          className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-all active:scale-95 border border-slate-200/80 shadow-2xs"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-black text-slate-900 tracking-tight">Caisse & Validation</h1>
          <p className="text-[10px] font-black text-[#059669] uppercase tracking-widest">{partner.name || 'Établissement Partenaire'}</p>
        </div>
        <div className="w-10" />
      </div>

      <form onSubmit={handleConfirmOrder} className="p-5 space-y-4">
        
        {/* BADGE DE CONFIANCE & INTERMÉDIATION LÉGALE */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#059669]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 tracking-wide">PLATFORME EAGLE TN</span>
              <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">Certifié</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 leading-snug pt-0.5">
              Intermédiation logistique officielle avec le marchand <strong className="text-slate-800">{partner.name}</strong>.
            </p>
          </div>
        </div>

        {authSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200/80 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 stroke-[2.5]" />
            <span>{authSuccessMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200/80 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SECTION 1: COORDONNÉES DU DESTINATAIRE */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#059669]" />
              Informations de Livraison
            </span>
            {isValidTunisianPhone(phone) ? (
              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" /> Numéro Valide
              </span>
            ) : (
              <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Format 8 Chiffres</span>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Nom & Prénom du Destinataire *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ex: Mohamed Ben Salem"
              className="w-full h-12 px-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Téléphone Tunisien (+216) *</label>
            <div className="relative">
              <input
                type="tel"
                required
                maxLength={8}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 98123456"
                className="w-full h-12 pl-10 pr-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-2xs"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Adresse exacte de livraison *</label>
              <button
                type="button"
                onClick={handleFetchAutoLocation}
                className="text-[10px] font-black text-[#059669] hover:text-[#047857] flex items-center gap-1 transition-colors bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60"
              >
                <Navigation className="w-3 h-3 stroke-[2.2]" />
                Localiser via GPS
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Avenue Habib Bourguiba, Sfax"
                className="w-full h-12 pl-10 pr-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-2xs"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONSIGNES PARTICULIÈRES */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <MessageSquare className="w-4 h-4 text-[#059669]" />
            Consignes & Instructions
          </h2>

          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Note à l'attention de la cuisine ({partner.name})</label>
            <input
              type="text"
              value={partnerNote}
              onChange={(e) => setPartnerNote(e.target.value)}
              placeholder="Ex: Extras, sauce séparée, cuisson..."
              className="w-full h-11 px-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-2xs"
            />
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => handleAddQuickChip('Sauce à part', 'partner')}
                className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-xl transition-all shrink-0 border border-slate-200/60"
              >
                + Sauce à part
              </button>
              <button
                type="button"
                onClick={() => handleAddQuickChip('Sans oignon', 'partner')}
                className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-xl transition-all shrink-0 border border-slate-200/60"
              >
                + Sans oignon
              </button>
              <button
                type="button"
                onClick={() => handleAddQuickChip('Très piquant', 'partner')}
                className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-xl transition-all shrink-0 border border-slate-200/60"
              >
                + Très piquant
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Note à l'attention du livreur</label>
            <input
              type="text"
              value={livreurNote}
              onChange={(e) => setLivreurNote(e.target.value)}
              placeholder="Ex: Étage, code d'accès, sonnette..."
              className="w-full h-11 px-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-2xs"
            />
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => handleAddQuickChip('Appeler dès l\'arrivée', 'livreur')}
                className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-xl transition-all shrink-0 border border-slate-200/60"
              >
                + Appeler dès l'arrivée
              </button>
              <button
                type="button"
                onClick={() => handleAddQuickChip('Déposer au 2ème étage', 'livreur')}
                className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-xl transition-all shrink-0 border border-slate-200/60"
              >
                + Déposer au 2ème étage
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: MODE DE PAIEMENT */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <Banknote className="w-4 h-4 text-[#059669]" />
            Modalités de Paiement
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentMethod('COD')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                paymentMethod === 'COD'
                  ? 'border-[#059669] bg-emerald-50/40 text-[#059669] shadow-2xs ring-1 ring-[#059669]'
                  : 'border-slate-200/80 bg-slate-50/50 text-slate-600 hover:bg-slate-100/50'
              }`}
            >
              <div className="flex justify-between items-start w-full mb-2">
                <Banknote className={`w-5 h-5 ${paymentMethod === 'COD' ? 'text-[#059669]' : 'text-slate-500'}`} />
                {paymentMethod === 'COD' && <CheckCircle2 className="w-4 h-4 text-[#059669]" />}
              </div>
              <div>
                <span className="block text-xs font-black text-slate-900">Paiement Espèces</span>
                <span className="text-[10px] font-bold text-slate-500">À la livraison (COD)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('CARD')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden opacity-90 ${
                paymentMethod === 'CARD'
                  ? 'border-[#059669] bg-emerald-50/40 text-[#059669] shadow-2xs ring-1 ring-[#059669]'
                  : 'border-slate-200/80 bg-slate-50/50 text-slate-600 hover:bg-slate-100/50'
              }`}
            >
              <div className="flex justify-between items-start w-full mb-2">
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'CARD' ? 'text-[#059669]' : 'text-slate-500'}`} />
                <span className="text-[8px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">Bientôt</span>
              </div>
              <div>
                <span className="block text-xs font-black text-slate-900">Carte Bancaire</span>
                <span className="text-[10px] font-bold text-slate-500">Paiement en ligne</span>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 4: RÉCAPITULATIF DE LA COMMANDE */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Récapitulatif de votre commande</h2>
            <span className="text-[10px] font-black text-[#059669] bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">{partner.name}</span>
          </div>

          <div className="space-y-3 divide-y divide-slate-100">
            {cartItems.map((item, idx) => {
              const itemPrice = item.price ?? 0;
              const itemTotal = item.total_price ?? itemPrice * item.quantity;
              const itemId = item.id || idx.toString();
              return (
                <div key={itemId} className="pt-3 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 truncate">
                    {onRemoveItem && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(itemId)}
                        className="text-slate-300 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50 shrink-0"
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <span className="font-medium text-slate-800 truncate">
                      <strong className="font-black text-slate-900 mr-1.5">{item.quantity}×</strong> 
                      {getItemTitle(item)}
                    </span>
                  </div>
                  <span className="font-mono font-black text-slate-900 shrink-0 text-xs">
                    {itemTotal.toFixed(3)} <span className="text-[10px] font-bold text-slate-400">TND</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between font-medium text-slate-500">
              <span>Sous-total articles (HT)</span>
              <span className="font-mono font-bold text-slate-800">{subtotal.toFixed(3)} TND</span>
            </div>
            <div className="flex justify-between font-medium text-slate-500">
              <span>Frais de livraison express</span>
              <span className="font-mono font-bold text-slate-800">{deliveryFee.toFixed(3)} TND</span>
            </div>
            <div className="flex justify-between items-baseline font-black text-slate-900 text-sm pt-3 border-t border-slate-900">
              <span className="uppercase tracking-wider">Total TTC à payer</span>
              <span className="text-lg font-mono text-[#059669]">{totalAmount.toFixed(3)} <span className="text-xs font-extrabold">TND</span></span>
            </div>
          </div>
        </div>

        {/* CADRE JURIDIQUE ET MENTIONS LÉGALES */}
        <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200/80 flex items-start gap-2.5 shadow-2xs">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            <strong>Cadre Légal d'Intermédiation :</strong> La plateforme EAGLE TN assurer un service de mise en relation et de transport logistique. La responsabilité liée à la préparation, la conformité sanitaire et la qualité des produits incombe exclusivement à l'établissement <strong>{partner.name}</strong>.
          </p>
        </div>

        {/* BARRE FIXE DE VALIDATION EN BAS */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 max-w-md mx-auto z-40 shadow-2xl">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white rounded-2xl p-4 font-black text-sm shadow-xl shadow-[#059669]/20 flex items-center justify-between transition-all disabled:opacity-50 group border border-emerald-600/30"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 stroke-[2.3]" />
              <span>{submitting ? 'Traitement en cours...' : 'Confirmer la Commande'}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-emerald-100 bg-emerald-800/40 px-3.5 py-1.5 rounded-xl text-xs font-black border border-emerald-400/20">
              <span>{totalAmount.toFixed(3)} TND</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>

      </form>

      {/* MODALE DE FACTURATION */}
      {invoiceData && (
        <InvoiceModal
          invoice={invoiceData}
          onClose={() => {
            const currentOrderId = invoiceData.orderId;
            setInvoiceData(null);
            if (onOrderSuccess) {
              onOrderSuccess(currentOrderId);
            } else {
              onBack();
            }
          }}
        />
      )}
    </div>
  );
};

export default Checkout;
