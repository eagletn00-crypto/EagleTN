import React from 'react';
import { useAdminStore } from '../stores/useAdminStore';

interface LogItem {
  id: string;
  action: string;
  operator: string;
  timestamp: string;
}

const mockLogs: LogItem[] = [
  { id: '1', action: 'DISPUTE_HOLD_PLACED', operator: 'System_Auto', timestamp: '17:58:12' },
  { id: '2', action: 'CASH_THRESHOLD_WARNING', operator: 'Livreur_42', timestamp: '17:57:45' },
  { id: '3', action: 'HANDSHAKE_OTP_VERIFIED', operator: 'Partenaire_09', timestamp: '17:55:01' },
  { id: '4', action: 'ZONE_DISPATCH_UPDATED', operator: 'HQ_Admin', timestamp: '17:50:22' },
];

export const TerminalLogs: React.FC = () => {
  const { manualMode } = useAdminStore();

  return (
    <div className="p-4 bg-[#05070a] border border-[#1e293b] rounded-xl font-mono text-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1e293b]">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            FLUX D'AUDIT OPÉRATIONNEL
          </span>
          <span className="text-[10px] text-slate-400">Réseau Synchrone: 100%</span>
        </div>
        
        <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
          {mockLogs.map((log) => (
            <div key={log.id} className="text-slate-300 flex justify-between gap-2 text-[11px]">
              <span className="text-slate-500">{log.timestamp}</span>
              <span className="text-cyan-400 font-semibold">{log.action}</span>
              <span className="text-slate-400">{log.operator}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-[#1e293b] text-[10px] text-slate-500 flex justify-between items-center">
        <span>Statut Serveurs: Operational</span>
        <span>{manualMode ? 'Dispatch: MANUEL' : 'Dispatch: AUTOMATIQUE'}</span>
      </div>
    </div>
  );
};
