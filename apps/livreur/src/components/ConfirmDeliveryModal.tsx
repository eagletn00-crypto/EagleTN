import React, { useState } from 'react';
import { CheckCircle2, Lock, ShieldAlert } from 'lucide-react';

export interface DeliveryConfirmationOrder {
  readonly id?: string;
  readonly short_code?: string;
  readonly order_code?: string;
  readonly total_amount?: number | null;
  readonly totalAmount?: number | null;
  readonly order_value?: number | null;
  readonly verification_code?: string | number | null;
  readonly verificationCode?: string | number | null;
  readonly pin_code?: string | number | null;
}

interface Props {
  readonly order: DeliveryConfirmationOrder;
  readonly onConfirm: (pin: string) => void | Promise<void>;
  readonly onClose: () => void;
}

export const ConfirmDeliveryModal: React.FC<Props> = ({ order, onConfirm, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const codAmount = Number(
    order.total_amount ?? order.totalAmount ?? order.order_value ?? 0
  );

  const handleConfirm = async () => {
    if (!/^\d{4}$/.test(pin)) {
      setError('Le code PIN doit contenir 4 chiffres.');
      return;
    }

    const rawPin =
      order.verification_code ?? order.verificationCode ?? order.pin_code;
    const expectedPin = rawPin !== undefined && rawPin !== null ? String(rawPin).trim() : '';

    if (!expectedPin) {
      setError('Code PIN introuvable sur cette commande.');
      return;
    }

    if (pin !== expectedPin) {
      setError('Code PIN incorrect. Veuillez vérifier avec le client.');
      return;
    }

    setError('');
    await onConfirm(pin);
  };

  const orderCode = order.short_code || order.order_code || order.id || 'COMMANDE';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full space-y-6 text-center shadow-2xl">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-slate-950 text-xl uppercase tracking-wide">
            Validation Sécurisée
          </h3>
          <p className="text-xs text-slate-500 font-bold uppercase">
            CMD-{orderCode}
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 block uppercase">
            Montant à collecter (COD)
          </span>
          <div className="flex justify-between items-center">
            <span className="font-black text-slate-900 text-sm">Espèces :</span>
            <span className="font-black text-emerald-600 text-2xl tabular-nums">
              {codAmount.toFixed(3)} DT
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-left">
            Code PIN du Client
          </label>
          <input
            type="text"
            inputMode="numeric"
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
            <p className="text-[11px] font-bold text-rose-600 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Valider la livraison</span>
          </button>

          <button
            type="button"
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
