import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';

export interface OrderTrackingScreenProps {
  orderId?: string;
  onBackToHome?: () => void;
  onBack?: () => void;
}

export function OrderTrackingScreen({
  orderId = 'ORD-961829',
  onBackToHome,
  onBack
}: OrderTrackingScreenProps) {
  const handleBack = onBackToHome || onBack || (() => {});
  const [liveOrderData, setLiveOrderData] = useState<any>(null);

  useEffect(() => {
    async function fetchRealOrder() {
      try {
        const { data } = await supabase
          .from('orders')
          .select(`*, profiles:driver_id(full_name, phone, avatar_url)`)
          .eq('id', orderId)
          .single();
        if (data) setLiveOrderData(data);
      } catch (err) {
        console.log('Fallback simulation', err);
      }
    }
    fetchRealOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12" dir="ltr">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3.5 flex items-center justify-between shadow-sm">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all border border-slate-200/60"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-center">
          <span className="text-xs font-black text-slate-900 font-mono">{orderId}</span>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">SUIVI EN TEMPS RÉEL</p>
        </div>
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all border border-slate-200/60"
        >
          <Home size={17} />
        </button>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase">Total à payer</p>
              <h3 className="text-base font-black font-mono text-white">
                {liveOrderData?.total_amount || '14.000'} <span className="text-xs text-emerald-400">DT</span>
              </h3>
            </div>
          </div>
          <span className="text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-xl text-slate-200">ESPÈCES (COD)</span>
        </div>
      </div>
    </div>
  );
}

export default OrderTrackingScreen;
