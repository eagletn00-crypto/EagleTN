import React, { useState } from 'react';
import { CheckCircle2, Lock, ShieldAlert } from 'lucide-react';

interface Props {
  order: any; // نستخدم any مؤقتاً لتجنب أخطاء Typescript مع الحقول الجديدة
  onConfirm: (pin: string) => void;
  onClose: () => void;
}

export const ConfirmDeliveryModal: React.FC<Props> = ({ order, onConfirm, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (pin.length !== 4) {
      setError('Le code PIN doit contenir 4 chiffres');
      return;
    }

    // جلب الكود الصحيح من الطلب (حسب المسميات المختلفة في القاعدة)
    const expectedPin = order.verificationCode || order.pin_code || order.verification_code;
    
    // التحقق الميداني
    if (expectedPin && expectedPin !== '0000' && pin !== String(expectedPin)) {
      setError('Code PIN incorrect. Veuillez vérifier avec le client.');
      return;
    }

    setError('');
    onConfirm(pin);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full space-y-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-slate-950 text-xl uppercase tracking-wide">Validation Sécurisée</h3>
          <p className="text-xs text-slate-500 font-bold uppercase">CMD-{order.short_code || order.order_code}</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 block uppercase">Montant A Collecter (COD)</span>
          <div className="flex justify-between items-center">
            <span className="font-black text-slate-900 text-sm">Espèces:</span>
            <span className="font-black text-emerald-600 text-2xl">
              {order.totalAmount ? order.totalAmount.toFixed(3) : (order.order_value || 0).toFixed(3)} DT
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-left">
            Code PIN du Client
          </label>
          <input 
            type="text" 
            maxLength={4}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            placeholder="••••"
            className="w-full text-center text-3xl font-black tracking-[0.5em] bg-slate-100 border-2 border-slate-200 rounded-2xl py-4 outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
          {error && (
            <p className="text-[10px] font-bold text-rose-600 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3 h-3" /> {error}
            </p>
          )}
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> VALIDER LA LIVRAISON
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-all uppercase tracking-wider"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
