import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Banknote,
  CreditCard,
  Lock,
  ExternalLink,
  ShoppingBag,
  WifiOff,
  Loader2,
  AlertTriangle,
  Store,
  Bike,
  ChevronRight,
  User,
  Phone,
  Edit3,
  Navigation,
  Check
} from 'lucide-react';
import { useCartStore } from '../../../store/useCartStore';

interface SlideOverCartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId?: string;
  totalAmount?: number;
  onSuccess?: (orderId: string) => void;
}

export function SlideOverCartSheet({
  isOpen,
  onClose,
  partnerId,
  onSuccess
}: SlideOverCartSheetProps) {
  const { items, getSubtotal, clearCart } = useCartStore();

  // DEFAULT USER DATA FROM SESSION / DB
  const [recipientName, setRecipientName] = useState('Said Kai\'s');
  const [recipientPhone, setRecipientPhone] = useState('+216 98 123 456');
  
  // GPS COORDINATES STATE
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 36.8332,
    lng: 10.1486
  }); // Default Tunis / Ennasr 2 coordinates
  const [addressName, setAddressName] = useState('Résidence Les Jasmins, Cité Ennasr 2');

  // MODAL EDIT STATE
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [tempName, setTempName] = useState(recipientName);
  const [tempPhone, setTempPhone] = useState(recipientPhone);

  const [selectedPayment, setSelectedPayment] = useState<'cod' | 'card'>('cod');
  const [partnerNote, setPartnerNote] = useState('');
  const [livreurNote, setLivreurNote] = useState('');
  const [acceptedCGU, setAcceptedCGU] = useState(true);
  const [acceptedINPDP, setAcceptedINPDP] = useState(true);
  const [showLegalModal, setShowLegalModal] = useState<'cgu' | 'inpdp' | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const restaurantDistanceKm = 3.2;
  const distanceError = restaurantDistanceKm > 10;

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Try acquiring real high-accuracy GPS coordinates in real-time
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => console.log('GPS Fetch fallback to default', err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? Math.min(2.5 + (restaurantDistanceKm * 0.4), 7.0) : 0;
  const totalFinal = subtotal + deliveryFee;

  const handleSaveRecipientDetails = () => {
    setRecipientName(tempName);
    setRecipientPhone(tempPhone);
    setShowRecipientModal(false);
  };

  const handleConfirmOrder = async () => {
    if (isOffline || !acceptedCGU || !acceptedINPDP || distanceError || isLoading) return;
    setIsLoading(true);

    // PAYLOAD SENT TO SUPABASE WITH GPS COORDINATES & DEDICATED RECIPIENT DATA
    const orderPayload = {
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      delivery_lat: userCoords?.lat,
      delivery_lng: userCoords?.lng,
      delivery_address_name: addressName,
      partner_note: partnerNote,
      livreur_note: livreurNote,
      payment_method: selectedPayment,
      total_amount: totalFinal
    };

    console.log('Sending Order Payload to Backend/Supabase:', orderPayload);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const demoOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      
      if (onSuccess) {
        onSuccess(demoOrderId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 font-sans"
        dir="ltr"
      >
        {/* HEADER */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Mon Panier
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Vérification de votre commande
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* TOASTS */}
        {isOffline && (
          <div className="bg-amber-500 text-white text-xs font-bold px-4 py-2.5 flex items-center gap-2 animate-pulse">
            <WifiOff size={15} className="shrink-0" />
            <span>Connexion Internet instable. Vérifiez votre réseau.</span>
          </div>
        )}

        {distanceError && (
          <div className="bg-rose-500 text-white text-xs font-bold px-4 py-2.5 flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0" />
            <span>Zone hors rayon de livraison (&gt; 10 km).</span>
          </div>
        )}

        {/* BODY */}
        {items.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <ShoppingBag size={36} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Votre panier est vide</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Choisissez des plats dans le menu pour continuer.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
            >
              Retour au menu
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">

            {/* INFORMATIONS DE LIVRAISON (READ-ONLY + MODIFIER TRIGGER + GPS EMBED) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  INFORMATIONS DE LIVRAISON
                </h3>
                <button
                  onClick={() => setShowRecipientModal(true)}
                  className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg transition-all active:scale-95"
                >
                  <Edit3 size={12} />
                  <span>Modifier</span>
                </button>
              </div>
              
              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-sm">
                
                {/* ADDRESS & GPS */}
                <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">Adresse actuelle</h4>
                      <span className="text-[9px] bg-slate-100 text-slate-600 font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Navigation size={9} className="text-emerald-600" />
                        {userCoords ? `${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}` : 'GPS Inactif'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                      {addressName}
                    </p>
                  </div>
                </div>

                {/* RECIPIENT BADGES */}
                <div className="flex items-center justify-between text-xs font-medium pt-0.5">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-900">{recipientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-mono">
                    <Phone size={14} className="text-slate-400" />
                    <span className="text-slate-600">{recipientPhone}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* INSTRUCTIONS */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                INSTRUCTIONS DE COMMANDE
              </h3>

              <div className="space-y-2.5">
                <div className="relative">
                  <div className="absolute top-3 left-3 text-slate-400 pointer-events-none">
                    <Store size={15} />
                  </div>
                  <input
                    type="text"
                    value={partnerNote}
                    onChange={(e) => setPartnerNote(e.target.value)}
                    placeholder="Instructions pour le restaurant (ex: sans oignon...)"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>

                <div className="relative">
                  <div className="absolute top-3 left-3 text-slate-400 pointer-events-none">
                    <Bike size={15} />
                  </div>
                  <input
                    type="text"
                    value={livreurNote}
                    onChange={(e) => setLivreurNote(e.target.value)}
                    placeholder="Instructions pour le livreur (ex: code porte, étage...)"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                MODE DE PAIEMENT
              </h3>

              <div className="grid grid-cols-1 gap-2">
                <div
                  onClick={() => setSelectedPayment('cod')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedPayment === 'cod'
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Espèces (COD)</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Paiement à la livraison</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-600 bg-emerald-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>

                <div className="p-3.5 bg-white/50 border border-slate-200/60 rounded-2xl opacity-60 flex items-center justify-between select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Carte Bancaire / e-Dinar</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Paiement sécurisé en ligne</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Bientôt
                  </span>
                </div>
              </div>
            </div>

            {/* BREAKDOWN */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span>Sous-total</span>
                <span className="font-mono text-slate-800 font-semibold">
                  {subtotal.toFixed(3)} <span className="text-[10px] opacity-60">DT</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span>Livraison</span>
                <span className="font-mono text-slate-800 font-semibold">
                  {deliveryFee.toFixed(3)} <span className="text-[10px] opacity-60">DT</span>
                </span>
              </div>

              <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
                <span className="text-xs font-black text-slate-900">Total final</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {totalFinal.toFixed(3)} <span className="text-xs font-bold text-emerald-600">DT</span>
                </span>
              </div>
            </div>

            {/* LEGAL */}
            <div className="space-y-2 text-[11px] text-slate-600 font-medium">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedCGU}
                  onChange={(e) => setAcceptedCGU(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                />
                <span>
                  J'accepte les{' '}
                  <button
                    type="button"
                    onClick={() => setShowLegalModal('cgu')}
                    className="text-emerald-600 font-bold underline underline-offset-2 hover:text-emerald-700 inline-flex items-center gap-0.5"
                  >
                    Conditions Générales d'Utilisation (CGU)
                    <ExternalLink size={10} />
                  </button>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedINPDP}
                  onChange={(e) => setAcceptedINPDP(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                />
                <span>
                  J'autorise le{' '}
                  <button
                    type="button"
                    onClick={() => setShowLegalModal('inpdp')}
                    className="text-emerald-600 font-bold underline underline-offset-2 hover:text-emerald-700 inline-flex items-center gap-0.5"
                  >
                    traitement de mes données et géolocalisation (INPDP)
                    <ExternalLink size={10} />
                  </button>
                </span>
              </label>
            </div>

          </div>
        )}

        {/* BOTTOM CTA */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0">
            <button
              disabled={!acceptedCGU || !acceptedINPDP || isOffline || distanceError || isLoading}
              onClick={handleConfirmOrder}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm text-white flex items-center justify-between transition-all shadow-lg active:scale-[0.98] ${
                acceptedCGU && acceptedINPDP && !isOffline && !distanceError && !isLoading
                  ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
                  : 'bg-slate-300 cursor-not-allowed shadow-none'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 w-full">
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Traitement de la commande...</span>
                </div>
              ) : (
                <>
                  <span className="tracking-wide">
                    Confirmer la commande • {totalFinal.toFixed(3)} DT
                  </span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* RECIPIENT & CONTACT MODAL (THE "MODIFIER" BOTTOM SHEET) */}
      {showRecipientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-sm text-slate-900">
                  Destinataire de la commande
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  Pour commander pour un ami ou changer de numéro.
                </p>
              </div>
              <button onClick={() => setShowRecipientModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                  Nom du destinataire
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                  Numéro de téléphone
                </label>
                <input
                  type="text"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleSaveRecipientDetails}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <Check size={16} />
              <span>Enregistrer pour cette commande</span>
            </button>
          </div>
        </div>
      )}

      {/* LEGAL MODAL */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Lock size={16} className="text-emerald-600" />
                {showLegalModal === 'cgu' ? 'Conditions Générales d\'Utilisation' : 'Protection des Données (INPDP)'}
              </h3>
              <button onClick={() => setShowLegalModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed max-h-60 overflow-y-auto space-y-2">
              <p>
                Conformément à la loi organique n° 2004-63 du 27 juillet 2004, relative à la protection des données à caractère personnel en Tunisie, vos informations sont strictly protégées.
              </p>
            </div>
            <button
              onClick={() => setShowLegalModal(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default SlideOverCartSheet;
