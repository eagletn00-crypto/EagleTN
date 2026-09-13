import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { formatDT } from '../utils/formatters';
import {
  Wallet,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download
} from 'lucide-react';

export interface PayoutRecord {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  reference?: string;
  payout_method?: string;
}

interface PartnerFinancesProps {
  partnerId?: string;
}

export const PartnerFinances: React.FC<PartnerFinancesProps> = ({ partnerId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('week');
  
  // High-level Metrics
  const [totalGross, setTotalGross] = useState<number>(0);
  const [platformCommission, setPlatformCommission] = useState<number>(0);
  const [netBalance, setNetBalance] = useState<number>(0);

  // Payout History
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [isRequestingPayout, setIsRequestingPayout] = useState<boolean>(false);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders for calculations
      let query = supabase
        .from('orders')
        .select('total_amount, total, status, created_at')
        .eq('status', 'delivered');

      if (partnerId) {
        query = query.eq('partner_id', partnerId);
      }

      // Date Filtering Logic
      const now = new Date();
      if (period === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        query = query.gte('created_at', startOfDay);
      } else if (period === 'week') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', sevenDaysAgo);
      } else if (period === 'month') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', thirtyDaysAgo);
      }

      const { data: ordersData, error: ordersError } = await query;

      if (!ordersError && ordersData) {
        const gross = ordersData.reduce((acc: number, curr: any) => acc + (curr.total_amount || curr.total || 0), 0);
        const commissionRate = 0.15; // 15% Platform Commission
        const comm = gross * commissionRate;
        const net = gross - comm;

        setTotalGross(gross);
        setPlatformCommission(comm);
        setNetBalance(net);
      }

      // 2. Fetch Payout History
      let payoutQuery = supabase
        .from('payouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (partnerId) {
        payoutQuery = payoutQuery.eq('partner_id', partnerId);
      }

      const { data: payoutsData } = await payoutQuery;
      if (payoutsData) {
        setPayouts(payoutsData as PayoutRecord[]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des finances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [partnerId, period]);

  const handleRequestPayout = async () => {
    if (netBalance <= 0) {
      alert("Votre solde net est insuffisant pour effectuer un virement.");
      return;
    }

    setIsRequestingPayout(true);
    try {
      const { error } = await supabase.from('payouts').insert([
        {
          partner_id: partnerId,
          amount: netBalance,
          status: 'pending',
          payout_method: 'Virement Bcaire / Flouci',
          created_at: new Date().toISOString()
        }
      ]);

      if (!error) {
        alert("Demande de virement envoyée avec succès !");
        fetchFinancialData();
      } else {
        alert(`Erreur: ${error.message}`);
      }
    } catch (err: any) {
      alert(`Erreur: ${err.message || err}`);
    } finally {
      setIsRequestingPayout(false);
    }
  };

  return (
    <div dir="ltr" className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif] p-4 md:p-8 pb-28 text-slate-900">
      {/* Header Controller */}
      <div className="max-w-6xl mx-auto mb-8 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center font-black">
            <Wallet className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-slate-950 text-xl tracking-tight">Finances & Recouvrement</h1>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> COD & VIREMENTS
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Suivi détaillé des ventes en espèces et des virements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFinancialData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'today', label: "Aujourd'hui" },
          { key: 'week', label: 'Cette Semaine' },
          { key: 'month', label: 'Ce Mois' },
          { key: 'all', label: 'Tout le Temps' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPeriod(tab.key as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
              period === tab.key
                ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                : 'bg-slate-50/80 text-slate-600 border-slate-200/60 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Stats Summary Cards */}
      <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Cash Encaissé */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Encaissements (COD)</span>
            <span className="p-2 bg-slate-50 text-slate-700 rounded-xl">
              <TrendingUp size={16} />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-950 tracking-tight">{formatDT(totalGross)}</p>
          <p className="text-[11px] font-semibold text-slate-400">Chiffre d'affaires brut généré</p>
        </div>

        {/* Commission Plateforme */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Commission EAGLE (15%)</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Receipt size={16} />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-950 tracking-tight">{formatDT(platformCommission)}</p>
          <p className="text-[11px] font-semibold text-amber-600/80">Frais de service plateforme</p>
        </div>

        {/* Solde Net À Encaisser */}
        <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(16,185,129,0.2)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">Solde Net Restant</span>
              <span className="p-2 bg-white/10 text-white rounded-xl backdrop-blur-md">
                <Wallet size={16} />
              </span>
            </div>
            <p className="text-3xl font-black tracking-tight mt-2">{formatDT(netBalance)}</p>
          </div>

          <button
            onClick={handleRequestPayout}
            disabled={isRequestingPayout || netBalance <= 0}
            className="w-full py-3 bg-white hover:bg-slate-50 text-emerald-700 font-black text-xs rounded-2xl transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ArrowUpRight size={16} />
            <span>{isRequestingPayout ? 'Traitement...' : 'Demander le Virement'}</span>
          </button>
        </div>
      </div>

      {/* Payouts History Section */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={14} />
            <span>Historique des Virements et Demandes</span>
          </h2>

          <button className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer">
            <Download size={14} />
            <span>Exporter Rapport</span>
          </button>
        </div>

        {loading ? (
          <div className="h-40 bg-slate-50 animate-pulse rounded-3xl border border-slate-100" />
        ) : payouts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-2">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-black text-slate-800 text-sm">Aucun virement enregistré</p>
            <p className="text-xs text-slate-400">Les demandes de virement effectuées s'afficheront ici.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="p-4 pl-6">Moyen de Paiement</th>
                    <th className="p-4">Montant</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 pr-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-800">
                  {payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 font-black text-slate-900">
                        {p.payout_method || 'Virement Bancaire'}
                      </td>
                      <td className="p-4 font-black text-slate-950">{formatDT(p.amount)}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            p.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                              : p.status === 'pending'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                              : 'bg-rose-50 text-rose-600 border border-rose-200/60'
                          }`}
                        >
                          {p.status === 'completed' && <CheckCircle2 size={12} />}
                          {p.status === 'pending' && <Clock size={12} />}
                          {p.status === 'failed' && <AlertCircle size={12} />}
                          {p.status === 'completed'
                            ? 'Payé'
                            : p.status === 'pending'
                            ? 'En cours'
                            : 'Échoué'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right text-slate-400 font-semibold">
                        {new Date(p.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerFinances;
