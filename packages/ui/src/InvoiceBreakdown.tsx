import React from 'react';
import { Banknote, FileCheck } from 'lucide-react';

export interface InvoiceBreakdownProps {
  subtotal_ht: number;
  tva_amount: number;
  timbre_fiscal: number;
  grand_total: number;
  change_needed_for?: number | null;
}

export const InvoiceBreakdown: React.FC<InvoiceBreakdownProps> = ({
  subtotal_ht, tva_amount, timbre_fiscal, grand_total, change_needed_for,
}) => {
  const formatTND = (amount: number): string => `${Number(amount).toFixed(3)} TND`;

  return (
    <div className="w-full bg-white border border-[#C59648]/20 rounded-3xl p-6 shadow-[var(--shadow-ambient)] font-sans">
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#E7E5E4]">
        <FileCheck className="w-4 h-4 text-[#8A652D]" />
        <h4 className="text-[11px] font-black text-[#1C1917] uppercase tracking-widest">
          Détails de facturation
        </h4>
      </div>
      
      <div className="space-y-3 mb-5 text-[13px]">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#78716C]">Base Hors Taxe</span>
          <span className="font-black text-[#1C1917]">{formatTND(subtotal_ht)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#78716C]">TVA applicable</span>
          <span className="font-black text-[#1C1917]">{formatTND(tva_amount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#78716C]">Droit de Timbre</span>
          <span className="font-black text-[#1C1917]">{formatTND(timbre_fiscal)}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-[#E7E5E4] flex justify-between items-center mb-2">
        <span className="text-[14px] font-black uppercase tracking-wider text-[#1C1917]">Total TTC</span>
        <span className="text-[20px] font-black text-[#8A652D] tracking-tight">{formatTND(grand_total)}</span>
      </div>

      {change_needed_for != null && change_needed_for > grand_total && (
        <div className="mt-5 bg-[#FAF9F6] border border-[#C59648]/20 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <div className="bg-white p-2 rounded-xl border border-[#C59648]/10 shadow-sm shrink-0">
            <Banknote className="w-5 h-5 text-[#8A652D]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-black text-[#1C1917] uppercase tracking-tight">
              Paiement en Espèces
            </span>
            <span className="text-[11px] font-bold text-[#78716C] leading-relaxed">
              Préparé par le client : <strong className="text-[#1C1917]">{formatTND(change_needed_for)}</strong>.
              <br/>Reste à rendre : <strong className="text-white bg-gradient-to-r from-[#1C1917] to-[#292524] px-2 py-0.5 rounded-lg ml-1 shadow-sm">{formatTND(change_needed_for - grand_total)}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
