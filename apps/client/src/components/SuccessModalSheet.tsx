import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Haptics, NotificationType, ImpactStyle } from '@capacitor/haptics';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  onTrackOrder?: () => void;
}

export const SuccessModalSheet: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  orderId = 'CMD-8492X',
  onTrackOrder
}) => {
  // Fire Sensory Feedback on Mount
  React.useEffect(() => {
    if (isOpen) {
      const fireSuccessHaptics = async () => {
        try {
          // Triple pulse success pattern
          await Haptics.notification({ type: NotificationType.Success });
          setTimeout(() => Haptics.impact({ style: ImpactStyle.Heavy }), 200);
        } catch(e) {}
      };
      
      const audio = new Audio('/sounds/eagle.mp3'); // or equivalent path
      audio.volume = 0.5;
      audio.play().catch(() => {});
      
      fireSuccessHaptics();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[var(--color-surface-base)] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 pb-10 flex flex-col items-center text-center shadow-[0_-12px_40px_rgba(0,0,0,0.2)] border-t border-[#E7E5E4] sm:border z-10"
          >
            <div className="w-12 h-1.5 bg-[#D6D3D1] rounded-full mb-8 sm:hidden" />

            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.15, damping: 15, stiffness: 250 }}
              className="relative w-28 h-28 rounded-[2rem] bg-gradient-to-br from-[#8A652D] to-[#B8893D] shadow-[0_12px_30px_rgba(163,120,54,0.4)] flex items-center justify-center border-4 border-white mb-6"
            >
              <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-[#F3E5AB] animate-pulse" />
              <CheckCircle2 className="w-14 h-14 text-white stroke-[2.5]" />
            </motion.div>

            <h2 className="text-[24px] font-black text-[#1C1917] tracking-tight mb-2 uppercase">
              Commande Confirmée
            </h2>
            <p className="text-[13px] font-bold text-[#78716C] leading-relaxed mb-8 max-w-[280px]">
              Votre commande souveraine <span className="text-[#8A652D] font-black uppercase tracking-widest">{orderId.split('-')[0]}</span> a été transmise avec succès.
            </p>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onTrackOrder}
              className="w-full h-14 bg-gradient-to-r from-[#1C1917] to-[#292524] text-[#F3E5AB] rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(28,25,23,0.3)] outline-none border-none mb-4"
            >
              <span>Suivre ma commande</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </motion.button>

            <button
              onClick={onClose}
              className="w-full h-12 text-[10px] font-black uppercase tracking-widest text-[#A8A29E] hover:text-[#1C1917] transition-colors outline-none border-none bg-transparent"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModalSheet;
