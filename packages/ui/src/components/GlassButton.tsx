import React from 'react';

type GlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline';
  className?: string;
};

export const GlassButton = ({ variant = 'solid', className = '', children, ...rest }: GlassButtonProps) => {
  if (variant === 'solid') {
    return (
      <button
        {...rest}
        className={`inline-flex items-center justify-center px-5 py-3 rounded-lg bg-amber-500 text-zinc-950 font-semibold shadow-lg hover:brightness-95 transition duration-300 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center px-5 py-3 rounded-lg bg-transparent border border-amber-500 text-amber-500 backdrop-blur-sm font-semibold hover:bg-amber-500/10 transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default GlassButton;
