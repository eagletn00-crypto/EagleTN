import React, { useState } from 'react';

interface SupportModalProps {
  onClose: () => void;
  orderId?: string;
  restaurantName?: string;
  orderStatus?: string;
  onSubmit?: (data: { motif: string; description: string }) => Promise<void> | void;
}

const MOTIFS = [
  'Retard de livraison',
  'Article manquant',
  'Qualité du produit',
  'Autre demande',
];

export const SupportModal: React.FC<SupportModalProps> = ({
  onClose,
  orderId = 'CMD-2026-8942',
  restaurantName = 'Chez Om Ali',
  orderStatus = 'En cours de livraison',
  onSubmit,
}) => {
  const [selectedMotif, setSelectedMotif] = useState<string>(MOTIFS[0]);
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({ motif: selectedMotif, description });
      } else {
        // المحاكاة الافتراضية
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      onClose();
    } catch (error) {
      console.error('Error submitting support ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-200">
        
        {/* Header - Premium Ultra-Clean White */}
        <div className="bg-white border-b border-slate-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-bold text-lg border border-amber-100/60 shadow-xs">
              📋
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">Assistance & Support Client</h3>
              <p className="text-[11px] text-slate-400 font-medium">Service certifié EAGLE TN DIGYTAL</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xs transition-all active:scale-90"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Active Order Card */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">COMMANDE CONCERNÉE</p>
              <h4 className="font-bold text-xs text-slate-900 mt-0.5">{orderId} • <span className="text-emerald-700">{restaurantName}</span></h4>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200/60 shadow-2xs">
              {orderStatus}
            </span>
          </div>

          {/* Legal Notice - INPDP & Trade Law */}
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3.5 flex items-start gap-2.5">
            <span className="text-amber-600 text-sm">🛡️</span>
            <p className="text-[10px] text-amber-900/90 leading-relaxed font-medium">
              Toute réclamation est horodatée et enregistrée conformément à la législation commerciale et aux normes INPDP en Tunisie pour assurer un traitement rigoureux.
            </p>
          </div>

          {/* Motif Selector */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              MOTIF DE LA RÉCLAMATION
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {MOTIFS.map((motif) => {
                const isSelected = selectedMotif === motif;
                return (
                  <button
                    key={motif}
                    type="button"
                    onClick={() => setSelectedMotif(motif)}
                    className={`p-3.5 rounded-2xl text-xs font-bold text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-emerald-50/50 border-2 border-emerald-600 text-emerald-950 shadow-xs'
                        : 'bg-white border border-slate-200/80 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {motif}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              DESCRIPTION DÉTAILLÉE
            </h4>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expliquez brièvement votre demande pour un traitement immédiat par notre équipe..."
              className="w-full p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-xs shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Traitement en cours...
              </span>
            ) : (
              'Envoyer la demande ➔'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SupportModal;
