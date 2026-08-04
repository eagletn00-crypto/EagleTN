import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // 1. قراءة .env من الجذر
  envDir: path.resolve(__dirname, '../../'),
  resolve: {
    // 2. تعيين Alias معماري نظيف لمجلد قواعد البيانات المشترك
    alias: {
      '@eagle/database': path.resolve(__dirname, '../../packages/database/src/supabase.ts'),
    },
  },
  server: {
    fs: {
      // 3. السماح لـ Vite بفك تشفير الملفات من الجذر
      allow: [path.resolve(__dirname, '../../')],
    },
  },
});
