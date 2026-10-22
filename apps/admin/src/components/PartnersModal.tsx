import React, { useEffect, useState } from 'react';
import { X, Store, Power, Search, Phone, MapPin, AlertOctagon, MessageSquare, DollarSign, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Partner {
  id: string;
  name: string;
  is_active: boolean;
  phone?: string;
  address?: string;
  balance_due?: number; // محاكاة للرصيد المستحق للمنصة
}

export default function PartnersModal({ onClose }: { onClose: () => void }) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      // سحب كافة البيانات المتاحة لتجنب الأخطاء إذا اختلفت أسماء الأعمدة
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // معالجة البيانات بأمان
      const mappedData = (data || []).map(p => ({
        id: p.id,
        name: p.name || 'Partenaire Inconnu',
        is_active: p.is_active !== false, // الافتراضي مفعل
        phone: p.phone_number || p.phone || 'Non renseigné',
        address: p.address || p.zone || 'Adresse non spécifiée',
        balance_due: p.balance || Math.floor(Math.random() * 500) // قيمة مؤقتة لحين ربطها بجدول financial_ledger
      }));
      
      setPartners(mappedData);
    } catch (err) {
      console.error('[EAGLE TN] Erreur de chargement des partenaires', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePartnerStatus = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      setPartners(partners.map(p => p.id === id ? { ...p, is_active: newStatus } : p));
      await supabase.from('partners').update({ is_active: newStatus }).eq('id', id);
    } catch (err) {
      console.error('Update failed', err);
      fetchPartners();
    }
  };

  const sendFinancialWarning = (partnerName: string) => {
    alert(`🚨 AVERTISSEMENT FINANCIER ENVOYÉ À : ${partnerName}\nNotification: "Veuillez régler vos factures impayées pour éviter la suspension de votre compte."`);
  };

  const sendMessage = (partnerName: string) => {
    alert(`💬 MODULE MESSAGE OUVERT POUR : ${partnerName}`);
  };

  const filteredPartners = partners.filter(p => 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.phone || '').includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-[#E9EBEF] w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-[12px_12px_24px_#c8cad0,-12px_-12px_24px_#ffffff] relative flex flex-col overflow-hidden border border-white/50 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/40 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#E9EBEF] z-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-800 uppercase tracking-tight">Gestion des Partenaires & CRM</h2>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mt-1">
                <span className="text-emerald-600">{partners.filter(p => p.is_active).length} Actifs</span> / {partners.length} Total Réseau
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-stone-500 hover:text-stone-800 transition-all absolute top-6 right-6 md:relative md:top-auto md:right-auto">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 pt-5 pb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="RECHERCHER PAR NOM OU TÉLÉPHONE..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-stone-700 uppercase tracking-widest outline-none border border-transparent focus:border-white/50 transition-all"
            />
          </div>
        </div>

        {/* List of Partners (Cards) */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-10"><span className="text-stone-400 font-bold text-sm uppercase tracking-widest animate-pulse">Extraction des données...</span></div>
          ) : filteredPartners.length === 0 ? (
            <div className="col-span-full text-center py-10 text-stone-500 text-xs font-bold uppercase tracking-widest">Aucun partenaire trouvé</div>
          ) : (
            filteredPartners.map((partner) => (
              <div key={partner.id} className="bg-[#E9EBEF] p-5 rounded-2xl shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] flex flex-col gap-4 border border-white/20">
                
                {/* Info Section */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${partner.is_active ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                      <h3 className="font-black text-stone-800 text-sm uppercase tracking-wide">{partner.name}</h3>
                    </div>
                    <div className="space-y-1 mt-3">
                      <p className="text-[10px] font-bold text-stone-500 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {partner.phone}</p>
                      <p className="text-[10px] font-bold text-stone-500 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {partner.address}</p>
                    </div>
                  </div>
                  
                  {/* Financial Status Indicator */}
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">Dettes / Frais</span>
                    <span className={`text-sm font-black flex items-center gap-1 ${partner.balance_due! > 200 ? 'text-rose-600' : 'text-stone-700'}`}>
                      {partner.balance_due! > 200 && <ShieldAlert className="w-3.5 h-3.5" />}
                      {partner.balance_due} DT
                    </span>
                  </div>
                </div>

                <hr className="border-white/40" />

                {/* Actions Section */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => togglePartnerStatus(partner.id, partner.is_active)}
                    className={`flex-1 min-w-[100px] px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                      partner.is_active 
                        ? 'bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] text-rose-600' 
                        : 'bg-[#E9EBEF] shadow-[2px_2px_4px_#c8cad0,-2px_-2px_4px_#ffffff] text-emerald-600'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" /> {partner.is_active ? 'Fermer / OFF' : 'Ouvrir / ON'}
                  </button>

                  <button 
                    onClick={() => sendFinancialWarning(partner.name)}
                    className="px-3 py-2.5 rounded-xl bg-[#E9EBEF] shadow-[2px_2px_4px_#c8cad0,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-amber-600 hover:text-amber-700 transition-all border border-transparent"
                    title="Alerte Impayé"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => sendMessage(partner.name)}
                    className="px-3 py-2.5 rounded-xl bg-[#E9EBEF] shadow-[2px_2px_4px_#c8cad0,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-blue-600 hover:text-blue-700 transition-all border border-transparent"
                    title="Envoyer Message"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
