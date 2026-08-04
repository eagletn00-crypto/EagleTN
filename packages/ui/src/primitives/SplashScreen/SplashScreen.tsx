import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  statusText?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  statusText = "Initialisation de la connexion sécurisée..." 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // محاكاة ذكية ومنضبطة لبناء قنوات البث ومزامنة الجداول الزمنية الحية لـ Supabase
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400); // مهلة ناعمة جداً للإخفاء الانسيابي (Fade-out effect)
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAFA] transition-all duration-500">
      <div className="w-full max-w-xs flex flex-col items-center space-y-8 animate-fade-in">
        
        {/* الشعار الخطي النقي المعماري لـ Eagle.tn */}
        <div className="relative flex items-center justify-center w-16 h-16 bg-white border border-zinc-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 22l1-4h3l1 4" />
            <path d="M18 22l1-4h3l1 4" />
            <path d="M12 2v20" />
            <path d="M3 10h18" />
            <path d="M12 2L3 10h18L12 2z" />
          </svg>
        </div>

        {/* مؤشر التحميل الخفي المينيماليست الفاخر بدقة البكسل */}
        <div className="w-full space-y-3">
          <div className="w-full h-[2px] bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-zinc-900 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* النصوص التوجيهية اللوجستية بالفرنسية الفاخرة */}
          <div className="flex justify-between items-center text-[11px] font-medium tracking-tight">
            <span className="text-zinc-400 uppercase font-mono">Eagle.tn</span>
            <span className="text-zinc-500 font-mono transition-all duration-200">{progress}%</span>
          </div>
          <p className="text-center text-xs text-zinc-400 font-normal leading-normal select-none">
            {statusText}
          </p>
        </div>

      </div>
    </div>
  );
};

SplashScreen.displayName = 'SplashScreen';
