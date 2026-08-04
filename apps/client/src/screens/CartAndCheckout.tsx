import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Banknote,
  CreditCard,
  Lock,
  ExternalLink,
  ShoppingBag,
  WifiOff,
  Loader2,
  AlertTriangle,
  Store,
  Bike
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartAndCheckoutProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirmOrder?: () => Promise<void> | void;
  items?: CartItem[];
  restaurantDistanceKm?: number;
  onExploreRestaurants?: () => void;
  [key: string]: any;
}

export function CartAndCheckout({
  isOpen = true,
  onClose = () => {},
  onConfirmOrder = () => {},
  items = [
    { id: '1', name: 'Ojja Royale aux Crevettes', price: 18.5, quantity: 1 },
    { id: '2', name: 'Jus d\'Orange Frais 33cl', price: 5.0, quantity: 2 }
  ],
  restaurantDistanceKm = 3.2,
  onExploreRestaurants
}: CartAndCheckoutProps) {
  const [selectedPayment, setSelectedPayment] = useState<'cod' | 'card'>('cod');
  const [partnerNote, setPartnerNote] = useState('');
  const [livreurNote, setLivreurNote] = useState('');
  const [acceptedCGU, setAcceptedCGU] = useState(true);
  const [acceptedINPDP, setAcceptedINPDP] = useState(true);
  const [showLegalModal, setShowLegalModal] = useState<'cgu' | 'inpdp' | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [distanceError, setDistanceError] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (restaurantDistanceKm > 10) {
      setDistanceError(true);
    } else {
      setDistanceError(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [restaurantDistanceKm]);

  if (isOpen === false) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = restaurantDistanceKm > 0 ? Math.min(2.5 + (restaurantDistanceKm * 0.4), 7.0) : 2.5;
  const totalFinal = subtotal + deliveryFee;

  const handleConfirm = async () => {
    if (isOffline || !acceptedCGU || !acceptedINPDP || distanceError || isLoading) return;
    setIsLoading(true);
    try {
      await onConfirmOrder();
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
                Découvrez nos établissements partenaires.
              </p>
            </div>
            <button
              onClick={onExploreRestaurants || onClose}
              className="mt-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
            >
              Explorer les restaurants
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">

            {/* DELIVERY INFO */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                INFORMATIONS DE LIVRAISON
              </h3>
              
              <div className="p-3.5 bg-white border border-slate-200/70 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Position actuelle (Tunis)</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Résidence Les Jasmin, Cité Ennasr 2
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded-lg">
                  ~18 min
                </span>
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
              onClick={handleConfirm}
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
                Conformément à la loi organique n° 2004-63 du 27 juillet 2004, relative à la protection des données à caractère personnel en Tunisie, vos informations sont strictement protégées.
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

export default CartAndCheckout;
