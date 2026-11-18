import React, { useEffect } from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  // Enforce ultra-smooth scrolling and iOS safe area padding
  useEffect(() => {
    document.body.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative mx-auto h-[100dvh] w-full max-w-md overflow-hidden bg-[var(--color-surface-base)] shadow-[var(--shadow-float)] sm:h-screen sm:rounded-[2.5rem] sm:border sm:border-slate-200/50 sm:my-8">
      {/* 
        Cinematic Ambient Glow (Optional subtle top highlight) 
      */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/60 to-transparent z-10" />

      {/* Main Content Area */}
      <main className="h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth pb-24 pt-safe">
        {children}
      </main>
    </div>
  );
};
