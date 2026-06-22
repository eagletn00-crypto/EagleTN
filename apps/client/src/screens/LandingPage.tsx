import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, GlassButton } from '@eagle-tn/ui';
import { useThemeStore } from '../stores/useThemeStore';

export default function LandingPage() {
  const accentClass = useThemeStore((state) => state.accentColor) === 'amber'
    ? 'text-amber-ultra-500'
    : 'text-zinc-200';

  return (
    <div className="min-h-screen bg-ultra-dark-950 text-gray-100 font-sans p-6 selection:bg-amber-ultra-500 selection:text-black">
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="max-w-2xl w-full p-0 overflow-hidden">
          <div className="bg-glass-soft p-12 text-center space-y-8">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-ultra-500 to-amber-ultra-600 rounded-full flex items-center justify-center mx-auto text-white text-5xl font-black shadow-amber-glow">
                🍕
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">MONO Delivery</h1>
              <p className="text-lg text-zinc-300">تطبيق التوصيل الأول بمعايير عالمية</p>
            </div>

              <div className="space-y-4 py-8">
              <p className="text-zinc-400">اختر كيفية استخدامك للتطبيق:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/client-home" className="block">
                  <div className="p-6 bg-ultra-dark-900 hover:bg-ultra-dark-800 border border-amber-soft hover:border-amber-ultra-500 rounded-xl transition-all duration-300 cursor-pointer group">
                    <div className="text-3xl mb-3">🛒</div>
                    <h3 className={`font-semibold ${accentClass} group-hover:text-amber-ultra-400 transition-colors`}>عميل</h3>
                    <p className="text-sm text-zinc-400 mt-2">اطلب وجبتك المفضلة</p>
                    <div className="mt-4">
                      <GlassButton variant="solid">Commencer</GlassButton>
                    </div>
                  </div>
                </Link>

                <Link to="/restaurant-menu" className="block">
                  <div className="p-6 bg-ultra-dark-900 hover:bg-ultra-dark-800 border border-amber-soft hover:border-amber-ultra-500 rounded-xl transition-all duration-300 cursor-pointer group">
                    <div className="text-3xl mb-3">👨‍🍳</div>
                    <h3 className={`font-semibold ${accentClass} group-hover:text-amber-ultra-400 transition-colors`}>مطعم</h3>
                    <p className="text-sm text-zinc-400 mt-2">إدارة الطلبات</p>
                    <div className="mt-4">
                      <GlassButton variant="outline">Accès</GlassButton>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-amber-soft bg-ultra-dark-950 px-12 py-6 text-center">
            <p className="text-xs text-zinc-500">
              تطبيق عملاء MONO | نسخة التطوير
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
