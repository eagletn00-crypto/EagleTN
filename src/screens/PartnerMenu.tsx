import React from 'react';

export default function PartnerMenu() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center shadow-2xl animate-fade-in">
        <h1 className="text-3xl font-light tracking-wider mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">EAGLE TN</h1>
        <p className="text-sm text-gray-400 mb-6 font-mono">Premium Partner Menu System</p>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          تم تحديث نظام القوائم وربطه بنجاح بقاعدة البيانات الجديدة <span className="text-emerald-400 font-mono">partners</span>.
        </p>
        <button 
          onClick={() => window.location.href = '/partner/dashboard'} 
          className="w-full py-3 bg-white text-black font-medium rounded-2xl hover:bg-gray-200 transition-all duration-300 shadow-lg shadow-white/10"
        >
          الانتقال إلى لوحة التحكم
        </button>
      </div>
    </div>
  );
}
