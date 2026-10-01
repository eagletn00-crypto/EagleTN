import React from 'react';
import BottomNavigation, { BottomNavigationProps, TabType } from './BottomNavigation';

export interface ClientFooterProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const ClientFooter: React.FC<ClientFooterProps> = ({
  activeTab = 'accueil',
  onTabChange,
}) => {
  return (
    <BottomNavigation
      activeTab={activeTab}
      onTabChange={(tab: TabType) => onTabChange?.(tab)}
    />
  );
};

export type { BottomNavigationProps };
export default ClientFooter;
