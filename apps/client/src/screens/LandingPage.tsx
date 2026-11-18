import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight, Compass } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export interface LandingPageProps {
  onSelectRole: (role: 'client' | 'guest') => void;
}

// 🦅 النسر السيادي
const EagleLogo: React.FC = memo(() => (
  <div className="relative flex flex-col items-center justify-center">
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.15, 0.05] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute inset-0 rounded-full bg-[#C1121F] blur-3xl pointer-events-none"
    />
    <svg width="90" height="90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-[0_8px_16px_rgba(193,18,31,0.15)]">
      <path d="M12 1.5L2 7.5L5.5 11.5L12 22L18.5 11.5L22 7.5L12 1.5Z" fill="#1C1917"/>
      <path d="M12 6L8.5 9L12 12.5L15.5 9L12 6Z" fill="#FAF8F5"/>
      <path d="M12 14.5L9.5 11L5 12.5L12 19.5V14.5Z" fill="#C1121F"/>
      <path d="M12 14.5L14.5 11L19 12.5L12 19.5V14.5Z" fill="#C1121F"/>
    </svg>
  </div>
));
EagleLogo.displayName = 'EagleLogo';

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  
  const handleSelect = async (role: 'client' | 'guest') => {
    try { await Haptics.impact({ style: role === 'client' ? ImpactStyle.Heavy : ImpactStyle.Light }); } catch(e) {}
    onSelectRole(role);
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between p-6 relative overflow-hidden font-sans selection:bg-[#C1121F]/20">
      
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

      {/* HEADER & BRANDING */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center mt-[12vh] space-y-6 relative z-10"
      >
        <EagleLogo />
        
        <div className="space-y-1.5 flex flex-col items-center">
          <h1 className="text-[38px] font-black tracking-tighter leading-none text-[#1C1917]">
            EAGLE<span className="text-[#C1121F] ml-0.5">TN</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
              Platforme Logistique
            </span>
          </div>
        </div>

        <div className="pt-4 flex flex-col items-center gap-1.5">
          <p className="text-[13px] font-bold text-[#1C1917] uppercase tracking-wide">
            Livraison sécurisée & rapide
          </p>
          <p className="text-[14px] font-bold text-gray-500 font-arabic">
            توصيل آمن، سري، سريع
          </p>
        </div>
      </motion.div>

      {/* ACTION BUTTONS (The Conversion Funnel) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-4 relative z-10 mb-8 max-w-sm mx-auto w-full"
      >
        {/* Primary Action: Login/Register */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect('client')}
          className="w-full h-[60px] bg-[#1C1917] text-white rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all flex items-center justify-between px-6 outline-none border border-white/10 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
              <User className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-black tracking-wide uppercase leading-none">Se Connecter</span>
              <span className="text-[10px] font-bold text-gray-400 mt-1">تسجيل الدخول / إنشاء حساب</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors relative z-10" strokeWidth={2.5} />
        </motion.button>

        {/* Secondary Action: Guest Mode */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect('guest')}
          className="w-full h-[56px] bg-white text-[#1C1917] font-black rounded-full border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-2 outline-none hover:bg-gray-50"
        >
          <Compass className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
          <span className="text-[12px] uppercase tracking-wider mt-0.5">Continuer sans compte</span>
        </motion.button>

        <p className="text-[11px] text-center font-bold text-gray-400 pt-2 px-4 leading-relaxed font-arabic">
          التصفح كزائر يتيح لك استكشاف المأكولات والمطاعم قبل التسجيل.
        </p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
