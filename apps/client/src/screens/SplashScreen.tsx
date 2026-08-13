import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

// شعار النسر الذهبي الفخم بتنسيق SVG مع تدرجات إضاءة ذهبية متقدمة
const EagleGoldEmblem: React.FC = () => (
  <svg
    viewBox="0 0 200 200"
    className="w-32 h-32 sm:w-36 sm:h-36 filter drop-shadow-[0_15px_25px_rgba(212,175,55,0.25)]"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* تدرج ذهبي معدني مصقول */}
      <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="30%" stopColor="#D4AF37" />
        <stop offset="70%" stopColor="#AA7C11" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>

      {/* تدرج القوة والتألق الخلفي */}
      <radialGradient id="glowEffect" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* إشراقة خلفية هادئة */}
    <circle cx="100" cy="100" r="90" fill="url(#glowEffect)" />

    {/* الإطار الخارجي الهندسي الذهبي */}
    <path
      d="M100 15 L175 55 L175 145 L100 185 L25 145 L25 55 Z"
      stroke="url(#goldMetallic)"
      strokeWidth="2.5"
      fill="rgba(10, 15, 30, 0.6)"
      className="backdrop-blur-sm"
    />

    {/* تفاصيل النسر الذهبي المحلق والمجرد */}
    <path
      d="M100 45 
         C115 65, 150 70, 170 60 
         C150 85, 125 95, 105 105 
         C130 115, 155 120, 165 140 
         C135 135, 115 125, 100 155 
         C85 125, 65 135, 35 140 
         C45 120, 70 115, 95 105 
         C75 95, 50 85, 30 60 
         C50 70, 85 65, 100 45 Z"
      fill="url(#goldMetallic)"
    />

    {/* رأس النسر والحاكمة العصرية */}
    <path
      d="M100 45 L106 60 L100 57 L94 60 Z"
      fill="#FFF"
    />
  </svg>
);

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 400); // إتاحة وقت بسيط للمستخدم لشعور بالطلب 100%
          return 100;
        }
        return prev + 2;
      });
    }, 60); // 3 ثوانٍ إجمالية (تعتبر المعيار الذهبي لـ Splash Screen السريعة)

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#0A0F1E] text-slate-100 flex flex-col justify-between items-center overflow-hidden font-sans select-none">
      
      {/* خلفية ديناميكية داكنة ممزوجة مع إضاءة قرطاجية خفيفة للغاية */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#E70013]/10 rounded-full blur-[100px]" />
      </div>

      {/* الرأس الأعلى: الهوية الوطنية اللوجستية الفخمة */}
      <div className="relative z-10 pt-14 flex flex-col items-center">
        <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2 rounded-full shadow-2xl">
          <span className="text-sm">🇹🇳</span>
          <span className="text-[11px] font-extrabold tracking-[0.25em] text-[#D4AF37] uppercase">
            Eagle Groupe Tunisia
          </span>
        </div>
      </div>

      {/* المنتصف: الشعار والاسم مع التايبوجرافي العالمي */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 my-auto">
        {/* أيقونة النسر الذهبي المصقول */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-[#D4AF37]/10 blur-xl animate-ping" style={{ animationDuration: '4s' }} />
          <EagleGoldEmblem />
        </div>

        {/* اسم التطبيق الفخم */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-3">
          <span className="bg-gradient-to-r from-[#FFE082] via-[#D4AF37] to-[#AA7C11] bg-clip-text text-transparent">
            EAGLE
          </span>{" "}
          <span className="text-white font-light">TN</span>
        </h1>

        {/* خط فاصل أحمر تونس أنيق */}
        <div className="w-12 h-[2px] bg-[#E70013] rounded-full mb-4 shadow-[0_0_8px_#E70013]" />

        {/* الشعار باللغة الفرنسية */}
        <p className="text-[11px] font-semibold text-slate-300 tracking-[0.2em] uppercase mb-1.5 opacity-90">
          Rapidité • Sécurité • Confidentialité
        </p>

        {/* الشعار باللغة العربية بلمسة حديثة */}
        <p className="text-xs font-bold text-[#D4AF37] tracking-wider dir-rtl opacity-95">
          السرعة • الأمان • السرية التامة
        </p>
      </div>

      {/* الجزء السفلي: شريط التقدم الفخم ورقم النسبة */}
      <div className="relative z-10 w-full max-w-xs px-6 pb-14 flex flex-col items-center gap-3">
        {/* حاوية شريط التقدم الزجاجية */}
        <div className="w-full bg-white/5 backdrop-blur-md h-2 rounded-full overflow-hidden p-[2px] border border-white/10 shadow-inner">
          <div
            className="bg-gradient-to-r from-[#D4AF37] via-[#FFE082] to-[#E70013] h-full rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(212,175,55,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* نسبة التحميل النصية */}
        <div className="flex items-center justify-between w-full px-1 text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
          <span>Chargement</span>
          <span className="text-[#D4AF37]">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

