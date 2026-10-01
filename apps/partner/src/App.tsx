import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PartnerDashboard from './screens/PartnerDashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PartnerDashboard />
    </BrowserRouter>
  );
};

export default App;
