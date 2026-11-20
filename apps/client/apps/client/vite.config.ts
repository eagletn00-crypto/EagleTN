import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'capacitor-vendor': ['@capacitor/core', '@capacitor/haptics', '@capacitor/geolocation'],
          'zustand-vendor': ['zustand']
        }
      }
    },
    chunkSizeWarningLimit: 400,
  }
});
