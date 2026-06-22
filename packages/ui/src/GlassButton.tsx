import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const variants = {
  primary: 'bg-amber-ultra-500 text-black hover:bg-amber-ultra-600',
  secondary: 'bg-ultra-dark-900 text-white border border-amber-soft hover:border-amber-ultra-500',
};

export function GlassButton({ variant = 'primary', className = '', children, ...props }: GlassButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 shadow-lg shadow-amber-glow/10 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
