import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-2 text-center rounded-xl border border-slate-200/60 ${className}`}>
        <Utensils className="w-6 h-6 stroke-[1.5] mb-1 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 leading-tight select-none">
          {alt || 'Eagle.tn'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;
