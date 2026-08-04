import React, { useEffect } from 'react';
import { useAdminStore } from '../stores/useAdminStore';

interface KpiCardProps {
  title: string;
  type: 'CA' | 'DRIVERS' | 'SUCCESS' | 'CIRCULATION';
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, type }) => {
  const { chiffreAffaires, pendingCash, cashInCirculation, flushFinancialBuffer } = useAdminStore();

  useEffect(() => {
    if (type !== 'CA') return;
    const interval = setInterval(() => flushFinancialBuffer(), 3500);
    return () => clearInterval(interval);
  }, [type, flushFinancialBuffer]);

  const renderValue = () => {
    switch (type) {
      case 'CA':
        return `${chiffreAffaires.toLocaleString('fr-TN', { minimumFractionDigits: 2 })} DT`;
      case 'CIRCULATION':
        return `${cashInCirculation.toLocaleString('fr-TN', { minimumFractionDigits: 2 })} DT`;
      case 'DRIVERS':
        return '24 Livreurs';
      case 'SUCCESS':
        return '98,4 %'; // توحيد استخدام الفاصلة الفرنسية القياسية
    }
  };

  return (
    <div className="p-3.5 bg-[#11151e] border border-[#1e293b] rounded-xl flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        {pendingCash > 0 && type === 'CA' && (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded animate-pulse font-mono">
            +{pendingCash.toLocaleString('fr-TN', { minimumFractionDigits: 2 })} DT
          </span>
        )}
        {type === 'CIRCULATION' && (
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono">
            Plafond 200 DT
          </span>
        )}
      </div>
      <div className="mt-2.5">
        <span className="text-xl font-black text-white tracking-tight font-mono">
          {renderValue()}
        </span>
      </div>
    </div>
  );
};
