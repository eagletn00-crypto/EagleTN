import React from 'react';

export function MobileContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start">
      <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
