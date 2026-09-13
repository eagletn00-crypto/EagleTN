import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* App Mobile Frame Canvas */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 text-slate-900 shadow-2xl relative overflow-x-hidden border-x border-slate-800/60 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default MobileContainer;
