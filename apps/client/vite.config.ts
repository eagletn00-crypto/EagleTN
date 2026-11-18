import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Simplified to prevent React circular dependency crashes
          'vendor-ui': ['lucide-react', 'framer-motion'],
          'vendor-data': ['@supabase/supabase-js', 'zustand'],
          'vendor-cap': ['@capacitor/core', '@capacitor/haptics', '@capacitor/geolocation']
        }
      }
    },
    chunkSizeWarningLimit: 500,
  }
});
