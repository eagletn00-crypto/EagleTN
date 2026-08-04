import React, { useState } from 'react';
import { DeliveryOrder } from '../types/order';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  order: DeliveryOrder;
  onSubmitIssue: (reason: string) => void;
  onClose: () => void;
}

export const ReportIssueModal: React.FC<Props> = ({ order, onSubmitIssue, onClose }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto font-black text-xl">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-slate-900 text-lg">Signaler un problème</h3>
          <p className="text-xs text-slate-500 font-medium">Commande #{order.short_code}</p>
        </div>

        <div className="space-y-2 text-left text-xs font-bold">
          {[
            { id: 'RESTAURANT_CLOSED', label: '🏪 Restaurant fermé / المغازة مغلقة' },
            { id: 'CLIENT_UNREACHABLE', label: '📞 Client ne répond pas / الحريف لا يجيب' },
            { id: 'WRONG_ADDRESS', label: '📍 Adresse erronée / العنوان غير صحيح' },
            { id: 'VEHICLE_BREAKDOWN', label: '⚙️ Panne de véhicule / عطل في الدراجة' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelectedReason(opt.id)}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedReason === opt.id 
                  ? 'border-red-600 bg-red-50/80 text-red-950 font-black' 
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <span>{opt.label}</span>
              {selectedReason === opt.id && <CheckCircle2 className="w-4 h-4 text-red-600" />}
            </button>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          <button 
            disabled={!selectedReason}
            onClick={() => onSubmitIssue(selectedReason)}
            className="w-full py-3.5 bg-red-600 disabled:opacity-50 hover:bg-red-700 text-white font-black rounded-2xl text-xs shadow-lg shadow-red-200 transition-all"
          >
            ENVOYER LE SIGNALEMENT
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-2.5 text-slate-400 font-bold text-xs"
          >
            Fermer / إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
