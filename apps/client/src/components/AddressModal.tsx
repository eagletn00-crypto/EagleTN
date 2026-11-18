import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useCartStore } from '../store/useCartStore';

export interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose }) => {
  const setAddress = useCartStore((state) => state.setAddress);
  
  const [quartier, setQuartier] = useState('');
  const [rue, setRue] = useState('');
  const [immeuble, setImmeuble] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');

  const handleCaptureGPS = async () => {
    try {
      setGpsStatus('locating');
      await Haptics.impact({ style: ImpactStyle.Light });
      await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      setGpsStatus('success');
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.warn("GPS Capture failed", error);
      setGpsStatus('error');
    }
  };

  const handleSave = async () => {
    if (!quartier || !rue) return;
    await Haptics.impact({ style: ImpactStyle.Medium });
    
    const formattedAddress = [quartier, rue, immeuble].filter(Boolean).join(', ');
    setAddress(formattedAddress);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-end justify-center">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-t-[2rem] z-[1000] flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="p-5 border-b border-[#1C1917]/10 flex items-center justify-between bg-[#FFFFFF]">
          <h3 className="text-[17px] font-black text-[#141413] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#C59648]" />
            Adresse de Livraison
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center border border-[#1C1917]/10 outline-none">
            <X className="w-4 h-4 text-[#141413]" />
          </button>
        </div>
        
        <div className="p-5 bg-[#FFFFFF] flex flex-col gap-4">
          <button 
            onClick={handleCaptureGPS}
            className={`w-full h-12 rounded-xl border flex items-center justify-center gap-2 text-[13px] font-bold transition-colors outline-none ${
              gpsStatus === 'success' 
                ? 'bg-[#059669]/10 border-[#059669]/20 text-[#059669]' 
                : gpsStatus === 'error'
                ? 'bg-[#FFF1F2] border-[#E70013]/20 text-[#E70013]'
                : 'bg-[#FAF8F5] border-[#1C1917]/10 text-[#141413]'
            }`}
          >
            {gpsStatus === 'locating' ? <Navigation className="w-4 h-4 animate-pulse" /> : 
             gpsStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
             gpsStatus === 'error' ? <AlertCircle className="w-4 h-4" /> : <Navigation className="w-4 h-4 text-[#C59648]" />}
            {gpsStatus === 'locating' ? 'Localisation en cours...' : 
             gpsStatus === 'success' ? 'Position GPS capturée' :
             gpsStatus === 'error' ? 'Erreur GPS - Activez la position' : 'Utiliser ma position GPS'}
          </button>

          <div className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Cité / Quartier (ex: Ennasr 2)" 
              value={quartier}
              onChange={(e) => setQuartier(e.target.value)}
              className="w-full h-12 px-4 bg-[#FAF8F5] rounded-xl text-[14px] font-bold text-[#141413] outline-none border border-[#1C1917]/10 focus:border-[#C59648] placeholder:text-[#A8A29E]" 
            />
            <input 
              type="text" 
              placeholder="Rue / Avenue" 
              value={rue}
              onChange={(e) => setRue(e.target.value)}
              className="w-full h-12 px-4 bg-[#FAF8F5] rounded-xl text-[14px] font-bold text-[#141413] outline-none border border-[#1C1917]/10 focus:border-[#C59648] placeholder:text-[#A8A29E]" 
            />
            <input 
              type="text" 
              placeholder="Immeuble, Résidence, Étage (Optionnel)" 
              value={immeuble}
              onChange={(e) => setImmeuble(e.target.value)}
              className="w-full h-12 px-4 bg-[#FAF8F5] rounded-xl text-[14px] font-bold text-[#141413] outline-none border border-[#1C1917]/10 focus:border-[#C59648] placeholder:text-[#A8A29E]" 
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={!quartier || !rue}
            className="w-full h-14 bg-[#141413] text-[#FFFFFF] rounded-xl font-bold text-[15px] mt-2 flex items-center justify-center shadow-lg disabled:opacity-50 outline-none transition-opacity"
          >
            Confirmer l'adresse
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default AddressModal;
