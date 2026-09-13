import React from 'react';
import { motion } from 'framer-motion';
import { Check, Truck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderSuccessProps {
  orderId?: string;
}

export const OrderSuccessScreen: React.FC<OrderSuccessProps> = ({
  orderId = 'EAGLE-9821-TN',
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Success Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-24 h-24 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 border-4 border-slate-900 mb-8 z-10"
      >
        <Check className="w-12 h-12 text-white stroke-[3]" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="z-10 max-w-sm"
      >
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">
          Commande Confirmée !
        </h1>
        <p className="text-emerald-400 font-bold text-sm mb-6">
          تم تأكيد طلبك بنجاح
        </p>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl mb-8 shadow-inner">
          <span className="text-xs text-slate-400 block font-medium">رقم الطلب / N° de commande</span>
          <span className="text-base font-extrabold text-slate-200 tracking-wider font-mono">{orderId}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/tracking')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all"
        >
          <Truck className="w-5 h-5" />
          <span>Suivre la Livraison • تتبع الطلب</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OrderSuccessScreen;
