import React from 'react';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  instructions?: string;
}

interface SlideOverCartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  onCheckout: () => void;
}

export const SlideOverCartSheet: React.FC<SlideOverCartSheetProps> = ({
  isOpen,
  onClose,
  cart,
  subtotal,
  deliveryFee,
  grandTotal,
  onCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans antialiased">
      {/* Glass Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7]/95 backdrop-blur-xl border-l border-white/80 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Glow Spheres */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="p-5 border-b border-amber-900/5 flex items-center justify-between relative z-10 bg-white/40 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-900">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Mon Panier</h2>
                <p className="text-[10px] text-slate-500 font-medium">Eagle TN • Quality & Freshness</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 relative z-10">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <Sparkles size={28} />
                </div>
                <p className="text-sm font-bold text-slate-700">Votre panier est vide</p>
                <p className="text-xs text-slate-400 max-w-[200px]">
                  Découvrez nos plats populaires et ajoutez vos envies du moment.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-amber-700">
                      {(item.price * item.quantity).toFixed(3)} DT
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200/60">
                    <span className="text-xs font-black text-slate-800">x{item.quantity}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white/60 backdrop-blur-lg border-t border-white/80 space-y-4 relative z-10">
              <div className="space-y-2 text-xs font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-bold text-slate-900">{subtotal.toFixed(3)} DT</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span className="font-bold text-slate-900">{deliveryFee.toFixed(3)} DT</span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Final</span>
                  <span className="text-amber-800">{grandTotal.toFixed(3)} DT</span>
                </div>
              </div>

              {/* INPDP Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Paiement sécurisé conforme aux normes</span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onCheckout}
                className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs tracking-wide transition-all active:scale-[0.99]"
              >
                <span>Commander ({grandTotal.toFixed(3)} DT)</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
