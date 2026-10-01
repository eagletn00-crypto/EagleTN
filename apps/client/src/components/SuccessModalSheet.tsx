import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

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
  title = "تمت العملية بنجاح",
  description = "تم حفظ التغييرات والبيانات بنجاح في النظام.",
  actionText = "متابعة",
  onAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 transform transition-all animate-in slide-in-from-bottom duration-300 font-['Plus_Jakarta_Sans']"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-1.5 bg-slate-200 rounded-full sm:hidden mx-auto -mr-6" />
        </div>

        <div className="flex flex-col items-center text-center p-2">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-500">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-sm">{description}</p>

          <button
            onClick={() => {
              if (onAction) onAction();
              onClose();
            }}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModalSheet;
