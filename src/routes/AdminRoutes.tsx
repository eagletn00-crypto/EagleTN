import React from 'react';
import { Routes, Route } from 'react-router-dom';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-amber-500 font-bold text-2xl">
          Admin Gateway - Active 🇹🇳
        </div>
      } />
    </Routes>
  );
};
export default AdminRoutes;
