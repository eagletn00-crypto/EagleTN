import React, { useState, useEffect } from 'react';
import { Store, Clock, Phone, MapPin, CheckCircle, ShieldCheck, Power, Loader2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface PartnerSettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  opening_time: string;
  closing_time: string;
  is_active: boolean;
  is_featured: boolean;
}

export const ParametresTab: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [partner, setPartner] = useState<PartnerSettings>(() => {
    // Restore cached active state instantly if exists
    const cachedActive = localStorage.getItem('partner_is_active');
    return {
      id: localStorage.getItem('partner_id') || '',
      name: 'Chez Am Ali',
      address: 'Rue El Gharbi El Issaoui, Cité Ibn Khaldoun, Tunis',
      phone: '+216 98 000 000',
      opening_time: '08:00',
      closing_time: '23:00',
      is_active: cachedActive !== null ? cachedActive === 'true' : true,
      is_featured: true,
    };
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);

      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Fetch error:', error.message);
        setStatusMessage({ type: 'error', text: `Erreur: ${error.message}` });
        return;
      }

      if (data && data.id) {
        const activeStatus = data.is_active ?? true;
        localStorage.setItem('partner_id', data.id);
        localStorage.setItem('partner_is_active', String(activeStatus));

        setPartner({
          id: data.id,
          name: data.name || 'Chez Am Ali',
          address: data.address || 'Rue El Gharbi El Issaoui, Tunis',
          phone: data.phone || '+216 98 000 000',
          opening_time: data.opening_time ? String(data.opening_time).slice(0, 5) : '08:00',
          closing_time: data.closing_time ? String(data.closing_time).slice(0, 5) : '23:00',
          is_active: activeStatus,
          is_featured: data.is_featured ?? true,
        });
      }
    } catch (err: any) {
      console.error('Error fetching partner:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStoreStatus = async () => {
    if (!partner.id) {
      setStatusMessage({ type: 'error', text: 'Impossible de modifier: ID manquant.' });
      return;
    }

    const newStatus = !partner.is_active;

    // Update state & LocalStorage immediately
    setPartner((prev) => ({ ...prev, is_active: newStatus }));
    localStorage.setItem('partner_is_active', String(newStatus));

    try {
      // FORCE select() after update to ensure DB commit verification
      const { data, error } = await supabase
        .from('partners')
        .update({ is_active: newStatus })
        .eq('id', partner.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        console.warn('Update did not return rows. Checking RLS/WHERE policy.');
      }

      setStatusMessage({
        type: 'success',
        text: newStatus ? 'Établissement actuellement OUVERT en ligne.' : 'Établissement actuellement FERMÉ.',
      });
    } catch (err: any) {
      // Revert state on actual failure
      const revertedStatus = !newStatus;
      setPartner((prev) => ({ ...prev, is_active: revertedStatus }));
      localStorage.setItem('partner_is_active', String(revertedStatus));
      setStatusMessage({ type: 'error', text: `Erreur: ${err.message || 'Échec de la sauvegarde'}` });
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!partner.id) {
      setStatusMessage({ type: 'error', text: 'Sauvegarde impossible: ID introuvable.' });
      return;
    }

    try {
      setSaving(true);
      setStatusMessage(null);

      const { error } = await supabase
        .from('partners')
        .update({
          name: partner.name,
          address: partner.address,
          phone: partner.phone,
          opening_time: partner.opening_time,
          closing_time: partner.closing_time,
        })
        .eq('id', partner.id)
        .select();

      if (error) throw error;

      setStatusMessage({ type: 'success', text: 'Paramètres mis à jour avec succès.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Erreur: ${err.message || 'Échec de la sauvegarde'}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
        <p className="text-xs font-medium text-gray-500">Chargement de la configuration...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen pb-28">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{partner.name}</h2>
              <p className="text-xs text-gray-500 line-clamp-1">{partner.address}</p>
            </div>
          </div>
          {partner.is_featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Certifié
            </span>
          )}
        </div>
      </div>

      {/* Control Status Card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Réception des commandes</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {partner.is_active
                ? 'Votre établissement est visible en ligne sur EAGLE TN'
                : 'Votre établissement est actuellement hors ligne'}
            </p>
          </div>
          <button
            onClick={toggleStoreStatus}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              partner.is_active
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-700'
                : 'bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200'
            }`}
          >
            <Power className="w-4 h-4" />
            {partner.is_active ? 'Ouvert' : 'Fermé'}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium mb-4 flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Form Settings */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            Horaires d'ouverture (Ouverture - Fermeture)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="time"
              value={partner.opening_time}
              onChange={(e) => setPartner((prev) => ({ ...prev, opening_time: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 font-medium"
            />
            <input
              type="time"
              value={partner.closing_time}
              onChange={(e) => setPartner((prev) => ({ ...prev, closing_time: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            Téléphone Direct
          </label>
          <input
            type="text"
            value={partner.phone}
            onChange={(e) => setPartner((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 font-medium"
            placeholder="+216 98 000 000"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            Adresse Physique du Local
          </label>
          <input
            type="text"
            value={partner.address}
            onChange={(e) => setPartner((prev) => ({ ...prev, address: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 font-medium"
            placeholder="Adresse complète"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full mt-2 bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mise à jour en cours...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Mettre à jour les Paramètres
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ParametresTab;
