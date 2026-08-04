import React from 'react';
import { HeaderGovernance } from '../components/HeaderGovernance';
import { KpiCard } from '../components/KpiCard';
import { MapContainer } from '../components/MapContainer';
import { DisputeModal } from '../components/DisputeModal';
import { TerminalLogs } from '../components/TerminalLogs';
import { ShiftClosureBar } from '../components/ShiftClosureBar';

export const AdminOverview: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      <div className="space-y-5">
        {/* Header Sovereignty */}
        <HeaderGovernance />

        {/* 4 KPIs: CA, Cash in Circulation, Drivers, Success Rate */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard title="Chiffre d'Affaires (CA)" type="CA" />
          <KpiCard title="Espèces en Circulation" type="CIRCULATION" />
          <KpiCard title="Livreurs en Route" type="DRIVERS" />
          <KpiCard title="Taux de Succès" type="SUCCESS" />
        </div>

        {/* Central Layout: Crisis Cell + Map + Live Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <DisputeModal />
            <MapContainer />
          </div>
          <div className="lg:col-span-1">
            <TerminalLogs />
          </div>
        </div>
      </div>

      {/* Footer Shift Governance */}
      <div className="mt-6">
        <ShiftClosureBar />
      </div>
    </div>
  );
};

export default AdminOverview;
