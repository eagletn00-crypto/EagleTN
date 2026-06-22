import React from 'react';

interface GlassCardProps {
  className?: string;
  glow?: boolean;
  children: React.ReactNode;
}

export function GlassCard({ className = '', glow = false, children }: GlassCardProps) {
  return (
    <div className={`rounded-3xl border border-glass bg-glass backdrop-blur-glass shadow-glass transition-all duration-300 ${glow ? 'shadow-amber-glow' : ''} ${className}`}>
      {children}
    </div>
  );
}
