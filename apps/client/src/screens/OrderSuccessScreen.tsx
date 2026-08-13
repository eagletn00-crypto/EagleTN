import React, { useState, useEffect } from 'react';
import { CheckCircle2, Phone, MessageSquare, Navigation, Clock, ShieldCheck, Home } from 'lucide-react';

interface OrderSuccessScreenProps {
  orderId?: string;
  driverName?: string;
  driverPhone?: string;
  estimatedMinutes?: number;
  onGoHome?: () => void;
}

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({
  orderId = '#EG-8924',
  driverName = 'مكرم الورغي',
  driverPhone = '+216 20 123 456',
  estimatedMinutes = 25,
  onGoHome,
}) => {
  const [progressStep, setProgressStep] = useState<number>(2); // 1: Confirmaton, 2: en préparation, 3: En route, 4: Livré

  // محاكاة تحرك السائق
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressStep(3);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none">
      
      {/* 1. الهيدر الزجاجي العلوي */}
      <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <button
          onClick={onGoHome}
          className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-95 transition-all border border-white/10"
        >
          <Home className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-black text-white tracking-tight">Suivi de Commande</h1>
          <p className="text-[10px] font-medium text-emerald-400">{orderId}</p>
        </div>

        <div className="w-10 h-10" />
      </div>

      <main className="flex-1 max-w-lg w-full mx-auto p-4 space-y-6 pb-28">

        {/* 2. بطاقة الحالة الرئيسية (Digital Emerald Glow) */}
        <div className="relative bg-gradient-to-b from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-6 rounded-3xl text-center space-y-3 shadow-2xl shadow-emerald-950/40 overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Commande Confirmée !</h2>
            <p className="text-xs font-medium text-emerald-300/80">
              {progressStep === 2 ? 'Le restaurant prépare votre repas' : 'Le livreur est en route vers vous'}
            </p>
          </div>

          {/* التقدير الزمني */}
          <div className="inline-flex items-center gap-2 bg-slate-950/60 px-4 py-2 rounded-full border border-white/10 text-xs font-extrabold text-white">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Livraison estimée dans <strong className="text-emerald-400">{estimatedMinutes} min</strong></span>
          </div>
        </div>

        {/* 3. شريط تقدم مراحل الطلب (Timeline Progress) */}
        <div className="bg-slate-900/90 border border-white/10 p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Statut de la livraison
          </h3>

          <div className="relative flex items-center justify-between px-2">
            {/* الخط الخلفي */}
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
            <div
              className="absolute top-1/2 left-6 h-0.5 bg-emerald-500 transition-all duration-700 -z-0"
              style={{ width: `${((progressStep - 1) / 3) * 100}%` }}
            />

            {/* نقاط التقدم */}
            {[
              { step: 1, label: 'Accepté' },
              { step: 2, label: 'En cuisine' },
              { step: 3, label: 'En route' },
              { step: 4, label: 'Livré' },
            ].map(({ step, label }) => {
              const isDone = progressStep >= step;
              return (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 border border-white/20 text-slate-500'
                    }`}
                  >
                    {step}
                  </div>
                  <span className={`text-[10px] font-bold ${isDone ? 'text-white' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. بطاقة السائق ومعلومات الاتصال المباشر */}
        <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center text-slate-400 font-bold text-lg">
                {driverName.slice(0, 1)}
              </div>
              <div>
                <h4 className="text-sm font-black text-white">{driverName}</h4>
                <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> Livreur Eagle TN
                </p>
              </div>
            </div>

            {/* أزرار التواصل المباشر */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${driverPhone}`}
                className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center active:scale-90 transition-all hover:bg-emerald-500 hover:text-slate-950"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 text-white flex items-center justify-center active:scale-90 transition-all hover:bg-slate-700"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 5. شارة الضمان المالي والدعم */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center gap-3 text-slate-400">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium leading-relaxed">
            Votre commande est protégée par Eagle TN. En cas de problème, notre support est disponible 24/7.
          </p>
        </div>

      </main>

      {/* 6. الزر السفلي العودة للرئيسية */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={onGoHome}
            className="w-full py-4 px-6 rounded-2xl bg-white text-slate-950 font-black text-sm tracking-wide shadow-xl active:scale-[0.98] transition-all hover:bg-slate-100"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>

    </div>
  );
};
