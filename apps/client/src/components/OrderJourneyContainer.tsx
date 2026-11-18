import React, { useState } from 'react';
import {  ShoppingBag, MapPin, Phone, ArrowRight, CheckCircle2, Navigation, Loader2, X, ShieldCheck , Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface CartItem { id: number; nameAr: string; nameFr: string; price: number; quantity: number; customization?: string; }

export const OrderJourneyContainer: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, nameAr: 'كمونية علوش', nameFr: 'Kammounia Allouche', price: 15.000, quantity: 1, customization: 'Format Plat, Extra Coca-Cola' },
  ]);
  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout' | 'tracking'>('cart');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [landmark, setLandmark] = useState('');
  const [geoCoordinates, setGeoCoordinates] = useState('');
  
  const deliveryPinCode = "4892";
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeDeliveryThreshold = 40.000;
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0.000 : 2.500;
  const finalTotal = subtotal + deliveryFee;
  const progressPercentage = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const formatPrice = (amount: number) => `${amount.toFixed(3)} DT`;

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    try { await Haptics.impact({ style }); } catch(e) {}
  };

  const updateQuantity = async (id: number, delta: number) => {
    await triggerHaptic();
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const handleGetLocation = async () => {
    await triggerHaptic();
    setIsLocating(true);
    setTimeout(() => { setGeoCoordinates("36.8065° N, 10.1815° E (Tunis Center)"); setIsLocating(false); }, 1000);
  };

  const proceedToNext = async (step: 'checkout' | 'tracking') => {
    await triggerHaptic(ImpactStyle.Heavy);
    setCurrentStep(step);
  };

  if (cartItems.length === 0 && !isBottomSheetOpen) {
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setIsBottomSheetOpen(true)} className="w-14 h-14 rounded-2xl bg-[var(--color-surface-elevated)] border-none shadow-[var(--shadow-ambient)] flex items-center justify-center text-[#8A652D] hover:bg-[#FAF9F6] active:scale-95 transition-all outline-none">
          <ShoppingBag className="w-6 h-6 stroke-[2]" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full font-sans antialiased text-[#1C1917]">
      {!isBottomSheetOpen && (
        <div className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-40 px-2">
          <motion.div whileTap={{ scale: 0.98 }} onClick={() => setIsBottomSheetOpen(true)} className="w-full bg-gradient-to-r from-[#1C1917] to-[#292524] backdrop-blur-xl border border-[#C59648]/20 shadow-[0_8px_30px_rgba(163,120,54,0.15)] rounded-2xl p-3.5 flex items-center justify-between transition-all outline-none cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="relative w-11 h-11 rounded-xl bg-[#C59648]/15 flex items-center justify-center text-[#C59648] border border-[#C59648]/20">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#8A652D] to-[#C59648] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#A8A29E] uppercase tracking-widest">Panier</span>
                <span className="text-[14px] font-black text-white tracking-tight">{formatPrice(subtotal)}</span>
              </div>
            </div>
            <button className="h-10 px-4 bg-gradient-to-r from-[#8A652D] to-[#B8893D] text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center space-x-2 shadow-md outline-none border-none pointer-events-none">
              <span>Valider</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {isBottomSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBottomSheetOpen(false)} className="absolute inset-0 bg-[#1C1917]/40 backdrop-blur-sm" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="relative w-full max-w-md bg-[var(--color-surface-base)] rounded-t-[2rem] p-5 space-y-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] max-h-[90vh] overflow-y-auto z-10 border-none no-scrollbar">
              <div className="w-12 h-1 bg-[#D6D3D1] rounded-full mx-auto mb-1" />
              
              <div className="flex justify-between items-center pb-2 border-b border-[#E7E5E4]">
                <div>
                  <h3 className="font-black text-[16px] text-[#1C1917] tracking-tight uppercase">
                    {currentStep === 'cart' && "Votre Commande"}
                    {currentStep === 'checkout' && "Détails de Livraison"}
                    {currentStep === 'tracking' && "Suivi en Direct"}
                  </h3>
                  <span className="text-[9px] font-black text-[#8A652D] uppercase tracking-widest block mt-0.5">Eagle TN Express</span>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsBottomSheetOpen(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#78716C] shadow-sm border-none outline-none">
                  <X className="w-4 h-4 stroke-[2.5]" />
                </motion.button>
              </div>

              {currentStep === 'cart' && (
                <div className="space-y-4 pb-20">
                  <div className="bg-white p-4 rounded-2xl shadow-[var(--shadow-ambient)]">
                    <p className="text-xs text-[#78716C] font-bold leading-relaxed mb-3">
                      {freeDeliveryThreshold - subtotal > 0 ? `Ajoutez ${formatPrice(freeDeliveryThreshold - subtotal)} pour la livraison gratuite.` : "🎉 Offre activée : Livraison gratuite accordée !"}
                    </p>
                    <div className="w-full bg-[#E7E5E4] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#8A652D] to-[#C59648] h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                    {cartItems.map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-[var(--shadow-ambient)] border border-[#E7E5E4]/50">
                        <div className="flex-1 pr-3">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-black text-[#1C1917] truncate">{item.nameFr}</span>
                            <span className="text-[10px] font-bold text-[#A8A29E]">{item.nameAr}</span>
                          </div>
                          {item.customization && <span className="inline-block text-[9px] bg-[#FAF9F6] text-[#8A652D] px-2 py-0.5 rounded-md font-bold mt-1.5 border border-[#C59648]/20 uppercase">{item.customization}</span>}
                        </div>
                        <div className="flex items-center space-x-2.5 bg-[#FAF9F6] p-1.5 rounded-xl border border-[#E7E5E4]/50 shadow-sm">
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1C1917] outline-none border-none"><Minus className="w-3.5 h-3.5" /></motion.button>
                          <span className="text-[13px] font-black w-5 text-center text-[#1C1917] tabular-nums">{item.quantity}</span>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-lg bg-[#1C1917] text-[#F3E5AB] shadow-sm flex items-center justify-center outline-none border-none"><Plus className="w-3.5 h-3.5" /></motion.button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-2xl space-y-3 shadow-[var(--shadow-ambient)] text-[12px] font-bold text-[#78716C]">
                    <div className="flex justify-between"><span>Sous-total HT</span><span className="font-black text-[#1C1917]">{formatPrice(subtotal)}</span></div>
                    <div className="flex justify-between"><span>Frais de livraison</span><span className={deliveryFee === 0 ? 'text-[#8A652D] uppercase' : 'font-black text-[#1C1917]'}>{deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}</span></div>
                    <div className="flex justify-between text-[14px] font-black text-[#1C1917] border-t border-[#E7E5E4] pt-3 mt-1">
                      <span>Total TTC</span><span className="text-[#8A652D]">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  <div className="fixed bottom-0 left-0 w-full p-4 bg-white/95 backdrop-blur-xl border-t border-[#E7E5E4]">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => proceedToNext('checkout')} className="w-full h-14 bg-gradient-to-r from-[#1C1917] to-[#292524] text-[#F3E5AB] font-black uppercase tracking-widest rounded-2xl flex items-center justify-between px-6 shadow-[0_8px_20px_rgba(28,25,23,0.3)] transition-all outline-none border-none">
                      <span>Passer à la caisse</span>
                      <div className="flex items-center space-x-2"><span className="font-sans">{formatPrice(finalTotal)}</span><ArrowRight className="w-4 h-4 stroke-[3]" /></div>
                    </motion.button>
                  </div>
                </div>
              )}

              {currentStep === 'checkout' && (
                <div className="space-y-4 pb-20">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#A8A29E] flex items-center space-x-1.5"><Phone className="w-3.5 h-3.5 text-[#8A652D]" /><span>Téléphone</span></label>
                    <input type="tel" placeholder="Ex: 98 123 456" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full h-12 px-4 bg-white rounded-xl text-xs font-black focus:outline-none focus:ring-2 focus:ring-[#C59648]/40 shadow-sm border-none text-[#1C1917]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#A8A29E] flex items-center space-x-1.5"><MapPin className="w-3.5 h-3.5 text-[#8A652D]" /><span>Point de repère</span></label>
                    <input type="text" placeholder="Ex: Ennasr 2, près de..." value={landmark} onChange={e => setLandmark(e.target.value)} className="w-full h-12 px-4 bg-white rounded-xl text-xs font-black focus:outline-none focus:ring-2 focus:ring-[#C59648]/40 shadow-sm border-none text-[#1C1917]" />
                  </div>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={handleGetLocation} disabled={isLocating} className="w-full h-12 bg-white hover:bg-[#FAF9F6] rounded-xl text-xs font-black text-[#1C1917] flex items-center justify-center space-x-2 shadow-sm border border-[#E7E5E4] outline-none">
                    {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-[#8A652D]" /> : <Navigation className="w-4 h-4 text-[#8A652D]" />}
                    <span>{geoCoordinates ? geoCoordinates : "Obtenir la position GPS"}</span>
                  </motion.button>

                  <div className="p-4 bg-[#C59648]/10 rounded-2xl flex items-center space-x-3 border border-[#C59648]/20">
                    <ShieldCheck className="w-5 h-5 text-[#8A652D] shrink-0" />
                    <div>
                      <p className="text-xs font-black text-[#1C1917]">Paiement à la livraison (Espèces)</p>
                      <p className="text-[10px] text-[#8A652D] font-bold uppercase tracking-widest mt-0.5">Facture Transparente Incluse</p>
                    </div>
                  </div>

                  <div className="fixed bottom-0 left-0 w-full p-4 bg-white/95 backdrop-blur-xl border-t border-[#E7E5E4] flex space-x-2">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={async () => { await triggerHaptic(); setCurrentStep('cart'); }} className="w-1/3 h-14 bg-[#FAF9F6] text-[#78716C] text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm outline-none border-none">Retour</motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => proceedToNext('tracking')} className="w-2/3 h-14 bg-gradient-to-r from-[#1C1917] to-[#292524] text-[#F3E5AB] text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center space-x-2 shadow-[0_8px_20px_rgba(28,25,23,0.3)] outline-none border-none">
                      <span>Confirmer</span><CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    </motion.button>
                  </div>
                </div>
              )}

              {currentStep === 'tracking' && (
                <div className="space-y-5 pb-6">
                  <div className="bg-gradient-to-r from-[#8A652D] to-[#B8893D] text-white p-5 rounded-3xl text-center space-y-1.5 shadow-[0_8px_20px_rgba(163,120,54,0.3)]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F3E5AB]">Code PIN de Livraison</span>
                    <div className="text-4xl font-black font-sans tracking-[0.25em] py-2">{deliveryPinCode}</div>
                    <p className="text-[10px] text-white/90 font-bold uppercase tracking-widest">À communiquer au livreur</p>
                  </div>

                  <div className="bg-white p-5 rounded-3xl space-y-4 shadow-[var(--shadow-ambient)]">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-[#1C1917] uppercase tracking-wider">Statut</span>
                      <span className="text-[#8A652D] bg-[#C59648]/10 px-3 py-1 rounded-xl uppercase tracking-widest border border-[#C59648]/20">En route 🛵</span>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="flex items-center space-x-3 text-xs font-bold text-[#A8A29E]">
                        <CheckCircle2 className="w-5 h-5 text-[#C59648] shrink-0" />
                        <span>Commande confirmée</span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs font-bold text-[#A8A29E]">
                        <CheckCircle2 className="w-5 h-5 text-[#C59648] shrink-0" />
                        <span>Préparation terminée</span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs font-black text-[#1C1917]">
                        <div className="w-5 h-5 rounded-full bg-[#1C1917] flex items-center justify-center text-[#F3E5AB] text-[10px] shadow-[0_0_12px_rgba(28,25,23,0.3)] border-2 border-white"><div className="w-1.5 h-1.5 bg-[#F3E5AB] rounded-full animate-pulse" /></div>
                        <span>Livreur en approche (GPS)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderJourneyContainer;
