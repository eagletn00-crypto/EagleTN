import React from 'react';
import { Routes, Route } from 'react-router-dom';

const PartnerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center font-sans border border-amber-500/10 m-4 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold tracking-wide text-amber-500 mb-2">Eagle.TN 🇹🇳</h2>
          <p className="text-zinc-400 text-sm">Portail Partenaire — Gestion de votre commerce</p>
        </div>
      } />
    </Routes>
  );
};
export default PartnerRoutes;
