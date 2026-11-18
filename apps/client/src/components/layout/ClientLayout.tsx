import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import ClientHeader from '../ClientHeader';
import BottomNavigation from '../BottomNavigation';

export const ClientLayout: React.FC = memo(() => {
  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col bg-[var(--color-surface-base)] font-sans">
      {/* 
        The Sovereign Header - Injected at the Layout Level
        This guarantees the Eagle TN identity and address selector 
        are always visible and sticky across all main platform screens.
      */}
      <ClientHeader />

      {/* Main Content Area - Expands to fill available space */}
      <main className="flex-1 flex flex-col w-full relative">
        <Outlet />
      </main>

      {/* Edge-to-Edge Navigation Dock */}
      <BottomNavigation />
    </div>
  );
});

ClientLayout.displayName = 'ClientLayout';
export default ClientLayout;
