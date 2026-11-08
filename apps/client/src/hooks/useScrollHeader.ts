import { useState, useEffect, useCallback } from 'react';

export const useScrollHeader = (threshold: number = 40) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    // Utilize requestAnimationFrame for buttery smooth 120Hz tracking
    requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > threshold);
    });
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount to handle initial load state
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return isScrolled;
};
