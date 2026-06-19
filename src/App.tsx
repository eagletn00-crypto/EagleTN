import React from 'react';
import AppRoutes from './routes';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased selection:bg-blue-500 selection:text-white">
      <AppRoutes />
    </div>
  );
}
