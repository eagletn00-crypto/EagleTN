import React, { useState } from 'react';
import { AppRouter } from './routes';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  // نتركه undefined ديناميكياً بدون أي Hardcoding
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | undefined>(undefined);

  const handleNavigate = (screen: string, params?: any) => {
    if (params?.partnerId) {
      setSelectedPartnerId(params.partnerId);
    }
    setCurrentScreen(screen);
  };

  return (
    <AppRouter
      currentScreen={currentScreen}
      selectedPartnerId={selectedPartnerId}
      onNavigate={handleNavigate}
    />
  );
}
