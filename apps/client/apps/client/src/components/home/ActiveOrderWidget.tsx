import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Navigation, ChefHat, CheckCircle2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// STRICT TYPING BASED ON SUPABASE SCHEMA
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled';

interface ActiveOrderWidgetProps {
  orderId: string;
  status: OrderStatus;
  partnerName: string;
  estimatedTime?: string;
}

const ActiveOrderWidget: React.FC<ActiveOrderWidgetProps> = memo(({
  orderId,
  status,
  partnerName,
  estimatedTime = "Calcul en cours..."
}) => {
  const navigate = useNavigate();

  // Dynamic UI State Machine based on Supabase order.status
  const stateConfig = useMemo(() => {
    switch (status) {
      case 'pending':
      case 'accepted':
        return {
          icon: <Package className="w-5 h-5 text-stone-900" />,
          title: 'Commande reçue',
          subtitle: 'En attente de confirmation',
          bgClass: 'bg-white',
          textClass: 'text-stone-900',
          pulse: false
        };
      case 'preparing':
      case 'ready':
        return {
          icon: <ChefHat className="w-5 h-5 text-white" />,
          title: 'En préparation',
          subtitle: partnerName,
          bgClass: 'bg-[#A37836]', // Brand Gold
          textClass: 'text-white',
          pulse: true
        };
      case 'picked_up':
      case 'on_the_way':
        return {
          icon: <Navigation className="w-5 h-5 text-white" />,
          title: 'En route vers vous',
          subtitle: `Arrive dans ${estimatedTime}`,
          bgClass: 'bg-stone-900', // Dark Mode Island
          textClass: 'text-white',
          pulse: true
        };
      case 'delivered':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-white" />,
          title: 'Livrée avec succès',
          subtitle: 'Bon appétit !',
          bgClass: 'bg-[#E71F27]', // Brand Red
          textClass: 'text-white',
          pulse: false
        };
      default:
        return null;
    }
  }, [status, partnerName, estimatedTime]);

  if (!stateConfig || status === 'cancelled') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      onClick={() => navigate(`/order/track/${orderId}`)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full ${stateConfig.bgClass} rounded-[1.5rem] p-4 flex items-center justify-between shadow-[0_12px_32px_rgba(0,0,0,0.12)] cursor-pointer overflow-hidden relative isolate transition-colors duration-500`}
    >
      {/* Subtle Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50 pointer-events-none"></div>
      
      <div className="flex items-center gap-3 z-10">
        <div className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner ${stateConfig.pulse ? 'animate-pulse' : ''}`}>
           {stateConfig.icon}
        </div>
        <div className="flex flex-col">
          <span className={`text-[11px] font-bold opacity-80 uppercase tracking-widest ${stateConfig.textClass}`}>
            {stateConfig.title}
          </span>
          <span className={`text-[14px] font-black truncate max-w-[180px] ${stateConfig.textClass}`}>
            {stateConfig.subtitle}
          </span>
        </div>
      </div>
      
      <ChevronRight className={`w-5 h-5 opacity-50 z-10 ${stateConfig.textClass}`} strokeWidth={2.5} />
    </motion.div>
  );
});

export default ActiveOrderWidget;
