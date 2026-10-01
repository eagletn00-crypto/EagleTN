import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../utils/location';

export const FinancesTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalGross, setTotalGross] = useState<number>(0);
  const [commission, setCommission] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);

  const fetchFinances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        setError('Connexion serveur indisponible.');
        return;
      }

      const { data, error: fetchErr } = await supabase
        .from('orders')
        .select('total_amount, status')
        .in('status', ['delivered', 'ready_for_pickup', 'on_the_way']);

      if (fetchErr) throw fetchErr;

      const gross = data?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;
      const comm = gross * 0.10;
      const net = gross - comm;

      setTotalGross(gross);
      setCommission(comm);
      setNetAmount(net);
    } catch (err: any) {
      console.error('[FinancesTab] Error:', err);
      setError(err.message || 'Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinances();
  }, [fetchFinances]);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4 font-sans text-slate-900 pb-32">
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black">Audit Financier Live</h1>
            <p className="text-xs text-slate-500 font-semibold">Bilan comptable certifié - EAGLE TN</p>
          </div>
        </div>
        <button
          onClick={fetchFinances}
          disabled={loading}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Chiffre d'Affaires Brut</span>
          <span className="text-lg font-black text-slate-900">
            {totalGross.toFixed(3)} <span className="text-xs text-slate-500 font-bold">DT</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-amber-600 block mb-1">Commission EAGLE (10%)</span>
          <span className="text-lg font-black text-amber-700">
            -{commission.toFixed(3)} <span className="text-xs text-amber-600 font-bold">DT</span>
          </span>
        </div>

        <div className="bg-emerald-600 text-white p-4 rounded-3xl shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-100 block mb-1">Solde Net À Verser</span>
          <span className="text-xl font-black">
            {netAmount.toFixed(3)} <span className="text-xs text-emerald-200 font-bold">DT</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancesTab;
