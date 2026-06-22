import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-gray-100 font-sans p-6 selection:bg-amber-500 selection:text-black">
      <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center shadow-xl space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto text-white text-5xl font-black shadow-2xl shadow-amber-500/30">
            🍕
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">MONO Delivery</h1>
          <p className="text-lg text-zinc-300">تطبيق التوصيل الأول بمعايير عالمية</p>
        </div>

        <div className="space-y-4 py-8">
          <p className="text-zinc-400">اختر كيفية استخدامك للتطبيق:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/client-home"
              className="p-6 bg-zinc-800 hover:bg-zinc-700 border border-amber-500/30 hover:border-amber-500 rounded-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="text-3xl mb-3">🛒</div>
              <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">عميل</h3>
              <p className="text-sm text-zinc-400 mt-2">اطلب وجبتك المفضلة</p>
            </a>

            <a
              href="/restaurant-menu"
              className="p-6 bg-zinc-800 hover:bg-zinc-700 border border-amber-500/30 hover:border-amber-500 rounded-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="text-3xl mb-3">👨‍🍳</div>
              <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">مطعم</h3>
              <p className="text-sm text-zinc-400 mt-2">إدارة الطلبات</p>
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">
            تطبيق عملاء MONO | نسخة التطوير
          </p>
        </div>
      </div>
    </div>
  );
}
