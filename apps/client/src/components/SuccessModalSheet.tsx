import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface SuccessModalSheetProps {
  isOpen: boolean;
  orderId: string | null;
  onTrackOrder: (orderId: string) => void;
  onClose: () => void;
}

export function SuccessModalSheet({ isOpen, orderId, onTrackOrder }: SuccessModalSheetProps) {
  if (!isOpen || !orderId) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center p-0 md:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 text-center space-y-5 animate-in slide-in-from-bottom duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={36} />
        </div>
        
        <div>
          <h2 className="text-xl font-black text-slate-900">Commande Confirmée! 🎉</h2>
          <p className="text-xs text-slate-500 mt-1">
            Votre commande <span className="font-mono font-bold text-emerald-600">#{orderId.slice(0, 8).toUpperCase()}</span> a été transmise avec succès.
          </p>
        </div>

        <button
          onClick={() => onTrackOrder(orderId)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
        >
          <span>Suivre ma commande</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default SuccessModalSheet;
