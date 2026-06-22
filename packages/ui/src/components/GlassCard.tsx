import React from 'react';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export const GlassCard = ({ children, className = '' }: GlassCardProps) => {
  return (
    <div className={`bg-zinc-900/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition duration-300 hover:border-amber-500/40 ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
