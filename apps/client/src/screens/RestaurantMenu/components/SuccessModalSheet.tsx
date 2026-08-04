import React from 'react';
import { CheckCircle2, Navigation, ArrowRight } from 'lucide-react';

interface SuccessModalSheetProps {
  isOpen: boolean;
  orderId?: string;
  onNavigateToTracking: () => void;
  onClose?: () => void;
}

export const SuccessModalSheet: React.FC<SuccessModalSheetProps> = ({
  isOpen,
  orderId = '',
  onNavigateToTracking,
  onClose
}) => {
  if (!isOpen) return null;

  // معالجة آمنة لتقصير الـ ID
  const displayId = orderId && typeof orderId === 'string' && orderId.length > 8 
    ? orderId.slice(0, 8).toUpperCase() 
    : (orderId || 'SUCCESS');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl space-y-5 transform transition-all animate-scale-up">
        
        {/* SUCCESS ICON */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={36} className="animate-bounce" />
        </div>

        {/* HEADER */}
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900">تم إرسال الطلب بنجاح! 🎉</h2>
          <p className="text-xs font-semibold text-slate-500">
            طلبك قيد المعالجة الآن بواسطة المطعم والسائق
          </p>
        </div>

        {/* ORDER REF CHIP */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 inline-block w-full">
          <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">رقم المرجعية</span>
          <span className="text-sm font-mono font-bold text-emerald-600">
            #{displayId}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onNavigateToTracking}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Navigation size={16} />
            تتبع الطلب مباشرة (Suivre)
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl text-xs transition-all"
            >
              إغلاق
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default SuccessModalSheet;
