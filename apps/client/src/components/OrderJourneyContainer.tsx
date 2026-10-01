import React, { useState } from 'react';
import { ShoppingBag, MapPin, Phone, ArrowRight, CheckCircle2, Navigation, Loader2, CreditCard, X, ShieldCheck } from 'lucide-react';

interface CartItem {
  id: number;
  nameAr: string;
  nameFr: string;
  price: number;
  quantity: number;
  customization?: string;
}

export const OrderJourneyContainer: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, nameAr: 'كمونية علوش فاخرة', nameFr: 'Kammounia Allouche', price: 15.000, quantity: 1, customization: 'Format Plat, Extra Coca-Cola' },
    { id: 2, nameAr: 'كسكسي دياري باللحم', nameFr: 'Couscous Tunisien', price: 16.500, quantity: 1, customization: 'Format Classique' }
  ]);

  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout' | 'tracking'>('cart');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [geoCoordinates, setGeoCoordinates] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  // Simulated Pin Code for Delivery
  const deliveryPinCode = "4892";

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeDeliveryThreshold = 40.000;
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0.000 : 2.500;
  const finalTotal = subtotal + deliveryFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercentage = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const formatPrice = (amount: number) => `${amount.toFixed(3)} DT`;

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setGeoCoordinates("36.8065° N, 10.1815° E (Tunis Center)");
      setIsLocating(false);
    }, 1000);
  };

  // 🛒 Cart Floating Trigger Button
  if (cartItems.length === 0 && !isBottomSheetOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <button 
          onClick={() => setIsBottomSheetOpen(true)}
          className="w-14 h-14 rounded-full bg-white border border-slate-200/80 flex items-center justify-center shadow-lg text-slate-400 hover:text-emerald-600 active:scale-90 transition-all duration-200"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2]" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full font-sans antialiased text-slate-900">

      {/* 🚀 Floating Bottom Cart Bar */}
      {!isBottomSheetOpen && (
        <div className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-40 px-2">
          <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl rounded-2xl p-3.5 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="relative w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                  {totalItems}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Panier ({totalItems} articles)</span>
                <span className="text-sm font-black text-slate-900 font-mono tracking-tight">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              onClick={() => { setIsBottomSheetOpen(true); setCurrentStep('cart'); }}
              className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wide rounded-xl flex items-center space-x-2 transition-all duration-150 active:scale-95 shadow-sm shadow-emerald-600/20"
            >
              <span>Valider</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* 📋 The Interactive Drawer */}
      {isBottomSheetOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center transition-all duration-300">
          <div className="absolute inset-0" onClick={() => setIsBottomSheetOpen(false)} />

          <div className="relative w-full max-w-md bg-slate-50/90 backdrop-blur-2xl rounded-t-[32px] p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto z-10 border-t border-white">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-1" />

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-base text-slate-900 tracking-tight">
                  {currentStep === 'cart' && "Votre Commande"}
                  {currentStep === 'checkout' && "Détails de Livraison"}
                  {currentStep === 'tracking' && "Suivi en Direct • GPS"}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                  Eagle TN Express
                </span>
              </div>
              <button
                onClick={() => setIsBottomSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all shadow-2xs"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* STEP 1: CART */}
            {currentStep === 'cart' && (
              <>
                <div className="bg-white border border-slate-200/70 p-3.5 rounded-2xl shadow-2xs">
                  <p className="text-xs text-slate-700 font-medium leading-relaxed mb-2">
                    {remainingForFreeDelivery > 0
                      ? `Ajoutez ${formatPrice(remainingForFreeDelivery)} pour la livraison gratuite.`
                      : "🎉 Offre activée : Livraison gratuite accordée !"}
                  </p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[32vh] overflow-y-auto pr-0.5">
                  {cartItems.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200/70 p-3.5 rounded-2xl flex items-center justify-between shadow-2xs">
                      <div className="flex-1 pr-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900 truncate">{item.nameFr}</span>
                          <span className="text-[10px] font-medium text-slate-400">{item.nameAr}</span>
                        </div>
                        {item.customization && (
                          <span className="inline-block text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium mt-1">
                            {item.customization}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-lg bg-white border border-slate-200/60 shadow-2xs flex items-center justify-center text-slate-700 font-bold text-xs">-</button>
                        <span className="text-xs font-black w-4 text-center text-slate-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-lg bg-emerald-600 text-white shadow-2xs flex items-center justify-center font-bold text-xs">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-200/70 p-4 rounded-2xl space-y-2 shadow-2xs text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Frais de livraison</span>
                    <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md' : 'text-slate-900'}`}>
                      {deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-2.5 mt-1">
                    <span>Total (TTC)</span>
                    <span className="text-emerald-600">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep('checkout')}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center justify-between px-5 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
                >
                  <span>Passer à la caisse</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-emerald-100">{formatPrice(finalTotal)}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>
              </>
            )}

            {/* STEP 2: CHECKOUT */}
            {currentStep === 'checkout' && (
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Numéro de téléphone</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: 98 123 456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-slate-200/80 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Point de repère (Landmark)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Ennasr 2, près de la pharmacie"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-emerald-600 transition-all shadow-2xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="w-full h-11 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-2 transition-all shadow-2xs"
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  ) : (
                    <Navigation className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>{geoCoordinates ? geoCoordinates : "Obtenir la position GPS en direct"}</span>
                </button>

                <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Paiement à la livraison (Espèces)</p>
                    <p className="text-[10px] text-slate-500 font-medium">الدفع نقداً عند الاستلام الميداني</p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setCurrentStep('cart')}
                    className="w-1/3 h-12 bg-white border border-slate-200/80 text-slate-700 text-xs font-bold rounded-2xl shadow-2xs"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setCurrentStep('tracking')}
                    className="w-2/3 h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
                  >
                    <span>Confirmer la commande</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LIVE TRACKING & PIN CODE */}
            {currentStep === 'tracking' && (
              <div className="space-y-4">
                {/* Delivery PIN Code Card */}
                <div className="bg-emerald-600 text-white p-4 rounded-3xl text-center space-y-1 shadow-md shadow-emerald-600/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                    CODE PIN DE LIVRAISON TERRAIN
                  </span>
                  <div className="text-3xl font-black font-mono tracking-widest py-1">
                    {deliveryPinCode}
                  </div>
                  <p className="text-[10px] text-emerald-100 font-medium">
                    قدم هذا الرمز للسائق عند الاستلام لتأكيد العملية
                  </p>
                </div>

                {/* Driver Progress Stepper */}
                <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">Statut de la livraison</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      En route 🚴
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Commande reçue et confirmée</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Préparation du repas en cuisine</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] animate-pulse">●</div>
                      <span>Livreur en cours de déplacement (GPS)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsBottomSheetOpen(false)}
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md"
                >
                  Fermer et suivre sur la carte
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default OrderJourneyContainer;
