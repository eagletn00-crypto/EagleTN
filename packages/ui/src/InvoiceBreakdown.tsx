import React from 'react';
import { Banknote } from 'lucide-react';

export interface InvoiceBreakdownProps {
  subtotal_ht: number;
  tva_amount: number;
  timbre_fiscal: number;
  grand_total: number;
  change_needed_for?: number | null;
}

export const InvoiceBreakdown: React.FC<InvoiceBreakdownProps> = ({
  subtotal_ht,
  tva_amount,
  timbre_fiscal,
  grand_total,
  change_needed_for,
}) => {
  // Formatage officiel Tunisien (3 décimales)
  const formatTND = (amount: number): string => `${Number(amount).toFixed(3)} TND`;

  return (
    <div className="w-full bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
        Détails de facturation
      </h4>
      
      <div className="space-y-2.5 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-light text-neutral-500">Base Hors Taxe</span>
          <span className="text-sm font-medium text-neutral-900">{formatTND(subtotal_ht)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-light text-neutral-500">TVA applicable</span>
          <span className="text-sm font-medium text-neutral-900">{formatTND(tva_amount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-light text-neutral-500">Droit de Timbre</span>
          <span className="text-sm font-medium text-neutral-900">{formatTND(timbre_fiscal)}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex justify-between items-center mb-1">
        <span className="text-base font-bold text-neutral-900">Montant Total TTC</span>
        <span className="text-lg font-black text-neutral-900 tracking-tight">{formatTND(grand_total)}</span>
      </div>

      {change_needed_for != null && change_needed_for > grand_total && (
        <div className="mt-4 bg-neutral-50 border border-neutral-100/80 rounded-xl p-3.5 flex items-start gap-3">
          <div className="bg-white p-1.5 rounded-lg border border-neutral-200/60 shadow-sm mt-0.5">
            <Banknote className="w-4 h-4 text-neutral-700 shrink-0" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-neutral-900 tracking-tight mb-1">
              Paiement en Espèces (Cash)
            </span>
            <span className="text-[11px] font-medium text-neutral-500 leading-relaxed">
              Le client a préparé <strong className="text-neutral-700">{formatTND(change_needed_for)}</strong>. 
              Reste à rendre au client : <strong className="text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200 ml-1 shadow-sm">{formatTND(change_needed_for - grand_total)}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
