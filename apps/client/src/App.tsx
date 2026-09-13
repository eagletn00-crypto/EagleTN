import React from 'react';
import { AppRoutes } from './routes';
import { MobileContainer } from './components/MobileContainer';

export const App: React.FC = () => {
  return (
    <MobileContainer>
      <AppRoutes />
    </MobileContainer>
  );
};

export default App;
