import React, { useState } from 'react';
import { ShoppingBag, MapPin, Phone, ArrowRight, CheckCircle2, Navigation, Loader2, CreditCard, Landmark, X } from 'lucide-react';

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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeDeliveryThreshold = 40.000;
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0.000 : 4.500;
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
      setGeoCoordinates("36.8065° N, 10.1815° E (Tunis Centric)");
      setIsLocating(false);
    }, 1200);
  };

  // 🛒 1. الحالة الأولى: زر السلة الخامل الدائري الفاخر (8K Micro-interaction Circle)
  if (cartItems.length === 0) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <button className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-[#4a3728]/10 flex items-center justify-center shadow-[0_8px_32px_rgba(74,55,40,0.08)] text-[#4a3728]/40 hover:text-[#4a3728] active:scale-90 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-[#fdfbf7] border border-[#4a3728]/5 flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
          </div>
        </button>
      </div>
    );
  }

  const getMicroCopy = () => {
    if (subtotal === 0) return "Votre panier est vide";
    if (subtotal < 25.000) return `🔥 Choix de gourmet ! (${totalItems} plats)`;
    return `👑 Festin Royal d'Oum Ali ! (${totalItems} plats)`;
  };

  return (
    <div className="w-full font-sans antialiased text-left">
      
      {/* 🚀 2. شريط السلة العائم الفاخر بخلفية زجاجية معتمة وأيقونة دائرية فائقة النعومة */}
      {!isBottomSheetOpen && (
        <div className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-40 px-2 animate-slide-up">
          <div className="w-full bg-[#1c120c]/90 backdrop-blur-xl border border-white/10 shadow-[0_16px_48px_rgba(28,18,12,0.35)] rounded-2xl p-4 flex items-center justify-between transition-all duration-300">
            
            <div className="flex items-center space-x-3.5">
              {/* أيقونة دائرية هندسية كاملة تلغي الجفاف البصري */}
              <div className="relative w-12 h-12 rounded-full bg-[#9e2a2b] flex items-center justify-center shadow-[0_4px_16px_rgba(158,42,43,0.4)] text-white">
                <ShoppingBag className="w-4 h-4 stroke-[2]" />
                <span className="absolute -top-1 -right-1 bg-white text-[#1c120c] text-[9px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#1c120c]/10 shadow-sm">
                  {totalItems}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white/50 tracking-wide">{getMicroCopy()}</span>
                <span className="text-base font-black text-[#fdfbf7] font-mono tracking-tight mt-0.5">{formatPrice(subtotal)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => { setIsBottomSheetOpen(true); setCurrentStep('cart'); }}
              className="h-11 px-5 bg-[#fdfbf7] hover:bg-[#fdfbf7]/90 text-[#1c120c] font-extrabold text-xs uppercase tracking-[0.15em] rounded-xl flex items-center space-x-2 transition-all duration-200 active:scale-95 shadow-md"
            >
              <span>Valider mon festin</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* 📋 3. نافذة مراجعة وإتمام الطلب الميداني (The Cart Review Drawer) */}
      {isBottomSheetOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center transition-all duration-300">
          <div className="absolute inset-0" onClick={() => setIsBottomSheetOpen(false)} />
          
          <div className="relative w-full max-w-md bg-[#fdfbf7] rounded-t-[2.5rem] p-6 space-y-5 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto z-10">
            
            <div className="w-12 h-1 bg-[#4a3728]/10 rounded-full mx-auto mb-1" />
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-lg text-[#1c120c] tracking-tight">
                  {currentStep === 'cart' && "Votre Commande"}
                  {currentStep === 'checkout' && "Détails de Livraison"}
                  {currentStep === 'tracking' && "Suivi en Direct"}
                </h3>
                <span className="text-[9px] font-mono font-bold text-[#4a3728]/40 uppercase tracking-widest block mt-0.5">Premium Dining System</span>
              </div>
              <button 
                onClick={() => setIsBottomSheetOpen(false)} 
                className="w-8 h-8 rounded-full bg-[#4a3728]/5 hover:bg-[#4a3728]/10 flex items-center justify-center text-[#1c120c] transition-all"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {currentStep === 'cart' && (
              <>
                <div className="bg-white border border-[#4a3728]/5 p-4 rounded-2xl shadow-sm">
                  <p className="text-xs text-[#1c120c] font-medium leading-relaxed mb-2">
                    {remainingForFreeDelivery > 0 
                      ? `Ajoutez encore ${formatPrice(remainingForFreeDelivery)} pour débloquer la livraison gratuite.` 
                      : "🎉 Offre activée : Livraison gratuite accordée !"}
                  </p>
                  <div className="w-full bg-[#4a3728]/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#9e2a2b] h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3 max-h-[32vh] overflow-y-auto pr-1">
                  {cartItems.map(item => (
                    <div key={item.id} className="bg-white border border-[#4a3728]/5 p-4 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex-1 pr-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#1c120c] tracking-tight">{item.nameFr}</span>
                          <span className="text-[10px] font-medium text-[#4a3728]/40 font-mono mt-0.5">{item.nameAr}</span>
                        </div>
                        {item.customization && (
                          <span className="inline-block text-[9px] bg-[#4a3728]/5 text-[#4a3728]/80 px-2 py-0.5 rounded-md font-medium mt-2">
                            {item.customization}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 bg-[#fdfbf7] p-1.5 rounded-xl border border-[#4a3728]/5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1c120c] font-bold text-xs">-</button>
                        <span className="text-xs font-mono font-black w-4 text-center text-[#1c120c]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1c120c] font-bold text-xs">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-[#4a3728]/5 p-4 rounded-2xl space-y-2.5 shadow-sm text-xs text-[#4a3728]/70">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-mono font-bold text-[#1c120c]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Frais de livraison</span>
                    <span className={`font-mono font-bold ${deliveryFee === 0 ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded' : 'text-[#1c120c]'}`}>
                      {deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#1c120c] border-t border-[#4a3728]/5 pt-3 mt-1">
                    <span>Total à payer (TTC)</span>
                    <span className="font-mono text-base text-[#9e2a2b]">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentStep('checkout')}
                  className="w-full h-13 bg-[#1c120c] hover:bg-[#4a3728] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-between px-6 shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Passer à la caisse</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-white/70">{formatPrice(finalTotal)}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </button>
              </>
            )}

            {currentStep === 'checkout' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* حقل الهاتف بأيقونة دائرية مدمجة فاخرة */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#4a3728]/60 flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-[#1c120c] flex items-center justify-center text-white shadow-sm">
                      <Phone className="w-2.5 h-2.5" />
                    </div>
                    <span>Numéro de téléphone</span>
                  </label>
                  <input 
                    type="tel" 
                    placeholder="Ex: 98 123 456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-[#4a3728]/10 rounded-xl text-xs font-mono focus:outline-none focus:border-[#1c120c] transition-all"
                  />
                </div>

                {/* زر الـ GPS الدائري الهندسي فائق الدقة */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#4a3728]/60 flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-[#1c120c] flex items-center justify-center text-white shadow-sm">
                      <MapPin className="w-2.5 h-2.5" />
                    </div>
                    <span>Localisation GPS</span>
                  </label>
                  <button
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="w-full h-11 bg-white border border-dashed border-[#4a3728]/20 hover:border-[#1c120c] rounded-xl text-xs font-bold text-[#1c120c] flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4a3728]" />
                        <span className="font-mono text-[11px]">Calcul des coordonnées...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 rounded-full bg-[#9e2a2b]/10 flex items-center justify-center text-[#9e2a2b]">
                          <Navigation className="w-2.5 h-2.5 fill-current" />
                        </div>
                        <span>{geoCoordinates ? "Position GPS Enregistrée ✓" : "Détecter ma position actuelle"}</span>
                      </>
                    )}
                  </button>
                  {geoCoordinates && (
                    <p className="text-[10px] font-mono text-green-600 font-bold bg-green-50/50 p-2 rounded-lg border border-green-600/10 text-center">{geoCoordinates}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#4a3728]/60">
                    Indication / Adresse
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Près de la mosquée, 2ème étage..."
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-[#4a3728]/10 rounded-xl text-xs focus:outline-none focus:border-[#1c120c] transition-all"
                  />
                </div>

                {/* اختيار طريقة الدفع بأيقونات هندسية دائرية معزولة */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#4a3728]/60 block">Mode de Paiement</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between items-start transition-all h-22 ${paymentMethod === 'cod' ? 'border-[#1c120c] bg-[#1c120c] text-white' : 'border-[#4a3728]/10 bg-white text-[#1c120c]'}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-white/10 text-white' : 'bg-[#1c120c]/5 text-[#1c120c]'}`}>
                        <Landmark className="w-3 h-3 stroke-[2]" />
                      </div>
                      <span className="text-[11px] font-bold">À la livraison</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between items-start transition-all h-22 ${paymentMethod === 'card' ? 'border-[#1c120c] bg-[#1c120c] text-white' : 'border-[#4a3728]/10 bg-white text-[#1c120c]'}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-white/10 text-white' : 'bg-[#1c120c]/5 text-[#1c120c]'}`}>
                        <CreditCard className="w-3 h-3 stroke-[2]" />
                      </div>
                      <span className="text-[11px] font-bold">Carte / E-Dinar</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentStep('tracking')}
                  disabled={!phoneNumber || !geoCoordinates}
                  className="w-full h-13 bg-[#9e2a2b] hover:bg-[#802223] disabled:bg-neutral-200 disabled:text-neutral-400 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-[0.99] mt-2"
                >
                  <span>Envoyer la commande 🛵</span>
                </button>
              </div>
            )}

            {/* 👨‍🍳 شاشة التتبع بأيقونة النجاح الدائرية الفخمة ثلاثية الأبعاد */}
            {currentStep === 'tracking' && (
              <div className="space-y-6 text-center py-6 animate-fade-in">
                {/* الأيقونة الدائرية الفائقة النعومة للنجاح */}
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-[0_8px_24px_rgba(22,163,74,0.15)]">
                  <CheckCircle2 className="w-8 h-8 text-green-600 stroke-[1.8]" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-base font-black text-[#1c120c]">Commande Reçue !</h4>
                  <p className="text-xs text-[#4a3728]/60 max-w-xs mx-auto px-4 leading-relaxed">
                    Le chef prépare actuellement votre festin avec précision.
                  </p>
                </div>

                <div className="bg-white border border-[#4a3728]/5 p-4 rounded-2xl max-w-sm mx-auto shadow-sm space-y-3 text-left">
                  <div className="flex items-center space-x-3 text-xs font-bold text-[#1c120c]">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                    <span>En préparation...</span>
                  </div>
                  <div className="w-full bg-[#4a3728]/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-1/3 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#4a3728]/40 font-mono font-bold pt-1">
                    <span>LIVRAISON ESTIMÉE</span>
                    <span>25 - 35 MIN</span>
                  </div>
                </div>

                <button
                  onClick={() => { setIsBottomSheetOpen(false); setCartItems([]); }}
                  className="px-6 h-10 border border-[#1c120c]/10 hover:bg-neutral-50 text-[#1c120c] text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Retour à la carte
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
