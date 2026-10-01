import React, { useState, useEffect, useCallback } from 'react';
import { Package, Search, CheckCircle2, XCircle, Utensils, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../utils/location';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_available: boolean;
  category_id?: string;
  image_url?: string;
}

export const StockageTab: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        setError('Connexion serveur indisponible.');
        return;
      }

      const { data, error: fetchErr } = await supabase
        .from('menu_items')
        .select('*')
        .order('name', { ascending: true });

      if (fetchErr) throw fetchErr;

      setItems(data || []);
    } catch (err: any) {
      console.error('[StockageTab] Error fetching menu:', err);
      setError(err.message || 'Erreur lors du chargement de la carte.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;

    // Optimistic UI Update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_available: nextStatus } : item))
    );

    try {
      if (!supabase) return;

      const { error: updateErr } = await supabase
        .from('menu_items')
        .update({ is_available: nextStatus })
        .eq('id', id);

      if (updateErr) throw updateErr;
    } catch (err: any) {
      console.error('[StockageTab] Error updating status:', err);
      // Revert back on error
      fetchMenu();
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 font-sans text-slate-900 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 text-slate-800 rounded-2xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black">Gestion des Stocks & Carte</h1>
            <p className="text-xs text-slate-500 font-semibold">Base de données en direct - EAGLE TN</p>
          </div>
        </div>
        <button
          onClick={fetchMenu}
          disabled={loading}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error Bar */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Field */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher un plat, boisson, article..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-2xs"
        />
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-slate-400">
          Chargement du menu en direct...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-3xl border border-slate-200/80 p-6">
          <Utensils className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold text-slate-600">Aucun produit disponible dans la base</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredItems.map((item) => {
            const available = item.is_available ?? true;
            return (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Utensils className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{item.name}</h3>
                    <p className="text-[11px] font-black text-slate-700 mt-0.5">
                      {Number(item.price).toFixed(3)} <span className="text-[10px] text-slate-400 font-normal">DT</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleAvailability(item.id, available)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    available
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-100'
                  }`}
                >
                  {available ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Disponible</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Épuisé</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StockageTab;
