import React, { memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface SplashScreenProps {
  isLoading: boolean;
  onReady?: () => void;
}

// 🦅 النسر السيادي مع ختم تونس
const SovereignEmblem: React.FC = memo(() => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0, y: 30 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ type: 'spring', damping: 20, stiffness: 140 }}
    className="relative flex flex-col items-center justify-center mb-6"
  >
    {/* Cinematic Glow (Ivory/Red Mix) */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute inset-0 rounded-full bg-[#C1121F]/15 blur-3xl pointer-events-none"
    />

    <div className="relative">
      {/* Eagle SVG (Ultra Clean) */}
      <svg width="110" height="110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_12px_24px_rgba(193,18,31,0.15)] relative z-10">
        <path d="M12 1.5L2 7.5L5.5 11.5L12 22L18.5 11.5L22 7.5L12 1.5Z" fill="#1C1917"/>
        <path d="M12 6L8.5 9L12 12.5L15.5 9L12 6Z" fill="#FAF8F5"/>
        <path d="M12 14.5L9.5 11L5 12.5L12 19.5V14.5Z" fill="#C1121F"/>
        <path d="M12 14.5L14.5 11L19 12.5L12 19.5V14.5Z" fill="#C1121F"/>
      </svg>
      
      {/* Tunisian Flag Badge (Minimalist) */}
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        transition={{ delay: 0.4, type: 'spring' }}
        className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full p-1 shadow-md border border-gray-100 z-20 flex items-center justify-center"
      >
        <svg viewBox="0 0 512 512" className="w-full h-full">
          <circle cx="256" cy="256" r="256" fill="#C1121F"/>
          <circle cx="256" cy="256" r="128" fill="#fff"/>
          <path d="M280.9,165.7c-50.6,0-91.8,40.6-92.4,91h0.2c0.6,49.8,41.2,90.2,91.2,91c-4.4,0.4-8.8,0.7-13.4,0.7c-53.5,0-96.8-43.3-96.8-96.8c0-53.5,43.3-96.8,96.8-96.8C271.7,154.9,276.4,155.2,280.9,165.7z" fill="#C1121F"/>
          <polygon points="274.6,220.1 298.8,247.9 261.9,247.7 284,271.6 257,250.7 291.6,236.4" fill="#C1121F"/>
        </svg>
      </motion.div>
    </div>
  </motion.div>
));
SovereignEmblem.displayName = 'SovereignEmblem';

export const SplashScreen: React.FC<SplashScreenProps> = memo(({ isLoading, onReady }) => {

  // تفعيل النبض اللمسي الذكي عند الإقلاع لإعطاء إحساس بـ "استيقاظ" التطبيق
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => { Haptics.impact({ style: ImpactStyle.Heavy }).catch(()=>{}); }, 300);
      setTimeout(() => { Haptics.impact({ style: ImpactStyle.Light }).catch(()=>{}); }, 800);
    }
  }, [isLoading]);

  return (
    <AnimatePresence onExitComplete={onReady}>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] w-full min-h-[100dvh] bg-[#FAF8F5] flex flex-col justify-between items-center overflow-hidden font-sans select-none px-6 py-12"
        >
          {/* Top Spacer */}
          <div className="h-10" />

          {/* THE CORE JUMP (القفزة المركزية) */}
          <div className="relative z-10 flex flex-col items-center text-center w-full">
            <SovereignEmblem />

            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-1 flex flex-col items-center"
            >
              <h1 className="text-[48px] font-black tracking-tighter leading-none text-[#1C1917]">
                EAGLE<span className="text-[#C1121F] ml-0.5">TN</span>
              </h1>
              
              <div className="flex items-center gap-2 mt-2 bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                <span className="text-[12px] font-black tracking-widest text-[#1C1917] uppercase">
                  L'excellence logistique
                </span>
                <span className="text-[14px]">🛵</span>
              </div>
            </motion.div>
          </div>

          {/* SMART WELCOME & LOYALTY (الترحيب والولاء) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full flex flex-col items-center gap-4 mb-4"
          >
            <div className="flex flex-col items-center gap-1 opacity-80">
              <span className="text-[13px] font-black text-[#1C1917] uppercase tracking-wide">
                Fiers de vous servir
              </span>
              <span className="text-[11px] font-bold text-gray-400 font-arabic tracking-wide">
                بكل فخر، تونسية
              </span>
            </div>

            {/* Smart Micro-Loader */}
            <div className="w-48 h-[3px] bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 w-1/2 bg-[#C1121F] rounded-full"
              />
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
});

SplashScreen.displayName = 'SplashScreen';
export default SplashScreen;
