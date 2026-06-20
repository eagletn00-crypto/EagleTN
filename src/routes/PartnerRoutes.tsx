import React from 'react';
import { Routes, Route } from 'react-router-dom';

const PartnerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-amber-500 font-bold tracking-widest uppercase">Partner System Maintenance</h2>
        </div>
      } />
    </Routes>
  );
};

export default PartnerRoutes;
