import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const AuthInitializer = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null; // مكون صامت لا يطبع أي واجهة
};
