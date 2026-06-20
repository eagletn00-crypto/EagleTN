import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl text-amber-500 font-black mb-4">404</h1>
      <Link to="/client" className="px-6 py-2 bg-amber-500 text-black font-bold rounded">Return Home</Link>
    </div>
  );
};
export default NotFound;
