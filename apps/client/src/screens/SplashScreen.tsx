import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  isLoading: boolean;
  onReady?: () => void;
}

const EagleCarthageEmblem: React.FC = memo(() => (
  <motion.div 
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', damping: 20, stiffness: 120 }}
    className="relative flex items-center justify-center"
  >
    <motion.div
      animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -inset-8 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none"
    />

    <svg
      role="img"
      aria-label="Eagle Carthage Logo"
      viewBox="0 0 200 200"
      className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-[0_16px_32px_rgba(5,150,105,0.12)] relative z-10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>

        <linearGradient id="carthageCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D4D" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>

      <path
        d="M100 15 L175 55 L175 145 L100 185 L25 145 L25 55 Z"
        stroke="url(#emeraldGradient)"
        strokeWidth="2"
        fill="rgba(255, 255, 255, 0.85)"
      />

      <path
        d="M100 45 C115 65, 150 70, 170 60 C150 85, 125 95, 105 105 C130 115, 155 120, 165 140 C135 135, 115 125, 100 155 C85 125, 65 135, 35 140 C45 120, 70 115, 95 105 C75 95, 50 85, 30 60 C50 70, 85 65, 100 45 Z"
        fill="url(#emeraldGradient)"
      />
      
      <path
        d="M100 45 L106 60 L100 57 L94 60 Z"
        fill="url(#carthageCrimson)"
      />
    </svg>
  </motion.div>
));

EagleCarthageEmblem.displayName = 'EagleCarthageEmblem';

export const SplashScreen: React.FC<SplashScreenProps> = memo(({ isLoading, onReady }) => {
  return (
    <AnimatePresence onExitComplete={onReady}>
      {isLoading && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] w-full min-h-[100dvh] bg-neutral-50 text-slate-900 flex flex-col justify-center items-center overflow-hidden font-sans select-none px-6 py-10"
        >
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="w-[450px] h-[450px] bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-transparent rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 my-auto">
            <EagleCarthageEmblem />
            
            <motion.div 
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl font-black tracking-widest leading-none">
                <span className="text-slate-900">EAGLE</span>
                <span className="text-red-600 font-light ml-1">.TN</span>
              </h1>
              <p className="text-[10px] font-extrabold tracking-[0.35em] text-emerald-700 uppercase">
                L'art de la livraison express
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-8 h-[2px] bg-red-600 rounded-full opacity-80 origin-center" 
            />

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="flex items-center gap-2.5 text-[11px] font-light text-slate-500 tracking-wider pt-0.5"
            >
              <span className="font-normal text-slate-700">السرعة</span>
              <span className="w-1 h-1 rounded-full bg-emerald-600" />
              <span className="font-normal text-slate-700">الأمان</span>
              <span className="w-1 h-1 rounded-full bg-red-600" />
              <span className="font-normal text-slate-700">القرب الدائم</span>
            </motion.div>
          </div>
          
          <div className="relative z-10 w-full max-w-[140px] pt-4 flex flex-col items-center">
            <div 
              role="progressbar" 
              aria-busy="true" 
              className="w-full bg-slate-200/60 h-1 rounded-full overflow-hidden relative"
            >
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-600 to-transparent" 
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SplashScreen.displayName = 'SplashScreen';
export default SplashScreen;
