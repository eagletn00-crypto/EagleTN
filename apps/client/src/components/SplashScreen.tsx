import React, { useEffect, useState, useRef } from 'react';

export interface SplashScreenProps {
  isHydrated: boolean;
  onTransitionComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  isHydrated,
  onTransitionComplete,
}) => {
  const [stage, setStage] = useState<'INITIAL' | 'DISPLAY' | 'EXITING'>('INITIAL');
  const [imgError, setImgError] = useState(false);
  const hasTriggeredExit = useRef(false);

  useEffect(() => {
    const stageTimer = requestAnimationFrame(() => {
      setStage('DISPLAY');
    });
    return () => cancelAnimationFrame(stageTimer);
  }, []);

  useEffect(() => {
    if (isHydrated && stage === 'DISPLAY' && !hasTriggeredExit.current) {
      hasTriggeredExit.current = true;
      const exitTimer = setTimeout(() => {
        setStage('EXITING');
      }, 600);

      const completeTimer = setTimeout(() => {
        onTransitionComplete();
      }, 1300);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isHydrated, stage, onTransitionComplete]);

  return (
    <div
      aria-hidden={stage === 'EXITING'}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-between text-white select-none overflow-hidden touch-none pointer-events-none bg-[#07070A]"
      style={{
        willChange: 'opacity, transform, filter',
        transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1), filter 700ms cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: stage === 'EXITING' ? 0 : 1,
        transform: stage === 'EXITING' ? 'scale(1.04)' : 'scale(1)',
        filter: stage === 'EXITING' ? 'blur(12px)' : 'blur(0px)',
      }}
    >
      {/* Background Image Container with Fallback */}
      <div className="absolute inset-0 z-0">
        {!imgError ? (
          <img
            src="/eagle.png" 
            alt="Eagle TN Background"
            className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out"
            style={{
              transform: stage !== 'INITIAL' ? 'scale(1)' : 'scale(1.08)',
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div 
            className="w-full h-full"
            style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(212, 175, 55, 0.12) 0%, rgba(226, 26, 44, 0.04) 40%, rgba(7, 7, 10, 1) 80%)',
            }}
          />
        )}
        
        {/* Cyber Dark Overlay: Gradient masking to guarantee 100% text readability */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(7,7,10,0.2) 0%, rgba(7,7,10,0.7) 50%, rgba(7,7,10,0.98) 85%)',
          }}
        />
      </div>

      {/* Top Status Pulse Line */}
      <div className="w-full flex justify-center pt-14 z-10">
        <div className="relative w-10 h-[2px] bg-white/10 rounded-full flex items-center justify-center">
          <div className="absolute w-2 h-2 bg-[#E21A2C] rounded-full shadow-[0_0_12px_#E21A2C] animate-ping opacity-90" />
          <div className="absolute w-1.5 h-1.5 bg-[#E21A2C] rounded-full shadow-[0_0_6px_#E21A2C]" />
        </div>
      </div>

      {/* Center/Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 mt-auto mb-16">
        
        {/* Vector Eagle Emblem (Visible if no external image or as brand icon) */}
        {imgError && (
          <div
            className="relative w-28 h-28 mb-4 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
            style={{
              willChange: 'opacity, transform',
              transition: 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 900ms cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: stage !== 'INITIAL' ? 1 : 0,
              transform: stage !== 'INITIAL' ? 'translateY(0px) scale(1)' : 'translateY(20px) scale(0.9)',
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF0D0" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#8A6418" />
                </linearGradient>
              </defs>
              <path
                d="M100 35 L120 75 L155 85 L125 115 L135 155 L100 130 L65 155 L75 115 L45 85 L80 75 Z"
                fill="url(#goldGradient)"
              />
            </svg>
          </div>
        )}

        {/* Brand Title */}
        <div 
          className="relative px-6 py-2 rounded-2xl"
          style={{
            willChange: 'opacity, transform',
            transition: 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) 100ms, transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 100ms',
            opacity: stage !== 'INITIAL' ? 1 : 0,
            transform: stage !== 'INITIAL' ? 'translateY(0px)' : 'translateY(24px)',
          }}
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center justify-center gap-1 font-sans drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]">
            <span className="bg-gradient-to-r from-[#FFF0D0] via-[#D4AF37] to-[#9A741C] bg-clip-text text-transparent">
              EAGLE
            </span>
            <span className="text-[#E21A2C] font-black drop-shadow-[0_0_15px_rgba(226,26,44,0.6)]">
              .TN
            </span>
          </h1>
        </div>

        {/* Separator Accent */}
        <div 
          className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent my-3"
          style={{
            transition: 'opacity 900ms ease-out 150ms',
            opacity: stage !== 'INITIAL' ? 1 : 0,
          }}
        />

        {/* Subtitle */}
        <p
          className="text-[10px] font-extrabold tracking-[0.25em] text-slate-300 uppercase font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          style={{
            willChange: 'opacity, transform',
            transition: 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
            opacity: stage !== 'INITIAL' ? 1 : 0,
            transform: stage !== 'INITIAL' ? 'translateY(0px)' : 'translateY(16px)',
          }}
        >
          PLATEFORME DE LIVRAISON PREMIUM • TUNISIE
        </p>

        {/* Thin Cyber Loader */}
        <div 
          className="w-44 h-[2px] bg-white/10 rounded-full overflow-hidden mt-8 relative"
          style={{
            transition: 'opacity 800ms ease-out 300ms',
            opacity: stage !== 'INITIAL' ? 1 : 0,
          }}
        >
          <div 
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-[#D4AF37] via-[#E21A2C] to-[#FF3B4E] rounded-full animate-[loading_1.4s_infinite_ease-in-out]"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full flex justify-center pb-8">
        <span
          className="text-[8px] font-extrabold tracking-[0.28em] text-white/40 uppercase font-sans drop-shadow-md"
          style={{
            willChange: 'opacity',
            transition: 'opacity 800ms ease-out 400ms',
            opacity: stage !== 'INITIAL' ? 1 : 0,
          }}
        >
          PROPULSÉ PAR LA TECHNOLOGIE TUNISIENNE 🦅
        </span>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
