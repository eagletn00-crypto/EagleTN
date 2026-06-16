import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // تشغيل الصوت السينمائي
    const eagleSound = new Audio('/eagle.mp3');
    eagleSound.volume = 0.6;
    eagleSound.play().catch(() => {});

    // المشهد 1: Cosmic Inception (النسر يتضخم من تونس) -> 0s to 3s
    setPhase(1);

    // المشهد 2: Hypersonic Delivery (الدراجة الضوئية الخاطفة) -> 3s to 4.2s
    const timer2 = setTimeout(() => setPhase(2), 3000);

    // المشهد 3: الانفجار الذهبي (Explosion) -> 4.2s to 4.5s
    const timer3 = setTimeout(() => setPhase(3), 4200);

    // المشهد 4: كشف الشعار العالمي (Logo Reveal) -> 4.5s to 7s
    const timer4 = setTimeout(() => setPhase(4), 4500);

    // الخروج إلى واجهة التطبيق الرئيسية
    const exitTimer = setTimeout(() => navigate('/home'), 7500);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(exitTimer);
      eagleSound.pause();
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center overflow-hidden font-sans select-none">
      
      {/* =========================================
          المشهد الأول: The Cosmic Inception
         ========================================= */}
      {/* خلفية الفضاء وتوهج مدن تونس (Ibn Khaldoun, Jbal Lahmar...) */}
      <div className={`absolute inset-0 transition-opacity duration-[3000ms] ease-out ${phase >= 1 && phase < 3 ? 'opacity-100' : 'opacity-0'}`}>
        {/* التوهج الأحمر/الذهبي الكوني */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E3000F]/20 via-[#FFD700]/5 to-transparent blur-3xl"></div>
        
        {/* النسر المهيب يتضخم ليغطي الكوكب */}
        <img 
          src="/eagle-bg.png" 
          alt="Eagle Cosmic" 
          className="absolute top-1/2 left-1/2 w-96 h-96 object-contain -translate-x-1/2 -translate-y-1/2 transition-transform duration-[4000ms] ease-in-out opacity-80 mix-blend-screen"
          style={{ transform: phase >= 1 ? 'translate(-50%, -50%) scale(4)' : 'translate(-50%, -50%) scale(0)' }}
        />
      </div>

      {/* =========================================
          المشهد الثاني: The Hypersonic Delivery
         ========================================= */}
      {/* الدراجة الضوئية الخاطفة (Light Trail) */}
      <div className={`absolute top-1/2 left-0 w-full h-1 z-20 ${phase === 2 ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          className="h-1 bg-[#FFD700] shadow-[0_0_40px_10px_rgba(255,215,0,0.8),_0_0_80px_20px_rgba(227,0,15,0.6)]"
          style={{
            width: '40vw',
            transform: phase === 2 ? 'translateX(120vw) skewX(-45deg)' : 'translateX(-50vw) skewX(-45deg)',
            transition: 'transform 0.4s cubic-bezier(0.1, 0.8, 0.1, 1)'
          }}
        ></div>
      </div>

      {/* =========================================
          المشهد الثالث: الانفجار الذهبي
         ========================================= */}
      <div className={`absolute inset-0 bg-white z-30 transition-opacity duration-300 ${phase === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="w-full h-full bg-[#FFD700] mix-blend-overlay blur-md"></div>
      </div>

      {/* =========================================
          المشهد الرابع: The Global Logo Reveal
         ========================================= */}
      <div className={`relative z-40 flex flex-col items-center text-center transition-all duration-[2000ms] ease-out ${phase >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        
        {/* التوهج الخلفي خلف النص */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFD700]/10 via-transparent to-transparent blur-2xl"></div>

        <h1 className="text-5xl md:text-7xl font-black tracking-[0.2em] mb-4 flex items-center justify-center gap-2 drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          <span className="text-white">EAGLE</span>
          <span className="text-[#FFD700]">.</span>
          <span className="text-[#E3000F]">TN</span>
        </h1>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent my-6 opacity-70"></div>

        <h2 className="text-sm md:text-lg font-bold text-gray-300 tracking-[0.3em] uppercase mb-4 drop-shadow-md">
          L'ART DE LA LIVRAISON, REDÉFINI.
        </h2>

        <h3 className="text-xl md:text-3xl font-black text-[#FFD700] font-arabic drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
          فن التوصيل، برؤية جديدة.
        </h3>
        
      </div>

    </div>
  );
};

export default SplashScreen;
