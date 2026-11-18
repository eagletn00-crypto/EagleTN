// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, CheckCircle, Navigation, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '@eagletn/types';

export const DriverTracking: React.FC<{ order?: Order }> = ({ order }) => {
  const navigate = useNavigate();
  const [slideProgress, setSlideProgress] = useState(0);
  const [status, setStatus] = useState<'on_way' | 'arrived'>('on_way');

  const activeOrder = order || {
    id: 'EAG-4091-DEV',
    client_id: 'client-123',
    client_name: 'Ahmed Ben Salah',
    client_phone: '21 345 678',
    delivery_address: 'Avenue Habib Bourguiba, Tunis',
    status: 'on_way',
    partner_id: 'partner-123',
    subtotal: 35.000,
    delivery_fee: 2.500,
    service_fee: 0.500,
    total_amount: 38.000,
    items: [],
  } as Order;

  const handleSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSlideProgress(value);
    
    if (value > 90) {
      setSlideProgress(100);
      if (status === 'on_way') {
        setStatus('arrived');
        setTimeout(() => setSlideProgress(0), 1000);
      } else {
        // Validation logic would go here
        navigate('/orders');
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] isolate font-sans selection:bg-[#A37836] selection:text-white pb-32">
      {/* Map Area Placeholder */}
      <div className="w-full h-[45dvh] bg-stone-200 relative isolate">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="w-12 h-12 text-stone-400 opacity-50" />
        </div>
        <div className="absolute top-4 left-4 z-20">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-stone-900 border border-white/20"
          >
            <span className="font-bold text-lg leading-none -mt-0.5">&larr;</span>
          </button>
        </div>
      </div>

      {/* Order Details Sheet */}
      <div className="relative -mt-6 bg-white rounded-t-[2rem] shadow-[0_-12px_40px_rgba(0,0,0,0.04)] px-5 pt-6 pb-8 border-t border-stone-100 z-30">
        <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-6" />
        
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">{activeOrder.client_name}</h2>
            <p className="text-[13px] font-bold text-stone-400 mt-1">{activeOrder.delivery_address}</p>
          </div>
          <div className="bg-[#FAF9F6] px-3 py-1.5 rounded-[1rem] border border-stone-100 shadow-sm flex items-center gap-1.5">
            <span className="text-[14px] font-extrabold text-[#A37836] tabular-nums">
              {Number(activeOrder.total_amount).toFixed(3)} DT
            </span>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <button className="flex-1 h-12 bg-[#FAF9F6] border border-stone-100 rounded-[1.5rem] flex items-center justify-center gap-2 text-stone-700 shadow-sm hover:bg-stone-50 transition-colors">
            <Phone className="w-4 h-4 stroke-[2.5]" />
            <span className="text-[13px] font-bold">Appeler</span>
          </button>
          <button className="flex-1 h-12 bg-[#FAF9F6] border border-stone-100 rounded-[1.5rem] flex items-center justify-center gap-2 text-stone-700 shadow-sm hover:bg-stone-50 transition-colors">
            <MessageCircle className="w-4 h-4 stroke-[2.5]" />
            <span className="text-[13px] font-bold">Message</span>
          </button>
        </div>

        {/* Action Slider */}
        <div className="relative w-full h-16 bg-stone-100 rounded-[2rem] overflow-hidden shadow-inner border border-stone-200/50">
          <div 
            className="absolute top-0 left-0 h-full bg-[#A37836]/10" 
            style={{ width: `${slideProgress}%` }} 
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[13px] font-black text-stone-500 uppercase tracking-[0.15em]">
              {status === 'on_way' ? 'Glisser pour Arrivé' : 'Glisser pour Livré'}
            </span>
          </div>
          
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={slideProgress} 
            onChange={handleSlide}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
          
          <motion.div 
            className="absolute top-1 bottom-1 left-1 w-14 bg-white rounded-[1.5rem] shadow-md flex items-center justify-center pointer-events-none z-10 border border-stone-100"
            style={{ x: `calc(${slideProgress}% * (100vw - 3.5rem) / 100)` }}
            animate={{ x: `${slideProgress}%` }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {status === 'on_way' ? (
              <Navigation className="w-5 h-5 text-[#A37836] stroke-[2.5]" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-500 stroke-[2.5]" />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DriverTracking;
