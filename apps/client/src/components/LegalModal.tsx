import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield, FileText, Scale } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-t-[2rem] z-[9999]0] flex flex-col max-h-[85vh] overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-[#1C1917]/10 flex items-center justify-between bg-[#FFFFFF]">
          <h3 className="text-[18px] font-black text-[#141413] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#C59648]" />
            Conditions et Confidentialité
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center outline-none border border-[#1C1917]/10">
            <X className="w-5 h-5 text-[#141413]" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6 text-[13px] text-[#57534E] leading-relaxed bg-[#FFFFFF] flex-1">
          <section>
            <h4 className="text-[15px] font-bold text-[#141413] flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#C59648]" />
              Protection des Données (INPDP)
            </h4>
            <p>Conformément à la législation tunisienne en vigueur relative à la protection des données personnelles, vos informations (localisation GPS, historique des commandes, numéro de téléphone) sont strictement cryptées. Elles sont exclusivement partagées avec notre flotte logistique dans le but unique d'assurer la livraison de votre commande.</p>
          </section>

          <section>
            <h4 className="text-[15px] font-bold text-[#141413] flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#C59648]" />
              Conditions de Vente (CGV)
            </h4>
            <p><strong className="text-[#141413]">Éditeur :</strong> EAGLE TN, plateforme Q-Commerce de Luxe opérant en Tunisie.</p>
            <p className="mt-1"><strong className="text-[#141413]">Paiement (COD) :</strong> Le client s'engage formellement à honorer le paiement en espèces à la livraison. Le montant exact, incluant le timbre fiscal (1.000 DT) et les frais de livraison, est validé numériquement au moment de la commande.</p>
            <p className="mt-1"><strong className="text-[#141413]">Force Majeure :</strong> Les délais de livraison sont estimatifs. EAGLE TN se réserve le droit d'annuler ou de reporter une livraison en cas de conditions climatiques extrêmes ou d'enjeux de sécurité routière.</p>
          </section>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default LegalModal;
