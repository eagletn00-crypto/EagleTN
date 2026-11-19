import React, { useEffect, useState } from 'react';
import { X, UserPlus, ShieldCheck, Lock, Unlock, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface DriverWallet {
  driver_id: string;
  cash_in_hand: number;
  commission_debt: number;
  max_cash_limit: number;
  is_locked: boolean;
  updated_at: string;
}

export default function DriversModal({ onClose }: { onClose: () => void }) {
  const [wallets, setWallets] = useState<DriverWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [maxCashLimit, setMaxCashLimit] = useState('200');

  const fetchDrivers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wallets')
      .select('profile_id, current_cash_balance, total_earnings, max_cash_threshold, is_frozen, updated_at')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setWallets(
        (data as any[]).map((w) => ({
          driver_id: w.profile_id,
          cash_in_hand: Number(w.current_cash_balance ?? 0),
          commission_debt: 0,
          max_cash_limit: Number(w.max_cash_threshold ?? 200),
          is_locked: Boolean(w.is_frozen),
          updated_at: w.updated_at,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-driver', {
        body: {
          full_name: fullName,
          email,
          phone,
          password,
          max_cash_limit: Number(maxCashLimit) || 200,
        },
      });

      if (error || data?.error) {
        throw new Error(data?.error || error?.message || 'Erreur lors de la création');
      }

      setFeedback({
        type: 'success',
        text: `Coursier créé et activé (${data.driver.email}) — Plafond: ${Number(data.driver.max_cash_limit).toFixed(3)} TND`,
      });
      setFullName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setMaxCashLimit('200');
      await fetchDrivers();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLock = async (wallet: DriverWallet) => {
    const { error } = await supabase
      .from('wallets')
      .update({ is_frozen: !wallet.is_locked } as never)
      .eq('profile_id', wallet.driver_id);

    if (!error) {
      setWallets((prev) =>
        prev.map((w) => (w.driver_id === wallet.driver_id ? { ...w, is_locked: !w.is_locked } : w))
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAFAFA] border border-slate-200/80 shadow-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Flotte Coursiers (إدارة السائقين)</h2>
            <p className="text-xs text-slate-500">Création sécurisée et contrôle des plafonds espèces</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateDriver} className="rounded-2xl bg-white border border-slate-200/70 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Nouveau Coursier (إضافة سائق جديد)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Nom complet (الاسم الكامل)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
            <input
              type="tel"
              placeholder="Téléphone (+216 ...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
            <input
              type="email"
              required
              placeholder="Email de connexion"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Mot de passe temporaire (6+ car.)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
            <input
              type="number"
              step="10"
              min="0"
              placeholder="Plafond Cash (TND)"
              value={maxCashLimit}
              onChange={(e) => setMaxCashLimit(e.target.value)}
              className="rounded-xl bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-slate-900 text-white text-sm font-medium py-2 px-4 hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {submitting ? 'Création en cours...' : 'Créer & Activer le Coursier'}
            </button>
          </div>

          {feedback && (
            <div
              className={`rounded-xl px-3 py-2 text-xs font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {feedback.text}
            </div>
          )}
        </form>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              Portefeuilles Actifs ({wallets.length})
            </h3>
            <button
              onClick={fetchDrivers}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Actualiser
            </button>
          </div>

          {loading ? (
            <div className="text-center py-6 text-xs text-slate-400">Chargement...</div>
          ) : wallets.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-2xl border border-slate-200/70">
              Aucun coursier enregistré.
            </div>
          ) : (
            <div className="space-y-2">
              {wallets.map((w) => (
                <div
                  key={w.driver_id}
                  className="flex items-center justify-between rounded-2xl bg-white border border-slate-200/70 p-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-mono text-slate-700">{w.driver_id.slice(0, 12)}...</p>
                    <p className="text-xs text-slate-500">
                      Cash: <strong className="text-slate-800">{Number(w.cash_in_hand).toFixed(3)} TND</strong> ·
                      Plafond: <strong className="text-slate-800">{Number(w.max_cash_limit).toFixed(3)} TND</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => toggleLock(w)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      w.is_locked
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {w.is_locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    {w.is_locked ? 'Suspendu' : 'Actif'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
