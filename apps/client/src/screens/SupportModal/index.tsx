import React from 'react';

interface Props {
  onClose: () => void;
}

export const SupportModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-xl text-sm">📋</span>
            <div>
              <h3 className="font-bold text-xs">Assistance & Documentation Client</h3>
              <p className="text-[10px] text-slate-400">Service client certifié EAGLE TN</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm p-1">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">COMMANDE EN COURS</p>
              <h4 className="font-bold text-xs text-slate-900 mt-0.5">CMD-2026-8942 — Restaurant El Mida</h4>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200/60">
              En préparation
            </span>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 flex items-start gap-2">
            <span className="text-amber-600 text-xs">🛡️</span>
            <p className="text-[10px] text-amber-900 leading-relaxed">
              Toute réclamation est enregistrée et horodatée conformément à la législation commerciale tunisienne pour garantir un suivi rigoureux.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              MOTIF DE LA RÉCLAMATION
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 bg-white border-2 border-amber-500 rounded-xl text-xs font-bold text-slate-800 text-left">
                Retard de livraison
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 text-left hover:border-slate-300">
                Article manquant
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 text-left hover:border-slate-300">
                Qualité du produit
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 text-left hover:border-slate-300">
                Autre demande
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              DESCRIPTION DÉTAILLÉE
            </h4>
            <textarea
              rows={3}
              placeholder="Expliquez brièvement votre demande pour un traitement immédiat..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            onClick={onClose}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md active:scale-98 transition-transform"
          >
            Envoyer la demande ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
