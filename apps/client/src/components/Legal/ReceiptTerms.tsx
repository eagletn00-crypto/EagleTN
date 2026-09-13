import React from 'react';

export const ReceiptTerms: React.FC = () => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] text-slate-500 space-y-1.5 leading-relaxed">
      <h5 className="font-bold text-slate-700 uppercase">الشروط التنظيمية لمنصة EAGLE TN:</h5>
      <ul className="list-disc list-inside space-y-0.5">
        <li>جميع الأسعار المذكورة تشمل الأداءات والرسوم الميدانية المعتمدة.</li>
        <li>العميل ملتزم بتسليم المبلغ المالي للوجبة المحددة بالحرف لسائق السكوتر.</li>
        <li>تخضع عملية معالجة المواقع الجغرافي للتشريعات التونسية لحماية المعطيات الشخصية (INPDP).</li>
      </ul>
    </div>
  );
};

export default ReceiptTerms;
