import React from 'react';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';

interface SuccessModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const SuccessModalSheet: React.FC<SuccessModalSheetProps> = ({
  isOpen,
  onClose,
  title = "Opération Réussie",
  description = "Votre commande a été transmise avec succès au système EAGLE TN.",
  actionText = "Continuer",
  onAction,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[28px] p-6 shadow-2xl border border-slate-100 transform transition-all animate-in slide-in-from-bottom duration-300 font-sans text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar for mobile drawer feel */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex justify-end items-center mb-2">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-200/60 flex items-center justify-center mb-4 text-emerald-600 shadow-2xs">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <h3 className="text-base font-extrabold text-slate-900 mb-1.5 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 font-semibold mb-6 leading-relaxed max-w-xs">{description}</p>

          <button
            type="button"
            onClick={() => {
              if (onAction) onAction();
              onClose();
            }}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/25 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModalSheet;
