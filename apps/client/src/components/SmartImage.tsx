import React, { useState, useEffect } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img 
      src={imgSrc} 
      alt={alt || 'Image'} 
      className={className} 
      onError={() => setImgSrc(fallbackSrc)}
      loading="lazy"
      {...props} 
    />
  );
};

export default SmartImage;
