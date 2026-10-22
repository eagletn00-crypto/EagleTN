import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Incident {
  id: string;
  type: string;
  status: string;
  description: string;
  amount_disputed: number;
  created_at: string;
}

export default function IncidentsModal({ onClose }: { onClose: () => void }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
    
    // ربط حي (Realtime) لمراقبة النزاعات الجديدة لحظة وقوعها
    const channel = supabase
      .channel('incidents_tracker')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        fetchIncidents();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('incidents')
        .select('id, type, status, description, amount_disputed, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setIncidents(data || []);
    } catch (err) {
      console.error('[EAGLE TN] Erreur de chargement des réclamations', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await supabase.from('incidents').update({ status: newStatus }).eq('id', id);
      fetchIncidents();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const getStatusConfig = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100/50', label: 'En Attente' };
      case 'INVESTIGATING': return { icon: AlertTriangle, color: 'text-blue-500', bg: 'bg-blue-100/50', label: 'En Cours' };
      case 'RESOLVED': return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100/50', label: 'Résolu' };
      default: return { icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-100/50', label: status || 'Inconnu' };
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* خلفية زجاجية عازلة */}
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* نافذة التحكم */}
      <div className="bg-[#E9EBEF] w-full max-w-3xl max-h-[85vh] rounded-[2rem] shadow-[12px_12px_24px_#c8cad0,-12px_-12px_24px_#ffffff] relative flex flex-col overflow-hidden border border-white/50 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/40 flex justify-between items-center bg-[#E9EBEF] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-800 uppercase tracking-tight">Centre des Réclamations</h2>
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mt-0.5 animate-pulse">
                {incidents.filter(i => i.status === 'PENDING').length} Incidents Critiques
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-stone-500 hover:text-stone-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Liste des incidents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10"><span className="text-stone-400 font-bold text-sm uppercase tracking-widest animate-pulse">Synchronisation...</span></div>
          ) : incidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-50">
              <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
              <p className="font-black text-stone-600 uppercase tracking-widest text-sm">Zéro Réclamation</p>
            </div>
          ) : (
            incidents.map((incident) => {
              const config = getStatusConfig(incident.status);
              const StatusIcon = config.icon;
              
              return (
                <div key={incident.id} className="bg-[#E9EBEF] p-5 rounded-2xl shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] border border-white/30 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${config.bg} ${config.color} border border-white/50 flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" /> {config.label}
                      </span>
                      <span className="text-[10px] font-bold text-stone-400 uppercase">{new Date(incident.created_at).toLocaleTimeString('fr-FR')}</span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 mb-1">{incident.type || 'Anomalie Système'}</h4>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">{incident.description}</p>
                    {incident.amount_disputed > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-black text-amber-600 uppercase tracking-widest">
                        <DollarSign className="w-3 h-3" /> Litige: {incident.amount_disputed} DT
                      </div>
                    )}
                  </div>
                  
                  {/* أزرار الإجراءات السريعة */}
                  <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                    {incident.status === 'PENDING' && (
                      <button onClick={() => updateStatus(incident.id, 'INVESTIGATING')} className="flex-1 md:flex-none px-4 py-2 bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest transition-all">
                        Traiter
                      </button>
                    )}
                    {incident.status !== 'RESOLVED' && (
                      <button onClick={() => updateStatus(incident.id, 'RESOLVED')} className="flex-1 md:flex-none px-4 py-2 bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-widest transition-all border border-emerald-100">
                        Clôturer
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
