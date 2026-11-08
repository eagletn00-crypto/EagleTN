import React, { memo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useClientOrderStream } from '../../context/OrderStreamContext';
import { ClientHeader } from '../ClientHeader';
import BottomNavigation from '../BottomNavigation';

export const ClientLayout: React.FC = memo(() => {
  useClientOrderStream();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab for bottom navigation mapping
  const getActiveTab = () => {
    if (location.pathname === '/') return 'accueil';
    if (location.pathname.startsWith('/order')) return 'commandes';
    if (location.pathname === '/profile') return 'profil';
    return 'recherche';
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === 'accueil' || tabId === 'recherche') navigate('/');
    if (tabId === 'commandes') navigate('/order/track/latest');
    if (tabId === 'profil') navigate('/profile');
  };

  const currentTab = getActiveTab();
  // Bottom navigation visibility bounds
  const withBottomNav = ['/', '/profile', '/order/track/latest'].includes(location.pathname);

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#FDFBF7] flex flex-col overflow-x-hidden antialiased select-none transform-gpu">
      
      <div className="sticky top-0 z-50 w-full pt-[env(safe-area-inset-top)] bg-[#FDFBF7]/85 backdrop-blur-xl border-b border-stone-200/20">
        <ClientHeader />
      </div>

      <main 
        className={`flex-1 w-full h-full overflow-y-auto scroll-smooth [-webkit-overflow-scrolling:touch] scrollbar-none relative z-10 transition-all duration-300 ${
          withBottomNav ? 'pb-[calc(env(safe-area-inset-bottom)+104px)]' : 'pb-[env(safe-area-inset-bottom)]'
        }`}
      >
        <Outlet />
      </main>

      {withBottomNav && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md transform-gpu pointer-events-none pb-[calc(env(safe-area-inset-bottom)+20px)] px-4">
          <div className="absolute -top-16 left-0 w-full h-16 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/60 to-transparent pointer-events-none" />
          <div className="w-full bg-[#FFFDF9]/85 backdrop-blur-xl border border-stone-200/40 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.06)] px-3 py-1.5 pointer-events-auto">
            <BottomNavigation activeTab={currentTab} onTabChange={handleTabChange} />
          </div>
        </div>
      )}
    </div>
  );
});

ClientLayout.displayName = 'ClientLayout';
export default ClientLayout;
