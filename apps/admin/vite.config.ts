import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: path.resolve(__dirname, '../../'),
  resolve: {
    alias: {
      '@eagle/database': path.resolve(__dirname, '../../packages/database/src/supabase.ts'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '../../')],
    },
  },
});
