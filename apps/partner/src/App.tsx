import React, { useState } from 'react';
import PartnerDashboard from './screens/PartnerDashboard';
import { PartnerLogin } from './components/auth/PartnerLogin';

export const App: React.FC = () => {
  // تم ضبط الحالة الافتراضية إلى true لتجاوز تسجيل الدخول مؤقتاً
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  return (
    <div>
      {!isAuthenticated ? (
        <PartnerLogin onSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <PartnerDashboard />
      )}
    </div>
  );
};

export default App;
