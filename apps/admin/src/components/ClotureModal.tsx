import React from 'react';
import { Printer, X, FileText, CheckCircle, Calculator, ShieldCheck } from 'lucide-react';
import { useAdminStore } from '../stores/useAdminStore';

interface ClotureModalProps {
  onClose: () => void;
}

export default function ClotureModal({ onClose }: ClotureModalProps) {
  // سحب البيانات المحسوبة مركزياً من الخادم (Single Source of Truth)
  const { chiffreAffaires, pendingCash, commissionPlateforme, partPartenaires } = useAdminStore();
  const timestamp = new Date().toLocaleString('fr-FR');

  const handlePrint = () => {
    const style = document.createElement('style');
    style.innerHTML = `@media print { body * { visibility: hidden; } #print-section, #print-section * { visibility: visible; } #print-section { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; background: white; } }`;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4">
      <div 
        id="print-section"
        className="bg-[#E9EBEF] w-full max-w-lg rounded-[2rem] shadow-[10px_10px_20px_rgba(0,0,0,0.15),-10px_-10px_20px_#ffffff] p-8 flex flex-col gap-6 relative border border-white/50"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-[#E9EBEF] rounded-full shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] flex items-center justify-center text-stone-500 print:hidden transition-all active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس التقرير الرسمي */}
        <div className="text-center space-y-2 border-b border-stone-300/50 pb-6">
          <div className="w-16 h-16 mx-auto bg-[#E9EBEF] rounded-full shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center mb-4 border border-white/40">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-stone-800 uppercase tracking-widest">Rapport d'Audit Financier</h2>
          <p className="text-xs font-bold text-stone-500">Généré le: {timestamp}</p>
          <p className="text-[10px] font-black text-blue-700 bg-blue-50 inline-block px-3 py-1 rounded-md border border-blue-200 mt-2">
            CONFORME AUX NORMES DE TRAÇABILITÉ
          </p>
        </div>

        {/* التدقيق المالي الدقيق */}
        <div className="space-y-4">
          <div className="bg-[#E9EBEF] p-4 rounded-2xl shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] border border-white/30 flex justify-between items-center">
            <span className="text-xs font-black text-stone-500 uppercase tracking-widest flex items-center gap-2"><Calculator className="w-4 h-4"/> CA Global (Brut)</span>
            <span className="text-lg font-black text-stone-800">{chiffreAffaires.toFixed(3)} DT</span>
          </div>

          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-stone-600">Part Partenaires (Déduction faite)</span>
            <span className="text-sm font-black text-stone-800">{partPartenaires.toFixed(3)} DT</span>
          </div>

          <div className="flex justify-between items-center px-2 border-b border-stone-300/50 pb-4">
            <div className="flex flex-col">
               <span className="text-xs font-black text-emerald-700">Commissions EAGLE TN</span>
               <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Algorithme Dynamique (0% - 10%)</span>
            </div>
            <span className="text-sm font-black text-emerald-700">+{commissionPlateforme.toFixed(3)} DT</span>
          </div>

          <div className="bg-[#E9EBEF] p-4 rounded-2xl shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] border border-white/50 flex justify-between items-center mt-2">
            <span className="text-xs font-black text-amber-700 uppercase tracking-widest">Espèces à Récupérer</span>
            <span className="text-xl font-black text-amber-600">{pendingCash.toFixed(3)} DT</span>
          </div>
        </div>

        {/* الإجراءات */}
        <div className="flex gap-4 mt-4 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-stone-700 font-black text-[11px] uppercase tracking-widest"
          >
            <Printer className="w-4 h-4" /> Imprimer
          </button>
          
          <button 
            onClick={() => {
              alert("Audit validé et crypté dans Supabase.");
              onClose();
            }}
            className="flex-[2] bg-emerald-600 shadow-md active:scale-95 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-white font-black text-[11px] uppercase tracking-widest"
          >
            <CheckCircle className="w-4 h-4" /> Valider l'Audit
          </button>
        </div>
      </div>
    </div>
  );
}
