import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 100); // 50 steps * 100ms = 5000ms (5 seconds)

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-stone-50 flex flex-col justify-between items-center overflow-hidden font-sans select-none">
      {/* Carthage Background with Warm Light */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1572252821143-035235f5243f?w=1200&auto=format&fit=crop&q=80"
          alt="Carthage Tunisia"
          className="w-full h-full object-cover object-center opacity-25 scale-105 animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/60 via-transparent to-stone-50" />
      </div>

      {/* Top Header Glow */}
      <div className="relative z-10 pt-12 flex flex-col items-center">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-red-100 px-4 py-1.5 rounded-full shadow-sm">
          <span className="text-base">🇹🇳</span>
          <span className="text-xs font-black tracking-widest text-red-600 uppercase">Eagle Groupe Tunisia</span>
        </div>
      </div>

      {/* Center Branding & Identity */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 my-auto">
        {/* Glow Ring behind logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-ping" style={{ animationDuration: '3s' }} />
          <div className="w-24 h-24 rounded-3xl bg-white shadow-xl border border-red-100 flex items-center justify-center relative z-10">
            <span className="text-4xl font-black text-[#E33E38] tracking-tighter">EAGLE</span>
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-none mb-2">
          THE EAGLE <span className="text-[#E33E38]">TN</span>
        </h1>

        {/* French Motto */}
        <p className="text-xs font-bold text-stone-600 tracking-wider uppercase mb-1">
          Rapidité • Sécurité • Confidentialité
        </p>

        {/* Arabic Digital Text */}
        <p className="text-sm font-extrabold text-[#E33E38] tracking-wide mt-2 dir-rtl">
          السرعة • الأمان • السرية التامة
        </p>
      </div>

      {/* Bottom Progress Bar & Footer */}
      <div className="relative z-10 w-full max-w-xs px-6 pb-12 flex flex-col items-center gap-4">
        {/* Progress Container */}
        <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden p-0.5 border border-stone-300/40">
          <div
            className="bg-[#E33E38] h-full rounded-full transition-all duration-100 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">
          Chargement en cours {progress}%
        </span>
      </div>
    </div>
  );
};

export default SplashScreen;
