import React from 'react';
import LivreurDashboard from './screens/LivreurDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans" dir="ltr">
        <LivreurDashboard />
      </div>
    </ErrorBoundary>
  );
}
