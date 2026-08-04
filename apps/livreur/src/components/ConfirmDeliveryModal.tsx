import React from 'react';
import { DeliveryOrder } from '../types/order';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  order: DeliveryOrder;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeliveryModal: React.FC<Props> = ({ order, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-5 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-slate-950 text-xl">Confirmer la livraison</h3>
          <p className="text-xs text-slate-500 font-medium">Commande {order.order_code} (#{order.short_code})</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-1">
          <span className="text-[10px] font-black text-slate-400 block uppercase">Montant A Collecter</span>
          <div className="flex justify-between items-center">
            <span className="font-black text-slate-900 text-sm">Espèces / Cash:</span>
            <span className="font-black text-emerald-600 text-2xl">{order.order_value.toFixed(3)} DT</span>
          </div>
        </div>

        <p className="text-xs font-bold text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200/80">
          ⚠️ Avez-vous bien encaissé le montant exact auprès du client ?
        </p>

        <div className="space-y-2 pt-2">
          <button 
            onClick={onConfirm}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all"
          >
            OUI, J'AI ENCAISSÉ {order.order_value.toFixed(3)} DT
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-all"
          >
            Annuler / إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
