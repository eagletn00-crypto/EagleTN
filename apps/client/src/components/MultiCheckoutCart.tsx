import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useCartStore } from '../store/useCartStore';
import { supabase } from '../lib/supabase';
import { InvoiceBreakdown } from '../../../../packages/ui/src/InvoiceBreakdown';

export const MultiCheckoutCart: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { items, promoCode } = useCartStore();
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOfficialInvoice = async () => {
      if (items.length === 0 || !isOpen) return;
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('calculate-order-total', {
        body: { items, promoCode, userLocation: null, merchantId: items[0]?.merchantId }
      });

      if (!error && data) {
        setInvoice(data);
      }
      setIsLoading(false);
    };

    fetchOfficialInvoice();
  }, [items, promoCode, isOpen]);

  const handleCheckout = async () => {
    try { await Haptics.impact({ style: ImpactStyle.Heavy }); } catch(e) {}
    // Proceed with secure server-side order insertion
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end font-sans">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1C1917]/40 backdrop-blur-sm" />
          
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-[var(--color-surface-ivory)] h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto relative z-10"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[var(--color-accent-gold)]" />
                  <h2 className="text-[16px] font-black text-[var(--color-ink-primary)] uppercase tracking-tight">Caisse Souveraine</h2>
                </div>
                <button onClick={onClose} className="text-xs font-black text-[var(--color-ink-muted)] hover:text-[var(--color-ink-primary)] transition-colors border-none bg-transparent outline-none">
                  Fermer
                </button>
              </div>

              {/* Items List (Simplified for UX) */}
              <div className="mt-5 space-y-3.5">
                <p className="text-[11px] font-bold text-[var(--color-ink-muted)]">{items.length} article(s) dans le panier</p>
              </div>
            </div>

            <div className="pt-5 border-t border-[var(--color-border-subtle)] space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-6 text-[var(--color-ink-muted)]">
                  <Loader2 className="w-6 h-6 animate-spin mb-2 text-[var(--color-accent-gold)]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Calcul sécurisé en cours...</span>
                </div>
              ) : invoice ? (
                <InvoiceBreakdown 
                  subtotal_ht={invoice.subtotal_ht} 
                  tva_amount={invoice.tva_amount} 
                  timbre_fiscal={invoice.timbre_fiscal} 
                  grand_total={invoice.grand_total} 
                />
              ) : null}

              <motion.button
                whileTap={{ scale: 0.98 }} onClick={handleCheckout} disabled={isLoading || !invoice}
                className="w-full bg-gradient-to-r from-[var(--color-ink-primary)] to-[#292524] text-[var(--color-surface-ivory)] font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-[13px] uppercase tracking-widest shadow-[0_8px_20px_rgba(26,25,24,0.3)] transition-all border-none outline-none disabled:opacity-50"
              >
                <span>Confirmer et Payer</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MultiCheckoutCart;
