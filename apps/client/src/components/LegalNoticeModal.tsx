import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface LegalNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-black text-slate-900">الامتثال القانوني | Eagle.tn</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 border-none cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 overflow-y-auto space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
          <p className="font-bold text-slate-800">1. حماية المعطيات الشخصية (INPDP):</p>
          <p>يتم جمع إحداثيات الموقع الجغرافي ورقم الهاتف حصرياً لتأمين عملية التوصيل بواسطة الدراجات النارية 🛵 وفقاً للقانون التونسي عدد 63 لسنة 2004.</p>
          
          <p className="font-bold text-slate-800">2. المعاملات المالية والشروط الضريبية:</p>
          <p>جميع الطلبات تتضمن الطابع الفردي (Timbre Fiscal) القانوني. الدفع عند التسليم ينطوي على التزام قانوني بالاستلام.</p>

          <p className="font-bold text-slate-800">3. حقوق الشركاء والموصلين:</p>
          <p>تضمن المنصة حقوق المطاعم والسائقين عبر نظام التوثيق اللحظي للطلبات (OTP Verification).</p>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-2xl text-xs border-none cursor-pointer mt-2"
        >
          موافق ومتابعة
        </button>
      </div>
    </div>
  );
};

export default LegalNoticeModal;
