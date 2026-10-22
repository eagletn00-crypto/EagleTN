import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import { usePartnerDashboardData } from '../../hooks/usePartnerDashboardData';

interface OrderRecord {
  id: string;
  created_at: string;
  total_amount: number;
  platform_fee: number;
  payment_method: 'COD' | 'Card';
  change_needed_for?: number | null;
  status: string;
}

export default function FinancesTab() {
  const { partner } = usePartnerDashboardData();
  const [ledger, setLedger] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFinancials = useCallback(async () => {
    if (!partner?.id) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, total_amount, platform_fee, payment_method, change_needed_for, status')
        .eq('partner_id', partner.id)
        .order('created_at', { ascending: false })
        .limit(50); // Protection de la mémoire Termux

      if (error) throw error;
      setLedger((data as OrderRecord[]) || []);
    } catch (err) {
      console.error("[EAGLE TN] Erreur de lecture des métriques financières:", err);
    } finally {
      setIsLoading(false);
    }
  }, [partner?.id]);

  useEffect(() => {
    fetchFinancials();
  }, [fetchFinancials]);

  // Agrégation stricte sur les champs de la base de données
  const metrics = ledger.reduce((acc, curr) => ({
    gross: acc.gross + (curr.total_amount || 0),
    fees: acc.fees + (curr.platform_fee || 0),
  }), { gross: 0, fees: 0 });

  const netRevenue = metrics.gross - metrics.fees;

  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] bg-[#E9EBEF] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] border-t-stone-800 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#E9EBEF] p-4 text-[#2D3142] pb-24 space-y-6">
      <h2 className="text-xl font-black tracking-tight text-stone-800 mb-2">Synthèse Financière</h2>

      <div className="space-y-5">
        <div className="w-full p-6 rounded-3xl bg-[#E9EBEF] shadow-[8px_8px_16px_#c8cad0,-8px_-8px_16px_#ffffff] flex flex-col">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Chiffre d'Affaires Brut</span>
          <span className="text-3xl font-black text-stone-800">{metrics.gross.toFixed(3)} <span className="text-lg">DT</span></span>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="p-5 rounded-3xl bg-[#E9EBEF] shadow-[8px_8px_16px_#c8cad0,-8px_-8px_16px_#ffffff] flex flex-col">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Commission Eagle TN</span>
            <span className="text-xl font-black text-rose-600">-{metrics.fees.toFixed(3)} <span className="text-sm">DT</span></span>
          </div>

          <div className="p-5 rounded-3xl bg-[#E9EBEF] shadow-[8px_8px_16px_#c8cad0,-8px_-8px_16px_#ffffff] ring-1 ring-emerald-500/20 flex flex-col relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-400/10 rounded-full blur-xl"></div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">Revenu Net</span>
            <span className="text-xl font-black text-emerald-600">{netRevenue.toFixed(3)} <span className="text-sm">DT</span></span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Historique des Transactions</h3>
        <div className="space-y-4">
          {ledger.map((tx) => (
            <div key={tx.id} className="p-4 rounded-2xl bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-stone-800 text-sm">{tx.id.split('-')[0].toUpperCase()}</div>
                  <div className="text-[10px] font-medium text-stone-500">{new Date(tx.created_at).toLocaleString('fr-TN')}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-600">{(tx.total_amount || 0).toFixed(3)} DT</div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${tx.payment_method === 'COD' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {tx.payment_method}
                  </div>
                </div>
              </div>
              
              {tx.payment_method === 'COD' && tx.change_needed_for && (
                <div className="flex items-center gap-2 bg-[#E9EBEF] p-2 rounded-xl shadow-[2px_2px_4px_#c8cad0,-2px_-2px_4px_#ffffff]">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-xs font-semibold text-stone-600">
                    Prévoir monnaie sur : <span className="text-amber-700 font-black">{tx.change_needed_for.toFixed(3)} DT</span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
